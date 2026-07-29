export interface RepeatCard {
  id: string;
  materialId: string;
  front: string; // Question
  back: string;  // Answer
  interval: number; // in days
  repetitions: number;
  easeFactor: number;
  nextReviewDate: string; // YYYY-MM-DD
  lastReviewedAt?: string | null;
  createdAt: string;
}
