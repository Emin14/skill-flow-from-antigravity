import React from 'react';
import { BaseWordCardProps } from './types';
import { speakEnglishWord } from '@/entities/english';
import { Volume2, Tag, Star, CheckSquare, Square } from 'lucide-react';
import styles from './variants.module.css';

/**
 * Variant 35: Notion Checklist Inspector
 * Interactive checklist format where clicking an item inspects its detailed meaning.
 */
export const Variant35NotionChecklist: React.FC<BaseWordCardProps> = ({
  currentCard,
  meaningsList,
  safeMeaningIndex,
  currentMeaning,
  displayTranscription,
  settings,
  onSelectMeaning,
  renderHighlightedSentence,
}) => {
  return (
    <div className={styles.baseCardContainer} style={{ padding: '16px', gap: '10px', background: '#ffffff', fontFamily: 'Georgia, serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <div>
          <span style={{ fontSize: '26px', fontWeight: 700, color: '#18181b' }}>{currentCard.word}</span>
          <span style={{ fontSize: '13px', color: '#71717a', fontStyle: 'italic', marginLeft: '8px' }}>/{displayTranscription}/</span>
        </div>
        <button type="button" className={styles.audioMiniBtn} onClick={() => speakEnglishWord(currentCard.word, settings.accent)}>
          <Volume2 size={16} />
        </button>
      </div>

      {/* Checklist items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontFamily: 'system-ui, sans-serif' }}>
        {meaningsList.map((m, idx) => {
          const isSelected = idx === safeMeaningIndex;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectMeaning(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: isSelected ? '#f4f4f5' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 6px',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              {isSelected ? <CheckSquare size={14} color="#18181b" /> : <Square size={14} color="#a1a1aa" />}
              <span style={{ fontSize: '12px', fontWeight: isSelected ? 700 : 500, color: isSelected ? '#18181b' : '#52525b' }}>
                {idx + 1}. {m.translation} <span style={{ color: '#a1a1aa', fontSize: '10.5px' }}>({m.partOfSpeech})</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Detailed quote box */}
      {currentMeaning.examples && currentMeaning.examples.length > 0 && (
        <div style={{ borderLeft: '2px solid #18181b', paddingLeft: '8px', fontSize: '12px', lineHeight: 1.4, fontFamily: 'system-ui, sans-serif', marginTop: '2px' }}>
          <div style={{ fontWeight: 600 }}>• {renderHighlightedSentence(currentMeaning.examples[0].en, currentCard.word)}</div>
          {currentMeaning.examples[0].ru && <div style={{ color: '#71717a', fontSize: '11px', marginTop: '1px' }}>{currentMeaning.examples[0].ru}</div>}
        </div>
      )}
    </div>
  );
};
