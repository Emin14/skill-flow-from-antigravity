'use client';

import React, { useState } from 'react';
import { WordMeaningItem } from '@/entities/english';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';
import styles from './variants.module.css';

interface MeaningSelectorTrackProps {
  meaningsList: WordMeaningItem[];
  safeMeaningIndex: number;
  onSelectMeaning: (index: number) => void;
}

export const MeaningSelectorTrack: React.FC<MeaningSelectorTrackProps> = ({
  meaningsList,
  safeMeaningIndex,
  onSelectMeaning,
}) => {
  const [showAll, setShowAll] = useState(false);

  if (!meaningsList || meaningsList.length === 0) return null;

  // Find primary meanings
  const primaryIndices = meaningsList
    .map((m, idx) => (m.primary ? idx : -1))
    .filter((idx) => idx !== -1);

  // Fallback: if no primary flag is set in dictionary data, treat first meaning as primary
  const effectivePrimaryIndices =
    primaryIndices.length > 0 ? primaryIndices : [0];

  const hasSecondary = meaningsList.length > effectivePrimaryIndices.length;
  const secondaryCount = meaningsList.length - effectivePrimaryIndices.length;

  // If user selected a secondary meaning, ensure it's visible even when showAll is false
  const visibleIndices = showAll
    ? meaningsList.map((_, i) => i)
    : Array.from(new Set([...effectivePrimaryIndices, safeMeaningIndex]));

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none', padding: '1px 0' }}>
      {visibleIndices.map((idx) => {
        const m = meaningsList[idx];
        if (!m) return null;
        const isSelected = idx === safeMeaningIndex;
        const isPrimary = m.primary || effectivePrimaryIndices.includes(idx);
        const shortTr = m.translation?.split(/[,;]/)[0] || '';

        return (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectMeaning(idx)}
            className={`${styles.meaningSelectPill} ${isSelected ? styles.meaningSelectPillActive : styles.meaningSelectPillInactive}`}
            title={`#${idx + 1} ${m.translation} (${m.partOfSpeech})`}
          >
            {isPrimary && <Star size={9} fill="currentColor" style={{ marginRight: '2px' }} />}
            #{idx + 1} {shortTr}
          </button>
        );
      })}

      {hasSecondary && (
        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          style={{
            flexShrink: 0,
            background: 'var(--color-surface-hover)',
            border: '1px dashed var(--color-border)',
            color: 'var(--color-text-muted)',
            borderRadius: '10px',
            padding: '2px 7px',
            fontSize: '9.5px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            whiteSpace: 'nowrap',
          }}
          title={showAll ? 'Показывать только основные значения' : 'Показать все второстепенные значения слова'}
        >
          {showAll ? (
            <>
              <span>Скрыть</span>
              <ChevronUp size={11} />
            </>
          ) : (
            <>
              <span>+{secondaryCount} ещё</span>
              <ChevronDown size={11} />
            </>
          )}
        </button>
      )}
    </div>
  );
};
