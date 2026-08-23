import React, { useState } from 'react';
import { BaseWordCardProps } from './types';
import { speakEnglishWord } from '@/entities/english';
import { Volume2, ChevronLeft, ChevronRight, Copy, Check, Sparkles, Layers } from 'lucide-react';

/**
 * Variant 14: Exact layout as Variant 13 + Primary Meanings Mode with Optional "+N Secondary Meanings" Expand
 */
export const Variant14BadgeCounterStepper: React.FC<BaseWordCardProps> = ({
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

  // Primary filtering
  const primaryMeanings = meaningsList.filter((m) => m.primary);
  const hasPrimaryDistinction = primaryMeanings.length > 0 && primaryMeanings.length < meaningsList.length;
  const secondaryCount = meaningsList.length - primaryMeanings.length;

  const displayedMeanings = (!showAllMeanings && hasPrimaryDistinction) ? primaryMeanings : meaningsList;
  const currentSafeIdx = Math.min(displayedMeanings.length - 1, Math.max(0, safeMeaningIndex));
  const activeMeaning = displayedMeanings[currentSafeIdx] || propMeaning;
  const total = displayedMeanings.length;

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
      {/* 1. Headword Header: Centered Word + Volume2 aligned to Bottom Edge + Subtitle IPA (Exact as Variant 13) */}
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

      {/* 3. Inset Meaning Card with Primary / Secondary Filter & Integrated Bottom Stepper */}
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
        {/* Scrollable / Flexible Top Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', scrollbarWidth: 'none' }}>
          {/* Upper Section: POS Badge & Register Badge & Primary Tag on the Left, Translation Centered */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '-1px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
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

              {/* Toggle Chip for Secondary Meanings */}
              {hasPrimaryDistinction && (
                <button
                  type="button"
                  onClick={() => {
                    setShowAllMeanings(!showAllMeanings);
                    onSelectMeaning(0);
                  }}
                  style={{
                    border: '1px solid #e2e8f0',
                    background: showAllMeanings ? '#f1f5f9' : '#f8fafc',
                    color: showAllMeanings ? '#0f172a' : '#475569',
                    fontSize: '8.5px',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    transition: 'all 0.15s ease',
                  }}
                  title={showAllMeanings ? 'Показать только основные значения' : `Показать все ${meaningsList.length} значений`}
                >
                  <Layers size={9} style={{ color: '#2563eb' }} />
                  {showAllMeanings ? 'Только основные' : `+${secondaryCount} доп.`}
                </button>
              )}
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

          {/* Subtle Divider Line before Examples */}
          {activeMeaning.examples && activeMeaning.examples.length > 0 && (
            <div style={{ height: '1px', background: '#f1f5f9', margin: '2px 0 2px 0' }} />
          )}

          {/* Examples Section with One-Tap Copy */}
          {activeMeaning.examples && activeMeaning.examples.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {activeMeaning.examples.slice(0, 2).map((ex, i) => (
                <div key={i} style={{ fontSize: '12px', lineHeight: 1.35 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: '#09090b', fontWeight: 500 }}>
                      • {renderHighlightedSentence(ex.en, currentCard.word)}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(ex.en, i)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: copiedIndex === i ? '#16a34a' : '#a1a1aa',
                        cursor: 'pointer',
                        padding: '0 2px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      title="Копировать пример"
                    >
                      {copiedIndex === i ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                  {ex.ru && <div style={{ color: '#71717a', fontSize: '11px', paddingLeft: '8px' }}>{ex.ru}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Synonyms Section */}
          {activeMeaning.synonyms && activeMeaning.synonyms.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', marginTop: '1px' }}>
              <span style={{ fontSize: '10px', color: '#a1a1aa', fontWeight: 600 }}>syn:</span>
              {activeMeaning.synonyms.slice(0, 3).map((syn, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '10.5px',
                    color: '#475569',
                    background: '#f8fafc',
                    padding: '0 4px',
                    borderRadius: '4px',
                    border: '1px solid #f1f5f9',
                  }}
                >
                  {syn}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Integrated Meaning Stepper */}
        {total > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '3px',
              borderTop: '1px solid #f1f5f9',
              marginTop: '2px',
            }}
          >
            <button
              type="button"
              disabled={currentSafeIdx === 0}
              onClick={() => onSelectMeaning(Math.max(0, currentSafeIdx - 1))}
              style={{
                border: 'none',
                background: currentSafeIdx === 0 ? 'transparent' : '#f4f4f5',
                color: currentSafeIdx === 0 ? '#d4d4d8' : '#09090b',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: currentSafeIdx === 0 ? 'default' : 'pointer',
                padding: 0,
              }}
              title="Предыдущее значение"
            >
              <ChevronLeft size={13} />
            </button>

            {/* Stepper Dots Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {displayedMeanings.map((m, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectMeaning(idx)}
                  style={{
                    width: idx === currentSafeIdx ? '14px' : '5px',
                    height: '5px',
                    borderRadius: '3px',
                    background: idx === currentSafeIdx ? '#2563eb' : '#e2e8f0',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  title={`Значение ${idx + 1} из ${total}: ${m.translation}`}
                />
              ))}
            </div>

            <button
              type="button"
              disabled={currentSafeIdx === total - 1}
              onClick={() => onSelectMeaning(Math.min(total - 1, currentSafeIdx + 1))}
              style={{
                border: 'none',
                background: currentSafeIdx === total - 1 ? 'transparent' : '#f4f4f5',
                color: currentSafeIdx === total - 1 ? '#d4d4d8' : '#09090b',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: currentSafeIdx === total - 1 ? 'default' : 'pointer',
                padding: 0,
              }}
              title="Следующее значение"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
