import React from 'react';
import { BaseWordCardProps } from './types';
import { speakEnglishWord } from '@/entities/english';
import { Volume2, Tag, Star, Calendar, CloudRain, Sparkles, CheckCircle2 } from 'lucide-react';
import styles from './variants.module.css';

/**
 * Variant 9: Top Full Tabs & 2-Col Lab (Макет 2 — Вкладки сверху + содержимое ниже)
 * Horizontal full-width meaning tabs [1 апрель] [2 дурак] + 2-column split (Examples on left, Synonyms on right).
 */
export const Variant9TopTabsTwoCol: React.FC<BaseWordCardProps> = ({
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
  const isPrimary = currentMeaning.primary || safeMeaningIndex === 0;

  return (
    <div className={styles.baseCardContainer} style={{ padding: '16px', gap: '12px' }}>
      {/* 1. Header with Word & Speaker */}
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

        <button
          type="button"
          onClick={() => speakEnglishWord(currentCard.word, settings.accent)}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'var(--color-accent-light)',
            color: 'var(--color-accent-text)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
          }}
          title="Прослушать"
        >
          <Volume2 size={18} />
        </button>
      </div>

      {/* 2. Top 3-Col Meta Bar */}
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

      {/* 3. Horizontal Full-Name Tabs [1 апрель] [2 дурак] [3 Эйприл] */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${meaningsList.length}, 1fr)`, gap: '6px' }}>
        {meaningsList.map((m, idx) => {
          const isSelected = idx === safeMeaningIndex;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectMeaning(idx)}
              style={{
                padding: '8px 4px',
                borderRadius: '10px',
                border: isSelected ? 'none' : '1px solid var(--color-border)',
                background: isSelected ? 'var(--color-accent)' : 'var(--color-surface)',
                color: isSelected ? '#ffffff' : 'var(--color-text-primary)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: isSelected ? '0 2px 8px rgba(99,102,241,0.25)' : 'none',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {idx + 1} {m.translation.split(/[,;]/)[0]}
            </button>
          );
        })}
      </div>

      {/* 4. Inset Box with 2-Column Split (Examples Left | Synonyms Right) */}
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1.5px solid var(--color-border)',
          borderRadius: '14px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-accent-text)' }}>
            {currentMeaning.partOfSpeech} • {currentMeaning.register?.join(', ') || 'основное'}
          </span>
          {isPrimary && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: 700, color: 'var(--color-accent-text)' }}>
              <Star size={11} fill="currentColor" />
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
                <Tag size={8} />
                <span>{t}</span>
              </span>
            ))}
          </div>
        )}

        {/* 2-Column Split */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '12px', marginTop: '4px' }}>
          {/* Left Column: Examples */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-accent-text)', marginBottom: '4px' }}>Примеры</div>
            {currentMeaning.examples && currentMeaning.examples.length > 0 ? (
              currentMeaning.examples.map((ex, i) => (
                <div key={i} style={{ fontSize: '11.5px', lineHeight: 1.35, marginBottom: '4px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>• {renderHighlightedSentence(ex.en, currentCard.word)}</div>
                  {ex.ru && <div style={{ color: 'var(--color-text-muted)', fontSize: '10.5px' }}>{ex.ru}</div>}
                </div>
              ))
            ) : (
              <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>—</span>
            )}
          </div>

          {/* Right Column: Synonyms */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-accent-text)', marginBottom: '4px' }}>Синонимы</div>
            {currentMeaning.synonyms && currentMeaning.synonyms.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {currentMeaning.synonyms.map((s, i) => (
                  <span key={i} className={styles.synonymChip}>{s}</span>
                ))}
              </div>
            ) : (
              <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>—</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
