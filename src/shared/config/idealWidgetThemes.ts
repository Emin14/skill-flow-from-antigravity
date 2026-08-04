'use client';

export interface IdealWidgetCandidate {
  id: string;
  name: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  mutedTextColor: string;
  accentColor: string;
  boxShadow?: string;
  isSolid?: boolean;
}

export const LOCKED_WIDGET_THEMES: Record<string, IdealWidgetCandidate> = {
  // ☀️ Светлые темы (9) - WCAG 2.1 AA Compliant Contrast (min 4.5:1 ratio)
  default: {
    id: 'default_2',
    name: 'Небесный (Ультра матовое белое стекло)',
    bgGradient: 'linear-gradient(135deg, #FFFFFF 0%, rgba(238, 245, 255, 0.9) 100%)',
    borderColor: 'rgba(59, 130, 246, 0.22)',
    textColor: '#0f172a',
    mutedTextColor: '#475569',
    accentColor: '#0284c7',
    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.08)',
  },
  pebble: {
    id: 'pebble_3',
    name: 'Галька (Контрастный мятный отблеск)',
    bgGradient: 'linear-gradient(135deg, rgba(209, 250, 229, 0.85) 0%, #FFFFFF 100%)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    textColor: '#064e3b',
    mutedTextColor: '#047857',
    accentColor: '#047857',
    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.12)',
  },
  pearl: {
    id: 'pearl_2',
    name: 'Жемчужный (Чистый нейтральный белый Apple)',
    bgGradient: '#FFFFFF',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    textColor: '#0f172a',
    mutedTextColor: '#475569',
    accentColor: '#111827',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
  },
  light_today: {
    id: 'light_today_1',
    name: 'Чистый нейтрал (Белая карточка + Серый бордер)',
    bgGradient: '#FFFFFF',
    borderColor: '#D1D5DB',
    textColor: '#111827',
    mutedTextColor: '#4b5563',
    accentColor: '#1F1F1F',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
  },
  sunshine: {
    id: 'sunshine_3',
    name: 'Солнечный (Белый + Золотой контур)',
    bgGradient: '#FFFFFF',
    borderColor: 'rgba(245, 158, 11, 0.35)',
    textColor: '#1e293b',
    mutedTextColor: '#475569',
    accentColor: '#b45309',
    boxShadow: '0 4px 16px rgba(245, 158, 11, 0.1)',
  },
  spring: {
    id: 'spring_3',
    name: 'Весенний мятный (Сплошной изумрудный плакат)',
    bgGradient: '#059669',
    borderColor: '#059669',
    textColor: '#ffffff',
    mutedTextColor: 'rgba(255, 255, 255, 0.95)',
    accentColor: '#ffffff',
    boxShadow: '0 6px 20px rgba(5, 150, 105, 0.25)',
    isSolid: true,
  },
  peach: {
    id: 'peach_3',
    name: 'Персиковый (Белый + Коралловый контур)',
    bgGradient: '#FFFFFF',
    borderColor: 'rgba(244, 63, 94, 0.35)',
    textColor: '#4c0519',
    mutedTextColor: '#475569',
    accentColor: '#be123c',
    boxShadow: '0 4px 16px rgba(244, 63, 94, 0.1)',
  },
  turquoise: {
    id: 'turquoise_3',
    name: 'Бирюзовый (Сплошной лазурный плакат)',
    bgGradient: '#0891b2',
    borderColor: '#0891b2',
    textColor: '#ffffff',
    mutedTextColor: 'rgba(255, 255, 255, 0.95)',
    accentColor: '#ffffff',
    boxShadow: '0 6px 20px rgba(8, 145, 178, 0.25)',
    isSolid: true,
  },
  winter: {
    id: 'winter_3',
    name: 'Зимний морозный (Сплошной небесный плакат)',
    bgGradient: '#0284c7',
    borderColor: '#0284c7',
    textColor: '#ffffff',
    mutedTextColor: 'rgba(255, 255, 255, 0.95)',
    accentColor: '#ffffff',
    boxShadow: '0 6px 20px rgba(2, 132, 199, 0.25)',
    isSolid: true,
  },

  // 🌙 Тёмные темы (5)
  dark_today: {
    id: 'dark_today_1',
    name: 'Темный графит (Премиум матовый графит)',
    bgGradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, #2A2A2A 100%)',
    borderColor: '#3D3D3D',
    textColor: '#ffffff',
    mutedTextColor: '#cbd5e1',
    accentColor: '#38bdf8',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  },
  oled_black: {
    id: 'oled_black_1',
    name: 'Глубокий OLED (Угольный премиум остров #1C1C1E)',
    bgGradient: 'linear-gradient(135deg, #1C1C1E 0%, #121214 100%)',
    borderColor: '#3A3A3C',
    textColor: '#ffffff',
    mutedTextColor: '#98989D',
    accentColor: '#38bdf8',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
  },
  midnight_blue: {
    id: 'midnight_blue_1',
    name: 'Полуночный синий (Полуночное синее стекло)',
    bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.22) 0%, #232736 100%)',
    borderColor: '#353B52',
    textColor: '#ffffff',
    mutedTextColor: '#94a3b8',
    accentColor: '#60a5fa',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
  },
  midnight_neon: {
    id: 'midnight_neon_3',
    name: 'Неоновая ночь (Неоновая стеклянная капсула)',
    bgGradient: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'var(--color-accent)',
    textColor: '#ffffff',
    mutedTextColor: '#cbd5e1',
    accentColor: 'var(--color-accent)',
    boxShadow: '0 0 16px var(--color-accent-light)',
  },
  cyber_purple: {
    id: 'cyber_purple_1',
    name: 'Кибер фиолетовый (Лавандовый кибер дым)',
    bgGradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.22) 0%, #242130 100%)',
    borderColor: '#3D3850',
    textColor: '#ffffff',
    mutedTextColor: '#cbd5e1',
    accentColor: '#c084fc',
    boxShadow: '0 4px 20px rgba(168, 85, 247, 0.2)',
  },
};

export const applyIdealWidgetCandidate = (themeId: string) => {
  if (typeof window === 'undefined') return;
  const config = LOCKED_WIDGET_THEMES[themeId] || LOCKED_WIDGET_THEMES['dark_today'];
  const root = document.documentElement;

  root.style.setProperty('--widget-custom-bg', config.bgGradient);
  root.style.setProperty('--widget-custom-border', config.borderColor);
  root.style.setProperty('--widget-custom-text', config.textColor);
  root.style.setProperty('--widget-custom-muted-text', config.mutedTextColor);
  root.style.setProperty('--widget-custom-accent', config.accentColor);
  root.style.setProperty('--widget-custom-shadow', config.boxShadow || '0 4px 16px rgba(0, 0, 0, 0.15)');
};
