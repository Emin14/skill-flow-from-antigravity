'use client';

import React, { useState, useEffect } from 'react';
import {
  OxfordWord,
  WordMeaningItem,
  EnglishWordProgressItem,
  EnglishWordReviewLogItem,
  speakEnglishWord,
} from '@/entities/english';
import { lockBodyScroll, unlockBodyScroll } from '@/shared/lib/scrollLock';
import {
  Volume2,
  X,
  Layers,
} from 'lucide-react';
import styles from './WordDetailModal.module.css';

interface WordDetailModalProps {
  word: OxfordWord | null;
  isOpen: boolean;
  onClose: () => void;
  accent?: 'us' | 'uk';
}

const MILESTONES = [
  { label: '1д', target: '1д' },
  { label: '3д', target: '+3д' },
  { label: '7д', target: '+7д' },
  { label: '14д', target: '+14д' },
  { label: '30д', target: 'Mastered' },
];

export const WordDetailModal: React.FC<WordDetailModalProps> = ({
  word,
  isOpen,
  onClose,
  accent = 'us',
}) => {
  const [meaningIndex, setMeaningIndex] = useState(0);
  const [showAllMeanings, setShowAllMeanings] = useState(false);
  const [historyLogs, setHistoryLogs] = useState<EnglishWordReviewLogItem[]>([]);
  const [progress, setProgress] = useState<EnglishWordProgressItem | null>(null);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      lockBodyScroll();
      return () => unlockBodyScroll();
    }
  }, [isOpen]);

  // Reset state and fetch history on word change
  useEffect(() => {
    if (isOpen && word) {
      setMeaningIndex(0);
      setShowAllMeanings(false);
      fetchWordHistory(word.id);
    }
  }, [isOpen, word?.id]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const fetchWordHistory = async (wordId: string) => {
    try {
      const res = await fetch(`/api/english/word-history?wordId=${encodeURIComponent(wordId)}`);
      if (res.ok) {
        const data = await res.json();
        setProgress(data.progress || null);
        setHistoryLogs(data.history || []);
      }
    } catch (err) {
      console.warn('Failed to load word history:', err);
    }
  };

  if (!isOpen || !word) return null;

  // Meanings stable sort (primary first)
  const rawMeanings: WordMeaningItem[] =
    word.meanings && word.meanings.length > 0
      ? word.meanings
      : (word.translations || []).flatMap((t: any, tIdx: number) =>
          (t.meanings || []).map((m: string, mIdx: number) => ({
            id: tIdx * 100 + mIdx + 1,
            partOfSpeech: t.partOfSpeech,
            translation: m,
            register: [],
            synonyms: [],
            examples: word.examples || [],
            phrases: word.phrases || [],
          }))
        );

  const primaryMeanings = rawMeanings.filter((m) => !!m.primary);
  const secondaryMeanings = rawMeanings.filter((m) => !m.primary);
  const sortedMeanings =
    primaryMeanings.length > 0
      ? [...primaryMeanings, ...secondaryMeanings]
      : rawMeanings;

  const secondaryCount = secondaryMeanings.length;
  const hasPrimaryDistinction = primaryMeanings.length > 0 && secondaryCount > 0;
  const displayedMeanings = !showAllMeanings && hasPrimaryDistinction ? primaryMeanings : sortedMeanings;
  const safeMeaningIndex = Math.min(displayedMeanings.length - 1, Math.max(0, meaningIndex));
  const activeMeaning = displayedMeanings[safeMeaningIndex] || sortedMeanings[0];

  // Highlight word in sentence
  const renderHighlightedSentence = (sentence: string, targetWord: string) => {
    if (!sentence || !targetWord) return sentence;
    const baseWord = targetWord.toLowerCase().trim();
    const regex = new RegExp(`\\b(${baseWord}[a-z]*)\\b`, 'gi');
    const parts = sentence.split(regex);
    return parts.map((part, idx) => {
      if (regex.test(part)) {
        return (
          <span key={idx} className={styles.highlightedWord}>
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const formatDateShort = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'short',
      }).format(d);
    } catch {
      return isoString;
    }
  };

  const ratingToEmoji = (rating: string) => {
    switch (rating) {
      case 'again':
        return '🔴 Не помню';
      case 'hard':
        return '🟡 Трудно';
      case 'good':
        return '🟢 Нормально';
      case 'easy':
        return '🔵 Легко';
      case 'already_know':
        return '💎 Знаю';
      default:
        return rating;
    }
  };

  const renderStatusBadge = (status?: string) => {
    const s = status || progress?.status || 'NEW';
    const statusMap: Record<string, { label: string; bg: string; color: string; border: string }> = {
      NEW: { label: 'Новое', bg: 'var(--color-surface-hover)', color: 'var(--color-text-muted)', border: 'var(--color-border)' },
      LEARNING: { label: 'Изучается', bg: 'var(--color-accent-light)', color: 'var(--color-accent-text)', border: 'var(--color-accent-border)' },
      REVIEW: { label: 'На повторении', bg: 'var(--color-warning-light)', color: 'var(--color-warning)', border: 'var(--color-warning-border)' },
      MASTERED: { label: 'Выучено', bg: 'var(--color-success-light)', color: 'var(--color-success)', border: 'var(--color-success-border)' },
    };
    const current = statusMap[s] || statusMap.NEW;
    return (
      <span
        style={{
          fontSize: '11px',
          fontWeight: 700,
          padding: '2px 7px',
          borderRadius: '6px',
          background: current.bg,
          color: current.color,
          border: `1px solid ${current.border}`,
        }}
      >
        {current.label}
      </span>
    );
  };

  const repetitions = progress?.repetitions ?? 0;
  const isMastered = progress?.status === 'MASTERED' || repetitions >= 5;

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modal}>
        {/* Header - Fixed top */}
        <div className={styles.header}>
          <div>
            <div className={styles.wordTitleRow}>
              <span className={styles.wordTitle}>{word.word}</span>
              {word.transcription && (
                <span className={styles.transcription}>{word.transcription}</span>
              )}
              <button
                type="button"
                className={styles.audioBtn}
                onClick={() => speakEnglishWord(word.word, accent)}
                title="Озвучить слово"
              >
                <Volume2 size={15} />
              </button>
            </div>
          </div>

          <div className={styles.headerActions}>
            <span className={styles.cefrBadge}>{word.cefrLevel}</span>
            {renderStatusBadge(word.status)}
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              title="Закрыть (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body - Scrollable Middle Area */}
        <div className={styles.contentBody}>
          {/* 1. Meaning Pills Track */}
          <div className={styles.meaningsTrack}>
            {displayedMeanings.map((m, idx) => {
              const isSelected = idx === safeMeaningIndex;
              return (
                <button
                  key={m.id || idx}
                  type="button"
                  className={`${styles.pillBtn} ${isSelected ? styles.pillBtnActive : ''}`}
                  onClick={() => setMeaningIndex(idx)}
                >
                  {m.translation.split(/[,;/]/)[0].trim() || `Значение ${idx + 1}`}
                </button>
              );
            })}

            {hasPrimaryDistinction && (
              <button
                type="button"
                className={styles.expanderPill}
                onClick={() => {
                  if (!showAllMeanings) {
                    setShowAllMeanings(true);
                    setMeaningIndex(primaryMeanings.length);
                  } else {
                    setShowAllMeanings(false);
                    setMeaningIndex(0);
                  }
                }}
              >
                <Layers size={11} />
                <span>{showAllMeanings ? 'Основные' : `+${secondaryCount} доп.`}</span>
              </button>
            )}
          </div>

          {/* 2. Active Meaning Card */}
          {activeMeaning && (
            <div className={styles.meaningCard}>
              {activeMeaning.partOfSpeech && (
                <span className={styles.posBadge}>{activeMeaning.partOfSpeech}</span>
              )}
              <div className={styles.translationText}>{activeMeaning.translation}</div>

              {activeMeaning.synonyms && activeMeaning.synonyms.length > 0 && (
                <div className={styles.synonymsRow}>
                  <span className={styles.synonymsLabel}>Синонимы:</span>
                  <span>{activeMeaning.synonyms.join(', ')}</span>
                </div>
              )}

              {/* Examples */}
              {activeMeaning.examples && activeMeaning.examples.length > 0 && (
                <div className={styles.examplesSection}>
                  {activeMeaning.examples.map((ex, exIdx) => (
                    <div key={exIdx} className={styles.exampleItem}>
                      <div className={styles.exampleEn}>
                        {renderHighlightedSentence(ex.en, word.word)}
                      </div>
                      {ex.ru && <div className={styles.exampleRu}>{ex.ru}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. Phrasal verbs / Idioms */}
          {word.phrases && word.phrases.length > 0 && (
            <div className={styles.phrasesSection}>
              <div className={styles.phrasesTitle}>Фразовые глаголы и идиомы:</div>
              {word.phrases.map((ph, phIdx) => (
                <div key={ph.id || phIdx} className={styles.phraseCard}>
                  <span className={styles.phraseName}>{ph.phrase}</span>
                  <span className={styles.phraseTranslation}>{ph.translation}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ALWAYS VISIBLE PINNED REPETITION TRACK (At the bottom, no scrolling needed) */}
        <div className={styles.pinnedRepeatFooter}>
          {/* Milestone timeline track */}
          <div className={styles.timelineTrackContainer}>
            <div className={styles.timelineTrack}>
              {/* Connector Line behind nodes */}
              <div className={styles.connectorLine}>
                {[0, 1, 2, 3].map((idx) => {
                  const isStepPassed = isMastered || repetitions > idx;
                  return (
                    <div
                      key={idx}
                      className={`${styles.lineSegment} ${
                        isStepPassed ? styles.lineSegmentCompleted : styles.lineSegmentFuture
                      }`}
                    />
                  );
                })}
              </div>

              {/* 5 Milestone Step Nodes */}
              {MILESTONES.map((step, idx) => {
                const isCompleted = isMastered || repetitions > idx;
                const isNext = !isMastered && repetitions === idx;
                // Match with review log if available
                const logForStep = historyLogs[historyLogs.length - 1 - idx] || historyLogs[0];
                const ratingEmojiMap: Record<string, string> = {
                  again: '🔴',
                  hard: '🟡',
                  good: '🟢',
                  easy: '🔵',
                  already_know: '💎',
                };
                const ratingEmoji = logForStep ? ratingEmojiMap[logForStep.rating] || '🟢' : '🟢';

                return (
                  <div key={idx} className={styles.stepColumn}>
                    <span
                      className={`${styles.stepLabel} ${
                        isCompleted
                          ? styles.stepLabelCompleted
                          : isNext
                          ? styles.stepLabelNext
                          : styles.stepLabelFuture
                      }`}
                    >
                      {step.label}
                    </span>

                    <div
                      className={`${styles.nodeCircle} ${
                        isCompleted
                          ? styles.nodeCompleted
                          : isNext
                          ? styles.nodeNext
                          : styles.nodeFuture
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <span className={styles.checkmarkIcon}>✓</span>
                          {logForStep && (
                            <span className={styles.smartRatingBadge} title={`Оценка: ${logForStep.rating}`}>
                              {ratingEmoji}
                            </span>
                          )}
                        </>
                      ) : isNext ? (
                        <span className={styles.pulseDot} />
                      ) : (
                        <span className={styles.emptyDot} />
                      )}
                    </div>

                    <span
                      className={`${styles.subLabel} ${
                        isCompleted
                          ? styles.subLabelCompleted
                          : isNext
                          ? styles.subLabelNext
                          : styles.subLabelFuture
                      }`}
                    >
                      {isCompleted
                        ? (logForStep ? formatDateShort(logForStep.createdAt) : 'Пройдено')
                        : isNext
                        ? (progress?.nextReviewDate ? formatDateShort(progress.nextReviewDate) : 'Ожидает')
                        : step.target}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer bottom meta row: recent ratings and memory stats */}
          <div className={styles.footerMetaRow}>
            <div className={styles.recentRatingsGroup}>
              {historyLogs.slice(0, 3).map((log) => (
                <span key={log.id} className={styles.ratingMiniPill} title={`Интервал: ${log.intervalDays} дн.`}>
                  {ratingToEmoji(log.rating)}
                  <span style={{ opacity: 0.65 }}>{formatDateShort(log.createdAt)}</span>
                </span>
              ))}
            </div>

            <div className={styles.metaStatsGroup}>
              <span title="Серия успешных повторов">🔥 {repetitions}/5</span>
              <span title="Количество ошибок">⚠️ {progress?.errorCount ?? 0}</span>
              <span title="Коэффициент легкости">⚡ {progress?.easeFactor ? progress.easeFactor.toFixed(1) : '2.5'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
