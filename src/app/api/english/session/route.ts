import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { getTodayStr, formatLocalDateStr } from '@/shared/lib/dateUtils';
import oxfordDictionary from '@/data/oxford_3000.json';
import { OxfordWord, SessionWordCard } from '@/entities/english/model/types';

export const dynamic = 'force-dynamic';

const dictionary = oxfordDictionary as unknown as OxfordWord[];
const dictionaryMap = new Map<string, OxfordWord>(
  dictionary.map((w) => [w.id, w])
);

// Deterministic seed-based pseudo-random generator
function getSeededRandom(seedStr: string) {
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = (seed << 5) - seed + seedStr.charCodeAt(i);
    seed |= 0;
  }
  return () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
}

function shuffleWithSeed<T>(array: T[], seedStr: string): T[] {
  const arr = [...array];
  const rand = getSeededRandom(seedStr);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function GET() {
  try {
    const todayStr = getTodayStr();

    let settings = null;
    try {
      settings = await prisma.englishSettings.findUnique({
        where: { id: 'default' },
      });

      if (!settings) {
        settings = await prisma.englishSettings.create({
          data: {
            id: 'default',
            dailyNewWords: 5,
            maxReviewsPerDay: 30,
            activeLevels: JSON.stringify(['A1', 'A2', 'B1', 'B2']),
            autoPronounce: true,
            accent: 'us',
          },
        });
      }
    } catch (e) {
      console.warn('Prisma EnglishSettings fallback to default:', e);
    }

    const activeLevels: string[] = settings
      ? JSON.parse(settings.activeLevels || '["A1","A2","B1","B2"]')
      : ['A1', 'A2', 'B1', 'B2'];
    const dailyTargetCount = settings?.dailyNewWords ?? 5;
    const maxReviewsLimit = settings?.maxReviewsPerDay ?? 30;

    let progressList: any[] = [];
    try {
      progressList = await prisma.englishWordProgress.findMany();
    } catch (e) {
      console.warn('Prisma EnglishWordProgress fallback to empty:', e);
    }

    const progressMap = new Map(progressList.map((p) => [p.wordId, p]));

    // Helper to extract local YYYY-MM-DD from lastReviewedAt
    const getLocalReviewDate = (lastReviewedAt: any): string | null => {
      if (!lastReviewedAt) return null;
      try {
        return formatLocalDateStr(new Date(lastReviewedAt));
      } catch {
        return null;
      }
    };

    // 1. Due reviews for today that have NOT yet been reviewed today
    const dueReviewsRaw = progressList.filter((p) => {
      if (p.status === 'NEW') return false;
      const lastReviewDateStr = getLocalReviewDate(p.lastReviewedAt);
      if (lastReviewDateStr === todayStr) return false;
      return p.nextReviewDate && p.nextReviewDate <= todayStr;
    });

    const dueReviews = shuffleWithSeed(dueReviewsRaw, todayStr + '-reviews').slice(0, maxReviewsLimit);

    const reviewWords: SessionWordCard[] = dueReviews
      .map((p) => {
        const base = dictionaryMap.get(p.wordId);
        if (!base) return null;
        return {
          ...base,
          progress: {
            wordId: p.wordId,
            status: p.status,
            nextReviewDate: p.nextReviewDate,
            intervalDays: p.intervalDays,
            easeFactor: p.easeFactor,
            repetitions: p.repetitions,
            errorCount: p.errorCount,
            lastReviewedAt: p.lastReviewedAt ? new Date(p.lastReviewedAt).toISOString() : null,
          },
          isNew: false,
        };
      })
      .filter(Boolean) as SessionWordCard[];

    // 2. Deterministic daily 5 words selection
    const eligibleWords = dictionary.filter((w) => activeLevels.includes(w.cefrLevel));
    const dailyAssignedPool = shuffleWithSeed(eligibleWords, todayStr + '-assigned-words');
    
    const todayTargetWords: OxfordWord[] = [];
    for (const w of dailyAssignedPool) {
      if (todayTargetWords.length >= dailyTargetCount) break;
      const prog = progressMap.get(w.id);
      const lastReviewDateStr = getLocalReviewDate(prog?.lastReviewedAt);
      
      // If learned on PREVIOUS days, skip
      if (prog && prog.status !== 'NEW' && lastReviewDateStr !== todayStr) {
        continue;
      }
      todayTargetWords.push(w);
    }

    // Set of words learned TODAY
    const learnedTodayWordIds = new Set(
      progressList
        .filter((p) => {
          const lastReviewDateStr = getLocalReviewDate(p.lastReviewedAt);
          return lastReviewDateStr === todayStr && p.status !== 'NEW';
        })
        .map((p) => p.wordId)
    );

    let dailyLearnedCount = 0;
    const remainingNewWords: SessionWordCard[] = [];

    for (const targetWord of todayTargetWords) {
      if (learnedTodayWordIds.has(targetWord.id)) {
        dailyLearnedCount++;
      } else {
        remainingNewWords.push({
          ...targetWord,
          isNew: true,
        });
      }
    }

    const totalLearned = progressList.filter(
      (p) => p.status === 'LEARNING' || p.status === 'REVIEW' || p.status === 'MASTERED'
    ).length;
    const totalMastered = progressList.filter((p) => p.status === 'MASTERED').length;

    const isCompletedToday = remainingNewWords.length === 0 && reviewWords.length === 0 && dailyLearnedCount > 0;

    return NextResponse.json({
      todayStr,
      newWords: remainingNewWords,
      reviewWords,
      dailyLearnedCount,
      dailyTargetCount,
      totalLearned,
      totalMastered,
      totalWords: dictionary.length,
      streakDays: totalLearned > 0 ? Math.max(1, Math.min(14, Math.ceil(totalLearned / 5))) : 0,
      isCompletedToday,
    });
  } catch (error) {
    console.error('CRITICAL Error fetching English session:', error);
    return NextResponse.json({
      todayStr: getTodayStr(),
      newWords: [],
      reviewWords: [],
      dailyLearnedCount: 0,
      dailyTargetCount: 5,
      totalLearned: 0,
      totalMastered: 0,
      totalWords: dictionary.length,
      streakDays: 0,
      isCompletedToday: false,
    });
  }
}
