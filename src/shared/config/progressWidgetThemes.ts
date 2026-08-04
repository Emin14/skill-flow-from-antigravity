'use client';

export interface ProgressWidgetVariantOption {
  id: string;
  name: string;
  gradientBgDark: string;
  gradientBgLight: string;
  borderColorDark: string;
  borderColorLight: string;
  textColorDark: string;
  textColorLight: string;
  accentColorDark: string;
  accentColorLight: string;
  isSolid?: boolean;
}

export const PROGRESS_WIDGET_VARIANTS: ProgressWidgetVariantOption[] = [
  {
    id: 'emerald',
    name: '1. Изумрудный кибер (Emerald)',
    gradientBgDark: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(16, 185, 129, 0.05) 100%)',
    gradientBgLight: 'linear-gradient(135deg, rgba(209, 250, 229, 0.7) 0%, rgba(255, 255, 255, 0.95) 100%)',
    borderColorDark: '#10b981',
    borderColorLight: 'rgba(5, 150, 105, 0.3)',
    textColorDark: '#f8fafc',
    textColorLight: '#0f172a',
    accentColorDark: '#34d399',
    accentColorLight: '#047857',
  },
  {
    id: 'sky',
    name: '2. Небесно-голубой (Sky Blue)',
    gradientBgDark: 'linear-gradient(135deg, rgba(56, 189, 248, 0.18) 0%, rgba(56, 189, 248, 0.05) 100%)',
    gradientBgLight: 'linear-gradient(135deg, rgba(224, 242, 254, 0.7) 0%, rgba(255, 255, 255, 0.95) 100%)',
    borderColorDark: '#38bdf8',
    borderColorLight: 'rgba(2, 132, 199, 0.3)',
    textColorDark: '#f8fafc',
    textColorLight: '#0f172a',
    accentColorDark: '#38bdf8',
    accentColorLight: '#0369a1',
  },
  {
    id: 'indigo',
    name: '3. Индиго магия (Indigo)',
    gradientBgDark: 'linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(99, 102, 241, 0.05) 100%)',
    gradientBgLight: 'linear-gradient(135deg, rgba(224, 231, 255, 0.7) 0%, rgba(255, 255, 255, 0.95) 100%)',
    borderColorDark: '#6366f1',
    borderColorLight: 'rgba(67, 56, 202, 0.3)',
    textColorDark: '#f8fafc',
    textColorLight: '#0f172a',
    accentColorDark: '#818cf8',
    accentColorLight: '#4338ca',
  },
  {
    id: 'orange',
    name: '4. Сочный оранжевый (Orange)',
    gradientBgDark: 'linear-gradient(135deg, rgba(255, 107, 0, 0.18) 0%, rgba(255, 107, 0, 0.05) 100%)',
    gradientBgLight: 'linear-gradient(135deg, rgba(255, 237, 213, 0.7) 0%, rgba(255, 255, 255, 0.95) 100%)',
    borderColorDark: '#ff6b00',
    borderColorLight: 'rgba(194, 65, 12, 0.3)',
    textColorDark: '#f8fafc',
    textColorLight: '#0f172a',
    accentColorDark: '#fb923c',
    accentColorLight: '#c2410c',
  },
  {
    id: 'amber',
    name: '5. Солнечный янтарь (Gold Amber)',
    gradientBgDark: 'linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(245, 158, 11, 0.05) 100%)',
    gradientBgLight: 'linear-gradient(135deg, rgba(254, 243, 199, 0.7) 0%, rgba(255, 255, 255, 0.95) 100%)',
    borderColorDark: '#f59e0b',
    borderColorLight: 'rgba(180, 83, 9, 0.3)',
    textColorDark: '#f8fafc',
    textColorLight: '#0f172a',
    accentColorDark: '#fbbf24',
    accentColorLight: '#b45309',
  },
  {
    id: 'coral',
    name: '6. Коралловая роза (Coral Rose)',
    gradientBgDark: 'linear-gradient(135deg, rgba(244, 63, 94, 0.18) 0%, rgba(244, 63, 94, 0.05) 100%)',
    gradientBgLight: 'linear-gradient(135deg, rgba(254, 226, 226, 0.7) 0%, rgba(255, 255, 255, 0.95) 100%)',
    borderColorDark: '#f43f5e',
    borderColorLight: 'rgba(190, 18, 60, 0.3)',
    textColorDark: '#f8fafc',
    textColorLight: '#0f172a',
    accentColorDark: '#fb7185',
    accentColorLight: '#be123c',
  },
  {
    id: 'aqua',
    name: '7. Бирюзовый аква (Aqua Cyan)',
    gradientBgDark: 'linear-gradient(135deg, rgba(71, 184, 196, 0.18) 0%, rgba(71, 184, 196, 0.05) 100%)',
    gradientBgLight: 'linear-gradient(135deg, rgba(204, 251, 241, 0.7) 0%, rgba(255, 255, 255, 0.95) 100%)',
    borderColorDark: '#47b8c4',
    borderColorLight: 'rgba(15, 118, 110, 0.3)',
    textColorDark: '#f8fafc',
    textColorLight: '#0f172a',
    accentColorDark: '#2dd4bf',
    accentColorLight: '#0f766e',
  },
  {
    id: 'lime',
    name: '8. Весенний лайм (Spring Lime)',
    gradientBgDark: 'linear-gradient(135deg, rgba(132, 204, 22, 0.18) 0%, rgba(132, 204, 22, 0.05) 100%)',
    gradientBgLight: 'linear-gradient(135deg, rgba(236, 252, 203, 0.7) 0%, rgba(255, 255, 255, 0.95) 100%)',
    borderColorDark: '#84cc16',
    borderColorLight: 'rgba(77, 124, 15, 0.3)',
    textColorDark: '#f8fafc',
    textColorLight: '#0f172a',
    accentColorDark: '#a3e635',
    accentColorLight: '#4d7c0f',
  },
  {
    id: 'violet',
    name: '9. Сиреневая орхидея (Lilac Violet)',
    gradientBgDark: 'linear-gradient(135deg, rgba(139, 92, 246, 0.18) 0%, rgba(139, 92, 246, 0.05) 100%)',
    gradientBgLight: 'linear-gradient(135deg, rgba(237, 233, 254, 0.7) 0%, rgba(255, 255, 255, 0.95) 100%)',
    borderColorDark: '#8b5cf6',
    borderColorLight: 'rgba(109, 40, 217, 0.3)',
    textColorDark: '#f8fafc',
    textColorLight: '#0f172a',
    accentColorDark: '#c084fc',
    accentColorLight: '#6d28d9',
  },
  {
    id: 'magenta',
    name: '10. Неоновая маджента (Magenta)',
    gradientBgDark: 'linear-gradient(135deg, rgba(217, 70, 239, 0.18) 0%, rgba(217, 70, 239, 0.05) 100%)',
    gradientBgLight: 'linear-gradient(135deg, rgba(250, 232, 255, 0.7) 0%, rgba(255, 255, 255, 0.95) 100%)',
    borderColorDark: '#d946ef',
    borderColorLight: 'rgba(162, 28, 175, 0.3)',
    textColorDark: '#f8fafc',
    textColorLight: '#0f172a',
    accentColorDark: '#e879f9',
    accentColorLight: '#a21caf',
  },
  {
    id: 'sunset_twist',
    name: '11. Закатный твист (Оранж + Фиолет)',
    gradientBgDark: 'linear-gradient(135deg, rgba(255, 107, 0, 0.2) 0%, rgba(139, 92, 246, 0.15) 100%)',
    gradientBgLight: 'linear-gradient(135deg, rgba(255, 237, 213, 0.7) 0%, rgba(237, 233, 254, 0.7) 100%)',
    borderColorDark: '#ff6b00',
    borderColorLight: 'rgba(194, 65, 12, 0.3)',
    textColorDark: '#f8fafc',
    textColorLight: '#0f172a',
    accentColorDark: '#fb923c',
    accentColorLight: '#c2410c',
  },
  {
    id: 'aurora',
    name: '12. Северное сияние (Циан + Синий)',
    gradientBgDark: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(59, 130, 246, 0.15) 100%)',
    gradientBgLight: 'linear-gradient(135deg, rgba(207, 250, 254, 0.7) 0%, rgba(224, 242, 254, 0.7) 100%)',
    borderColorDark: '#06b6d4',
    borderColorLight: 'rgba(14, 116, 144, 0.3)',
    textColorDark: '#f8fafc',
    textColorLight: '#0f172a',
    accentColorDark: '#22d3ee',
    accentColorLight: '#0e7490',
  },
  {
    id: 'tropical',
    name: '13. Тропический рассвет (Коралл + Золото)',
    gradientBgDark: 'linear-gradient(135deg, rgba(251, 113, 133, 0.2) 0%, rgba(251, 191, 36, 0.15) 100%)',
    gradientBgLight: 'linear-gradient(135deg, rgba(254, 226, 226, 0.7) 0%, rgba(254, 243, 199, 0.7) 100%)',
    borderColorDark: '#fb7185',
    borderColorLight: 'rgba(190, 18, 60, 0.3)',
    textColorDark: '#f8fafc',
    textColorLight: '#0f172a',
    accentColorDark: '#fb7185',
    accentColorLight: '#be123c',
  },
  {
    id: 'cyber_gradient',
    name: '14. Изумрудно-голубой градиент',
    gradientBgDark: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(56, 189, 248, 0.15) 100%)',
    gradientBgLight: 'linear-gradient(135deg, rgba(209, 250, 229, 0.7) 0%, rgba(224, 242, 254, 0.7) 100%)',
    borderColorDark: '#38bdf8',
    borderColorLight: 'rgba(2, 132, 199, 0.3)',
    textColorDark: '#f8fafc',
    textColorLight: '#0f172a',
    accentColorDark: '#38bdf8',
    accentColorLight: '#0369a1',
  },
  {
    id: 'solid_emerald',
    name: '15. Бархатный Изумруд (Emerald Soft)',
    gradientBgDark: 'linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(16, 185, 129, 0.06) 100%)',
    gradientBgLight: 'linear-gradient(135deg, rgba(209, 250, 229, 0.85) 0%, rgba(255, 255, 255, 0.95) 100%)',
    borderColorDark: '#10b981',
    borderColorLight: 'rgba(5, 150, 105, 0.4)',
    textColorDark: '#f8fafc',
    textColorLight: '#0f172a',
    accentColorDark: '#34d399',
    accentColorLight: '#047857',
  },
  {
    id: 'solid_orange',
    name: '16. Неоновый Оранжевый (Orange Soft)',
    gradientBgDark: 'linear-gradient(135deg, rgba(255, 107, 0, 0.22) 0%, rgba(255, 107, 0, 0.06) 100%)',
    gradientBgLight: 'linear-gradient(135deg, rgba(255, 237, 213, 0.85) 0%, rgba(255, 255, 255, 0.95) 100%)',
    borderColorDark: '#ff6b00',
    borderColorLight: 'rgba(194, 65, 12, 0.4)',
    textColorDark: '#f8fafc',
    textColorLight: '#0f172a',
    accentColorDark: '#fb923c',
    accentColorLight: '#c2410c',
  },
  {
    id: 'solid_sapphire',
    name: '17. Глубокий Сапфир (Sapphire Soft)',
    gradientBgDark: 'linear-gradient(135deg, rgba(59, 130, 246, 0.22) 0%, rgba(59, 130, 246, 0.06) 100%)',
    gradientBgLight: 'linear-gradient(135deg, rgba(219, 234, 254, 0.85) 0%, rgba(255, 255, 255, 0.95) 100%)',
    borderColorDark: '#3b82f6',
    borderColorLight: 'rgba(37, 99, 235, 0.4)',
    textColorDark: '#f8fafc',
    textColorLight: '#0f172a',
    accentColorDark: '#60a5fa',
    accentColorLight: '#1d4ed8',
  },
  {
    id: 'solid_violet',
    name: '18. Ночной Фиолет (Violet Soft)',
    gradientBgDark: 'linear-gradient(135deg, rgba(139, 92, 246, 0.22) 0%, rgba(139, 92, 246, 0.06) 100%)',
    gradientBgLight: 'linear-gradient(135deg, rgba(237, 233, 254, 0.85) 0%, rgba(255, 255, 255, 0.95) 100%)',
    borderColorDark: '#8b5cf6',
    borderColorLight: 'rgba(109, 40, 217, 0.4)',
    textColorDark: '#f8fafc',
    textColorLight: '#0f172a',
    accentColorDark: '#c084fc',
    accentColorLight: '#6d28d9',
  },
  {
    id: 'solid_magenta',
    name: '19. Космическая Маджента (Magenta Soft)',
    gradientBgDark: 'linear-gradient(135deg, rgba(217, 70, 239, 0.22) 0%, rgba(217, 70, 239, 0.06) 100%)',
    gradientBgLight: 'linear-gradient(135deg, rgba(250, 232, 255, 0.85) 0%, rgba(255, 255, 255, 0.95) 100%)',
    borderColorDark: '#d946ef',
    borderColorLight: 'rgba(162, 28, 175, 0.4)',
    textColorDark: '#f8fafc',
    textColorLight: '#0f172a',
    accentColorDark: '#e879f9',
    accentColorLight: '#a21caf',
  },
  {
    id: 'adaptive',
    name: '20. Адаптивный нежный подтон (Текущий)',
    gradientBgDark: 'linear-gradient(135deg, var(--color-accent-light, rgba(99, 102, 241, 0.14)) 0%, var(--color-surface) 100%)',
    gradientBgLight: 'linear-gradient(135deg, var(--color-accent-light, rgba(79, 70, 229, 0.1)) 0%, #FFFFFF 100%)',
    borderColorDark: 'var(--color-accent-border, rgba(99, 102, 241, 0.3))',
    borderColorLight: 'var(--color-accent-border, rgba(79, 70, 229, 0.25))',
    textColorDark: '#f8fafc',
    textColorLight: '#0f172a',
    accentColorDark: 'var(--color-accent)',
    accentColorLight: 'var(--color-accent)',
  },
];

export const applyProgressWidgetStyle = (styleId: string) => {
  if (typeof window === 'undefined') return;
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const styleOpt = PROGRESS_WIDGET_VARIANTS.find((s) => s.id === styleId) || PROGRESS_WIDGET_VARIANTS[19];
  const root = document.documentElement;

  const bg = isLight ? styleOpt.gradientBgLight : styleOpt.gradientBgDark;
  const border = isLight ? styleOpt.borderColorLight : styleOpt.borderColorDark;
  const text = isLight ? styleOpt.textColorLight : styleOpt.textColorDark;
  const accent = isLight ? styleOpt.accentColorLight : styleOpt.accentColorDark;

  root.style.setProperty('--widget-progress-bg', bg);
  root.style.setProperty('--widget-progress-border', border);
  root.style.setProperty('--widget-progress-text', text);
  root.style.setProperty('--widget-progress-accent', accent);

  localStorage.setItem('progress-widget-color-variant', styleOpt.id);
};
