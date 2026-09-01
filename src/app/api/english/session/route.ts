import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { getTodayStr, formatLocalDateStr } from '@/shared/lib/dateUtils';
import {
  OxfordWord,
  SessionWordCard,
  CEFRLevel,
  getOxfordDictionary,
  getOxfordDictionaryMap,
} from '@/entities/english';
import { subDays } from 'date-fns';

export const dynamic = 'force-dynamic';

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

const ALL_CEFR_LEVELS: { level: CEFRLevel; title: string }[] = [
  { level: 'A1', title: 'Начальный (Beginner)' },
  { level: 'A2', title: 'Элементарный (Elementary)' },
  { level: 'B1', title: 'Средний (Intermediate)' },
  { level: 'B2', title: 'Выше среднего (Upper-Intermediate)' },
  { level: 'C1', title: 'Продвинутый (Advanced)' },
];

export async function GET(req: Request) {
  const dictionary = getOxfordDictionary();
  const dictionaryMap = getOxfordDictionaryMap();

  try {
    const { searchParams } = new URL(req.url);
    const clientDate = searchParams.get('clientDate');
    const tzOffsetRaw = searchParams.get('tzOffset');
    const tzOffsetMinutes = tzOffsetRaw !== null ? parseInt(tzOffsetRaw, 10) : null;

    const todayStr = clientDate && clientDate.includes('-') ? clientDate.trim() : getTodayStr();

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
            activeLevels: JSON.stringify(['A1', 'A2', 'B1', 'B2', 'C1']),
            autoPronounce: true,
            accent: 'us',
          },
        });
      }
    } catch (e) {
      console.warn('Prisma EnglishSettings fallback to default:', e);
    }

    const activeLevels: CEFRLevel[] = settings
      ? JSON.parse(settings.activeLevels || '["A1","A2","B1","B2","C1"]')
      : ['A1', 'A2', 'B1', 'B2', 'C1'];
    const dailyTargetCount = settings?.dailyNewWords ?? 5;
    const maxReviewsLimit = settings?.maxReviewsPerDay ?? 30;

    let progressList: any[] = [];
    try {
      progressList = await prisma.englishWordProgress.findMany();
    } catch (e) {
      console.warn('Prisma EnglishWordProgress fallback to empty:', e);
    }

    const progressMap = new Map(progressList.map((p) => [p.wordId, p]));

    // Helper to extract local YYYY-MM-DD from lastReviewedAt using client timezone offset
    const getLocalReviewDate = (lastReviewedAt: any): string | null => {
      if (!lastReviewedAt) return null;
      try {
        const d = new Date(lastReviewedAt);
        if (tzOffsetMinutes !== null && !isNaN(tzOffsetMinutes)) {
          // Client getTimezoneOffset() returns minutes to ADD to local time to get UTC
          // localMs = UTC ms - tzOffsetMinutes * 60 * 1000
          const localMs = d.getTime() - tzOffsetMinutes * 60 * 1000;
          return new Date(localMs).toISOString().split('T')[0];
        }
        return formatLocalDateStr(d);
      } catch {
        return null;
      }
    };

    // 1. Calculate actual daily learned count for today
    const todayReviewedWords = progressList.filter((p) => {
      if (!p.lastReviewedAt) return false;
      const lastReviewDateStr = getLocalReviewDate(p.lastReviewedAt);
      return lastReviewDateStr === todayStr;
    });
    const dailyLearnedCount = todayReviewedWords.length;

    // 2. Due reviews for today that have NOT yet been reviewed today
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

    // 3. Level-by-level stats & currentLevel determination
    const levelStats: Record<string, any> = {};
    let activeCurrentLevel: CEFRLevel = 'A1';
    let currentLevelFound = false;

    for (const item of ALL_CEFR_LEVELS) {
      const lvl = item.level;
      const lvlWords = dictionary.filter((w) => w.cefrLevel === lvl);
      const total = lvlWords.length;

      let learned = 0;
      let mastered = 0;
      for (const w of lvlWords) {
        const p = progressMap.get(w.id);
        if (p && p.status !== 'NEW') {
          learned++;
          if (p.status === 'MASTERED') {
            mastered++;
          }
        }
      }

      const percent = total > 0 ? Math.round((learned / total) * 100) : 0;
      const isCompleted = total > 0 && learned >= total;

      if (!currentLevelFound && !isCompleted && activeLevels.includes(lvl)) {
        activeCurrentLevel = lvl;
        currentLevelFound = true;
      }

      levelStats[lvl] = {
        level: lvl,
        title: item.title,
        total,
        learned,
        mastered,
        percent,
        isCurrent: false,
        isCompleted,
      };
    }

    if (!currentLevelFound) {
      activeCurrentLevel = activeLevels[0] || 'A1';
    }

    if (levelStats[activeCurrentLevel]) {
      levelStats[activeCurrentLevel].isCurrent = true;
    }

    // 4. New words selection (Pick in CEFR order A1 -> A2 -> B1 -> B2 -> C1, sorted by frequencyRank)
    const neededNewCount = Math.max(0, dailyTargetCount - dailyLearnedCount);
    let remainingNewWords: SessionWordCard[] = [];

    if (neededNewCount > 0) {
      const unlearnedWords: OxfordWord[] = [];

      for (const lvl of ['A1', 'A2', 'B1', 'B2', 'C1'] as CEFRLevel[]) {
        if (!activeLevels.includes(lvl)) continue;
        const wordsInLevel = dictionary
          .filter((w) => w.cefrLevel === lvl)
          .filter((w) => {
            const prog = progressMap.get(w.id);
            return !prog || prog.status === 'NEW';
          })
          .sort((a, b) => (a.frequencyRank || 9999) - (b.frequencyRank || 9999));

        unlearnedWords.push(...wordsInLevel);
        if (unlearnedWords.length >= neededNewCount) break;
      }

      const selectedWords = unlearnedWords.slice(0, neededNewCount);
      remainingNewWords = selectedWords.map((w) => ({
        ...w,
        isNew: true,
      }));
    }

    // 5. Total Learned & Mastered counts
    const totalLearned = progressList.filter(
      (p) => p.status === 'LEARNING' || p.status === 'REVIEW' || p.status === 'MASTERED'
    ).length;
    const totalMastered = progressList.filter((p) => p.status === 'MASTERED').length;

    // 6. Streak calculation (requires daily quota completion)
    const reviewsByDate = new Map<string, number>();
    for (const p of progressList) {
      const d = getLocalReviewDate(p.lastReviewedAt);
      if (d) {
        reviewsByDate.set(d, (reviewsByDate.get(d) || 0) + 1);
      }
    }

    let streakDays = 0;
    const isTodayGoalMet = dailyLearnedCount >= dailyTargetCount;
    let checkDate = new Date();

    if (isTodayGoalMet) {
      while (true) {
        const dateStr = formatLocalDateStr(checkDate);
        const count = reviewsByDate.get(dateStr) || 0;
        if (count >= dailyTargetCount || (dateStr === todayStr && isTodayGoalMet)) {
          streakDays++;
          checkDate = subDays(checkDate, 1);
        } else {
          break;
        }
      }
    } else {
      checkDate = subDays(checkDate, 1);
      while (true) {
        const dateStr = formatLocalDateStr(checkDate);
        const count = reviewsByDate.get(dateStr) || 0;
        if (count >= dailyTargetCount) {
          streakDays++;
          checkDate = subDays(checkDate, 1);
        } else {
          break;
        }
      }
    }

    const isCompletedToday = isTodayGoalMet && reviewWords.length === 0;

    return NextResponse.json({
      todayStr,
      newWords: remainingNewWords,
      reviewWords,
      dailyLearnedCount,
      dailyTargetCount,
      totalLearned,
      totalMastered,
      totalWords: dictionary.length,
      streakDays,
      isCompletedToday,
      levelStats,
      currentLevel: activeCurrentLevel,
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
