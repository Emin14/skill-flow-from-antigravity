import React from 'react';
import { BaseWordCardProps } from './types';
import { speakEnglishWord } from '@/entities/english';
import { Volume2, Tag, Star, CheckCircle2, Calendar, CloudRain, Sparkles } from 'lucide-react';
import styles from './variants.module.css';

/**
 * Variant 40: Pro Lexical Ultimate Station
 * Flagship layout featuring dual UK/US audio, top 3-col metadata box with icons, number circles and full rich context stage.
 */
export const Variant40ProLexicalStationCard: React.FC<BaseWordCardProps> = ({
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
  const lists = currentCard.lists || {};
  const isPrimary = currentMeaning.primary || safeMeaningIndex === 0;

  const ukPhon = currentCard.phonBr || currentCard.transcription;
  const usPhon = currentCard.phonNAm || currentCard.transcription;

  return (
    <div className={styles.baseCardContainer} style={{ border: '1.5px solid var(--color-accent)', padding: '16px', gap: '12px' }}>
      {/* 1. Header with Dual UK / US Audio */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="var(--color-accent-text)" />
            <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              {currentCard.word}
            </span>
          </div>
          <div style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', fontFamily: 'serif', marginTop: '2px' }}>
            {displayTranscription}
          </div>
        </div>

        {/* Dual Voices Buttons */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button
            type="button"
            className={styles.audioMiniBtn}
            onClick={() => speakEnglishWord(currentCard.word, 'uk')}
            style={{ background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
            title={`UK: ${ukPhon}`}
          >
            <span style={{ fontSize: '10.5px', fontWeight: 800 }}>🇬🇧 UK</span>
            <Volume2 size={13} />
          </button>
          <button
            type="button"
            className={styles.audioMiniBtn}
            onClick={() => speakEnglishWord(currentCard.word, 'us')}
            style={{ background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
            title={`US: ${usPhon}`}
          >
            <span style={{ fontSize: '10.5px', fontWeight: 800 }}>🇺🇸 US</span>
            <Volume2 size={13} />
          </button>
        </div>
      </div>

      {/* 2. Top 3-Col Meta Card */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 1fr',
          gap: '8px',
          background: 'var(--color-surface-hover)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          padding: '10px 12px',
          fontSize: '11.5px',
        }}
      >
        <div>
          <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-muted)', marginBottom: '3px' }}>
            Формы
          </div>
          <div style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>
            {forms.verbForms?.past ? `${forms.verbForms.past}, ${forms.verbForms.pastParticiple || 'V3'}` : forms.nounForms?.plural ? `Plural: ${forms.nounForms.plural}` : `Base: ${currentCard.word}`}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-muted)', marginBottom: '3px' }}>
            Темы
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-accent-text)' }}>
            <Calendar size={14} />
            <CloudRain size={14} />
            <Sparkles size={14} />
          </div>
        </div>

        <div>
          <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-muted)', marginBottom: '3px' }}>
            Списки
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-success)', fontWeight: 700 }}>
            <CheckCircle2 size={13} />
            <span>3000 5000</span>
          </div>
        </div>
      </div>

      {/* 3. Number Switcher Circles (1) 2 3 4 */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '2px 0' }}>
        {meaningsList.map((m, idx) => {
          const isSelected = idx === safeMeaningIndex;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectMeaning(idx)}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: isSelected ? 'var(--color-accent)' : 'transparent',
                color: isSelected ? '#ffffff' : 'var(--color-text-primary)',
                border: isSelected ? 'none' : '1px solid var(--color-border)',
                fontSize: '13.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
              title={`#${idx + 1} ${m.translation}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* 4. Inset Meaning Stage Card */}
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1.5px solid var(--color-accent-border)',
          borderRadius: '12px',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-accent-text)', textTransform: 'lowercase' }}>
            {currentMeaning.partOfSpeech}
          </span>
          {isPrimary && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: 700, color: 'var(--color-success)' }}>
              <Star size={12} fill="currentColor" />
              основное
            </span>
          )}
        </div>

        <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
          {currentMeaning.translation}
        </div>

        {topics.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {topics.map((t, i) => (
              <span key={i} className={`${styles.pillBadge} ${styles.topicPill}`}>
                <Tag size={9} />
                <span>{t}</span>
              </span>
            ))}
          </div>
        )}

        {currentMeaning.examples && currentMeaning.examples.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '2px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--color-accent-text)' }}>
              Примеры
            </span>
            {currentMeaning.examples.map((ex, i) => (
              <div key={i} style={{ fontSize: '12px', lineHeight: 1.4 }}>
                <div style={{ fontWeight: 600 }}>• {renderHighlightedSentence(ex.en, currentCard.word)}</div>
                {ex.ru && <div style={{ color: 'var(--color-text-muted)', fontSize: '11px', marginTop: '1px' }}>{ex.ru}</div>}
              </div>
            ))}
          </div>
        )}

        {currentMeaning.synonyms && currentMeaning.synonyms.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--color-accent-text)' }}>
              Синонимы
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {currentMeaning.synonyms.map((s, i) => (
                <span key={i} className={styles.synonymChip}>{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
