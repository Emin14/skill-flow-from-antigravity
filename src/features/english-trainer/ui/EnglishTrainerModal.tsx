'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  useEnglishStore,
  SessionWordCard,
  speakEnglishWord,
  triggerHapticFeedback,
} from '@/entities/english';
import { Check, X, EyeOff, CheckCheck, ArrowRight } from 'lucide-react';
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

export const EnglishTrainerModal: React.FC<EnglishTrainerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { session, settings, submitReview, fetchSession } = useEnglishStore();

  const [queue, setQueue] = useState<SessionWordCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>('');
  const [isMatch, setIsMatch] = useState<boolean | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const cardContentRef = useRef<HTMLDivElement>(null);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initialMountRef = useRef<boolean>(false);

  const clearAutoTimer = () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearAutoTimer();
  }, []);

  // When modal is opened, capture active cards and start clean session run
  useEffect(() => {
    if (isOpen) {
      clearAutoTimer();
      const allCards = [...(session?.reviewWords || []), ...(session?.newWords || [])];
      if (allCards.length > 0) {
        setQueue(shuffleList(allCards));
        setCurrentIndex(0);
        setIsAnswerRevealed(false);
        setUserInput('');
        setIsMatch(null);
        setIsFinished(false);
      } else {
        fetchSession();
      }
    }
    // Only re-run when isOpen changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const currentCard: SessionWordCard | undefined = queue[currentIndex];

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
    if (isOpen && !isAnswerRevealed && !isFinished) {
      inputRef.current?.focus();
    }
  }, [isOpen, currentIndex, isAnswerRevealed, isFinished]);

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
    const cleanInput = input.trim().toLowerCase();
    if (!cleanInput) return false;

    for (const tr of card.translations || []) {
      for (const m of tr.meanings || []) {
        const cleanMeaning = m.trim().toLowerCase();
        if (cleanMeaning === cleanInput) return true;
        if (cleanMeaning.includes(cleanInput) || cleanInput.includes(cleanMeaning)) {
          return true;
        }
      }
    }
    return false;
  };

  const advanceToNext = () => {
    clearAutoTimer();
    if (currentIndex + 1 < queue.length) {
      setCurrentIndex((idx) => idx + 1);
      setIsAnswerRevealed(false);
      setUserInput('');
      setIsMatch(null);
    } else {
      // Completed current run
      setIsFinished(true);
      triggerHapticFeedback('success');
      setTimeout(() => {
        onClose();
        fetchSession();
      }, 1500);
    }
  };

  const handleNextWordOnly = () => {
    // Only allow if correct answer has been verified (isMatch === true)
    if (isMatch !== true) return;
    triggerHapticFeedback('light');
    advanceToNext();
  };

  const handleMarkAsMastered = () => {
    const cardToRate = queue[currentIndex];
    if (!cardToRate) return;

    triggerHapticFeedback('success');
    submitReview(cardToRate.id, 'easy');
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

  const handleHideAnswer = () => {
    clearAutoTimer();
    setIsAnswerRevealed(false);
    setIsMatch(null);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      clearAutoTimer();
      onClose();
    }
  };

  const getMaskedExample = (text: string, targetWord: string) => {
    const regex = new RegExp(`\\b${targetWord}[a-zA-Z]*\\b`, 'gi');
    return text.replace(regex, '[ ... ]');
  };

  return (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      {/* Top Bar */}
      <div className={styles.header}>
        <button
          className={styles.closeBtn}
          onClick={() => {
            clearAutoTimer();
            onClose();
          }}
        >
          <span>✕</span>
          <span>Закрыть (Esc)</span>
        </button>

        {!isFinished && currentCard && (
          <div className={styles.progressStats}>
            <span className={styles.levelBadge}>{currentCard.cefrLevel}</span>
            <span className={styles.counterBadge}>
              {currentIndex + 1} / {queue.length}
            </span>
          </div>
        )}
      </div>

      {/* Main Study Area */}
      <div className={styles.cardContainer} onClick={handleBackdropClick}>
        {isFinished || (queue.length === 0 && !currentCard) ? (
          <div className={styles.completedCard}>
            <div className={styles.celebrateEmoji}>🎉</div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
              {isFinished ? 'Круг завершен!' : 'Все слова на сегодня выучены!'}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', lineHeight: 1.5, margin: 0 }}>
              {isFinished
                ? 'Вы просмотрели все карточки этого круга. Окно закрывается...'
                : 'На сегодня больше нет невыученных слов. Отличный результат!'}
            </p>
            <button
              className={styles.finishBtn}
              onClick={() => {
                clearAutoTimer();
                onClose();
              }}
            >
              Закрыть
            </button>
          </div>
        ) : currentCard ? (
          <div ref={cardContentRef} className={styles.card}>
            {/* Headword Header */}
            <div className={styles.wordSection}>
              <div className={styles.wordRow}>
                <h1 className={styles.headword}>{currentCard.word}</h1>
                <button
                  className={styles.audioBtn}
                  onClick={() => speakEnglishWord(currentCard.word, settings.accent)}
                  title="Прослушать произношение"
                >
                  🔊
                </button>
              </div>
              <div className={styles.transcription}>{currentCard.transcription}</div>
            </div>

            {/* Context Masked Example */}
            {currentCard.examples && currentCard.examples.length > 0 && (
              <div className={styles.exampleMasked}>
                «{getMaskedExample(currentCard.examples[0].en, currentCard.word)}»
              </div>
            )}

            {/* Interactive User Guess Input */}
            <div className={styles.inputSection}>
              <input
                ref={inputRef}
                type="text"
                className={`
                  ${styles.typeInput} 
                  ${isAnswerRevealed && isMatch === true ? styles.typeInputCorrect : ''}
                  ${isAnswerRevealed && isMatch === false ? styles.typeInputWrong : ''}
                `}
                placeholder="Введите перевод на русском (или нажмите Enter)..."
                value={userInput}
                disabled={isAnswerRevealed}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (!isAnswerRevealed) {
                      handleRevealAnswer();
                    }
                  }
                }}
              />

              {/* Feedback badge if user typed an answer */}
              {isAnswerRevealed && isMatch !== null && (
                <div
                  className={`
                    ${styles.feedbackBadge}
                    ${isMatch ? styles.feedbackCorrect : styles.feedbackIncorrect}
                  `}
                >
                  {isMatch ? (
                    <>
                      <Check size={16} strokeWidth={3} />
                      <span>Отлично! Перевод правильный</span>
                    </>
                  ) : (
                    <>
                      <X size={16} strokeWidth={3} />
                      <span>Не совсем так. Скройте перевод и введите правильное слово</span>
                    </>
                  )}
                </div>
              )}

              {!isAnswerRevealed && (
                <button className={styles.showAnswerBtn} onClick={handleRevealAnswer}>
                  <span>👁</span>
                  <span>Показать перевод (Enter)</span>
                </button>
              )}
            </div>

            {/* Revealed Translations & Details */}
            {isAnswerRevealed && (
              <div className={styles.revealedContent}>
                {/* Button to hide translation back and retry typing */}
                <button className={styles.hideAnswerBtn} onClick={handleHideAnswer}>
                  <EyeOff size={14} />
                  <span>Скрыть перевод и ввести заново</span>
                </button>

                <div className={styles.translationsList}>
                  {currentCard.translations?.map((tr, i) => (
                    <div key={i} className={styles.posGroup}>
                      <span className={styles.posTag}>{tr.partOfSpeech}</span>
                      <span className={styles.meanings}>{tr.meanings.join(', ')}</span>
                    </div>
                  ))}
                </div>

                {currentCard.collocations && currentCard.collocations.length > 0 && (
                  <div className={styles.detailsBlock}>
                    <span className={styles.detailTitle}>Словосочетания:</span>
                    {currentCard.collocations.map((cl, i) => (
                      <div key={i} className={styles.collocItem}>
                        <strong>• {cl.en}</strong> — <span className={styles.collocRu}>{cl.ru}</span>
                      </div>
                    ))}
                  </div>
                )}

                {currentCard.examples && currentCard.examples.length > 0 && (
                  <div className={styles.detailsBlock}>
                    <span className={styles.detailTitle}>Примеры предложений:</span>
                    {currentCard.examples.map((ex, i) => (
                      <div key={i} className={styles.exampleFullItem}>
                        • {ex.en} <br />
                        <span className={styles.exampleRu}>({ex.ru})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Bottom Controls: Next Card (requires valid input) & Mastered buttons */}
      {!isFinished && currentCard && (
        <div className={styles.footerControls}>
          <div className={styles.actionButtonsRow}>
            <button
              className={styles.nextWordBtn}
              onClick={handleNextWordOnly}
              disabled={isMatch !== true}
              title={
                isMatch === true
                  ? 'Перейти к следующему слову'
                  : 'Введите правильный перевод слова, чтобы перейти дальше'
              }
            >
              <span>Дальше</span>
              <ArrowRight size={16} />
            </button>

            <button
              className={styles.masteredBtn}
              onClick={handleMarkAsMastered}
              title="Отметить слово изученным — больше не показывать сегодня"
            >
              <CheckCheck size={18} />
              <span>Изучил ✓</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
