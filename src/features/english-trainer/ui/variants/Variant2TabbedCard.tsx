import React, { useState } from 'react';
import { BaseWordCardProps } from './types';
import { speakEnglishWord } from '@/entities/english';
import { Volume2, Copy, Check, Layers } from 'lucide-react';

/**
 * Variant 2: Master Layout with Horizontal Segmented Meaning Track instead of dots/arrows
 */
export const Variant2TabbedCard: React.FC<BaseWordCardProps> = ({
  currentCard,
  meaningsList,
  safeMeaningIndex,
  currentMeaning: propMeaning,
  displayTranscription,
  settings,
  onSelectMeaning,
  renderHighlightedSentence,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showAllMeanings, setShowAllMeanings] = useState<boolean>(false);
  const forms = currentCard.wordForms || {};

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard?.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  // Primary vs All filtering
  const primaryMeanings = meaningsList.filter((m) => m.primary);
  const hasPrimaryDistinction = primaryMeanings.length > 0 && primaryMeanings.length < meaningsList.length;
  const secondaryCount = meaningsList.length - primaryMeanings.length;

  const displayedMeanings = (!showAllMeanings && hasPrimaryDistinction) ? primaryMeanings : meaningsList;
  const currentSafeIdx = Math.min(displayedMeanings.length - 1, Math.max(0, safeMeaningIndex));
  const activeMeaning = displayedMeanings[currentSafeIdx] || propMeaning;

  const renderFormsRow = () => {
    if (forms.verbForms && (forms.verbForms.past || forms.verbForms.pastParticiple || forms.verbForms.ing)) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', fontSize: '11px', color: '#09090b', fontWeight: 600 }}>
          {forms.verbForms.past && <span><strong style={{ color: '#2563eb', fontWeight: 800 }}>past:</strong> {forms.verbForms.past}</span>}
          {forms.verbForms.past && forms.verbForms.pastParticiple && <span style={{ color: '#e2e8f0' }}>|</span>}
          {forms.verbForms.pastParticiple && <span><strong style={{ color: '#2563eb', fontWeight: 800 }}>part.:</strong> {forms.verbForms.pastParticiple}</span>}
          {(forms.verbForms.past || forms.verbForms.pastParticiple) && forms.verbForms.ing && <span style={{ color: '#e2e8f0' }}>|</span>}
          {forms.verbForms.ing && <span><strong style={{ color: '#2563eb', fontWeight: 800 }}>-ing:</strong> {forms.verbForms.ing}</span>}
        </div>
      );
    }
    if (forms.nounForms?.plural) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', fontSize: '11px', color: '#09090b', fontWeight: 600 }}>
          <span><strong style={{ color: '#2563eb', fontWeight: 800 }}>pl.:</strong> {forms.nounForms.plural}</span>
        </div>
      );
    }
    if (forms.adjectiveForms?.comparative || forms.adjectiveForms?.superlative) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', fontSize: '11px', color: '#09090b', fontWeight: 600 }}>
          {forms.adjectiveForms.comparative && <span><strong style={{ color: '#2563eb', fontWeight: 800 }}>comp.:</strong> {forms.adjectiveForms.comparative}</span>}
          {forms.adjectiveForms.comparative && forms.adjectiveForms.superlative && <span style={{ color: '#e2e8f0' }}>|</span>}
          {forms.adjectiveForms.superlative && <span><strong style={{ color: '#2563eb', fontWeight: 800 }}>superl.:</strong> {forms.adjectiveForms.superlative}</span>}
        </div>
      );
    }
    return null;
  };

  const formsNode = renderFormsRow();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '100%',
        background: 'transparent',
        border: 'none',
        padding: 0,
        boxShadow: 'none',
      }}
    >
      {/* 1. Headword Header: Centered Word + Volume2 aligned to Bottom Edge + Subtitle IPA */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', width: '100%' }}>
        <div style={{ display: 'inline-flex', alignItems: 'flex-end', justifyContent: 'center', gap: '7px' }}>
          <span style={{ fontSize: '32px', fontWeight: 800, color: '#09090b', letterSpacing: '-0.5px', lineHeight: 1 }}>
            {currentCard.word}
          </span>
          <button
            type="button"
            onClick={() => speakEnglishWord(currentCard.word, settings.accent)}
            style={{
              border: 'none',
              background: '#eff6ff',
              color: '#2563eb',
              borderRadius: '6px',
              width: '32px',
              height: '24px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.15s ease',
            }}
            title="Озвучить"
          >
            <Volume2 size={14} />
          </button>
        </div>

        <span style={{ fontSize: '14.5px', color: '#71717a', fontFamily: 'serif', textAlign: 'center' }}>
          /{displayTranscription}/
        </span>
      </div>

      {/* 2. Inline Grammar Forms Bar (Fixed Stable Height, Left Aligned) */}
      <div style={{ height: '20px', minHeight: '20px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', boxSizing: 'border-box' }}>
        {formsNode || <span style={{ opacity: 0, fontSize: '11px', lineHeight: '20px' }}>—</span>}
      </div>

      {/* 3. Horizontal Meaning Pills Track (Above the Card) */}
      <div
        style={{
          height: '26px',
          minHeight: '26px',
          display: 'flex',
          gap: '4px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        {displayedMeanings.map((m, i) => {
          const isSelected = i === currentSafeIdx;
          const shortTr = m.translation?.split(/[,;]/)[0] || '';
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelectMeaning(i)}
              style={{
                padding: '3px 9px',
                borderRadius: '12px',
                border: isSelected ? '1.5px solid #2563eb' : '1px solid #e2e8f0',
                background: isSelected ? '#eff6ff' : '#f8fafc',
                color: isSelected ? '#2563eb' : '#475569',
                fontSize: '10.5px',
                fontWeight: isSelected ? 800 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.15s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span style={{ opacity: isSelected ? 1 : 0.6 }}>{i + 1}.</span>
              <span>{shortTr}</span>
            </button>
          );
        })}

        {/* Expander Pill */}
        {hasPrimaryDistinction && (
          <button
            type="button"
            onClick={() => {
              setShowAllMeanings(!showAllMeanings);
              onSelectMeaning(0);
            }}
            style={{
              border: '1px solid #e2e8f0',
              background: showAllMeanings ? '#eff6ff' : '#f8fafc',
              color: showAllMeanings ? '#2563eb' : '#64748b',
              fontSize: '9.5px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              lineHeight: 1,
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.15s ease',
            }}
            title={showAllMeanings ? 'Показать только основные значения' : `Показать все ${meaningsList.length} значений`}
          >
            <Layers size={9.5} style={{ color: showAllMeanings ? '#2563eb' : '#94a3b8' }} />
            {showAllMeanings ? 'Только основные' : `+${secondaryCount} доп.`}
          </button>
        )}
      </div>

      {/* 4. Inset Meaning Card */}
      <div
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          background: '#ffffff',
          height: '195px',
          minHeight: '195px',
          maxHeight: '195px',
          padding: '10px 14px 6px 14px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Scrollable / Flexible Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', scrollbarWidth: 'none' }}>
          {/* Upper Section: POS Badge & Register Badge on the Left, Translation Centered */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '4px', marginBottom: '-1px' }}>
              <span
                style={{
                  background: '#eff6ff',
                  color: '#2563eb',
                  border: '1px solid #bfdbfe',
                  fontSize: '8px',
                  fontWeight: 700,
                  padding: '0 4px',
                  borderRadius: '3px',
                  textTransform: 'lowercase',
                  lineHeight: '12px',
                  display: 'inline-block',
                }}
              >
                {activeMeaning.partOfSpeech || 'noun'}
              </span>

              {!activeMeaning.primary && (
                <span
                  style={{
                    background: '#f8fafc',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    fontSize: '7.5px',
                    fontWeight: 700,
                    padding: '0 3px',
                    borderRadius: '3px',
                    textTransform: 'lowercase',
                    lineHeight: '11px',
                    display: 'inline-block',
                  }}
                  title="Дополнительное / вторичное значение"
                >
                  доп.
                </span>
              )}

              {activeMeaning.register && activeMeaning.register.length > 0 && activeMeaning.register.map((reg, idx) => (
                <span
                  key={idx}
                  style={{
                    background: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                    fontSize: '7.5px',
                    fontWeight: 700,
                    padding: '0 3px',
                    borderRadius: '3px',
                    textTransform: 'lowercase',
                    lineHeight: '11px',
                    display: 'inline-block',
                  }}
                >
                  {reg}
                </span>
              ))}
            </div>

            <div
              style={{
                fontSize: '16px',
                fontWeight: 800,
                color: '#09090b',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                width: '100%',
                textAlign: 'center',
              }}
            >
              {activeMeaning.translation}
            </div>
          </div>

          {/* Synonyms Section (Rendered above examples) */}
          {activeMeaning.synonyms && activeMeaning.synonyms.length > 0 && (
            <div style={{ fontSize: '11.5px', marginTop: '4px', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <span style={{ color: '#2563eb', fontWeight: 800 }}>Синонимы: </span>
              <span style={{ color: '#09090b', fontWeight: 500 }}>
                {activeMeaning.synonyms.join(', ')}
              </span>
            </div>
          )}

          {/* Subtle Divider Line before Examples */}
          {activeMeaning.examples && activeMeaning.examples.length > 0 && (
            <div style={{ height: '1px', background: '#f1f5f9', margin: '2px 0 3px 0' }} />
          )}

          {/* Examples Section with One-Tap Copy (Scrollable for all examples) */}
          {activeMeaning.examples && activeMeaning.examples.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                maxHeight: '115px',
                overflowY: 'auto',
                paddingRight: '4px',
              }}
            >
              {activeMeaning.examples.map((ex, i) => (
                <div key={i} style={{ fontSize: '12px', lineHeight: 1.35 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: '#09090b', fontWeight: 500, display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span>• {renderHighlightedSentence(ex.en, currentCard.word)}</span>
                      {ex.register && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            fontSize: '7.5px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em',
                            padding: '0.5px 3.5px',
                            borderRadius: '3px',
                            background: 'rgba(234, 179, 8, 0.10)',
                            border: '1px solid rgba(234, 179, 8, 0.28)',
                            color: '#ca8a04',
                            marginLeft: '5px',
                            lineHeight: 1.1,
                          }}
                        >
                          {ex.register}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(ex.en, i)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: copiedIndex === i ? '#16a34a' : '#a1a1aa',
                        padding: '1px',
                      }}
                      title="Скопировать"
                    >
                      {copiedIndex === i ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                  {ex.ru && (
                    <div style={{ color: '#4338ca', fontSize: '11px', paddingLeft: '10px', marginTop: '1px' }}>
                      {ex.ru}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
