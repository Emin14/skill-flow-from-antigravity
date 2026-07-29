'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, Typography, Button, Progress } from '@/shared/ui';
import { useRepeatCardStore, RepeatCard } from '@/entities/repeat-card';
import { ReviewRating } from '@/shared/lib/fsrs';
import styles from './ReviewPage.module.css';

export const ReviewPage: React.FC = () => {
  const { cards, fetchCards, getDueCards, answerCard } = useRepeatCardStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [sessionReviewedCount, setSessionReviewedCount] = useState(0);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const dueCards = getDueCards();
  const currentCard: RepeatCard | undefined = dueCards[currentIndex];

  const handleRating = async (rating: ReviewRating) => {
    if (!currentCard) return;

    await answerCard(currentCard.id, rating);
    setSessionReviewedCount((prev) => prev + 1);
    setIsAnswerRevealed(false);

    // If current index >= remaining due cards count - 1, stay or reset
    if (currentIndex >= dueCards.length - 1) {
      setCurrentIndex(0);
    }
  };

  const progressPercent =
    dueCards.length > 0 ? Math.round((sessionReviewedCount / (sessionReviewedCount + dueCards.length)) * 100) : 100;

  // Stage 9: Session Completed Screen
  if (dueCards.length === 0 || !currentCard) {
    return (
      <div className={styles.container}>
        <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <Typography variant="h1" style={{ marginBottom: 'var(--space-2)' }}>
            🎉 Сессия повторений завершена!
          </Typography>
          <Typography variant="body" style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
            Все карточки на сегодня успешно обработаны
          </Typography>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'var(--space-6)',
              marginBottom: 'var(--space-6)',
              padding: 'var(--space-4)',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div>
              <Typography variant="h2" style={{ color: 'var(--color-accent)' }}>
                {sessionReviewedCount}
              </Typography>
              <Typography variant="caption">Повторено сегодня</Typography>
            </div>
            <div>
              <Typography variant="h2" style={{ color: 'var(--color-success)' }}>
                Good
              </Typography>
              <Typography variant="caption">Средняя оценка</Typography>
            </div>
            <div>
              <Typography variant="h2" style={{ color: 'var(--color-text-primary)' }}>
                Завтра
              </Typography>
              <Typography variant="caption">Следующий показ</Typography>
            </div>
          </div>

          <Link href="/today" style={{ textDecoration: 'none' }}>
            <Button variant="primary">← Вернуться на экран "Сегодня"</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Session Progress Header */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h2">🧠 Повторение (FSRS Engine)</Typography>
          <Typography variant="caption" style={{ color: 'var(--color-text-muted)' }}>
            Осталось: {dueCards.length} карточек
          </Typography>
        </div>
        <Progress value={progressPercent} height={6} />
      </Card>

      {/* Flashcard */}
      <div className={styles.flashcard}>
        <div className={styles.questionText}>❓ {currentCard.front}</div>

        {isAnswerRevealed ? (
          <div>
            <div className={styles.answerDivider} />
            <div className={styles.answerText}>💡 {currentCard.back}</div>

            {/* FSRS Rating Buttons */}
            <div className={styles.ratingRow}>
              <Button className={styles.ratingBtnAgain} onClick={() => handleRating('Again')}>
                🔴 Again (1д)
              </Button>
              <Button className={styles.ratingBtnHard} onClick={() => handleRating('Hard')}>
                🔵 Hard
              </Button>
              <Button className={styles.ratingBtnGood} onClick={() => handleRating('Good')}>
                🟢 Good
              </Button>
              <Button className={styles.ratingBtnEasy} onClick={() => handleRating('Easy')}>
                🟣 Easy
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 'var(--space-6)' }}>
            <Button variant="primary" size="lg" onClick={() => setIsAnswerRevealed(true)}>
              [ Показать ответ ]
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
