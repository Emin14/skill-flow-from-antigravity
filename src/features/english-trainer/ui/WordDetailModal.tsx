'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';
import styles from './WordDetailModal.module.css';

interface WordDetailModalProps {
  word: OxfordWord | null;
  isOpen: boolean;
  onClose: () => void;
  accent?: 'us' | 'uk';
}

// 5 Step Milestones: Top shows Step #, Bottom shows Target Interval
const MILESTONES = [
  { stepNum: '1', targetInterval: '1д' },
  { stepNum: '2', targetInterval: '+3д' },
  { stepNum: '3', targetInterval: '+7д' },
  { stepNum: '4', targetInterval: '+14д' },
  { stepNum: '5', targetInterval: 'Mastered' },
];

const RATING_STYLES: Record<string, { bg: string; border: string; glow: string; label: string; emoji: string }> = {
  again: { bg: '#ef4444', border: '#dc2626', glow: 'rgba(239, 68, 68, 0.4)', label: 'Не помню', emoji: '🔴' },
  hard: { bg: '#f59e0b', border: '#d97706', glow: 'rgba(245, 158, 11, 0.4)', label: 'Трудно', emoji: '🟡' },
  good: { bg: '#10b981', border: '#059669', glow: 'rgba(16, 185, 129, 0.4)', label: 'Нормально', emoji: '🟢' },
  easy: { bg: '#3b82f6', border: '#2563eb', glow: 'rgba(59, 130, 246, 0.4)', label: 'Легко', emoji: '🔵' },
  already_know: { bg: '#a855f7', border: '#9333ea', glow: 'rgba(168, 85, 247, 0.4)', label: 'Знаю', emoji: '💎' },
};

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

  const activePillRef = useRef<HTMLButtonElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

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

  // Auto-scroll active pill into view
  useEffect(() => {
    if (activePillRef.current && scrollContainerRef.current) {
      activePillRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'nearest',
        block: 'nearest',
      });
    }
  }, [meaningIndex, showAllMeanings]);

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
    const found = RATING_STYLES[rating];
    return found ? `${found.emoji} ${found.label}` : rating;
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

  // Chronological logs (oldest first) to match step 1 -> step 2 -> step 3...
  const chronologicalLogs = [...historyLogs].reverse();

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modal}>
        {/* 1. Header - Fixed Top */}
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

        {/* 2. PINNED Meaning Pills Track with [‹] and [›] navigation - Always Visible Under Header */}
        <div className={styles.meaningsTrackPinned}>
          <button
            type="button"
            disabled={safeMeaningIndex === 0}
            onClick={() => setMeaningIndex(Math.max(0, safeMeaningIndex - 1))}
            className={styles.navArrowBtn}
            title="Предыдущее значение"
          >
            <ChevronLeft size={16} />
          </button>

          <div ref={scrollContainerRef} className={styles.meaningsTrackScroll}>
            {displayedMeanings.map((m, idx) => {
              const isSelected = idx === safeMeaningIndex;
              const rawTr = m.translation?.split(/[,;/]/)[0]?.trim() || `Значение ${idx + 1}`;
              return (
                <button
                  key={m.id || idx}
                  ref={isSelected ? activePillRef : null}
                  type="button"
                  className={`${styles.pillBtn} ${isSelected ? styles.pillBtnActive : ''}`}
                  onClick={() => setMeaningIndex(idx)}
                  title={m.translation}
                >
                  {rawTr}
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

          <button
            type="button"
            disabled={safeMeaningIndex === displayedMeanings.length - 1}
            onClick={() => setMeaningIndex(Math.min(displayedMeanings.length - 1, safeMeaningIndex + 1))}
            className={styles.navArrowBtn}
            title="Следующее значение"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* 3. Content Body - Scrollable Middle Area (Translations, Examples, Phrases) */}
        <div className={styles.contentBody}>
          {/* Active Meaning Card */}
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

          {/* Phrasal verbs / Idioms */}
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

        {/* 4. PINNED REPETITION TRACK (At the bottom, always visible) */}
        <div className={styles.pinnedRepeatFooter}>
          <div className={styles.timelineTrackContainer}>
            <div className={styles.timelineTrack}>
              {/* Connector Line */}
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

                // Match with the chronological review log for this specific repetition
                const logForStep = chronologicalLogs[idx] || (isCompleted ? historyLogs[0] : null);
                const ratingInfo = logForStep ? RATING_STYLES[logForStep.rating] || RATING_STYLES.good : RATING_STYLES.good;

                return (
                  <div key={idx} className={styles.stepColumn}>
                    {/* Top: Step Number (1, 2, 3, 4, 5) */}
                    <span
                      className={`${styles.stepLabel} ${
                        isCompleted
                          ? styles.stepLabelCompleted
                          : isNext
                          ? styles.stepLabelNext
                          : styles.stepLabelFuture
                      }`}
                    >
                      {step.stepNum}
                    </span>

                    {/* Circle: Colored in the rating color if completed */}
                    <div
                      className={`${styles.nodeCircle} ${
                        isCompleted
                          ? ''
                          : isNext
                          ? styles.nodeNext
                          : styles.nodeFuture
                      }`}
                      style={
                        isCompleted
                          ? {
                              backgroundColor: ratingInfo.bg,
                              borderColor: ratingInfo.border,
                              boxShadow: `0 0 10px ${ratingInfo.glow}`,
                              color: '#ffffff',
                            }
                          : undefined
                      }
                      title={
                        isCompleted && logForStep
                          ? `Повтор ${step.stepNum}: ${ratingInfo.label} (${formatDateShort(logForStep.createdAt)})`
                          : isNext
                          ? `Следующий повтор: ${progress?.nextReviewDate || 'Ожидает'}`
                          : `Плановый повтор ${step.stepNum}`
                      }
                    >
                      {isCompleted ? (
                        <>
                          <span className={styles.checkmarkIcon}>✓</span>
                          {logForStep && (
                            <span className={styles.smartRatingBadge} title={`Оценка: ${ratingInfo.label}`}>
                              {ratingInfo.emoji}
                            </span>
                          )}
                        </>
                      ) : isNext ? (
                        <span className={styles.pulseDot} />
                      ) : (
                        <span className={styles.emptyDot} />
                      )}
                    </div>

                    {/* Bottom: Date when reviewed (e.g. 3 сен) OR interval when to review next (+3д, +7д...) */}
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
                        : step.targetInterval}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer bottom meta row */}
          <div className={styles.footerMetaRow}>
            <div className={styles.recentRatingsGroup}>
              {historyLogs.slice(0, 3).map((log) => (
                <span key={log.id} className={styles.ratingMiniPill} title={`Интервал: ${log.intervalDays} дн.`}>
                  {ratingToEmoji(log.rating)}
                  <span style={{ opacity: 0.65 }}>({formatDateShort(log.createdAt)})</span>
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
