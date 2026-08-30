'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  useEnglishStore,
  SessionWordCard,
  ReviewRating,
  WordMeaningItem,
  speakEnglishWord,
  triggerHapticFeedback,
} from '@/entities/english';
import { lockBodyScroll, unlockBodyScroll } from '@/shared/lib/scrollLock';
import {
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { Variant14SegmentedPillCard } from './variants';
import styles from './EnglishTrainerModal.module.css';

interface EnglishTrainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function shuffleList<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const renderHighlightedSentence = (text: string, target: string) => {
  if (!text || !target) return text;
  const regex = new RegExp(`(\\b${target}[a-zA-Z]*\\b)`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.toLowerCase().startsWith(target.toLowerCase())) {
      return (
        <span
          key={index}
          style={{
            color: 'var(--color-accent-text)',
            fontWeight: 600,
          }}
        >
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

export const EnglishTrainerModal: React.FC<EnglishTrainerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { session, settings, submitReview, fetchSession } = useEnglishStore();

  const [queue, setQueue] = useState<SessionWordCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [meaningIndex, setMeaningIndex] = useState<number>(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>('');
  const [isMatch, setIsMatch] = useState<boolean | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isLoadingRandom, setIsLoadingRandom] = useState<boolean>(false);

  const handleLoadRandomWords = async () => {
    setIsLoadingRandom(true);
    clearAutoTimer();
    try {
      const words = await useEnglishStore.getState().fetchRandomWords(5);
      if (words && words.length > 0) {
        setQueue(words);
        setCurrentIndex(0);
        setMeaningIndex(0);
        setIsAnswerRevealed(false);
        setUserInput('');
        setIsMatch(null);
        setIsFinished(false);
        triggerHapticFeedback('medium');
      }
    } catch (e) {
      console.error('Error loading random words:', e);
    } finally {
      setIsLoadingRandom(false);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const cardContentRef = useRef<HTMLDivElement>(null);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearAutoTimer = () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  };

  // Scroll lock when modal opens
  useEffect(() => {
    if (isOpen) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }
    return () => {
      unlockBodyScroll();
      clearAutoTimer();
    };
  }, [isOpen]);

  // When modal is opened, capture active cards and start clean session run
  useEffect(() => {
    if (isOpen) {
      clearAutoTimer();
      const allCards = [...(session?.reviewWords || []), ...(session?.newWords || [])];
      if (allCards.length > 0) {
        setQueue(shuffleList(allCards));
        setCurrentIndex(0);
        setMeaningIndex(0);
        setIsAnswerRevealed(false);
        setUserInput('');
        setIsMatch(null);
        setIsFinished(false);
      } else {
        fetchSession();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const currentCard: SessionWordCard | undefined = queue[currentIndex];
  const isReviewWord = currentCard ? !currentCard.isNew : false;

  // Auto pronounce word on card arrival if enabled
  useEffect(() => {
    if (isOpen && currentCard && settings.autoPronounce && !isFinished) {
      const timer = setTimeout(() => {
        speakEnglishWord(currentCard.word, settings.accent);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentCard, settings.autoPronounce, settings.accent, isFinished]);

  // Focus input automatically
  useEffect(() => {
    if (isOpen && isReviewWord && !isAnswerRevealed && !isFinished) {
      inputRef.current?.focus();
    }
  }, [isOpen, currentIndex, isReviewWord, isAnswerRevealed, isFinished]);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearAutoTimer();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const checkAnswerMatch = (input: string, card: SessionWordCard): boolean => {
    const cleanInput = input
      .trim()
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
    if (!cleanInput) return false;

    // Check against all meanings in the card
    for (const m of card.meanings || []) {
      const translation = m.translation || '';
      const subMeanings = translation.split(/[,/;]/).map((s: string) =>
        s
          .trim()
          .toLowerCase()
          .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
      );

      for (const sub of subMeanings) {
        if (!sub) continue;
        if (sub === cleanInput) return true;
        if (sub.startsWith(cleanInput) || cleanInput.startsWith(sub)) {
          if (Math.abs(sub.length - cleanInput.length) <= 2) return true;
        }
      }
    }

    // Fallback check against translations
    for (const tr of card.translations || []) {
      for (const m of tr.meanings || []) {
        const subMeanings = m.split(/[,/]/).map((s: string) =>
          s
            .trim()
            .toLowerCase()
            .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
        );

        for (const sub of subMeanings) {
          if (!sub) continue;
          if (sub === cleanInput) return true;
          if (sub.startsWith(cleanInput) || cleanInput.startsWith(sub)) {
            if (Math.abs(sub.length - cleanInput.length) <= 2) return true;
          }
        }
      }
    }
    return false;
  };

  const advanceToNext = () => {
    clearAutoTimer();
    if (currentIndex + 1 < queue.length) {
      setCurrentIndex((idx) => idx + 1);
      setMeaningIndex(0);
      setIsAnswerRevealed(false);
      setUserInput('');
      setIsMatch(null);
    } else {
      setIsFinished(true);
      triggerHapticFeedback('success');
      setTimeout(() => {
        onClose();
        fetchSession();
      }, 1500);
    }
  };

  const handlePrevWord = () => {
    if (currentIndex > 0) {
      clearAutoTimer();
      setCurrentIndex((idx) => idx - 1);
      setMeaningIndex(0);
      setIsAnswerRevealed(false);
      setUserInput('');
      setIsMatch(null);
    }
  };

  const handleNextWord = () => {
    if (currentIndex + 1 < queue.length) {
      clearAutoTimer();
      setCurrentIndex((idx) => idx + 1);
      setMeaningIndex(0);
      setIsAnswerRevealed(false);
      setUserInput('');
      setIsMatch(null);
    }
  };

  const handleMarkAsLearned = () => {
    const cardToRate = queue[currentIndex];
    if (!cardToRate) return;

    triggerHapticFeedback('success');
    submitReview(cardToRate.id, 'easy');
    advanceToNext();
  };

  const handleAlreadyKnowWord = () => {
    const cardToRate = queue[currentIndex];
    if (!cardToRate) return;

    triggerHapticFeedback('success');
    submitReview(cardToRate.id, 'already_know');
    advanceToNext();
  };

  const handleReviewRating = (rating: ReviewRating) => {
    const cardToRate = queue[currentIndex];
    if (!cardToRate) return;

    if (rating === 'again') {
      triggerHapticFeedback('error');
    } else if (rating === 'easy') {
      triggerHapticFeedback('success');
    } else {
      triggerHapticFeedback('medium');
    }

    submitReview(cardToRate.id, rating);
    advanceToNext();
  };

  const handleRevealAnswer = () => {
    const card = queue[currentIndex];
    if (!card) return;

    if (userInput.trim()) {
      const matched = checkAnswerMatch(userInput, card);
      setIsMatch(matched);
      triggerHapticFeedback(matched ? 'success' : 'medium');
    } else {
      setIsMatch(null);
      triggerHapticFeedback('light');
    }

    setIsAnswerRevealed(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!isAnswerRevealed) {
        handleRevealAnswer();
      }
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      clearAutoTimer();
      onClose();
    }
  };

  const meaningsList: WordMeaningItem[] =
    currentCard?.meanings && currentCard.meanings.length > 0
      ? currentCard.meanings
      : (currentCard?.translations || []).flatMap((t: any, tIdx: number) =>
          (t.meanings || []).map((m: string, mIdx: number) => ({
            id: tIdx * 100 + mIdx + 1,
            partOfSpeech: t.partOfSpeech,
            translation: m,
            register: [],
            synonyms: [],
            examples: currentCard?.examples || [],
            phrases: currentCard?.phrases || [],
          }))
        );

  const safeMeaningIndex = Math.min(
    meaningIndex,
    Math.max(0, meaningsList.length - 1)
  );
  const currentMeaning = meaningsList[safeMeaningIndex];

  // Accent-aware transcription
  const displayTranscription = currentCard
    ? settings.accent === 'uk'
      ? currentCard.phonBr || currentCard.transcription
      : currentCard.phonNAm || currentCard.transcription
    : '';

  return (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.cardContainer} onClick={(e) => e.stopPropagation()}>
        {isFinished || (queue.length === 0 && !currentCard) ? (
          <div className={styles.completedCard}>
            <div className={styles.celebrateEmoji}>🎉</div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
              Дневная норма выполнена!
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
              Вы успешно прошли запланированные слова на сегодня. Возвращайтесь завтра для закрепления интервального повторения!
            </p>
            <button
              type="button"
              className={styles.finishBtn}
              onClick={handleLoadRandomWords}
              disabled={isLoadingRandom}
              style={{
                background: 'var(--color-accent)',
                color: '#fff',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Plus size={15} />
              <span>{isLoadingRandom ? 'Загрузка...' : 'Учить еще 5 слов'}</span>
            </button>
            <button
              className={styles.finishBtn}
              onClick={() => {
                clearAutoTimer();
                onClose();
              }}
            >
              Завершить
            </button>
          </div>
        ) : currentCard ? (
          <div ref={cardContentRef} className={styles.card}>
            {/* Single Harmonious Top Ribbon with Fixed Height */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '6px',
                padding: '0',
                marginBottom: '4px',
                borderBottom: '1px solid var(--color-border)',
                width: '100%',
                height: '36px',
                minHeight: '36px',
                maxHeight: '36px',
                boxSizing: 'border-box',
              }}
            >
              {/* Left: Previous Word Arrow */}
              <button
                onClick={handlePrevWord}
                disabled={currentIndex === 0}
                style={{
                  background: 'var(--color-surface-hover)',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: '8px',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: currentIndex > 0 ? 'pointer' : 'not-allowed',
                  opacity: currentIndex > 0 ? 1 : 0.25,
                  color: 'var(--color-text-primary)',
                  padding: 0,
                  flexShrink: 0,
                }}
                title="Предыдущее слово (←)"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Middle: Frequency Rank + CEFR + Status + Topics */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  overflowX: 'auto',
                  scrollbarWidth: 'none',
                  flex: 1,
                  minWidth: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                {/* Frequency Rank */}
                {currentCard.frequencyRank && (
                  <span
                    style={{
                      background: 'var(--color-surface-hover)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-secondary)',
                      fontSize: '10.5px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '5px',
                      flexShrink: 0,
                    }}
                    title="Частотный ранг в Оксфордском словаре"
                  >
                    #{currentCard.frequencyRank}
                  </span>
                )}

                {/* CEFR Level */}
                <span
                  style={{
                    background: 'var(--color-warning-light)',
                    border: '1px solid var(--color-warning-border)',
                    color: 'var(--color-warning)',
                    fontSize: '10.5px',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '5px',
                    flexShrink: 0,
                  }}
                >
                  {currentCard.cefrLevel}
                </span>

                {/* Status Pill */}
                {isReviewWord ? (
                  <span className={styles.cardTypePillReview} style={{ fontSize: '10px', padding: '2px 6px', flexShrink: 0 }}>🔄 Повторение</span>
                ) : (
                  <span className={styles.cardTypePillNew} style={{ fontSize: '10px', padding: '2px 6px', flexShrink: 0 }}>✨ Новое</span>
                )}

                {/* Topic Badges */}
                {currentCard.topics && currentCard.topics.map((t: string, idx: number) => (
                  <span
                    key={idx}
                    style={{
                      background: 'rgba(168, 85, 247, 0.14)',
                      color: '#a855f7',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '10px',
                      flexShrink: 0,
                    }}
                  >
                    {t}
                  </span>
                ))}

                {/* Oxford 3000 / 5000 Lists */}
                <span style={{ border: '1px solid var(--color-accent-border)', color: 'var(--color-accent-text)', background: 'var(--color-accent-light)', padding: '1px 5px', borderRadius: '5px', fontSize: '10px', fontWeight: 800, flexShrink: 0 }}>
                  3000
                </span>
                <span style={{ border: '1px solid var(--color-accent-border)', color: 'var(--color-accent-text)', background: 'var(--color-accent-light)', padding: '1px 5px', borderRadius: '5px', fontSize: '10px', fontWeight: 800, flexShrink: 0 }}>
                  5000
                </span>
              </div>

              {/* Right: Next Word Arrow */}
              <button
                onClick={handleNextWord}
                disabled={currentIndex + 1 >= queue.length}
                style={{
                  background: 'var(--color-surface-hover)',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: '8px',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: currentIndex + 1 < queue.length ? 'pointer' : 'not-allowed',
                  opacity: currentIndex + 1 < queue.length ? 1 : 0.25,
                  color: 'var(--color-text-primary)',
                  padding: 0,
                  flexShrink: 0,
                }}
                title="Следующее слово (→)"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Core Card Body */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

              {/* Master Word Card Component */}
              <Variant14SegmentedPillCard
                currentCard={currentCard}
                meaningsList={meaningsList}
                safeMeaningIndex={safeMeaningIndex}
                currentMeaning={currentMeaning}
                displayTranscription={displayTranscription}
                settings={settings}
                onSelectMeaning={(idx) => {
                  setMeaningIndex(idx);
                  triggerHapticFeedback('light');
                }}
                renderHighlightedSentence={renderHighlightedSentence}
                isReviewWord={isReviewWord}
                isAnswerRevealed={!isReviewWord ? true : isAnswerRevealed}
                onRevealAnswer={handleRevealAnswer}
              />

              {/* Input & Action Controls: Tailored by Mode */}
              {isReviewWord ? (
                /* REPEAT/REVIEW MODE (Active Recall) */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Self-check Input */}
                  <div className={styles.inputSection}>
                    <input
                      ref={inputRef}
                      type="text"
                      className={`
                        ${styles.typeInput} 
                        ${isAnswerRevealed && isMatch === true ? styles.typeInputCorrect : ''}
                        ${isAnswerRevealed && isMatch === false ? styles.typeInputWrong : ''}
                      `}
                      placeholder="Введите перевод (или нажмите Enter)..."
                      value={userInput}
                      disabled={isAnswerRevealed}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    {userInput.trim() && !isAnswerRevealed && (
                      <button
                        className={styles.clearInputBtn}
                        onClick={() => setUserInput('')}
                        title="Очистить"
                      >
                        ✕
                      </button>
                    )}

                    {isAnswerRevealed && isMatch !== null && (
                      <div
                        className={`
                          ${styles.feedbackBadge}
                          ${isMatch ? styles.feedbackCorrect : styles.feedbackIncorrect}
                        `}
                      >
                        {isMatch ? (
                          <>
                            <Check size={15} strokeWidth={3} />
                            <span>Отлично! Перевод совпал со значением</span>
                          </>
                        ) : (
                          <>
                            <X size={15} strokeWidth={3} />
                            <span>Не совсем так. Сверьтесь со слайдером значений выше</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions for Review Mode */}
                  {!isAnswerRevealed ? (
                    /* Step 1: Reveal Action */
                    <button
                      type="button"
                      onClick={handleRevealAnswer}
                      style={{
                        padding: '11px 16px',
                        background: 'var(--color-accent)',
                        border: 'none',
                        color: '#ffffff',
                        borderRadius: '12px',
                        fontSize: '13.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'all var(--transition-fast) ease',
                      }}
                    >
                      <span>Показать ответ (Enter)</span>
                    </button>
                  ) : (
                    /* Step 2: Spaced Repetition 4-Rating Buttons */
                    <div className={styles.reviewRatingGrid}>
                      <button
                        className={`${styles.reviewRateBtn} ${styles.rateAgainBtn}`}
                        onClick={() => handleReviewRating('again')}
                        title="Не вспомнил слово"
                      >
                        <span className={styles.rateEmoji}>🔴</span>
                        <span className={styles.rateText}>Не помню</span>
                      </button>

                      <button
                        className={`${styles.reviewRateBtn} ${styles.rateHardBtn}`}
                        onClick={() => handleReviewRating('hard')}
                        title="Вспомнил с трудом"
                      >
                        <span className={styles.rateEmoji}>🟡</span>
                        <span className={styles.rateText}>С трудом</span>
                      </button>

                      <button
                        className={`${styles.reviewRateBtn} ${styles.rateGoodBtn}`}
                        onClick={() => handleReviewRating('good')}
                        title="Вспомнил нормально"
                      >
                        <span className={styles.rateEmoji}>🟢</span>
                        <span className={styles.rateText}>Помню</span>
                      </button>

                      <button
                        className={`${styles.reviewRateBtn} ${styles.rateEasyBtn}`}
                        onClick={() => handleReviewRating('easy')}
                        title="Вспомнил очень легко"
                      >
                        <span className={styles.rateEmoji}>🔵</span>
                        <span className={styles.rateText}>Легко</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* NEW WORD STUDY MODE (Pure Study & Learn) */
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '2px' }}>
                  <button
                    type="button"
                    onClick={handleMarkAsLearned}
                    style={{
                      padding: '11px 14px',
                      background: 'var(--color-accent)',
                      border: 'none',
                      color: '#ffffff',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                    title="Отметить слово изученным на сегодня"
                  >
                    <span>✓ Изучил</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAlreadyKnowWord}
                    style={{
                      padding: '11px 14px',
                      background: 'rgba(234, 179, 8, 0.12)',
                      border: '1.5px solid rgba(234, 179, 8, 0.4)',
                      color: '#eab308',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                    title="Я уже знаю это слово — убрать из очереди навсегда"
                  >
                    <span>⚡ Уже знаю</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
