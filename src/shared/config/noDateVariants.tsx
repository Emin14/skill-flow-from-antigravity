'use client';

import React from 'react';

export interface NoDateVariantOption {
  id: number;
  name: string;
}

export const NO_DATE_VARIANTS: NoDateVariantOption[] = [
  { id: 1, name: '1. Красный бейдж (❌ Без даты)' },
  { id: 2, name: '2. Инфинити-плашка (♾️ В любое время)' },
  { id: 3, name: '3. Микро-иконка 🚫' },
  { id: 4, name: '4. Неоновый глоу (⚡ Без даты)' },
  { id: 5, name: '5. Glassmorphism (✨ Anytime)' },
  { id: 6, name: '6. Сегментированный переключатель' },
  { id: 7, name: '7. Круглая микро-кнопка ❌' },
  { id: 8, name: '8. Пунктирная лента (--- Без даты ---)' },
  { id: 9, name: '9. Перечеркнутый календарь 📅⃠' },
  { id: 10, name: '10. Янтарный чип (🌅 Без срока)' },
  { id: 11, name: '11. Минималистичная ссылка' },
  { id: 12, name: '12. Сплит-бейдж (♾️ Anytime [✕])' },
  { id: 13, name: '13. Магический градиент (🔮 В любое время)' },
  { id: 14, name: '14. Статусная точка (● Без даты)' },
  { id: 15, name: '15. iOS Слайдинг-плашка' },
];

interface RenderNoDateButtonProps {
  variantId: number;
  scheduledDate: string;
  onClear: () => void;
  onSetToday: () => void;
}

