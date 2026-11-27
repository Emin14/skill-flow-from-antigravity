import { ReviewRating } from '../model/types';

export async function submitReviewBeforeAdvance(
  submitReview: (wordId: string, rating: ReviewRating) => Promise<void>,
  wordId: string,
  rating: ReviewRating,
  advance: () => void,
): Promise<void> {
  await submitReview(wordId, rating);
  advance();
}
