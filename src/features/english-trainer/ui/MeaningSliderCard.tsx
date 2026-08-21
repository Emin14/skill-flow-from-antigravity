import React from 'react';
import { SessionWordCard, WordMeaningItem, EnglishSettingsConfig, speakEnglishWord } from '@/entities/english';
import { Volume2 } from 'lucide-react';

export interface MeaningSliderCardProps {
  currentCard: SessionWordCard;
  meaningsList: WordMeaningItem[];
  safeMeaningIndex: number;
  currentMeaning: WordMeaningItem;
  displayTranscription: string;
  settings: EnglishSettingsConfig;
  onSelectMeaning: (index: number) => void;
  renderHighlightedSentence: (text: string, target: string) => React.ReactNode;
}

export const MeaningSliderCard: React.FC<MeaningSliderCardProps> = ({
  currentCard,
  meaningsList,
  safeMeaningIndex,
  currentMeaning,
  displayTranscription,
  settings,
  onSelectMeaning,
  renderHighlightedSentence,
}) => {
  const totalMeanings = meaningsList.length;
  const playAudio = () => speakEnglishWord(currentCard.word, settings.accent);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Top Word Pill */}
      <div
        style={{
          alignSelf: 'center',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '24px',
          padding: '4px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
          {currentCard.word}
        </span>
        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
          {displayTranscription}
        </span>
        <button
          type="button"
          onClick={playAudio}
          style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '2px',
            color: 'var(--color-accent-text)',
          }}
          title="Прослушать произношение"
        >
          <Volume2 size={14} />
        </button>
      </div>

      {/* Segmented Track of Meanings */}
      {totalMeanings > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '4px',
            overflowX: 'auto',
            padding: '2px 0',
            scrollbarWidth: 'none',
          }}
        >
          {meaningsList.map((m, i) => {
            const isSelected = i === safeMeaningIndex;
            const shortTr = m.translation?.split(/[,;]/)[0] || '';
            return (
              <button
                key={i}
                type="button"
                onClick={() => onSelectMeaning(i)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '14px',
                  border: isSelected ? '1.5px solid var(--color-accent)' : '1px solid var(--color-border)',
                  background: isSelected ? 'var(--color-accent-light)' : 'var(--color-surface)',
                  color: isSelected ? 'var(--color-accent-text)' : 'var(--color-text-muted)',
                  fontSize: '11px',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
              >
                #{i + 1} {shortTr}
              </button>
            );
          })}
        </div>
      )}

      {/* Center Main Card with Stable Fixed-Height Examples Block */}
      <div
        style={{
          width: '100%',
          background: 'var(--color-surface)',
          border: '1.5px solid var(--color-accent-border)',
          borderRadius: '14px',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              background: 'var(--color-accent-light)',
              color: 'var(--color-accent-text)',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '10.5px',
              fontWeight: 800,
            }}
          >
            {currentMeaning?.partOfSpeech}
          </span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)' }}>
            {safeMeaningIndex + 1} из {totalMeanings}
          </span>
        </div>

        <div
          style={{
            fontSize: '14.5px',
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
            marginTop: '2px',
          }}
        >
          {currentMeaning?.translation}
        </div>

        {/* Fixed stable container: exactly 110px high, never jumps */}
        <div
          style={{
            marginTop: '6px',
            borderTop: '1px solid var(--color-border)',
            paddingTop: '6px',
            height: '110px',
            minHeight: '110px',
            maxHeight: '110px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {currentMeaning?.examples && currentMeaning.examples.length > 0 ? (
            currentMeaning.examples.map((ex, i) => (
              <div key={i} style={{ fontSize: '12px', marginBottom: '2px', lineHeight: 1.35 }}>
                <div>• {renderHighlightedSentence(ex.en, currentCard.word)}</div>
                {ex.ru && (
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '11px', marginTop: '2px' }}>
                    {ex.ru}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-muted)',
                fontSize: '11.5px',
                fontStyle: 'italic',
              }}
            >
              (к этому значению нет примеров в словаре)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
