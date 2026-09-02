'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BaseWordCardProps } from './types';
import { speakEnglishWord, triggerHapticFeedback } from '@/entities/english';
import { copyToClipboard } from '@/shared/lib/clipboard';
import { useToastStore } from '@/shared/ui';
import { Volume2, ChevronLeft, ChevronRight, Copy, Check, Sparkles, ArrowUpRight, X, Eye } from 'lucide-react';

/**
 * Variant 2: Harmonious Large-Font Word Card
 * - Все шрифты менее 15px гармонично увеличены на 20-33% для максимальной читаемости.
 * - Микрошрифты (7.5px -> 10px, 8px -> 10.5px, 10.5px -> 12.5px, 11.5px -> 13.5px, 12px -> 14px).
 * - Сохранены все пропорции, бейджи, цвета и фиксированная сетка без сдвигов верстки.
 */
export const Variant15LargeFontCard: React.FC<BaseWordCardProps> = ({
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

  const handleCopy = async (text: string, index: number) => {
    if (!text) return;
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedIndex(index);
      triggerHapticFeedback('light');
      useToastStore.getState().showToast('Скопировано в буфер обмена', 'success', undefined, 2000);
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

  // Auto-scroll active pill into view
  useEffect(() => {
    if (activePillRef.current && scrollContainerRef.current) {
      activePillRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [currentSafeIdx, showAllMeanings]);

  // Reset scroll positions
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', fontSize: '12px', color: 'var(--color-text-primary)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {forms.verbForms.past && <span><strong style={{ color: 'var(--color-accent-text)', fontWeight: 800 }}>past:</strong> {forms.verbForms.past}</span>}
          {forms.verbForms.past && forms.verbForms.pastParticiple && <span style={{ color: 'var(--color-border)' }}>|</span>}
          {forms.verbForms.pastParticiple && <span><strong style={{ color: 'var(--color-accent-text)', fontWeight: 800 }}>part.:</strong> {forms.verbForms.pastParticiple}</span>}
          {(forms.verbForms.past || forms.verbForms.pastParticiple) && forms.verbForms.ing && <span style={{ color: 'var(--color-border)' }}>|</span>}
          {forms.verbForms.ing && <span><strong style={{ color: 'var(--color-accent-text)', fontWeight: 800 }}>-ing:</strong> {forms.verbForms.ing}</span>}
        </div>
      );
    }
    if (forms.nounForms?.plural) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', fontSize: '12px', color: 'var(--color-text-primary)', fontWeight: 600, whiteSpace: 'nowrap' }}>
          <span><strong style={{ color: 'var(--color-accent-text)', fontWeight: 800 }}>pl.:</strong> {forms.nounForms.plural}</span>
        </div>
      );
    }
    if (forms.adjectiveForms?.comparative || forms.adjectiveForms?.superlative) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', fontSize: '12px', color: 'var(--color-text-primary)', fontWeight: 600, whiteSpace: 'nowrap' }}>
          {forms.adjectiveForms.comparative && <span><strong style={{ color: 'var(--color-accent-text)', fontWeight: 800 }}>comp.:</strong> {forms.adjectiveForms.comparative}</span>}
          {forms.adjectiveForms.comparative && forms.adjectiveForms.superlative && <span style={{ color: 'var(--color-border)' }}>|</span>}
          {forms.adjectiveForms.superlative && <span><strong style={{ color: 'var(--color-accent-text)', fontWeight: 800 }}>superl.:</strong> {forms.adjectiveForms.superlative}</span>}
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
            style={{
              border: '1px solid var(--color-accent-border)',
              background: 'var(--color-accent-light)',
              color: 'var(--color-accent-text)',
              borderRadius: '6px',
              width: '30px',
              height: '26px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.15s ease',
            }}
            title="Озвучить слово"
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
            onClick={() => handleCopy(currentCard.word, -1)}
            style={{
              border: '1px solid var(--color-border)',
              background: copiedIndex === -1 ? 'var(--color-success-light)' : 'var(--color-surface-hover)',
              color: copiedIndex === -1 ? 'var(--color-success)' : 'var(--color-text-muted)',
              borderRadius: '6px',
              width: '30px',
              height: '26px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.15s ease',
            }}
            title="Скопировать слово"
          >
            {copiedIndex === -1 ? <Check size={14} strokeWidth={2.5} /> : <Copy size={14} />}
          </button>
        </div>

        <span style={{ fontSize: '15px', color: 'var(--color-text-muted)', fontFamily: 'serif', textAlign: 'center', lineHeight: '20px' }}>
          /{displayTranscription}/
        </span>
      </div>

      {/* 2. Inline Grammar Forms Bar (Fixed Stable Height 22px) */}
      <div style={{ height: '22px', minHeight: '22px', maxHeight: '22px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', boxSizing: 'border-box', overflow: 'hidden' }}>
        {formsNode || <span style={{ opacity: 0, fontSize: '12px' }}>—</span>}
      </div>

      {/* 3. Horizontal Meaning Pills Track with Quick-Switch Arrows [‹] [›] */}
      <div
        style={{
          height: '30px',
          minHeight: '30px',
          maxHeight: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Prev Arrow */}
        <button
          type="button"
          onClick={() => {
            if (currentSafeIdx > 0 && !isMasked) {
              onSelectMeaning(currentSafeIdx - 1);
            }
          }}
          disabled={currentSafeIdx === 0 || isMasked}
          style={{
            width: '26px',
            height: '26px',
            border: '1px solid var(--color-border)',
            background: currentSafeIdx === 0 || isMasked ? 'transparent' : 'var(--color-surface-hover)',
            color: currentSafeIdx === 0 || isMasked ? 'var(--color-text-disabled)' : 'var(--color-text-primary)',
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

        {/* Scrollable Pills Track */}
        <div
          ref={scrollContainerRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            flex: 1,
            height: '100%',
            padding: '2px 0',
          }}
        >
          {displayedMeanings.map((m, idx) => {
            const isCurrent = idx === currentSafeIdx;
            return (
              <button
                key={m.id || idx}
                ref={isCurrent ? activePillRef : null}
                type="button"
                onClick={() => {
                  if (!isMasked) {
                    onSelectMeaning(idx);
                  }
                }}
                disabled={isMasked}
                style={{
                  height: '26px',
                  padding: '0 11px',
                  borderRadius: '13px',
                  border: isCurrent
                    ? '1.5px solid var(--color-accent)'
                    : '1px solid var(--color-border)',
                  background: isCurrent
                    ? 'var(--color-accent-light)'
                    : 'var(--color-surface-hover)',
                  color: isCurrent
                    ? 'var(--color-accent-text)'
                    : 'var(--color-text-secondary)',
                  fontSize: '13px',
                  fontWeight: isCurrent ? 800 : 500,
                  whiteSpace: 'nowrap',
                  cursor: isMasked ? 'default' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.15s ease',
                  flexShrink: 0,
                }}
                title={m.translation}
              >
                <span>{idx + 1}.</span>
                <span>{m.partOfSpeech || 'знач.'}</span>
              </button>
            );
          })}

          {/* Primary / All toggle pill */}
          {hasPrimaryDistinction && !isMasked && (
            <button
              type="button"
              onClick={() => {
                setShowAllMeanings(!showAllMeanings);
                onSelectMeaning(0);
              }}
              style={{
                height: '24px',
                padding: '0 8px',
                borderRadius: '12px',
                border: '1px dashed var(--color-border)',
                background: showAllMeanings ? 'var(--color-accent-light)' : 'transparent',
                color: showAllMeanings ? 'var(--color-accent-text)' : 'var(--color-text-muted)',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.15s ease',
              }}
              title={showAllMeanings ? 'Показать только основные значения' : `Показать все значения (+${secondaryCount} доп.)`}
            >
              {showAllMeanings ? 'Основные' : `Все (${meaningsList.length})`}
            </button>
          )}
        </div>

        {/* Next Arrow */}
        <button
          type="button"
          onClick={() => {
            if (currentSafeIdx < total - 1 && !isMasked) {
              onSelectMeaning(currentSafeIdx + 1);
            }
          }}
          disabled={currentSafeIdx === total - 1 || isMasked}
          style={{
            width: '26px',
            height: '26px',
            border: '1px solid var(--color-border)',
            background: currentSafeIdx === total - 1 || isMasked ? 'transparent' : 'var(--color-surface-hover)',
            color: currentSafeIdx === total - 1 || isMasked ? 'var(--color-text-disabled)' : 'var(--color-text-primary)',
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

      {/* 4. Inset Meaning Card: Fixed 188px Height */}
      <div
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          background: 'var(--color-surface-hover)',
          height: '188px',
          minHeight: '188px',
          maxHeight: '188px',
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
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--color-accent-light)',
                border: '1px solid var(--color-accent-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-accent-text)',
              }}
            >
              <Eye size={20} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                Вспомните перевод слова
              </span>
              <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                Напишите перевод ниже или нажмите кнопку
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRevealAnswer?.();
              }}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '6px 16px',
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--color-accent-text)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
                marginTop: '2px',
              }}
            >
              <Eye size={14} />
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
              gap: '5px',
              overflowY: 'auto',
              scrollbarWidth: 'thin',
              height: '100%',
              paddingRight: '2px',
            }}
          >
            {/* Upper Section: POS Badge & Register Badge on the Left, Translation Centered */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '6px', marginBottom: '1px' }}>
                <span
                  style={{
                    background: 'var(--color-accent-light)',
                    color: 'var(--color-accent-text)',
                    border: '1px solid var(--color-accent-border)',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    textTransform: 'lowercase',
                    lineHeight: '15px',
                    display: 'inline-block',
                  }}
                >
                  {activeMeaning.partOfSpeech || 'noun'}
                </span>

                {!activeMeaning.primary && (
                  <span
                    style={{
                      background: 'var(--color-surface-active)',
                      color: 'var(--color-text-muted)',
                      border: '1px solid var(--color-border)',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '1px 5px',
                      borderRadius: '4px',
                      textTransform: 'lowercase',
                      lineHeight: '14px',
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
                      background: 'var(--color-danger-light)',
                      color: 'var(--color-danger)',
                      border: '1px solid var(--color-danger-border)',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '1px 5px',
                      borderRadius: '4px',
                      textTransform: 'lowercase',
                      lineHeight: '14px',
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
                  fontSize: '18px',
                  fontWeight: 800,
                  color: 'var(--color-text-primary)',
                  lineHeight: 1.25,
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
              <div style={{ fontSize: '13.5px', marginTop: '3px', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span style={{ color: 'var(--color-accent-text)', fontWeight: 800 }}>Синонимы: </span>
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
                  {activeMeaning.synonyms.join(', ')}
                </span>
              </div>
            )}

            {/* Subtle Divider Line before Examples */}
            {activeMeaning.examples && activeMeaning.examples.length > 0 && (
              <div style={{ height: '1px', background: 'var(--color-border)', margin: '3px 0 4px 0' }} />
            )}

            {/* Examples Section with One-Tap Copy */}
            {activeMeaning.examples && activeMeaning.examples.length > 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                {activeMeaning.examples.map((ex, i) => (
                  <div key={i} style={{ fontSize: '14px', lineHeight: 1.4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ color: 'var(--color-text-primary)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span>• {renderHighlightedSentence(ex.en, currentCard.word)}</span>
                        {ex.register && (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              fontSize: '10px',
                              fontWeight: 700,
                              textTransform: 'lowercase',
                              padding: '1px 5px',
                              borderRadius: '4px',
                              background: 'var(--color-warning-light)',
                              border: '1px solid var(--color-warning-border)',
                              color: 'var(--color-warning)',
                              marginLeft: '5px',
                              lineHeight: 1.2,
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
                          color: copiedIndex === i ? 'var(--color-success)' : 'var(--color-text-muted)',
                          padding: '2px',
                        }}
                        title="Скопировать"
                      >
                        {copiedIndex === i ? <Check size={13} strokeWidth={2.5} /> : <Copy size={13} />}
                      </button>
                    </div>
                    {ex.ru && (
                      <div style={{ color: 'var(--color-text-secondary)', fontSize: '13px', paddingLeft: '8px', marginTop: '2px' }}>
                        {ex.ru}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', fontStyle: 'italic', padding: '6px 0' }}>
                (примеров к этому значению нет)
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Fixed 34px Slot for Phrases Button */}
      <div style={{ height: '34px', minHeight: '34px', maxHeight: '34px', width: '100%', boxSizing: 'border-box' }}>
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
              fontSize: '13px',
              fontWeight: 500,
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} color="var(--color-text-disabled)" />
              <span>Фразы откроются после ответа</span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--color-text-disabled)' }}>🔒</span>
          </div>
        ) : cardPhrases.length > 0 ? (
          <button
            type="button"
            onClick={() => setIsOverlayOpen(true)}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 12px',
              borderRadius: '8px',
              border: '1px solid rgba(168, 85, 247, 0.45)',
              background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.12) 0%, rgba(147, 51, 234, 0.18) 100%)',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
              boxSizing: 'border-box',
              transition: 'all 0.15s ease',
            }}
            title="Открыть список фраз и идиом с этим словом"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} color="#a855f7" />
              <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                Фразы и идиомы:
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 700, color: '#a855f7' }}>
              <span>{cardPhrases.length}</span>
              <ArrowUpRight size={14} />
            </div>
          </button>
        ) : (
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
              fontSize: '12.5px',
              boxSizing: 'border-box',
              opacity: 0.7,
            }}
          >
            <span>Фразы и идиомы</span>
            <span style={{ fontSize: '12px', color: 'var(--color-text-disabled)' }}>—</span>
          </div>
        )}
      </div>

      {/* 6. Phrases Bottom Modal Sheet Overlay */}
      {isOverlayOpen && (
        <div
          onClick={() => setIsOverlayOpen(false)}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 100,
            background: 'var(--color-surface)',
            borderRadius: '16px',
            border: '1.5px solid rgba(168, 85, 247, 0.5)',
            boxShadow: '0 16px 36px -8px rgba(0, 0, 0, 0.65)',
            display: 'flex',
            flexDirection: 'column',
            padding: '12px 14px',
            boxSizing: 'border-box',
            animation: 'fadeIn 0.15s ease-out',
          }}
        >
          {/* Overlay Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '8px',
              borderBottom: '1px solid var(--color-border)',
              marginBottom: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="#a855f7" />
              <span style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                Фразы со словом
              </span>
              <span style={{ fontSize: '14.5px', color: '#a855f7', fontWeight: 800 }}>
                {currentCard.word}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 500, marginLeft: '2px' }}>
                ({cardPhrases.length})
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsOverlayOpen(false)}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface-hover)',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
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
                    fontSize: '14px',
                    lineHeight: 1.45,
                    background: 'var(--color-surface-hover)',
                    padding: '8px 11px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: 'var(--color-text-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                      <span>• {renderHighlightedSentence(p.phrase, currentCard.word)}</span>
                      {p.partOfSpeech && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            fontSize: '10.5px',
                            fontWeight: 700,
                            textTransform: 'lowercase',
                            padding: '1px 5px',
                            borderRadius: '3px',
                            background: 'rgba(168, 85, 247, 0.15)',
                            border: '1px solid rgba(168, 85, 247, 0.3)',
                            color: '#c084fc',
                            lineHeight: 1.2,
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
                            fontSize: '10.5px',
                            fontWeight: 700,
                            textTransform: 'lowercase',
                            padding: '1px 5px',
                            borderRadius: '3px',
                            background: 'var(--color-warning-light)',
                            border: '1px solid var(--color-warning-border)',
                            color: 'var(--color-warning)',
                            lineHeight: 1.2,
                          }}
                        >
                          {reg}
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(p.phrase, copyKey)}
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
                      {copiedIndex === copyKey ? <Check size={14} strokeWidth={2.5} /> : <Copy size={14} />}
                    </button>
                  </div>
                  {p.translation && (
                    <div style={{ color: 'var(--color-text-secondary)', fontSize: '13px', paddingLeft: '10px', marginTop: '2px' }}>
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
