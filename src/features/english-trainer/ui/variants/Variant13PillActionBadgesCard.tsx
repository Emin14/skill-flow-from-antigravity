import React, { useState } from 'react';
import { BaseWordCardProps } from './types';
import { speakEnglishWord } from '@/entities/english';
import { Volume2, Tag } from 'lucide-react';
import { MeaningSelectorTrack } from './MeaningSelectorTrack';
import { WordFormsGlobal } from './WordFormsGlobal';
import styles from './variants.module.css';

/**
 * Variant 13: Meaning Pills with Action Badges
 * Primary-first meaning track + interactive badge pills for examples and synonyms + global forms.
 */
export const Variant13PillActionBadgesCard: React.FC<BaseWordCardProps> = ({
  currentCard,
  meaningsList,
  safeMeaningIndex,
  currentMeaning,
  displayTranscription,
  settings,
  onSelectMeaning,
  renderHighlightedSentence,
}) => {
  const [activeBadge, setActiveBadge] = useState<'examples' | 'synonyms'>('examples');

  const exCount = currentMeaning.examples?.length || 0;
  const synCount = currentMeaning.synonyms?.length || 0;

  return (
    <div className={styles.baseCardContainer}>
      {/* Word Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
            {currentCard.word}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
            {displayTranscription}
          </span>
          <button
            type="button"
            className={styles.audioMiniBtn}
            onClick={() => speakEnglishWord(currentCard.word, settings.accent)}
            title="Озвучить"
          >
            <Volume2 size={15} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {currentCard.topics && currentCard.topics.length > 0 && (
            <span className={`${styles.pillBadge} ${styles.topicPill}`} title={`Тема: ${currentCard.topics.join(', ')}`}>
              <Tag size={10} />
              <span>{currentCard.topics[0]}</span>
            </span>
          )}
          <span className={`${styles.pillBadge} ${styles.posPill}`}>{currentMeaning.partOfSpeech}</span>
        </div>
      </div>

      {/* Meaning Selection Track with Primary Filter */}
      <MeaningSelectorTrack
        meaningsList={meaningsList}
        safeMeaningIndex={safeMeaningIndex}
        onSelectMeaning={onSelectMeaning}
      />

      {/* Translation & Badge Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-accent-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          #{safeMeaningIndex + 1}: {currentMeaning.translation}
        </div>

        <div style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
          <button
            type="button"
            onClick={() => setActiveBadge('examples')}
            style={{
              border: activeBadge === 'examples' ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
              background: activeBadge === 'examples' ? 'var(--color-accent-light)' : 'transparent',
              color: activeBadge === 'examples' ? 'var(--color-accent-text)' : 'var(--color-text-muted)',
              borderRadius: '6px',
              padding: '2px 6px',
              fontSize: '10px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            💬 {exCount} прим.
          </button>
          <button
            type="button"
            onClick={() => setActiveBadge('synonyms')}
            style={{
              border: activeBadge === 'synonyms' ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
              background: activeBadge === 'synonyms' ? 'var(--color-accent-light)' : 'transparent',
              color: activeBadge === 'synonyms' ? 'var(--color-accent-text)' : 'var(--color-text-muted)',
              borderRadius: '6px',
              padding: '2px 6px',
              fontSize: '10px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            🔗 {synCount} син.
          </button>
        </div>
      </div>

      {/* Viewport */}
      <div className={styles.fixedViewport}>
        {activeBadge === 'examples' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {currentMeaning.examples && currentMeaning.examples.length > 0 ? (
              currentMeaning.examples.map((ex, i) => (
                <div key={i} style={{ background: 'var(--color-surface-hover)', padding: '4px 6px', borderRadius: '6px' }}>
                  <div>• {renderHighlightedSentence(ex.en, currentCard.word)}</div>
                  {ex.ru && <div style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>{ex.ru}</div>}
                </div>
              ))
            ) : (
              <span style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>Примеры отсутствуют</span>
            )}
          </div>
        )}

        {activeBadge === 'synonyms' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {currentMeaning.synonyms && currentMeaning.synonyms.length > 0 ? (
              currentMeaning.synonyms.map((s, i) => (
                <span key={i} className={styles.synonymChip}>{s}</span>
              ))
            ) : (
              <span style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>Синонимов нет</span>
            )}
          </div>
        )}
      </div>

      {/* Global Word Forms */}
      <WordFormsGlobal word={currentCard.word} wordForms={currentCard.wordForms} />
    </div>
  );
};
