import React, { useState } from 'react';
import { BaseWordCardProps } from './types';
import { speakEnglishWord } from '@/entities/english';
import { Volume2, Tag, Sparkles } from 'lucide-react';
import { MeaningSelectorTrack } from './MeaningSelectorTrack';
import { WordFormsGlobal } from './WordFormsGlobal';
import styles from './variants.module.css';

/**
 * Variant 8: Glass Morphism QuickStage
 * Glassy container with primary meaning track + quick switcher between Examples and Synonyms + word forms footer.
 */
export const Variant8GlassStageCard: React.FC<BaseWordCardProps> = ({
  currentCard,
  meaningsList,
  safeMeaningIndex,
  currentMeaning,
  displayTranscription,
  settings,
  onSelectMeaning,
  renderHighlightedSentence,
}) => {
  const [activeTab, setActiveTab] = useState<'examples' | 'synonyms'>('examples');

  return (
    <div className={styles.baseCardContainer} style={{ background: 'var(--color-surface)', backdropFilter: 'blur(8px)', border: '1.5px solid var(--color-accent-border)' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={15} color="var(--color-accent-text)" />
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

      {/* Primary-first Meanings Selector */}
      <MeaningSelectorTrack
        meaningsList={meaningsList}
        safeMeaningIndex={safeMeaningIndex}
        onSelectMeaning={onSelectMeaning}
      />

      {/* Meaning Translation Title + Tab Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-accent-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          #{safeMeaningIndex + 1}: {currentMeaning.translation}
        </div>

        <div style={{ display: 'flex', gap: '2px', background: 'var(--color-surface-hover)', padding: '2px', borderRadius: '6px', flexShrink: 0 }}>
          {(['examples', 'synonyms'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTab(t)}
              style={{
                border: 'none',
                background: activeTab === t ? 'var(--color-accent)' : 'transparent',
                color: activeTab === t ? '#ffffff' : 'var(--color-text-muted)',
                borderRadius: '4px',
                padding: '2px 6px',
                fontSize: '9.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {t === 'examples' ? 'Примеры' : 'Синонимы'}
            </button>
          ))}
        </div>
      </div>

      {/* Viewport for Active Meaning */}
      <div className={styles.fixedViewport}>
        {activeTab === 'examples' && (
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

        {activeTab === 'synonyms' && (
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

      {/* Global Forms Footer */}
      <WordFormsGlobal word={currentCard.word} wordForms={currentCard.wordForms} />
    </div>
  );
};
