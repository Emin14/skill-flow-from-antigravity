import React from 'react';
import { BaseWordCardProps } from './types';
import { speakEnglishWord } from '@/entities/english';
import { Volume2, Tag, Star, ChevronLeft, ChevronRight, Calendar, CloudRain, Sparkles, CheckCircle2 } from 'lucide-react';
import styles from './variants.module.css';

/**
 * Variant 8: 3D True Layered Deck (Макет 1 — Карточка-стопка)
 * Deep multi-layer card stack with floating navigation (< 1 of N >), top metadata bar and inset context stage.
 */
export const Variant8CardStack3D: React.FC<BaseWordCardProps> = ({
  currentCard,
  meaningsList,
  safeMeaningIndex,
  currentMeaning,
  displayTranscription,
  settings,
  onSelectMeaning,
  renderHighlightedSentence,
}) => {
  const forms = currentCard.wordForms || {};
  const topics = currentCard.topics || [];
  const total = meaningsList.length;
  const isPrimary = currentMeaning.primary || safeMeaningIndex === 0;

  const handlePrev = () => {
    if (safeMeaningIndex > 0) onSelectMeaning(safeMeaningIndex - 1);
  };
  const handleNext = () => {
    if (safeMeaningIndex < total - 1) onSelectMeaning(safeMeaningIndex + 1);
  };

  return (
    <div className={styles.baseCardContainer} style={{ padding: '16px', gap: '12px' }}>
      {/* 1. Header: Word + IPA + Audio */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1.15 }}>
            {currentCard.word}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <span style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', fontFamily: 'serif' }}>
              {displayTranscription}
            </span>
            <button
              type="button"
              className={styles.audioMiniBtn}
              onClick={() => speakEnglishWord(currentCard.word, settings.accent)}
              title="Озвучить"
            >
              <Volume2 size={16} />
            </button>
          </div>
        </div>

        {/* CEFR & Frequency */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ background: 'var(--color-accent-light)', color: 'var(--color-accent-text)', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '8px' }}>
            {currentCard.cefrLevel || 'A1'}
          </span>
          <span style={{ background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '8px' }}>
            #{currentCard.frequencyRank || '524'}
          </span>
        </div>
      </div>

      {/* 2. Top 3-Col Meta Bar (Forms | Topics | Oxford Lists) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 1fr',
          gap: '8px',
          background: 'var(--color-surface-hover)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          padding: '8px 12px',
          fontSize: '11px',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--color-text-muted)', marginBottom: '2px' }}>Формы</div>
          <div style={{ color: 'var(--color-text-secondary)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {forms.verbForms?.past ? `${forms.verbForms.past}` : forms.nounForms?.plural ? `pl: ${forms.nounForms.plural}` : `base: ${currentCard.word}`}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--color-text-muted)', marginBottom: '2px' }}>Темы</div>
          <div style={{ display: 'flex', gap: '5px', color: 'var(--color-accent-text)', marginTop: '2px' }}>
            <Calendar size={13} /><CloudRain size={13} /><Sparkles size={13} />
          </div>
        </div>
        <div>
          <div style={{ fontSize: '9.5px', fontWeight: 800, color: 'var(--color-text-muted)', marginBottom: '2px' }}>Списки</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--color-success)', fontWeight: 700 }}>
            <CheckCircle2 size={11} /> 3000 • 5000
          </div>
        </div>
      </div>

      {/* 3. True 3D Stack Container with Chevrons */}
      <div className={styles.stackCardDeck}>
        {/* Left Nav Chevron */}
        <button
          type="button"
          disabled={safeMeaningIndex === 0}
          onClick={handlePrev}
          style={{
            position: 'absolute',
            left: '-8px',
            zIndex: 10,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: safeMeaningIndex > 0 ? 'pointer' : 'default',
            opacity: safeMeaningIndex > 0 ? 1 : 0.25,
            color: 'var(--color-text-primary)',
          }}
          title="Предыдущее значение"
        >
          <ChevronLeft size={18} />
        </button>

        {/* 3D Stack Under-Layers */}
        <div style={{ width: '92%', position: 'relative' }}>
          <div className={styles.stackLayerBack} />
          <div className={styles.stackLayerMid} />

          {/* Foreground Top Card */}
          <div className={styles.stackLayerFront}>
            {/* Top Badge: 1 из 4 */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-24px', marginBottom: '2px' }}>
              <span style={{ background: 'var(--color-accent)', color: '#ffffff', fontSize: '10.5px', fontWeight: 800, padding: '2px 12px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
                {safeMeaningIndex + 1} из {total}
              </span>
            </div>

            {/* Header: POS + Primary Star */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-accent-text)', textTransform: 'lowercase' }}>
                {currentMeaning.partOfSpeech}
              </span>
              {isPrimary && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: 700, color: 'var(--color-accent-text)' }}>
                  <Star size={11} fill="currentColor" />
                  основное
                </span>
              )}
            </div>

            {/* Large Translation */}
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              {currentMeaning.translation}
            </div>

            {/* Topic Pills */}
            {topics.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {topics.map((t, i) => (
                  <span key={i} className={`${styles.pillBadge} ${styles.topicPill}`}>
                    <Tag size={8} />
                    <span>{t}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Examples (EN + RU) */}
            {currentMeaning.examples && currentMeaning.examples.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-accent-text)' }}>Примеры</span>
                {currentMeaning.examples.map((ex, i) => (
                  <div key={i} style={{ fontSize: '12px', lineHeight: 1.4 }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>• {renderHighlightedSentence(ex.en, currentCard.word)}</div>
                    {ex.ru && <div style={{ color: 'var(--color-text-muted)', fontSize: '11px', marginTop: '1px' }}>{ex.ru}</div>}
                  </div>
                ))}
              </div>
            )}

            {/* Synonyms */}
            {currentMeaning.synonyms && currentMeaning.synonyms.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-accent-text)' }}>Синонимы</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {currentMeaning.synonyms.map((s, i) => (
                    <span key={i} className={styles.synonymChip}>{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Nav Chevron */}
        <button
          type="button"
          disabled={safeMeaningIndex >= total - 1}
          onClick={handleNext}
          style={{
            position: 'absolute',
            right: '-8px',
            zIndex: 10,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: safeMeaningIndex < total - 1 ? 'pointer' : 'default',
            opacity: safeMeaningIndex < total - 1 ? 1 : 0.25,
            color: 'var(--color-text-primary)',
          }}
          title="Следующее значение"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