export const RenderNoDateButton: React.FC<RenderNoDateButtonProps> = ({
  variantId,
  scheduledDate,
  onClear,
  onSetToday,
}) => {
  const hasDate = !!scheduledDate;
  const handleClick = hasDate ? onClear : onSetToday;

  switch (variantId) {
    case 1:
      // Variant 1: Compact Red Cross Badge
      return (
        <button
          type="button"
          onClick={handleClick}
          title={hasDate ? 'Очистить дату' : 'Установить на Сегодня'}
          style={{
            height: '26px',
            padding: '0 8px',
            borderRadius: '6px',
            background: hasDate ? 'rgba(239, 68, 68, 0.14)' : 'rgba(99, 102, 241, 0.15)',
            border: hasDate ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(99, 102, 241, 0.4)',
            color: hasDate ? '#ef4444' : 'var(--color-accent-text)',
            fontSize: '11.5px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {hasDate ? '❌ Без даты' : '☀️ Сегодня'}
        </button>
      );

    case 2:
      // Variant 2: Infinity Pill
      return (
        <button
          type="button"
          onClick={handleClick}
          title={hasDate ? 'Очистить дату (В любое время)' : 'Установить на Сегодня'}
          style={{
            height: '26px',
            padding: '0 10px',
            borderRadius: '12px',
            background: hasDate ? 'rgba(56, 189, 248, 0.15)' : 'rgba(99, 102, 241, 0.15)',
            border: hasDate ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid rgba(99, 102, 241, 0.4)',
            color: hasDate ? '#38bdf8' : 'var(--color-accent-text)',
            fontSize: '11.5px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {hasDate ? '♾️ В любое время' : '☀️ Сегодня'}
        </button>
      );

    case 3:
      // Variant 3: Minimalist Slash Icon
      return (
        <button
          type="button"
          onClick={handleClick}
          title={hasDate ? 'Без даты 🚫' : 'Установить на Сегодня'}
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '6px',
            background: hasDate ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            border: hasDate ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--color-border)',
            color: hasDate ? '#ef4444' : 'var(--color-text-muted)',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          {hasDate ? '🚫' : '📅'}
        </button>
      );

    case 4:
      // Variant 4: Neon Glow Toggle Switch
      return (
        <button
          type="button"
          onClick={handleClick}
          style={{
            height: '26px',
            padding: '0 9px',
            borderRadius: '8px',
            background: hasDate ? 'rgba(168, 85, 247, 0.18)' : 'rgba(99, 102, 241, 0.15)',
            border: hasDate ? '1px solid rgba(168, 85, 247, 0.5)' : '1px solid rgba(99, 102, 241, 0.4)',
            color: hasDate ? '#c084fc' : 'var(--color-accent-text)',
            fontSize: '11px',
            fontWeight: 700,
            boxShadow: hasDate ? '0 0 10px rgba(168, 85, 247, 0.35)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {hasDate ? '⚡ Без даты' : '☀️ Сегодня'}
        </button>
      );

    case 5:
      // Variant 5: Floating Glass Tag
      return (
        <button
          type="button"
          onClick={handleClick}
          style={{
            height: '26px',
            padding: '0 9px',
            borderRadius: '10px',
            background: hasDate ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            backdropFilter: 'blur(8px)',
            color: hasDate ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
            fontSize: '11px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {hasDate ? '✨ Anytime' : '☀️ Today'}
        </button>
      );

    case 6:
      // Variant 6: Segmented Tab Badge
      return (
        <button
          type="button"
          onClick={handleClick}
          style={{
            height: '26px',
            padding: '0 8px',
            borderRadius: '6px',
            background: hasDate ? 'rgba(255, 255, 255, 0.06)' : 'rgba(99, 102, 241, 0.25)',
            border: hasDate ? '1px solid var(--color-border)' : '1px solid rgba(99, 102, 241, 0.6)',
            color: hasDate ? 'var(--color-text-muted)' : '#a5b4fc',
            fontSize: '11px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {hasDate ? '📆 Дата [❌]' : '♾️ Без даты'}
        </button>
      );

    case 7:
      // Variant 7: Micro Icon Circle
      return (
        <button
          type="button"
          onClick={handleClick}
          title={hasDate ? 'Сбросить дату' : 'Установить Сегодня'}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: hasDate ? '#ef4444' : 'var(--color-accent)',
            border: 'none',
            color: '#ffffff',
            fontSize: '11px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            boxShadow: hasDate ? '0 2px 6px rgba(239, 68, 68, 0.4)' : '0 2px 6px rgba(99, 102, 241, 0.4)',
          }}
        >
          {hasDate ? '✕' : '✓'}
        </button>
      );

    case 8:
      // Variant 8: Dashed Outline Ribbon
      return (
        <button
          type="button"
          onClick={handleClick}
          style={{
            height: '26px',
            padding: '0 8px',
            borderRadius: '6px',
            background: 'transparent',
            border: hasDate ? '1.5px dashed rgba(239, 68, 68, 0.5)' : '1.5px dashed rgba(255, 255, 255, 0.25)',
            color: hasDate ? '#f87171' : 'var(--color-text-muted)',
            fontSize: '11px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {hasDate ? '--- Без даты ---' : '+ Дата'}
        </button>
      );

    case 9:
      // Variant 9: Calendar Strikethrough Icon
      return (
        <button
          type="button"
          onClick={handleClick}
          title={hasDate ? 'Убрать дату 📅⃠' : 'Добавить дату'}
          style={{
            height: '26px',
            padding: '0 8px',
            borderRadius: '6px',
            background: hasDate ? 'rgba(239, 68, 68, 0.12)' : 'var(--color-surface-hover)',
            border: hasDate ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--color-border)',
            color: hasDate ? '#ef4444' : 'var(--color-text-primary)',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          <span>{hasDate ? '📅⃠' : '📅'}</span>
          <span style={{ fontSize: '11px', fontWeight: 600 }}>{hasDate ? 'Сбросить' : 'Сегодня'}</span>
        </button>
      );

    case 10:
      // Variant 10: Sunset Orange Chip
      return (
        <button
          type="button"
          onClick={handleClick}
          style={{
            height: '26px',
            padding: '0 9px',
            borderRadius: '8px',
            background: hasDate ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.1))' : 'rgba(99, 102, 241, 0.15)',
            border: hasDate ? '1px solid rgba(245, 158, 11, 0.45)' : '1px solid rgba(99, 102, 241, 0.4)',
            color: hasDate ? '#fbbf24' : 'var(--color-accent-text)',
            fontSize: '11px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {hasDate ? '🌅 Без срока' : '☀️ Сегодня'}
        </button>
      );

    case 11:
      // Variant 11: Minimalist Text Link (Fixed Width to prevent UI layout jumping)
      return (
        <button
          type="button"
          onClick={handleClick}
          style={{
            height: '26px',
            width: '106px',
            padding: '0 4px',
            background: 'none',
            border: 'none',
            color: hasDate ? '#ef4444' : 'var(--color-accent-text)',
            fontSize: '11px',
            fontWeight: 600,
            textDecoration: 'underline',
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            boxSizing: 'border-box',
          }}
        >
          {hasDate ? 'Очистить дату' : 'Поставить сегодня'}
        </button>
      );

    case 12:
      // Variant 12: Dual Action Split Badge
      return (
        <button
          type="button"
          onClick={handleClick}
          style={{
            height: '26px',
            padding: '0 8px',
            borderRadius: '12px',
            background: hasDate ? 'rgba(99, 102, 241, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            border: hasDate ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid rgba(239, 68, 68, 0.35)',
            color: hasDate ? '#a5b4fc' : '#ef4444',
            fontSize: '11px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          <span>{hasDate ? '♾️ Anytime' : '❌ Без даты'}</span>
          <span style={{ opacity: 0.6, fontSize: '10px' }}>[✕]</span>
        </button>
      );

    case 13:
      // Variant 13: Floating Sparkle Badge
      return (
        <button
          type="button"
          onClick={handleClick}
          style={{
            height: '26px',
            padding: '0 9px',
            borderRadius: '9px',
            background: hasDate ? 'linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(79, 70, 229, 0.2))' : 'rgba(99, 102, 241, 0.15)',
            border: hasDate ? '1px solid rgba(147, 51, 234, 0.45)' : '1px solid rgba(99, 102, 241, 0.4)',
            color: hasDate ? '#e9d5ff' : 'var(--color-accent-text)',
            fontSize: '11px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {hasDate ? '🔮 В любое время' : '☀️ Сегодня'}
        </button>
      );

    case 14:
      // Variant 14: Borderless Micro Dot
      return (
        <button
          type="button"
          onClick={handleClick}
          style={{
            height: '26px',
            padding: '0 7px',
            borderRadius: '6px',
            background: 'var(--color-surface-hover)',
            border: '1px solid var(--color-border)',
            color: hasDate ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
            fontSize: '11px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: hasDate ? '#ef4444' : '#10b981' }} />
          <span>{hasDate ? 'Без даты' : 'Сегодня'}</span>
        </button>
      );

    case 15:
    default:
      // Variant 15: iOS Pill Switcher
      return (
        <button
          type="button"
          onClick={handleClick}
          style={{
            height: '26px',
            padding: '0 9px',
            borderRadius: '14px',
            background: hasDate ? 'rgba(239, 68, 68, 0.16)' : 'rgba(16, 185, 129, 0.16)',
            border: hasDate ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
            color: hasDate ? '#f87171' : '#34d399',
            fontSize: '11px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {hasDate ? '🗓️ С датой (Нажми: ♾️)' : '♾️ Без даты (Нажми: 🗓️)'}
        </button>
      );
  }
};
