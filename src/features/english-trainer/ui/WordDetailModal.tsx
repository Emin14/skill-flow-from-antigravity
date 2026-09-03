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
  BookOpen,
  History,
  Flame,
  AlertTriangle,
  Calendar,
  Zap,
  Layers,
} from 'lucide-react';
import styles from './WordDetailModal.module.css';

interface WordDetailModalProps {
  word: OxfordWord | null;
  isOpen: boolean;
  onClose: () => void;
  accent?: 'us' | 'uk';
}

export const WordDetailModal: React.FC<WordDetailModalProps> = ({
  word,
  isOpen,
  onClose,
  accent = 'us',
}) => {
  const [activeTab, setActiveTab] = useState<'meanings' | 'history'>('meanings');
  const [meaningIndex, setMeaningIndex] = useState(0);
  const [showAllMeanings, setShowAllMeanings] = useState(false);
  const [historyLogs, setHistoryLogs] = useState<EnglishWordReviewLogItem[]>([]);
  const [progress, setProgress] = useState<EnglishWordProgressItem | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

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
      setActiveTab('meanings');
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
    setIsLoadingHistory(true);
    try {
      const res = await fetch(`/api/english/word-history?wordId=${encodeURIComponent(wordId)}`);
      if (res.ok) {
        const data = await res.json();
        setProgress(data.progress || null);
        setHistoryLogs(data.history || []);
      }
    } catch (err) {
      console.warn('Failed to load word history:', err);
    } finally {
      setIsLoadingHistory(false);
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

  // Format date helper
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return isoString;
    }
  };

  const renderRatingBadge = (rating: string) => {
    switch (rating) {
      case 'again':
        return <span className={`${styles.ratingTag} ${styles.ratingAgain}`}>🔴 Не помню</span>;
      case 'hard':
        return <span className={`${styles.ratingTag} ${styles.ratingHard}`}>🟡 Трудно</span>;
      case 'good':
        return <span className={`${styles.ratingTag} ${styles.ratingGood}`}>🟢 Нормально</span>;
      case 'easy':
        return <span className={`${styles.ratingTag} ${styles.ratingEasy}`}>🔵 Легко</span>;
      case 'already_know':
        return <span className={`${styles.ratingTag} ${styles.ratingMastered}`}>💎 Уже знаю</span>;
      default:
        return <span className={styles.ratingTag}>{rating}</span>;
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

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modal}>
        {/* Header */}
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

        {/* Tabs Row */}
        <div className={styles.tabsRow}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'meanings' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('meanings')}
          >
            <BookOpen size={15} />
            <span>Значения и примеры</span>
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'history' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <History size={15} />
            <span>История повторений {historyLogs.length > 0 ? `(${historyLogs.length})` : ''}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className={styles.contentBody}>
          {activeTab === 'meanings' ? (
            <>
              {/* Meaning Pills Track */}
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

              {/* Active Meaning Detail */}
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
            </>
          ) : (
            /* History Tab */
            <>
              {/* Memory Summary Grid */}
              <div className={styles.historyStatsGrid}>
                <div className={styles.statItem}>
                  <span className={styles.statItemLabel}>Текущий статус</span>
                  <span className={styles.statItemValue}>{renderStatusBadge(progress?.status || word.status)}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statItemLabel}>Следующий повтор</span>
                  <span className={styles.statItemValue}>
                    {progress?.nextReviewDate ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} />
                        {progress.nextReviewDate}
                      </span>
                    ) : (
                      'Не запланирован'
                    )}
                  </span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statItemLabel}>Серия повторов</span>
                  <span className={styles.statItemValue} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Flame size={14} color="#f97316" />
                    {progress?.repetitions ?? 0} раз
                  </span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statItemLabel}>Ошибок за всё время</span>
                  <span className={styles.statItemValue} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertTriangle size={14} color="#ef4444" />
                    {progress?.errorCount ?? 0}
                  </span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statItemLabel}>Интервал памяти</span>
                  <span className={styles.statItemValue} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Zap size={14} color="#eab308" />
                    {progress?.intervalDays ?? 1} дн.
                  </span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statItemLabel}>Фактор лёгкости (Ease)</span>
                  <span className={styles.statItemValue}>
                    {progress?.easeFactor ? progress.easeFactor.toFixed(2) : '2.50'}
                  </span>
                </div>
              </div>

              {/* Timeline Section */}
              <div className={styles.timelineSection}>
                <div className={styles.timelineTitle}>Хроника повторений:</div>

                {isLoadingHistory ? (
                  <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '20px' }}>
                    Загрузка истории...
                  </div>
                ) : historyLogs.length === 0 ? (
                  <div className={styles.emptyHistoryBox}>
                    <History size={24} opacity={0.6} />
                    <span>Слово ещё не повторялось в интервальном тренажёре</span>
                    <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                      История начнёт заполняться, когда слово попадёт в тренировку
                    </span>
                  </div>
                ) : (
                  <div className={styles.timelineList}>
                    {historyLogs.map((log) => (
                      <div key={log.id} className={styles.timelineItem}>
                        <div className={styles.timelineLeft}>
                          {renderRatingBadge(log.rating)}
                          <span className={styles.timelineDate}>{formatDate(log.createdAt)}</span>
                        </div>
                        <span className={styles.timelineInterval}>
                          {log.intervalDays === 1 ? '1 день' : `${log.intervalDays} дн.`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
