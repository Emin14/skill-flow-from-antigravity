'use client';

import React, { useMemo, useState } from 'react';
import { SessionWordCard, useEnglishStore, speakEnglishWord } from '@/entities/english';
import { ArrowRight, Check, Plus, RotateCcw, Volume2, X } from 'lucide-react';
import { lockBodyScroll, unlockBodyScroll } from '@/shared/lib/scrollLock';
import styles from './EnglishDayDoneModal.module.css';

interface EnglishDayDoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRepeatToday: () => void;
  /**
   * Raise today's goal by one batch, then start studying. The extra batch is
   * persisted server-side, so it survives closing the trainer.
   */
  onLearnMore: () => Promise<void>;
  /** Words studied today, as returned by the session endpoint. */
  words: SessionWordCard[];
  dailyTarget: number;
}

function primaryTranslation(word: SessionWordCard): string {
  const primary = word.meanings?.find((meaning) => meaning.primary && meaning.translation);
  if (primary) return primary.translation;
  const first = word.meanings?.find((meaning) => meaning.translation);
  if (first) return first.translation;
  return word.translations?.[0]?.meanings?.[0] ?? '';
}

export const EnglishDayDoneModal: React.FC<EnglishDayDoneModalProps> = ({
  isOpen,
  onClose,
  onRepeatToday,
  onLearnMore,
  words,
  dailyTarget,
}) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isListOverflowing, setIsListOverflowing] = useState(false);
  const listRef = React.useRef<HTMLUListElement | null>(null);
  const settings = useEnglishStore((state) => state.settings);

  // One entry per word id in case a word was rated twice today.
  const uniqueWords = useMemo(() => {
    const seen = new Set<string>();
    return words.filter((word) => {
      if (seen.has(word.id)) return false;
      seen.add(word.id);
      return true;
    });
  }, [words]);

  const extraCount = dailyTarget || settings.dailyNewWords || 5;

  React.useEffect(() => {
    if (!isOpen) {
      unlockBodyScroll();
      return;
    }
    lockBodyScroll();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      unlockBodyScroll();
    };
  }, [isOpen, onClose]);

  // A day with many words must scroll only the list; the fade at its bottom
  // edge is meaningful only while it actually overflows.
  React.useEffect(() => {
    const list = listRef.current;
    if (!isOpen || !list) return;
    const measure = () => setIsListOverflowing(list.scrollHeight > list.clientHeight + 1);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [isOpen, uniqueWords.length]);

  if (!isOpen) return null;

  const handleLearnMore = async () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      // Raise today's goal on the server and let the caller start the trainer.
      // The new batch is part of the session, so it is still there after the
      // trainer is closed — which keeps "Учить" on the widget.
      await onLearnMore();
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div
      className={styles.overlay}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Слова за сегодня">
        <header className={styles.header}>
          <div className={styles.headerText}>
            <span className={styles.title}>Сегодня выучено: {uniqueWords.length}</span>
            <span className={styles.subtitle}>Норма дня выполнена</span>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
            <X size={18} />
          </button>
        </header>

        {uniqueWords.length > 0 ? (
          <ul
            ref={listRef}
            className={`${styles.wordList} ${isListOverflowing ? styles.wordListOverflowing : ''}`}
          >
            {uniqueWords.map((word) => (
              <li key={word.id} className={styles.wordRow}>
                <button
                  type="button"
                  className={styles.speakBtn}
                  onClick={() => speakEnglishWord(word.word, settings.accent)}
                  aria-label={`Произнести ${word.word}`}
                  title="Произнести"
                >
                  <Volume2 size={14} />
                </button>
                <div className={styles.wordText}>
                  <span className={styles.word}>{word.word}</span>
                  {word.transcription && (
                    <span className={styles.transcription}>[{word.transcription}]</span>
                  )}
                  <span className={styles.translation}>{primaryTranslation(word)}</span>
                </div>
                {word.cefrLevel && <span className={styles.level}>{word.cefrLevel}</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>Сегодня ещё нет выученных слов.</p>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={onRepeatToday}
            disabled={uniqueWords.length === 0}
          >
            <RotateCcw size={15} />
            <span>Повторить</span>
          </button>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={handleLearnMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? <Check size={15} /> : <Plus size={15} />}
            <span>{isLoadingMore ? 'Загрузка...' : `Выучить ещё ${extraCount} слов`}</span>
            {!isLoadingMore && <ArrowRight size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};
