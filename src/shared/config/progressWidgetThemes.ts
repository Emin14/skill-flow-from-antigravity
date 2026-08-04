'use client';

export interface ProgressWidgetVariantOption {
  id: string;
  name: string;
  gradientBg: string;
  borderColor: string;
  textColor: string;
  accentColor: string;
  isSolid?: boolean;
}

export const PROGRESS_WIDGET_VARIANTS: ProgressWidgetVariantOption[] = [
  {
    id: 'emerald',
    name: '1. Изумрудный кибер (Emerald)',
    gradientBg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(16, 185, 129, 0.05) 100%)',
    borderColor: '#10b981',
    textColor: 'var(--color-text-primary)',
    accentColor: '#10b981',
  },
  {
    id: 'sky',
    name: '2. Небесно-голубой (Sky Blue)',
    gradientBg: 'linear-gradient(135deg, rgba(56, 189, 248, 0.18) 0%, rgba(56, 189, 248, 0.05) 100%)',
    borderColor: '#38bdf8',
    textColor: 'var(--color-text-primary)',
    accentColor: '#38bdf8',
  },
  {
    id: 'indigo',
    name: '3. Индиго магия (Indigo)',
    gradientBg: 'linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(99, 102, 241, 0.05) 100%)',
    borderColor: '#6366f1',
    textColor: 'var(--color-text-primary)',
    accentColor: '#6366f1',
  },
  {
    id: 'orange',
    name: '4. Сочный оранжевый (Orange)',
    gradientBg: 'linear-gradient(135deg, rgba(255, 107, 0, 0.18) 0%, rgba(255, 107, 0, 0.05) 100%)',
    borderColor: '#ff6b00',
    textColor: 'var(--color-text-primary)',
    accentColor: '#ff6b00',
  },
  {
    id: 'amber',
    name: '5. Солнечный янтарь (Gold Amber)',
    gradientBg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(245, 158, 11, 0.05) 100%)',
    borderColor: '#f59e0b',
    textColor: 'var(--color-text-primary)',
    accentColor: '#f59e0b',
  },
  {
    id: 'coral',
    name: '6. Коралловая роза (Coral Rose)',
    gradientBg: 'linear-gradient(135deg, rgba(244, 63, 94, 0.18) 0%, rgba(244, 63, 94, 0.05) 100%)',
    borderColor: '#f43f5e',
    textColor: 'var(--color-text-primary)',
    accentColor: '#f43f5e',
  },
  {
    id: 'aqua',
    name: '7. Бирюзовый аква (Aqua Cyan)',
    gradientBg: 'linear-gradient(135deg, rgba(71, 184, 196, 0.18) 0%, rgba(71, 184, 196, 0.05) 100%)',
    borderColor: '#47b8c4',
    textColor: 'var(--color-text-primary)',
    accentColor: '#47b8c4',
  },
  {
    id: 'lime',
    name: '8. Весенний лайм (Spring Lime)',
    gradientBg: 'linear-gradient(135deg, rgba(132, 204, 22, 0.18) 0%, rgba(132, 204, 22, 0.05) 100%)',
    borderColor: '#84cc16',
    textColor: 'var(--color-text-primary)',
    accentColor: '#84cc16',
  },
  {
    id: 'violet',
    name: '9. Сиреневая орхидея (Lilac Violet)',
    gradientBg: 'linear-gradient(135deg, rgba(139, 92, 246, 0.18) 0%, rgba(139, 92, 246, 0.05) 100%)',
    borderColor: '#8b5cf6',
    textColor: 'var(--color-text-primary)',
    accentColor: '#8b5cf6',
  },
  {
    id: 'magenta',
    name: '10. Неоновая маджента (Magenta)',
    gradientBg: 'linear-gradient(135deg, rgba(217, 70, 239, 0.18) 0%, rgba(217, 70, 239, 0.05) 100%)',
    borderColor: '#d946ef',
    textColor: 'var(--color-text-primary)',
    accentColor: '#d946ef',
  },
  {
    id: 'sunset_twist',
    name: '11. Закатный твист (Оранж + Фиолет)',
    gradientBg: 'linear-gradient(135deg, rgba(255, 107, 0, 0.2) 0%, rgba(139, 92, 246, 0.15) 100%)',
    borderColor: '#ff6b00',
    textColor: 'var(--color-text-primary)',
    accentColor: '#ff6b00',
  },
  {
    id: 'aurora',
    name: '12. Северное сияние (Циан + Синий)',
    gradientBg: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(59, 130, 246, 0.15) 100%)',
    borderColor: '#06b6d4',
    textColor: 'var(--color-text-primary)',
    accentColor: '#06b6d4',
  },
  {
    id: 'tropical',
    name: '13. Тропический рассвет (Коралл + Золото)',
    gradientBg: 'linear-gradient(135deg, rgba(251, 113, 133, 0.2) 0%, rgba(251, 191, 36, 0.15) 100%)',
    borderColor: '#fb7185',
    textColor: 'var(--color-text-primary)',
    accentColor: '#fb7185',
  },
  {
    id: 'cyber_gradient',
    name: '14. Изумрудно-голубой градиент',
    gradientBg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(56, 189, 248, 0.15) 100%)',
    borderColor: '#38bdf8',
    textColor: 'var(--color-text-primary)',
    accentColor: '#38bdf8',
  },
  {
    id: 'solid_emerald',
    name: '15. Сплошной Изумрудный плакат',
    gradientBg: '#10b981',
    borderColor: '#10b981',
    textColor: '#ffffff',
    accentColor: '#ffffff',
    isSolid: true,
  },
  {
    id: 'solid_orange',
    name: '16. Сплошной Оранжевый плакат',
    gradientBg: '#ff6b00',
    borderColor: '#ff6b00',
    textColor: '#ffffff',
    accentColor: '#ffffff',
    isSolid: true,
  },
  {
    id: 'solid_sapphire',
    name: '17. Сплошной Сапфировый плакат',
    gradientBg: '#3b82f6',
    borderColor: '#3b82f6',
    textColor: '#ffffff',
    accentColor: '#ffffff',
    isSolid: true,
  },
  {
    id: 'solid_violet',
    name: '18. Сплошной Фиолетовый плакат',
    gradientBg: '#8b5cf6',
    borderColor: '#8b5cf6',
    textColor: '#ffffff',
    accentColor: '#ffffff',
    isSolid: true,
  },
  {
    id: 'solid_magenta',
    name: '19. Сплошной Неоновый Маджента',
    gradientBg: '#d946ef',
    borderColor: '#d946ef',
    textColor: '#ffffff',
    accentColor: '#ffffff',
    isSolid: true,
  },
  {
    id: 'adaptive',
    name: '20. Адаптивный нежный подтон (Текущий)',
    gradientBg: 'linear-gradient(135deg, var(--color-accent-light, rgba(99, 102, 241, 0.14)) 0%, var(--color-surface) 100%)',
    borderColor: 'var(--color-accent-border, rgba(99, 102, 241, 0.3))',
    textColor: 'var(--color-text-primary)',
    accentColor: 'var(--color-accent)',
  },
];

export const applyProgressWidgetStyle = (styleId: string) => {
  if (typeof window === 'undefined') return;
  const styleOpt = PROGRESS_WIDGET_VARIANTS.find((s) => s.id === styleId) || PROGRESS_WIDGET_VARIANTS[19];
  const root = document.documentElement;

  root.style.setProperty('--widget-progress-bg', styleOpt.gradientBg);
  root.style.setProperty('--widget-progress-border', styleOpt.borderColor);
  root.style.setProperty('--widget-progress-text', styleOpt.textColor);
  root.style.setProperty('--widget-progress-accent', styleOpt.accentColor);

  localStorage.setItem('progress-widget-color-variant', styleOpt.id);
};
