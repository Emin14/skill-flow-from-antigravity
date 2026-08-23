import React, { useState } from 'react';
import { BaseWordCardProps } from './types';
import { speakEnglishWord } from '@/entities/english';
import { Volume2, Sparkles, Tag } from 'lucide-react';
import { MeaningSelectorTrack } from './MeaningSelectorTrack';
import { WordFormsGlobal } from './WordFormsGlobal';
import styles from './variants.module.css';

/**
 * Variant 5: Ultimate Lexical Workstation (formerly #20)
 * Workstation with primary-first meaning track, dedicated meaning breakdown, and global forms.
 */
export const Variant20MasterWorkstationCard: React.FC<BaseWordCardProps> = ({
  currentCard,
  meaningsList,
  safeMeaningIndex,
  currentMeaning,
  displayTranscription,
  settings,
  onSelectMeaning,
  renderHighlightedSentence,
}) => {
  const [activePanel, setActivePanel] = useState<'overview' | 'examples' | 'synonyms'>('overview');

  return (
    <div className={styles.baseCardContainer} style={{ border: '1.5px solid var(--color-accent)' }}>
      {/* Master Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} color="var(--color-accent-text)" />
          <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
            {currentCard.word}
          </span>
          <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
            {displayTranscription}
          </span>
          <button
            type="button"
            className={styles.audioMiniBtn}
            onClick={() => speakEnglishWord(currentCard.word, settings.accent)}
            title="Озвучить"
          >
            <Volume2 size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
          {currentCard.topics && currentCard.topics.length > 0 && (
            <span className={`${styles.pillBadge} ${styles.topicPill}`} title={`Тема: ${currentCard.topics.join(', ')}`}>
              <Tag size={10} />
              <span>{currentCard.topics[0]}</span>
            </span>
          )}
          <span className={`${styles.pillBadge} ${styles.posPill}`}>{currentMeaning.partOfSpeech}</span>
          <span style={{ fontSize: '9.5px', fontWeight: 800, background: 'var(--color-warning-light)', color: 'var(--color-warning)', padding: '1px 5px', borderRadius: '4px' }}>
            {currentCard.cefrLevel}
          </span>
        </div>
      </div>

      {/* Meaning Track with Primary Filter */}
      <MeaningSelectorTrack
        meaningsList={meaningsList}
        safeMeaningIndex={safeMeaningIndex}
        onSelectMeaning={onSelectMeaning}
      />

      {/* Navigation Tabs for Active Meaning */}
      <div style={{ display: 'flex', gap: '3px', background: 'var(--color-surface-hover)', padding: '2px', borderRadius: '6px' }}>
        {(['overview', 'examples', 'synonyms'] as const).map((p) => {
          const names = { overview: 'Обзор', examples: 'Примеры', synonyms: 'Синонимы' };
          const active = activePanel === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => setActivePanel(p)}
              style={{
                flex: 1,
                border: 'none',
                background: active ? 'var(--color-accent)' : 'transparent',
                color: active ? '#ffffff' : 'var(--color-text-muted)',
                fontWeight: active ? 700 : 500,
                fontSize: '10px',
                padding: '3px 2px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {names[p]}
            </button>
          );
        })}
      </div>

      {/* Viewport for Active Meaning */}
      <div className={styles.fixedViewport}>
        {activePanel === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-accent-text)' }}>
              #{safeMeaningIndex + 1}: {currentMeaning.translation}
            </div>
            {currentMeaning.examples && currentMeaning.examples.length > 0 && (
              <div style={{ background: 'var(--color-surface-hover)', padding: '4px 6px', borderRadius: '6px', fontSize: '11px' }}>
                <div>• {renderHighlightedSentence(currentMeaning.examples[0].en, currentCard.word)}</div>
                {currentMeaning.examples[0].ru && <div style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>{currentMeaning.examples[0].ru}</div>}
              </div>
            )}
          </div>
        )}

        {activePanel === 'examples' && (
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

        {activePanel === 'synonyms' && (
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
