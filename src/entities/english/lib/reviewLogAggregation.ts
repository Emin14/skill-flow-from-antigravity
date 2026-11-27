/**
 * Aggregates English review logs into per-day, per-word outcomes.
 *
 * The log is the source of truth for "what was actually learned": the progress
 * row only keeps the latest touch, so a word rated «Не помню» looks identical to
 * a word learned there (both have `lastReviewedAt` of today), while the log
 * records the rating that decides whether the word counts.
 *
 * Rules encoded here:
 *  - a word counts as learned on a day only when its LAST rating of that day is
 *    not `again` (an early success followed by a lapse is still a lapse);
 *  - `firstSuccessAt` keeps study order for the "today learned" panel;
 *  - `errorCount`-style stats are not derived here — they live on the progress row.
 */

export interface ReviewLogLike {
  wordId: string;
  rating: string;
  createdAt: Date | string;
}

export interface DayWordInfo {
  latestRating: string;
  /** Earliest successful rating of that day, in epoch ms; null if none. */
  firstSuccessAt: number | null;
}

export interface DayWordSummary {
  /** Words whose last rating of the day was not `again`, in study order. */
  learnedWordIds: string[];
  /** Words whose last rating of the day was `again` (progress was rolled back). */
  resetWordIds: string[];
  /** Learned-word count for the day, used for the goal counter and streak. */
  learnedCount: number;
}

/**
 * @param logs   review logs, newest first (`orderBy: { createdAt: 'desc' }`)
 * @param toLocalDate  maps a timestamp to the viewer's local `YYYY-MM-DD`
 */
export function buildDayWordInfo(
  logs: ReviewLogLike[],
  toLocalDate: (value: Date | string) => string | null
): Map<string, Map<string, DayWordInfo>> {
  const byDate = new Map<string, Map<string, DayWordInfo>>();

  for (const log of logs) {
    const dateStr = toLocalDate(log.createdAt);
    if (!dateStr) continue;

    let perWord = byDate.get(dateStr);
    if (!perWord) {
      perWord = new Map<string, DayWordInfo>();
      byDate.set(dateStr, perWord);
    }

    const at = new Date(log.createdAt).getTime();
    const existing = perWord.get(log.wordId);
    if (!existing) {
      // Newest first: the first entry seen for a word is its latest rating.
      perWord.set(log.wordId, {
        latestRating: log.rating,
        firstSuccessAt: log.rating !== 'again' ? at : null,
      });
    } else if (log.rating !== 'again') {
      // Older entries are earlier in time, so keep overwriting: the final value
      // is the first success of the day.
      existing.firstSuccessAt = at;
    }
  }

  return byDate;
}

export function summarizeDay(
  dayWordInfo: Map<string, DayWordInfo> | undefined
): DayWordSummary {
  if (!dayWordInfo) return { learnedWordIds: [], resetWordIds: [], learnedCount: 0 };

  const learned: { wordId: string; firstSuccessAt: number }[] = [];
  const resetWordIds: string[] = [];

  dayWordInfo.forEach((info, wordId) => {
    if (info.latestRating === 'again') {
      resetWordIds.push(wordId);
    } else {
      learned.push({ wordId, firstSuccessAt: info.firstSuccessAt ?? 0 });
    }
  });

  learned.sort((a, b) => a.firstSuccessAt - b.firstSuccessAt);

  return {
    learnedWordIds: learned.map((entry) => entry.wordId),
    resetWordIds,
    learnedCount: learned.length,
  };
}
