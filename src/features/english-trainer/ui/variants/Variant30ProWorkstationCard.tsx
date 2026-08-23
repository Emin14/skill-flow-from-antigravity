import React from 'react';
import { BaseWordCardProps } from './types';
import { speakEnglishWord } from '@/entities/english';
import { Volume2, Tag, Star, Calendar, Briefcase, ListTodo, Sparkles } from 'lucide-react';
import styles from './variants.module.css';

/**
 * Variant 30: Pro Oxford Lexical Workstation
 * Complete workstation featuring dual UK/US audio, number circles, rich examples with Russian translations and full metadata.
 */
export const Variant30ProWorkstationCard: React.FC<BaseWordCardProps> = ({
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
      {/* Top Header with Dual Audio UK/US */}
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

        {/* Dual Voices */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button
            type="button"
            className={styles.audioMiniBtn}
            onClick={() => speakEnglishWord(currentCard.word, 'uk')}
            style={{ background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
            title={`UK: ${ukPhon}`}
          >
            <span style={{ fontSize: '11px', fontWeight: 800 }}>🇬🇧 UK</span>
            <Volume2 size={13} />
          </button>
          <button
            type="button"
            className={styles.audioMiniBtn}
            onClick={() => speakEnglishWord(currentCard.word, 'us')}
            style={{ background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
            title={`US: ${usPhon}`}
          >
            <span style={{ fontSize: '11px', fontWeight: 800 }}>🇺🇸 US</span>
            <Volume2 size={13} />
          </button>
        </div>
      </div>

      {/* Numbered Circles Selector */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '2px 0' }}>
        {meaningsList.map((m, idx) => {
          const isSelected = idx === safeMeaningIndex;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectMeaning(idx)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: isSelected ? 'var(--color-accent)' : 'var(--color-surface-hover)',
                color: isSelected ? '#ffffff' : 'var(--color-text-primary)',
                border: isSelected ? 'none' : '1px solid var(--color-border)',
                fontSize: '13px',
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

      {/* Meaning Stage */}
      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-accent-text)' }}>
            {currentMeaning.partOfSpeech}
          </span>
          {isPrimary && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: 700, color: 'var(--color-success)' }}>
              <Star size={12} fill="currentColor" />
              основное значение
            </span>
          )}
        </div>

        <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
          {currentMeaning.translation}
        </div>

        {/* Topics */}
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

        {/* Examples */}
        {currentMeaning.examples && currentMeaning.examples.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
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

        {/* Synonyms */}
        {currentMeaning.synonyms && currentMeaning.synonyms.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
            {currentMeaning.synonyms.map((s, i) => (
              <span key={i} className={styles.synonymChip}>{s}</span>
            ))}
          </div>
        )}
      </div>

      {/* Icon List Footer */}
      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '11.5px' }}>
          <Calendar size={16} color="var(--color-accent-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 800, color: 'var(--color-text-primary)' }}>Формы слова</div>
            <div style={{ color: 'var(--color-text-muted)', marginTop: '1px' }}>
              {forms.verbForms?.past ? (
                `${forms.verbForms.past}, ${forms.verbForms.pastParticiple || 'V3'}`
              ) : forms.nounForms?.plural ? (
                `Plural: ${forms.nounForms.plural}`
              ) : (
                `Base: ${currentCard.word}`
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '11.5px' }}>
          <Briefcase size={16} color="var(--color-accent-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 800, color: 'var(--color-text-primary)' }}>Темы</div>
            <div style={{ color: 'var(--color-text-muted)', marginTop: '1px' }}>
              {topics.length > 0 ? topics.join(', ') : 'Общая лексика'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '11.5px' }}>
          <ListTodo size={16} color="var(--color-accent-text)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 800, color: 'var(--color-text-primary)' }}>Списки</div>
            <div style={{ color: 'var(--color-text-muted)', marginTop: '1px' }}>
              {[lists.oxford3000 ? 'Oxford 3000' : null, lists.oxford5000 ? 'Oxford 5000' : null].filter(Boolean).join(', ') || 'Oxford 5000'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
