'use client';

import React from 'react';
import { CARD_VARIANTS } from './types';
import { ChevronLeft, ChevronRight, LayoutTemplate } from 'lucide-react';
import styles from './variants.module.css';

interface CardVariantSwitcherProps {
  activeVariant: number;
  onSelectVariant: (variantId: number) => void;
}

export const CardVariantSwitcher: React.FC<CardVariantSwitcherProps> = ({
  activeVariant,
  onSelectVariant,
}) => {
  const current = CARD_VARIANTS.find((v) => v.id === activeVariant) || CARD_VARIANTS[0];

  const handlePrev = () => {
    const nextId = activeVariant > 1 ? activeVariant - 1 : CARD_VARIANTS.length;
    onSelectVariant(nextId);
  };

  const handleNext = () => {
    const nextId = activeVariant < CARD_VARIANTS.length ? activeVariant + 1 : 1;
    onSelectVariant(nextId);
  };

  return (
    <div className={styles.switcherContainer}>
      {/* Top Meta Bar */}
      <div className={styles.switcherTopRow}>
        <div className={styles.switcherLabelBadge} title={current.subtitle}>
          <LayoutTemplate size={13} color="var(--color-accent-text)" />
          <span>Дизайн #{current.id}: {current.name}</span>
          <span className={styles.switcherTag}>{current.tag}</span>
        </div>

        {/* Dropdown Select & Arrow Navigation */}
        <div className={styles.switcherNavBtns}>
          <button
            type="button"
            className={styles.switcherArrowBtn}
            onClick={handlePrev}
            title="Предыдущий дизайн карточки (←)"
          >
            <ChevronLeft size={16} />
          </button>

          <div className={styles.switcherSelectWrapper}>
            <select
              className={styles.switcherSelect}
              value={activeVariant}
              onChange={(e) => onSelectVariant(Number(e.target.value))}
              aria-label="Выбрать дизайн карточки"
            >
              {CARD_VARIANTS.map((v) => (
                <option key={v.id} value={v.id}>
                  #{v.id} {v.name} ({v.tag})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className={styles.switcherArrowBtn}
            onClick={handleNext}
            title="Следующий дизайн карточки (→)"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Horizontal Pill Numbers 1..20 */}
      <div className={styles.switcherTrack}>
        {CARD_VARIANTS.map((v) => {
          const isActive = v.id === activeVariant;
          return (
            <button
              key={v.id}
              type="button"
              className={`${styles.switcherPill} ${isActive ? styles.switcherPillActive : ''}`}
              onClick={() => onSelectVariant(v.id)}
              title={`#${v.id} ${v.name} — ${v.subtitle}`}
            >
              {v.id}
            </button>
          );
        })}
      </div>
    </div>
  );
};
