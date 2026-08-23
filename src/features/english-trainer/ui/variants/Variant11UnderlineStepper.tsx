import React, { useState } from 'react';
import { BaseWordCardProps } from './types';
import { speakEnglishWord } from '@/entities/english';
import { Volume2, ChevronLeft, ChevronRight, Copy, Check } from 'lucide-react';
import styles from './variants.module.css';

/**
 * Variant 11: Classic Inline Left (Word + IPA + Speaker)
 */
export const Variant11UnderlineStepper: React.FC<BaseWordCardProps> = ({
  currentCard,
  meaningsList,
  safeMeaningIndex,
  currentMeaning,
  displayTranscription,
  settings,
  onSelectMeaning,
  renderHighlightedSentence,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const forms = currentCard.wordForms || {};
  const total = meaningsList.length;

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard?.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handlePrev = () => {
    if (safeMeaningIndex > 0) onSelectMeaning(safeMeaningIndex - 1);
  };
  const handleNext = () => {
    if (safeMeaningIndex < total - 1) onSelectMeaning(safeMeaningIndex + 1);
  };

  const renderFormsRow = () => {
    if (forms.verbForms && (forms.verbForms.past || forms.verbForms.pastParticiple || forms.verbForms.ing)) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#09090b', fontWeight: 600 }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#09090b', fontWeight: 600 }}>
          <span><strong style={{ color: '#2563eb', fontWeight: 800 }}>pl.:</strong> {forms.nounForms.plural}</span>
        </div>
      );
    }
    if (forms.adjectiveForms?.comparative || forms.adjectiveForms?.superlative) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#09090b', fontWeight: 600 }}>
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
      {/* 1. Headword Header (Variation 11: Classic Inline Left) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '30px', fontWeight: 800, color: '#09090b', letterSpacing: '-0.4px', lineHeight: 1 }}>
          {currentCard.word}
        </span>
        <span style={{ fontSize: '15px', color: '#71717a', fontFamily: 'serif' }}>
          /{displayTranscription}/
        </span>
        <button
          type="button"
          className={styles.audioMiniBtn}
          onClick={() => speakEnglishWord(currentCard.word, settings.accent)}
          style={{ color: '#18181b', padding: '2px' }}
          title="Озвучить"
        >
          <Volume2 size={17} />
        </button>
      </div>

      {/* 2. Inline Grammar Forms Bar (Fixed Stable Height) */}
      <div style={{ height: '20px', minHeight: '20px', display: 'flex', alignItems: 'center', boxSizing: 'border-box' }}>
        {formsNode || <span style={{ opacity: 0, fontSize: '11px', lineHeight: '20px' }}>—</span>}
      </div>

      {/* 3. Inset Meaning Card with Integrated Bottom Stepper */}
      <div
        style={{
          background: '#ffffff',
          border: '1.5px solid #dbeafe',
          borderRadius: '14px',
          padding: '10px 14px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '6px',
          boxShadow: '0 4px 14px rgba(37,99,235,0.04)',
          height: '195px',
          minHeight: '195px',
          maxHeight: '195px',
          boxSizing: 'border-box',
        }}
      >
        {/* Scrollable / Flexible Top Content */}
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
                {currentMeaning.partOfSpeech || 'noun'}
              </span>
              {currentMeaning.register && currentMeaning.register.length > 0 && currentMeaning.register.map((reg, idx) => (
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
              {currentMeaning.translation}
            </div>
          </div>

          {/* Subtle Divider Line before Examples */}
          {currentMeaning.examples && currentMeaning.examples.length > 0 && (
            <div style={{ height: '1px', background: '#f1f5f9', margin: '2px 0 2px 0' }} />
          )}

          {/* Examples Section with One-Tap Copy */}
          {currentMeaning.examples && currentMeaning.examples.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {currentMeaning.examples.slice(0, 2).map((ex, i) => (
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

          {/* Synonyms Section */}
          {currentMeaning.synonyms && currentMeaning.synonyms.length > 0 && (
            <div style={{ fontSize: '11.5px', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <span style={{ color: '#2563eb', fontWeight: 800 }}>Синонимы: </span>
              <span style={{ color: '#09090b', fontWeight: 500 }}>
                {currentMeaning.synonyms.join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* Integrated Bottom Navigation Stepper inside the card */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px', borderTop: '1px solid #f1f5f9' }}>
          <button
            type="button"
            disabled={safeMeaningIndex === 0}
            onClick={handlePrev}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              border: '1px solid #c7d2fe',
              background: '#ffffff',
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: safeMeaningIndex > 0 ? 'pointer' : 'default',
              opacity: safeMeaningIndex > 0 ? 1 : 0.25,
              padding: 0,
            }}
            title="Назад"
          >
            <ChevronLeft size={14} />
          </button>

          {/* Pagination Dots */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {meaningsList.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onSelectMeaning(i)}
                style={{
                  width: i === safeMeaningIndex ? '8px' : '5px',
                  height: i === safeMeaningIndex ? '8px' : '5px',
                  borderRadius: '50%',
                  background: i === safeMeaningIndex ? '#2563eb' : '#cbd5e1',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                title={`Значение ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            disabled={safeMeaningIndex >= total - 1}
            onClick={handleNext}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              border: '1px solid #c7d2fe',
              background: '#ffffff',
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: safeMeaningIndex < total - 1 ? 'pointer' : 'default',
              opacity: safeMeaningIndex < total - 1 ? 1 : 0.25,
              padding: 0,
            }}
            title="Вперёд"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
