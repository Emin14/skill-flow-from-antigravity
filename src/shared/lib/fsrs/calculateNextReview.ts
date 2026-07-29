export type ReviewRating = 'Again' | 'Hard' | 'Good' | 'Easy';

export interface FSRSResult {
  nextInterval: number;
  newRepetitions: number;
  newEaseFactor: number;
  nextReviewDate: string; // YYYY-MM-DD
}

/**
 * Pure isolated FSRS Spaced Repetition calculation algorithm.
 */
export function calculateNextReview(
  rating: ReviewRating,
  currentInterval = 1,
  repetitions = 0,
  easeFactor = 2.5
): FSRSResult {
  let nextInterval = 1;
  let newRepetitions = repetitions;
  let newEaseFactor = easeFactor;

  switch (rating) {
    case 'Again':
      nextInterval = 1;
      newRepetitions = 0;
      newEaseFactor = Math.max(1.3, easeFactor - 0.2);
      break;

    case 'Hard':
      nextInterval = Math.max(1, Math.round(currentInterval * 1.2));
      newRepetitions = repetitions + 1;
      newEaseFactor = Math.max(1.3, easeFactor - 0.15);
      break;

    case 'Good':
      nextInterval = Math.max(1, Math.round(currentInterval * easeFactor));
      newRepetitions = repetitions + 1;
      newEaseFactor = easeFactor;
      break;

    case 'Easy':
      nextInterval = Math.max(2, Math.round(currentInterval * easeFactor * 1.3));
      newRepetitions = repetitions + 1;
      newEaseFactor = easeFactor + 0.15;
      break;
  }

  // Calculate future date YYYY-MM-DD
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + nextInterval);
  const nextReviewDate = targetDate.toISOString().split('T')[0];

  return {
    nextInterval,
    newRepetitions,
    newEaseFactor,
    nextReviewDate,
  };
}
