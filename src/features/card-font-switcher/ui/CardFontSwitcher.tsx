'use client';

import React, { useState, useEffect } from 'react';
import { TASK_CARD_FONTS, applyTaskCardFont } from '@/shared/config/cardFonts';
import { Type, Check, ChevronDown } from 'lucide-react';
import styles from './CardFontSwitcher.module.css';

export const CardFontSwitcher: React.FC = () => {
  const [activeFontId, setActiveFontId] = useState<string>('system_ios');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('user-card-font-id') || 'system_ios';
    setActiveFontId(saved);
  }, []);

  const handleSelectFont = (fontId: string) => {
    setActiveFontId(fontId);
    applyTaskCardFont(fontId);
    setIsOpen(false);
  };

  const activeFont = TASK_CARD_FONTS.find((f) => f.id === activeFontId) || TASK_CARD_FONTS[0];

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.triggerBtn}
        onClick={() => setIsOpen((prev) => !prev)}
        title="Сменить шрифт карточек задач"
      >
        <Type size={14} className={styles.icon} />
        <span className={styles.label}>Шрифт:</span>
        <span className={styles.activeFontName}>{activeFont.name}</span>
        <ChevronDown size={13} className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className={styles.backdrop} onClick={() => setIsOpen(false)} />
          <div className={styles.dropdownMenu}>
            <div className={styles.dropdownHeader}>
              <span>Шрифты карточек задач (Кириллица 🇷🇺)</span>
            </div>
            <div className={styles.optionsList}>
              {TASK_CARD_FONTS.map((font) => {
                const isSelected = font.id === activeFontId;
                return (
                  <button
                    key={font.id}
                    type="button"
                    className={`${styles.optionBtn} ${isSelected ? styles.optionBtnActive : ''}`}
                    onClick={() => handleSelectFont(font.id)}
                  >
                    <div className={styles.optionContent}>
                      <div className={styles.optionTitleRow}>
                        <span className={styles.fontName} style={{ fontFamily: font.fontFamily }}>
                          {font.name}
                        </span>
                        <span className={styles.appNameBadge}>{font.appName}</span>
                      </div>
                      <div className={styles.sampleText} style={{ fontFamily: font.fontFamily }}>
                        {font.sampleText}
                      </div>
                    </div>
                    {isSelected && <Check size={16} className={styles.checkIcon} />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
