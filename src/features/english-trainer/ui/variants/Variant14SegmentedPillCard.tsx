'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BaseWordCardProps } from './types';
import { speakEnglishWord } from '@/entities/english';
import { Volume2, ChevronLeft, ChevronRight, Copy, Check, Layers, Sparkles, ArrowUpRight, X } from 'lucide-react';

/**
 * Master Word Card: Variant 1 Layout with Variant 5 Phrases Modal Overlay
 * - Guaranteed 100% stable fixed height across all words (Zero height jumps / layout shift)
 * - Fits effortlessly without modal scrollbars
 * - Inset meaning card with inner smooth scrolling for long examples
 * - External bottom chip with fixed-slot height for phrases overlay
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
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showAllMeanings, setShowAllMeanings] = useState<boolean>(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activePillRef = useRef<HTMLButtonElement>(null);
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

  const renderFormsRow = () => {
    if (forms.verbForms && (forms.verbForms.past || forms.verbForms.pastParticiple || forms.verbForms.ing)) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '6px', fontSize: '10.5px', color: '#09090b', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {forms.verbForms.past && <span><strong style={{ color: '#2563eb', fontWeight: 800 }}>past:</strong> {forms.verbForms.past}</span>}
          {forms.verbForms.past && forms.verbForms.pastParticiple && <span style={{ color: '#cbd5e1' }}>|</span>}
          {forms.verbForms.pastParticiple && <span><strong style={{ color: '#2563eb', fontWeight: 800 }}>part.:</strong> {forms.verbForms.pastParticiple}</span>}
          {(forms.verbForms.past || forms.verbForms.pastParticiple) && forms.verbForms.ing && <span style={{ color: '#cbd5e1' }}>|</span>}
          {forms.verbForms.ing && <span><strong style={{ color: '#2563eb', fontWeight: 800 }}>-ing:</strong> {forms.verbForms.ing}</span>}
        </div>
      );
    }
    if (forms.nounForms?.plural) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '6px', fontSize: '10.5px', color: '#09090b', fontWeight: 600, whiteSpace: 'nowrap' }}>
          <span><strong style={{ color: '#2563eb', fontWeight: 800 }}>pl.:</strong> {forms.nounForms.plural}</span>
        </div>
      );
    }
    if (forms.adjectiveForms?.comparative || forms.adjectiveForms?.superlative) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '6px', fontSize: '10.5px', color: '#09090b', fontWeight: 600, whiteSpace: 'nowrap' }}>
          {forms.adjectiveForms.comparative && <span><strong style={{ color: '#2563eb', fontWeight: 800 }}>comp.:</strong> {forms.adjectiveForms.comparative}</span>}
          {forms.adjectiveForms.comparative && forms.adjectiveForms.superlative && <span style={{ color: '#cbd5e1' }}>|</span>}
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
              border: 'none',
              background: '#eff6ff',
              color: '#2563eb',
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
            title="Озвучить слово"
          >
            <Volume2 size={14} />
          </button>

          {/* Centered Headword */}
          <span style={{ fontSize: '29px', fontWeight: 800, color: '#09090b', letterSpacing: '-0.4px', lineHeight: 1 }}>
            {currentCard.word}
          </span>

          {/* Copy Button (After word) */}
          <button
            type="button"
            onClick={() => handleCopy(currentCard.word, -1)}
            style={{
              border: 'none',
              background: copiedIndex === -1 ? '#f0fdf4' : '#f8fafc',
              color: copiedIndex === -1 ? '#16a34a' : '#64748b',
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

        <span style={{ fontSize: '13.5px', color: '#71717a', fontFamily: 'serif', textAlign: 'center', lineHeight: '18px' }}>
          /{displayTranscription}/
        </span>
      </div>

      {/* 2. Inline Grammar Forms Bar (Fixed Stable Height 20px) */}
      <div style={{ height: '20px', minHeight: '20px', maxHeight: '20px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', boxSizing: 'border-box', overflow: 'hidden' }}>
        {formsNode || <span style={{ opacity: 0, fontSize: '10.5px' }}>—</span>}
      </div>

      {/* 3. Horizontal Meaning Pills Track (Fixed 28px Height) with Quick-Switch Arrows [‹] [›] */}
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
          disabled={currentSafeIdx === 0}
          onClick={() => onSelectMeaning(Math.max(0, currentSafeIdx - 1))}
          style={{
            border: '1px solid #e2e8f0',
            background: currentSafeIdx === 0 ? '#fafafa' : '#ffffff',
            color: currentSafeIdx === 0 ? '#d4d4d8' : '#2563eb',
            width: '22px',
            height: '22px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: currentSafeIdx === 0 ? 'default' : 'pointer',
            padding: 0,
            flexShrink: 0,
            transition: 'all 0.15s ease',
          }}
          title="Предыдущее значение"
        >
          <ChevronLeft size={13} />
        </button>

        {/* Scrollable Track */}
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
            const shortTr = m.translation?.split(/[,;]/)[0] || '';
            return (
              <button
                key={i}
                ref={isSelected ? activePillRef : null}
                type="button"
                onClick={() => onSelectMeaning(i)}
                style={{
                  padding: '2px 8px',
                  borderRadius: '10px',
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
                  height: '22px',
                }}
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
            onClick={() => {
              setShowAllMeanings(!showAllMeanings);
              onSelectMeaning(0);
            }}
            style={{
              border: '1px solid #e2e8f0',
              background: showAllMeanings ? '#eff6ff' : '#f8fafc',
              color: showAllMeanings ? '#2563eb' : '#64748b',
              fontSize: '9px',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              lineHeight: 1,
              whiteSpace: 'nowrap',
              flexShrink: 0,
              height: '22px',
              transition: 'all 0.15s ease',
            }}
            title={showAllMeanings ? 'Показать основные значения' : `Показать все ${meaningsList.length} значений`}
          >
            <Layers size={9} style={{ color: showAllMeanings ? '#2563eb' : '#94a3b8' }} />
            {showAllMeanings ? 'Основные' : `+${secondaryCount} доп.`}
          </button>
        )}

        {/* Right Arrow Button */}
        <button
          type="button"
          disabled={currentSafeIdx === total - 1}
          onClick={() => onSelectMeaning(Math.min(total - 1, currentSafeIdx + 1))}
          style={{
            border: '1px solid #e2e8f0',
            background: currentSafeIdx === total - 1 ? '#fafafa' : '#ffffff',
            color: currentSafeIdx === total - 1 ? '#d4d4d8' : '#2563eb',
            width: '22px',
            height: '22px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: currentSafeIdx === total - 1 ? 'default' : 'pointer',
            padding: 0,
            flexShrink: 0,
            transition: 'all 0.15s ease',
          }}
          title="Следующее значение"
        >
          <ChevronRight size={13} />
        </button>
      </div>

      {/* 4. Inset Meaning Card: Fixed 180px Height with Internal Smooth Scroll for Long Examples */}
      <div
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          background: '#ffffff',
          height: '180px',
          minHeight: '180px',
          maxHeight: '180px',
          padding: '10px 14px 8px 14px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Scrollable Content inside Card */}
        <div
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

          {/* Synonyms Section */}
          {activeMeaning.synonyms && activeMeaning.synonyms.length > 0 && (
            <div style={{ fontSize: '11.5px', marginTop: '3px', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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

          {/* Examples Section with One-Tap Copy */}
          {activeMeaning.examples && activeMeaning.examples.length > 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
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
                            marginLeft: '4px',
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
                      {copiedIndex === i ? <Check size={11} /> : <Copy size={11} />}
                    </button>
                  </div>
                  {ex.ru && (
                    <div style={{ color: '#4338ca', fontSize: '11px', paddingLeft: '8px', marginTop: '1px' }}>
                      {ex.ru}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic', padding: '6px 0' }}>
              (примеров к этому значению нет)
            </div>
          )}
        </div>
      </div>

      {/* 5. Fixed 32px Slot for Phrases Button (Guarantees zero height jump across words) */}
      <div style={{ height: '32px', minHeight: '32px', maxHeight: '32px', width: '100%', boxSizing: 'border-box' }}>
        {cardPhrases.length > 0 ? (
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
              border: '1px solid #d8b4fe',
              background: 'linear-gradient(90deg, #faf5ff 0%, #f3e8ff 100%)',
              color: '#7e22ce',
              cursor: 'pointer',
              fontSize: '11.5px',
              fontWeight: 700,
              transition: 'all 0.15s ease',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={13} color="#a855f7" />
              <span>Фразовые глаголы к слову</span>
              <span
                style={{
                  background: '#7e22ce',
                  color: '#ffffff',
                  fontSize: '9.5px',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: '4px',
                  lineHeight: 1,
                }}
              >
                {cardPhrases.length}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: 700 }}>
              <span>Посмотреть</span>
              <ArrowUpRight size={13} />
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
              border: '1px dashed #e2e8f0',
              background: '#f8fafc',
              color: '#94a3b8',
              fontSize: '11px',
              fontWeight: 500,
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={12} color="#cbd5e1" />
              <span>Фразовых выражений нет</span>
            </div>
            <span style={{ fontSize: '10.5px', color: '#cbd5e1' }}>—</span>
          </div>
        )}
      </div>

      {/* 6. Absolute Modal Overlay for Phrases (Takes 0px extra layout height) */}
      {isOverlayOpen && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#ffffff',
            borderRadius: '12px',
            border: '1.5px solid #a855f7',
            padding: '10px 12px',
            zIndex: 30,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          }}
        >
          {/* Overlay Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #f3e8ff',
              paddingBottom: '5px',
              marginBottom: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={13} color="#9333ea" />
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#6b21a8' }}>
                Фразовые глаголы ({cardPhrases.length})
              </span>
              <span style={{ fontSize: '10.5px', color: '#a855f7', fontWeight: 600 }}>
                к {currentCard.word}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOverlayOpen(false)}
              style={{
                border: 'none',
                background: '#f3e8ff',
                color: '#6b21a8',
                borderRadius: '50%',
                width: '22px',
                height: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Закрыть"
            >
              <X size={13} />
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
              gap: '5px',
              scrollbarWidth: 'thin',
            }}
          >
            {cardPhrases.map((p, pIdx) => {
              const copyKey = 1000 + pIdx;
              return (
                <div
                  key={p.id || pIdx}
                  style={{
                    fontSize: '11.5px',
                    lineHeight: 1.35,
                    background: '#faf5ff',
                    padding: '5px 8px',
                    borderRadius: '6px',
                    border: '1px solid #f3e8ff',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: '#09090b', fontWeight: 600, display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                      <span>• {renderHighlightedSentence(p.phrase, currentCard.word)}</span>
                      {p.partOfSpeech && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            fontSize: '7.5px',
                            fontWeight: 700,
                            textTransform: 'lowercase',
                            padding: '0.5px 3.5px',
                            borderRadius: '3px',
                            background: '#f3e8ff',
                            border: '1px solid #e9d5ff',
                            color: '#7c3aed',
                            lineHeight: 1.1,
                          }}
                        >
                          {p.partOfSpeech}
                        </span>
                      )}
                      {p.register && p.register.map((reg, rIdx) => (
                        <span
                          key={rIdx}
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
                            lineHeight: 1.1,
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
                        color: copiedIndex === copyKey ? '#16a34a' : '#a1a1aa',
                        padding: '1px',
                        marginLeft: '5px',
                      }}
                      title="Скопировать"
                    >
                      {copiedIndex === copyKey ? <Check size={11} /> : <Copy size={11} />}
                    </button>
                  </div>
                  {p.translation && (
                    <div style={{ color: '#6b21a8', fontSize: '10.5px', paddingLeft: '8px', marginTop: '1px' }}>
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
