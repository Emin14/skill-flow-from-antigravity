'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BaseWordCardProps } from './types';
import { speakEnglishWord, triggerHapticFeedback } from '@/entities/english';
import { copyToClipboard } from '@/shared/lib/clipboard';
import { Volume2, ChevronLeft, ChevronRight, Copy, Check, Layers, Sparkles, ArrowUpRight, X, Eye } from 'lucide-react';
import styles from './Variant14SegmentedPillCard.module.css';

/**
 * Master Word Card: Variant 14 Segmented Pill Card
 * - Fully adapted for both Light and Dark themes via CSS design tokens
 * - Guaranteed 100% stable fixed height across all words (Zero height jumps / layout shift)
 * - Supports Active Recall Masking when repeating words (isReviewWord && !isAnswerRevealed)
 * - Russian short translation on horizontal pills with pinned expander
 * - High readability for examples (en: 13px, ru: 12px) and phrasal verbs
 * - Crisp white text for phrases and idioms button
 * - Inset meaning card with inner smooth scrolling
 * - Reliable copy with visual checkmark (no unwanted closing of overlay, no toast popup)
 */
export const Variant14SegmentedPillCard: React.FC<BaseWordCardProps> = ({
  currentCard,
  meaningsList,
  safeMeaningIndex,
  currentMeaning: propMeaning,
  displayTranscription,
  settings,
  onSelectMeaning,
  renderHighlightedSentence,
  isReviewWord = false,
  isAnswerRevealed = true,
  onRevealAnswer,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showAllMeanings, setShowAllMeanings] = useState<boolean>(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activePillRef = useRef<HTMLButtonElement>(null);
  const meaningContentRef = useRef<HTMLDivElement>(null);
  const translationTextRef = useRef<HTMLDivElement>(null);
  const forms = currentCard.wordForms || {};

  const isMasked = isReviewWord && !isAnswerRevealed;

  const handleCopy = async (text: string, index: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (!text) return;
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedIndex(index);
      triggerHapticFeedback('light');
      setTimeout(() => setCopiedIndex(null), 1500);
    }
  };

  // Primary vs All filtering
  const primaryMeanings = meaningsList.filter((m) => m.primary);
  const secondaryCount = meaningsList.length - primaryMeanings.length;
  const hasPrimaryDistinction = primaryMeanings.length > 0 && secondaryCount > 0;
  const displayedMeanings = (!showAllMeanings && hasPrimaryDistinction) ? primaryMeanings : meaningsList;
  const currentSafeIdx = Math.min(displayedMeanings.length - 1, Math.max(0, safeMeaningIndex));
  const activeMeaning = displayedMeanings[currentSafeIdx] || propMeaning;
  const total = displayedMeanings.length;
  const cardPhrases = currentCard.phrases || [];

  // Auto-scroll active pill into view so it is never cut off
  useEffect(() => {
    if (activePillRef.current && scrollContainerRef.current) {
      activePillRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [currentSafeIdx, showAllMeanings]);

  // Reset scroll positions (both horizontal translation line and vertical examples container)
  // whenever active meaning, word, or reveal state changes
  useEffect(() => {
    if (translationTextRef.current) {
      translationTextRef.current.scrollLeft = 0;
    }
    if (meaningContentRef.current) {
      meaningContentRef.current.scrollTop = 0;
    }
  }, [currentSafeIdx, currentCard.word, isAnswerRevealed]);

  // Reset overlay and expanded meanings when word changes
  useEffect(() => {
    setIsOverlayOpen(false);
    setShowAllMeanings(false);
  }, [currentCard.word]);

  const renderFormsRow = () => {
    if (forms.verbForms && (forms.verbForms.past || forms.verbForms.pastParticiple || forms.verbForms.ing)) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '6px', fontSize: '11px', color: 'var(--color-text-primary)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {forms.verbForms.past && <span><strong className={styles.formLabel}>past:</strong> {forms.verbForms.past}</span>}
          {forms.verbForms.past && forms.verbForms.pastParticiple && <span style={{ color: 'var(--color-border)' }}>|</span>}
          {forms.verbForms.pastParticiple && <span><strong className={styles.formLabel}>part.:</strong> {forms.verbForms.pastParticiple}</span>}
          {(forms.verbForms.past || forms.verbForms.pastParticiple) && forms.verbForms.ing && <span style={{ color: 'var(--color-border)' }}>|</span>}
          {forms.verbForms.ing && <span><strong className={styles.formLabel}>-ing:</strong> {forms.verbForms.ing}</span>}
        </div>
      );
    }
    if (forms.nounForms?.plural) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '6px', fontSize: '11px', color: 'var(--color-text-primary)', fontWeight: 600, whiteSpace: 'nowrap' }}>
          <span><strong className={styles.formLabel}>pl.:</strong> {forms.nounForms.plural}</span>
        </div>
      );
    }
    if (forms.adjectiveForms?.comparative || forms.adjectiveForms?.superlative) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '6px', fontSize: '11px', color: 'var(--color-text-primary)', fontWeight: 600, whiteSpace: 'nowrap' }}>
          {forms.adjectiveForms.comparative && <span><strong className={styles.formLabel}>comp.:</strong> {forms.adjectiveForms.comparative}</span>}
          {forms.adjectiveForms.comparative && forms.adjectiveForms.superlative && <span style={{ color: 'var(--color-border)' }}>|</span>}
          {forms.adjectiveForms.superlative && <span><strong className={styles.formLabel}>superl.:</strong> {forms.adjectiveForms.superlative}</span>}
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
        gap: '6px',
        width: '100%',
        background: 'transparent',
        border: 'none',
        padding: 0,
        boxShadow: 'none',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      {/* 1. Headword Header: [Volume2 Button] [Word] [Copy Button] + IPA */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', width: '100%', minHeight: '52px', maxHeight: '52px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'flex-end', justifyContent: 'center', gap: '7px', height: '30px' }}>
          {/* Audio Button (Before word) */}
          <button
            type="button"
            onClick={() => speakEnglishWord(currentCard.word, settings.accent)}
            className={styles.audioBtn}
            title={`Произнести (${settings.accent.toUpperCase()})`}
          >
            <Volume2 size={15} />
          </button>

          {/* Centered Headword */}
          <span style={{ fontSize: '29px', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.4px', lineHeight: 1 }}>
            {currentCard.word}
          </span>

          {/* Copy Button (After word) */}
          <button
            type="button"
            onClick={(e) => handleCopy(currentCard.word, -1, e)}
            style={{
              border: '1px solid var(--color-border)',
              background: copiedIndex === -1 ? 'var(--color-success-light)' : 'var(--color-surface-hover)',
              color: copiedIndex === -1 ? 'var(--color-success)' : 'var(--color-text-muted)',
              borderRadius: '6px',
              width: '28px',
              height: '24px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.15s ease',
            }}
            title="Скопировать слово"
          >
            {copiedIndex === -1 ? <Check size={13} strokeWidth={2.5} /> : <Copy size={13} />}
          </button>
        </div>

        <span style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', fontFamily: 'serif', textAlign: 'center', lineHeight: '18px' }}>
          /{displayTranscription}/
        </span>
      </div>

      {/* 2. Inline Grammar Forms Bar (Fixed Stable Height 20px) */}
      <div style={{ height: '20px', minHeight: '20px', maxHeight: '20px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', boxSizing: 'border-box', overflow: 'hidden' }}>
        {formsNode || <span style={{ opacity: 0, fontSize: '10.5px' }}>—</span>}
      </div>

      {/* 3. Horizontal Meaning Pills Track with Russian Translation and Quick-Switch Arrows [‹] [›] */}
      <div
        style={{
          height: '28px',
          minHeight: '28px',
          maxHeight: '28px',
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        {/* Left Arrow Button */}
        <button
          type="button"
          disabled={currentSafeIdx === 0 || isMasked}
          onClick={() => onSelectMeaning(Math.max(0, currentSafeIdx - 1))}
          style={{
            border: '1px solid var(--color-border)',
            background: currentSafeIdx === 0 || isMasked ? 'var(--color-surface-hover)' : 'var(--color-surface)',
            color: currentSafeIdx === 0 || isMasked ? 'var(--color-text-disabled)' : 'var(--color-text-primary)',
            width: '25px',
            height: '25px',
            borderRadius: '7px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: currentSafeIdx === 0 || isMasked ? 'default' : 'pointer',
            padding: 0,
            flexShrink: 0,
            transition: 'all 0.15s ease',
          }}
          title="Предыдущее значение"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Scrollable Track with Russian Translations */}
        <div
          ref={scrollContainerRef}
          style={{
            display: 'flex',
            gap: '4px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            alignItems: 'center',
            flex: 1,
            minWidth: 0,
            scrollBehavior: 'smooth',
            scrollPadding: '0 16px',
            padding: '0 2px',
          }}
        >
          {displayedMeanings.map((m, i) => {
            const isSelected = i === currentSafeIdx;
            const rawTr = isMasked ? `Смысл ${i + 1}` : (m.translation?.split(/[,;]/)[0]?.trim() || '');
            const shortTr = rawTr.length > 16 ? `${rawTr.slice(0, 16)}...` : rawTr;
            return (
              <button
                key={i}
                ref={isSelected ? activePillRef : null}
                type="button"
                disabled={isMasked}
                onClick={() => onSelectMeaning(i)}
                className={`${styles.pillBtn} ${isSelected ? styles.pillSelected : styles.pillInactive}`}
                style={{ cursor: isMasked ? 'default' : 'pointer' }}
                title={m.translation}
              >
                {shortTr}
              </button>
            );
          })}
          {/* Spacer so the last pill is never clipped */}
          <span style={{ width: '4px', flexShrink: 0, display: 'inline-block' }} />
        </div>

        {/* ALWAYS VISIBLE PINNED Expander Pill */}
        {hasPrimaryDistinction && (
          <button
            type="button"
            disabled={isMasked}
            onClick={() => {
              setShowAllMeanings(!showAllMeanings);
              onSelectMeaning(0);
            }}
            className={`${styles.expanderPill} ${showAllMeanings ? styles.expanderPillActive : ''}`}
            style={{ cursor: isMasked ? 'default' : 'pointer' }}
            title={showAllMeanings ? 'Показать основные значения' : `Показать все ${meaningsList.length} значений`}
          >
            <Layers size={9.5} />
            {showAllMeanings ? 'Основные' : `+${secondaryCount} доп.`}
          </button>
        )}

        {/* Right Arrow Button */}
        <button
          type="button"
          disabled={currentSafeIdx === total - 1 || isMasked}
          onClick={() => onSelectMeaning(Math.min(total - 1, currentSafeIdx + 1))}
          style={{
            border: '1px solid var(--color-border)',
            background: currentSafeIdx === total - 1 || isMasked ? 'var(--color-surface-hover)' : 'var(--color-surface)',
            color: currentSafeIdx === total - 1 || isMasked ? 'var(--color-text-disabled)' : 'var(--color-text-primary)',
            width: '25px',
            height: '25px',
            borderRadius: '7px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: currentSafeIdx === total - 1 || isMasked ? 'default' : 'pointer',
            padding: 0,
            flexShrink: 0,
            transition: 'all 0.15s ease',
          }}
          title="Следующее значение"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* 4. Inset Meaning Card: Fixed 180px Height (Masked state for Active Recall OR Revealed state) */}
      <div
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          background: 'var(--color-surface-hover)',
          height: '180px',
          minHeight: '180px',
          maxHeight: '180px',
          padding: isMasked ? '12px' : '10px 14px 8px 14px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: isMasked ? 'center' : 'flex-start',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {isMasked ? (
          /* Active Recall Masked View: Prompt to remember translation */
          <div
            onClick={onRevealAnswer}
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <div className={styles.maskedEye}>
              <Eye size={19} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                Вспомните перевод слова
              </span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Напишите перевод ниже или нажмите кнопку
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRevealAnswer?.();
              }}
              className={styles.revealBtn}
            >
              <Eye size={13} />
              <span>Показать ответ (Enter)</span>
            </button>
          </div>
        ) : (
          /* Revealed View: Full translation, synonyms, and context examples */
          <div
            ref={meaningContentRef}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              overflowY: 'auto',
              scrollbarWidth: 'thin',
              height: '100%',
              paddingRight: '2px',
            }}
          >
            {/* Upper Section: POS Badge & Register Badge on the Left, Translation Centered */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '5px', marginBottom: '1px' }}>
                {/* Micro-increased POS badge: 9px (from 8px) */}
                <span className={styles.posBadge}>
                  {activeMeaning.partOfSpeech || 'noun'}
                </span>

                {/* Micro-increased «доп.»: 8.5px (from 7.5px) */}
                {!activeMeaning.primary && (
                  <span
                    style={{
                      background: 'var(--color-surface-active)',
                      color: 'var(--color-text-muted)',
                      border: '1px solid var(--color-border)',
                      fontSize: '8.5px',
                      fontWeight: 700,
                      padding: '0.5px 4px',
                      borderRadius: '3.5px',
                      textTransform: 'lowercase',
                      lineHeight: '12px',
                      display: 'inline-block',
                    }}
                    title="Дополнительное / вторичное значение"
                  >
                    доп.
                  </span>
                )}

                {/* Micro-increased register badge: 8.5px (from 7.5px) */}
                {activeMeaning.register && activeMeaning.register.length > 0 && activeMeaning.register.map((reg, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: 'var(--color-danger-light)',
                      color: 'var(--color-danger)',
                      border: '1px solid var(--color-danger-border)',
                      fontSize: '8.5px',
                      fontWeight: 700,
                      padding: '0.5px 4px',
                      borderRadius: '3.5px',
                      textTransform: 'lowercase',
                      lineHeight: '12px',
                      display: 'inline-block',
                    }}
                  >
                    {reg}
                  </span>
                ))}
              </div>

              <div
                ref={translationTextRef}
                style={{
                  fontSize: '17.5px',
                  fontWeight: 800,
                  color: 'var(--color-text-primary)',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  overflowX: 'auto',
                  scrollbarWidth: 'none',
                  width: '100%',
                  textAlign: 'center',
                  letterSpacing: '-0.2px',
                }}
              >
                {activeMeaning.translation}
              </div>
            </div>

            {/* Synonyms Section */}
            {activeMeaning.synonyms && activeMeaning.synonyms.length > 0 && (
              <div style={{ fontSize: '12px', marginTop: '3px', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span className={styles.synonymsLabel}>Синонимы: </span>
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
                  {activeMeaning.synonyms.join(', ')}
                </span>
              </div>
            )}

            {/* Subtle Divider Line before Examples */}
            {activeMeaning.examples && activeMeaning.examples.length > 0 && (
              <div style={{ height: '1px', background: 'var(--color-border)', margin: '2px 0 3px 0' }} />
            )}

            {/* Examples Section: Enhanced readability (en: 13px, ru: 12px, register: 8.5px) */}
            {activeMeaning.examples && activeMeaning.examples.length > 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px',
                }}
              >
                {activeMeaning.examples.map((ex, i) => (
                  <div key={i} style={{ fontSize: '13px', lineHeight: 1.38 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ color: 'var(--color-text-primary)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span>• {renderHighlightedSentence(ex.en, currentCard.word)}</span>
                        {ex.register && (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              fontSize: '8.5px',
                              fontWeight: 700,
                              textTransform: 'lowercase',
                              padding: '0.5px 4px',
                              borderRadius: '3.5px',
                              background: 'var(--color-warning-light)',
                              border: '1px solid var(--color-warning-border)',
                              color: 'var(--color-warning)',
                              marginLeft: '4px',
                              lineHeight: 1.15,
                            }}
                          >
                            {ex.register}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleCopy(ex.en, i, e)}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          color: copiedIndex === i ? 'var(--color-success)' : 'var(--color-text-muted)',
                          padding: '1px',
                        }}
                        title="Скопировать"
                      >
                        {copiedIndex === i ? <Check size={12} strokeWidth={2.5} /> : <Copy size={12} />}
                      </button>
                    </div>
                    {ex.ru && (
                      <div style={{ color: 'var(--color-text-secondary)', fontSize: '12px', paddingLeft: '8px', marginTop: '1.5px' }}>
                        {ex.ru}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', fontStyle: 'italic', padding: '6px 0' }}>
                (примеров к этому значению нет)
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Fixed 32px Slot for Phrases Button (Crisp White Text) */}
      <div style={{ height: '32px', minHeight: '32px', maxHeight: '32px', width: '100%', boxSizing: 'border-box' }}>
        {isMasked ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 12px',
              borderRadius: '8px',
              border: '1px dashed var(--color-border)',
              background: 'var(--color-surface-hover)',
              color: 'var(--color-text-muted)',
              fontSize: '11.5px',
              fontWeight: 500,
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={12} color="var(--color-text-disabled)" />
              <span>Фразы откроются после ответа</span>
            </div>
            <span style={{ fontSize: '10.5px', color: 'var(--color-text-disabled)' }}>🔒</span>
          </div>
        ) : cardPhrases.length > 0 ? (
          <button
            type="button"
            onClick={() => setIsOverlayOpen(true)}
            className={styles.phrasesBtn}
            title="Открыть список фраз и идиом с этим словом"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} className={styles.phrasesSparkles} />
              <span className={styles.phrasesTitle}>Фразовые глаголы к слову</span>
              <span className={styles.phrasesCount}>
                ({cardPhrases.length})
              </span>
            </div>
            <div className={styles.phrasesAction}>
              <span>Посмотреть</span>
              <ArrowUpRight size={14} />
            </div>
          </button>
        ) : (
          <div className={styles.phrasesEmpty}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={12} color="var(--color-text-disabled)" />
              <span className={styles.phrasesEmptyText}>Фразовых выражений нет</span>
            </div>
            <span style={{ fontSize: '10.5px', color: 'var(--color-text-disabled)' }}>—</span>
          </div>
        )}
      </div>

      {/* 6. Absolute Modal Overlay for Phrases (Safe from outside click closes, copy will NOT close) */}
      {isOverlayOpen && !isMasked && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--color-surface)',
            borderRadius: '12px',
            border: '1.5px solid rgba(168, 85, 247, 0.5)',
            padding: '10px 12px',
            zIndex: 30,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-xl, 0 8px 30px rgba(0,0,0,0.3))',
          }}
        >
          {/* Overlay Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--color-border)',
              paddingBottom: '6px',
              marginBottom: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={15} color="#c084fc" />
              <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                Фразовые глаголы к
              </span>
              <span style={{ fontSize: '13px', color: '#c084fc', fontWeight: 800 }}>
                {currentCard.word}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 500, marginLeft: '2px' }}>
                ({cardPhrases.length})
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOverlayOpen(false)}
              style={{
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface-hover)',
                color: 'var(--color-text-primary)',
                borderRadius: '7px',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Закрыть (Esc)"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* Overlay Phrases List */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              scrollbarWidth: 'thin',
            }}
          >
            {cardPhrases.map((p: any, pIdx: number) => {
              const copyKey = 1000 + pIdx;
              return (
                <div
                  key={p.id || pIdx}
                  style={{
                    fontSize: '13.5px',
                    lineHeight: 1.42,
                    background: 'var(--color-surface-hover)',
                    padding: '7px 10px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: 'var(--color-text-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', gap: '5px' }}>
                      <span>• {renderHighlightedSentence(p.phrase, currentCard.word)}</span>
                      {p.partOfSpeech && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            fontSize: '9px',
                            fontWeight: 700,
                            textTransform: 'lowercase',
                            padding: '1px 4.5px',
                            borderRadius: '3px',
                            background: 'rgba(168, 85, 247, 0.15)',
                            border: '1px solid rgba(168, 85, 247, 0.3)',
                            color: '#c084fc',
                            lineHeight: 1.15,
                          }}
                        >
                          {p.partOfSpeech}
                        </span>
                      )}
                      {p.register && p.register.map((reg: string, rIdx: number) => (
                        <span
                          key={rIdx}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            fontSize: '9px',
                            fontWeight: 700,
                            textTransform: 'lowercase',
                            padding: '1px 4.5px',
                            borderRadius: '3px',
                            background: 'var(--color-warning-light)',
                            border: '1px solid var(--color-warning-border)',
                            color: 'var(--color-warning)',
                            lineHeight: 1.15,
                          }}
                        >
                          {reg}
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(p.phrase, copyKey, e)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: copiedIndex === copyKey ? 'var(--color-success)' : 'var(--color-text-muted)',
                        padding: '2px',
                        marginLeft: '6px',
                      }}
                      title="Скопировать"
                    >
                      {copiedIndex === copyKey ? <Check size={13} strokeWidth={2.5} /> : <Copy size={13} />}
                    </button>
                  </div>
                  {p.translation && (
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '12.5px', paddingLeft: '10px', marginTop: '2px' }}>
                      {p.translation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
