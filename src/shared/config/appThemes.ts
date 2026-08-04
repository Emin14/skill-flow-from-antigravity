'use client';

export interface AppThemePreset {
  id: string;
  name: string;
  category: 'light' | 'dark';
  bgColor: string;
  cardBgColor: string;
  cardBorder: string;
  textColor: string;
  accentColor: string;
  previewEmoji: string;
}

export const APP_THEME_PRESETS: AppThemePreset[] = [
  // ☀️ Light Themes (14)
  {
    id: 'default',
    name: 'Default',
    category: 'light',
    bgColor: '#EEF5FF',
    cardBgColor: '#FFFFFF',
    cardBorder: 'rgba(59, 130, 246, 0.15)',
    textColor: '#0f172a',
    accentColor: '#3b82f6',
    previewEmoji: '☀️',
  },
  {
    id: 'pebble',
    name: 'Pebble',
    category: 'light',
    bgColor: '#F2F4F7',
    cardBgColor: '#FFFFFF',
    cardBorder: 'rgba(0, 0, 0, 0.08)',
    textColor: '#1e293b',
    accentColor: '#475569',
    previewEmoji: '🪨',
  },
  {
    id: 'pearl',
    name: 'Pearl',
    category: 'light',
    bgColor: '#F5F5F7',
    cardBgColor: '#FFFFFF',
    cardBorder: 'rgba(0, 0, 0, 0.06)',
    textColor: '#0f172a',
    accentColor: '#6366f1',
    previewEmoji: '🦪',
  },
  {
    id: 'light_today',
    name: 'Light / Сегодня',
    category: 'light',
    bgColor: '#FAFAFA',
    cardBgColor: '#FFFFFF',
    cardBorder: '#EFEFEF',
    textColor: '#18181b',
    accentColor: '#ef4444',
    previewEmoji: '🔴',
  },
  {
    id: 'sunshine',
    name: 'Sunshine',
    category: 'light',
    bgColor: '#FFFDF0',
    cardBgColor: '#FFFFFF',
    cardBorder: 'rgba(245, 158, 11, 0.15)',
    textColor: '#1e293b',
    accentColor: '#f59e0b',
    previewEmoji: '☀️',
  },
  {
    id: 'spring',
    name: 'Spring 👑',
    category: 'light',
    bgColor: '#E8F6DD',
    cardBgColor: '#FFFFFF',
    cardBorder: 'rgba(16, 185, 129, 0.15)',
    textColor: '#064e3b',
    accentColor: '#10b981',
    previewEmoji: '🌱',
  },
  {
    id: 'summer',
    name: 'Summer 👑',
    category: 'light',
    bgColor: '#D6F3F9',
    cardBgColor: '#FFFFFF',
    cardBorder: 'rgba(14, 165, 233, 0.15)',
    textColor: '#0c4a6e',
    accentColor: '#0ea5e9',
    previewEmoji: '🏖️',
  },
  {
    id: 'peach',
    name: 'Peach',
    category: 'light',
    bgColor: '#FFF4F2',
    cardBgColor: '#FFFFFF',
    cardBorder: 'rgba(244, 63, 94, 0.15)',
    textColor: '#4c0519',
    accentColor: '#f43f5e',
    previewEmoji: '🍑',
  },
  {
    id: 'turquoise',
    name: 'Turquoise',
    category: 'light',
    bgColor: '#F0FAF8',
    cardBgColor: '#FFFFFF',
    cardBorder: 'rgba(20, 184, 166, 0.15)',
    textColor: '#042f2e',
    accentColor: '#14b8a6',
    previewEmoji: '💎',
  },
  {
    id: 'matcha',
    name: 'Matcha',
    category: 'light',
    bgColor: '#F5F7EF',
    cardBgColor: '#FFFFFF',
    cardBorder: 'rgba(132, 204, 22, 0.15)',
    textColor: '#1a2e05',
    accentColor: '#84cc16',
    previewEmoji: '🍵',
  },
  {
    id: 'winter',
    name: 'Winter 👑',
    category: 'light',
    bgColor: '#E4EFFD',
    cardBgColor: '#FFFFFF',
    cardBorder: 'rgba(56, 189, 248, 0.18)',
    textColor: '#0f172a',
    accentColor: '#0284c7',
    previewEmoji: '❄️',
  },
  {
    id: 'teal',
    name: 'Teal',
    category: 'light',
    bgColor: '#EBF8FA',
    cardBgColor: '#FFFFFF',
    cardBorder: 'rgba(6, 182, 212, 0.15)',
    textColor: '#083344',
    accentColor: '#06b6d4',
    previewEmoji: '🌊',
  },
  {
    id: 'cyan_aqua',
    name: 'Cyan Light / Aqua',
    category: 'light',
    bgColor: '#EEFAFC',
    cardBgColor: '#FFFFFF',
    cardBorder: 'rgba(71, 184, 196, 0.2)',
    textColor: '#083344',
    accentColor: '#47b8c4',
    previewEmoji: '💧',
  },
  {
    id: 'sky_icloud',
    name: 'Sky Blue (iCloud)',
    category: 'light',
    bgColor: '#EFF5FC',
    cardBgColor: '#FFFFFF',
    cardBorder: 'rgba(56, 165, 248, 0.18)',
    textColor: '#0f172a',
    accentColor: '#38a5f8',
    previewEmoji: '☁️',
  },

  // 🌙 Dark Themes (6)
  {
    id: 'dark_today',
    name: 'Dark / Сегодня',
    category: 'dark',
    bgColor: '#1F1F1F',
    cardBgColor: '#2A2A2A',
    cardBorder: '#353535',
    textColor: '#f8fafc',
    accentColor: '#38bdf8',
    previewEmoji: '🌙',
  },
  {
    id: 'oled_black',
    name: 'Темный (OLED)',
    category: 'dark',
    bgColor: '#000000',
    cardBgColor: '#1C1C1E',
    cardBorder: '#2C2C2E',
    textColor: '#ffffff',
    accentColor: '#38bdf8',
    previewEmoji: '🖤',
  },
  {
    id: 'dark_amber',
    name: 'Dark Amber / Orange',
    category: 'dark',
    bgColor: '#000000',
    cardBgColor: '#1C1C1E',
    cardBorder: '#2C2C2E',
    textColor: '#ffffff',
    accentColor: '#ff6b00',
    previewEmoji: '🟧',
  },
  {
    id: 'dark_emerald',
    name: 'Dark Emerald',
    category: 'dark',
    bgColor: '#121414',
    cardBgColor: '#1E2222',
    cardBorder: '#242828',
    textColor: '#f1f5f9',
    accentColor: '#10b981',
    previewEmoji: '🟩',
  },
  {
    id: 'midnight_blue',
    name: 'Midnight Blue',
    category: 'dark',
    bgColor: '#1B1E28',
    cardBgColor: '#232736',
    cardBorder: '#2D3245',
    textColor: '#f8fafc',
    accentColor: '#6366f1',
    previewEmoji: '🌌',
  },
  {
    id: 'midnight_neon',
    name: 'Midnight Neon',
    category: 'dark',
    bgColor: '#181A24',
    cardBgColor: '#202434',
    cardBorder: '#2A3045',
    textColor: '#f8fafc',
    accentColor: '#30b5ff',
    previewEmoji: '🔮',
  },
];

export const applyAppThemePreset = (themeId: string) => {
  if (typeof window === 'undefined') return;
  const preset = APP_THEME_PRESETS.find((t) => t.id === themeId) || APP_THEME_PRESETS.find((t) => t.id === 'dark_today') || APP_THEME_PRESETS[0];
  const root = document.documentElement;

  root.style.setProperty('--color-bg', preset.bgColor);
  root.style.setProperty('--color-surface', preset.cardBgColor);
  root.style.setProperty('--color-border', preset.cardBorder);
  root.style.setProperty('--color-text-primary', preset.textColor);
  root.style.setProperty('--color-accent', preset.accentColor);

  root.setAttribute('data-theme', preset.category);
  localStorage.setItem('app-preset-theme-id', preset.id);
  localStorage.setItem('app-theme', preset.category);
};
