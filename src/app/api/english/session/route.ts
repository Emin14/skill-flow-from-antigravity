import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { getTodayStr, formatLocalDateStr } from '@/shared/lib/dateUtils';
import {
  OxfordWord,
  SessionWordCard,
  CEFRLevel,
  getOxfordDictionary,
  getOxfordDictionaryMap,
  buildDayWordInfo,
  summarizeDay,
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
    const dailyNewWordsSetting = settings?.dailyNewWords ?? 5;
    const maxReviewsLimit = settings?.maxReviewsPerDay ?? 30;

    // The user may ask for extra words ("learn more") after finishing the day.
    // EnglishDayGoal stores an absolute goal for the date, so it is compared
    // against the setting instead of being added to it.
    let storedGoalToday = 0;
    try {
      const dayGoal = await prisma.englishDayGoal.findUnique({ where: { date: todayStr } });
      storedGoalToday = dayGoal?.goalCount ?? 0;
    } catch (e) {
      console.warn('Prisma EnglishDayGoal fallback to none:', e);
    }

    const dailyTargetCount = dailyNewWordsSetting;
    const effectiveGoalCount = Math.max(dailyNewWordsSetting, storedGoalToday);
    const extraGoalToday = Math.max(0, effectiveGoalCount - dailyNewWordsSetting);

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

    // 1. Words actually learned today.
    // `lastReviewedAt` is NOT a reliable marker: a word rated «Не помню» also
    // touches its row, yet it was not learned and its progress is rolled back.
    // The review log is the source of truth — a word counts as learned today
    // only when its latest rating of the day is not `again`.
    const today = new Date();
    // A wide window is loaded on purpose: the same day-word aggregation feeds
    // both today's counter and the streak, which walks back through previous
    // days. Only three small columns are selected.
    let reviewLogs: { wordId: string; rating: string; createdAt: Date }[] = [];
    try {
      reviewLogs = await prisma.englishWordReviewLog.findMany({
        where: { createdAt: { gte: subDays(today, 180) } },
        orderBy: { createdAt: 'desc' },
        select: { wordId: true, rating: true, createdAt: true },
      });
    } catch (e) {
      console.warn('Prisma EnglishWordReviewLog fallback to empty:', e);
    }

    const dayWordInfo = buildDayWordInfo(reviewLogs, getLocalReviewDate);
    const todaySummary = summarizeDay(dayWordInfo.get(todayStr));
    const learnedWordIdsToday = todaySummary.learnedWordIds;
    const dailyLearnedCount = todaySummary.learnedCount;

    // Words answered with «Не помню» today: their interval was cleared and
    // they are due tomorrow, so without this set they could be handed out
    // again in the same session as fresh words.
    const resetTodayIds = new Set(todaySummary.resetWordIds);

    // Words that were studied today — used by the "done" panel to list what
    // was actually learned instead of only showing a counter.
    const learnedTodayWords: SessionWordCard[] = learnedWordIdsToday
      .map((wordId) => {
        const base = dictionaryMap.get(wordId);
        if (!base) return null;
        const p = progressMap.get(wordId);
        return {
          ...base,
          progress: p
            ? {
                wordId: p.wordId,
                status: p.status as 'NEW' | 'LEARNING' | 'REVIEW' | 'MASTERED',
                nextReviewDate: p.nextReviewDate,
                intervalDays: p.intervalDays,
                easeFactor: p.easeFactor,
                repetitions: p.repetitions,
                errorCount: p.errorCount,
                lastReviewedAt: p.lastReviewedAt ? new Date(p.lastReviewedAt).toISOString() : null,
              }
            : undefined,
          isNew: false,
        };
      })
      .filter(Boolean) as SessionWordCard[];

    // 2. Due reviews for today that have NOT yet been reviewed today.
    // A word rated «Не помню» is reset to LEARNING with a 1-day interval, so it
    // is out of today's queue in both directions: it is not NEW (so it is not
    // refilled from the new-words pool) and its nextReviewDate is tomorrow.
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
        // Only real progress counts as learned. LEARNING is the "was forgotten
        // and reset" state, so counting `status !== 'NEW'` would credit the
        // word for a memory failure.
        if (p && (p.status === 'REVIEW' || p.status === 'MASTERED')) {
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
    const neededNewCount = Math.max(0, effectiveGoalCount - dailyLearnedCount);
    let remainingNewWords: SessionWordCard[] = [];

    if (neededNewCount > 0) {
      const unlearnedWords: OxfordWord[] = [];

      for (const lvl of ['A1', 'A2', 'B1', 'B2', 'C1'] as CEFRLevel[]) {
        if (!activeLevels.includes(lvl)) continue;
        const wordsInLevel = dictionary
          .filter((w) => w.cefrLevel === lvl)
          .filter((w) => {
            const prog = progressMap.get(w.id);
            if (resetTodayIds.has(w.id)) return false;
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
    // LEARNING is excluded on purpose: it only ever means «was forgotten and
    // reset», so the word has no progress to show yet. It surfaces under the
    // separate `totalReset` field below instead of inflating the learned stats.
    const totalLearned = progressList.filter(
      (p) => p.status === 'REVIEW' || p.status === 'MASTERED'
    ).length;
    const totalMastered = progressList.filter((p) => p.status === 'MASTERED').length;
    const totalReset = progressList.filter((p) => p.status === 'LEARNING').length;

    // 6. Streak calculation (requires daily quota completion).
    // Counted from successful day-word pairs, so a word answered only with
    // «Не помню» does not keep a streak alive on its own.
    const reviewsByDate = new Map<string, number>();
    dayWordInfo.forEach((perWord, dateStr) => {
      const learned = summarizeDay(perWord).learnedCount;
      if (learned > 0) reviewsByDate.set(dateStr, learned);
    });

    let streakDays = 0;
    const isTodayGoalMet = dailyLearnedCount >= effectiveGoalCount;
    let checkDate = new Date();

    if (isTodayGoalMet) {
      while (true) {
        const dateStr = formatLocalDateStr(checkDate);
        const count = reviewsByDate.get(dateStr) || 0;
        // Today counts as met once the effective goal (base + extra) is
        // reached; past days keep the plain daily setting as the bar.
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
    // The panel's "learn more" button keeps offering another batch as long as
    // words remain; the widget shows the study action while `newWords` is not
    // empty, which is what makes the button reappear after the panel is closed.
    const learnedTodayCount = dailyLearnedCount;
    const remainingTodayCount = Math.max(0, effectiveGoalCount - learnedTodayCount);

    return NextResponse.json({
      todayStr,
      newWords: remainingNewWords,
      reviewWords,
      learnedTodayWords,
      dailyLearnedCount,
      dailyTargetCount,
      extraGoalCount: extraGoalToday,
      effectiveGoalCount,
      remainingTodayCount,
      totalLearned,
      totalMastered,
      totalReset,
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
      learnedTodayWords: [],
      dailyLearnedCount: 0,
      dailyTargetCount: 5,
      extraGoalCount: 0,
      effectiveGoalCount: 5,
      remainingTodayCount: 5,
      totalLearned: 0,
      totalMastered: 0,
      totalWords: dictionary.length,
      streakDays: 0,
      isCompletedToday: false,
    });
  }
}
