import assert from 'node:assert/strict';
import { submitReviewBeforeAdvance } from './reviewFlow';

async function run() {
  const events: string[] = [];
  let resolveReview!: () => void;
  const review = new Promise<void>((resolve) => {
    resolveReview = resolve;
  });

  const operation = submitReviewBeforeAdvance(
    async () => {
      events.push('review-started');
      await review;
      events.push('review-finished');
    },
    'word-1',
    'again',
    () => events.push('advanced'),
  );

  await Promise.resolve();
  assert.deepEqual(events, ['review-started']);
  resolveReview();
  await operation;
  assert.deepEqual(events, ['review-started', 'review-finished', 'advanced']);
}

void run();
