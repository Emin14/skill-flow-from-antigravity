export interface DualAccentThemeOption {
  id: string;
  name: string;
  dark: {
    categoryColor: string;
    repeatColor: string;
  };
  light: {
    categoryColor: string;
    repeatColor: string;
  };
}

export interface CardBgThemeOption {
  id: string;
  name: string;
  dark: {
    bgGradient: string;
    borderColor: string;
  };
  light: {
    bgGradient: string;
    borderColor: string;
  };
}

// 1. Dual Accent Text Themes (Category + Repeat Tag) - WCAG 2.1 AA Compliant (min 4.5:1 contrast)
export const CATEGORY_TEXT_THEMES: DualAccentThemeOption[] = [
  {
    id: 'adaptive',
    name: '✨ Адаптивный к акценту (Синхронизирован с темой)',
    dark: { categoryColor: 'var(--color-accent-text)', repeatColor: 'var(--color-accent-text)' },
    light: { categoryColor: 'var(--color-accent-text)', repeatColor: 'var(--color-accent-text)' },
  },
  {
    id: 'amber',
    name: '🔥 Неоновый янтарь (По умолчанию)',
    dark: { categoryColor: '#fbbf24', repeatColor: '#38bdf8' },
    light: { categoryColor: '#b45309', repeatColor: '#0369a1' },
  },
  {
    id: 'ocean',
    name: '🌊 Морской океан (Бирюза + Изумруд)',
    dark: { categoryColor: '#38bdf8', repeatColor: '#34d399' },
    light: { categoryColor: '#0369a1', repeatColor: '#047857' },
  },
  {
    id: 'violet_gold',
    name: '🔮 Кибер магия (Фиолетовый + Золото)',
    dark: { categoryColor: '#c084fc', repeatColor: '#fbbf24' },
    light: { categoryColor: '#6d28d9', repeatColor: '#b45309' },
  },
  {
    id: 'emerald_rose',
    name: '🌿 Мятная роза (Изумруд + Коралл)',
    dark: { categoryColor: '#34d399', repeatColor: '#fb7185' },
    light: { categoryColor: '#047857', repeatColor: '#be123c' },
  },
  {
    id: 'sunset_blue',
    name: '🌅 Закатный триумф (Оранжевый + Голубой)',
    dark: { categoryColor: '#fb923c', repeatColor: '#38bdf8' },
    light: { categoryColor: '#c2410c', repeatColor: '#0369a1' },
  },
  {
    id: 'rose_lime',
    name: '🌸 Кибер сакура (Роза + Лайм)',
    dark: { categoryColor: '#fb7185', repeatColor: '#a3e635' },
    light: { categoryColor: '#be123c', repeatColor: '#4d7c0f' },
  },
  {
    id: 'lime_violet',
    name: '🍋 Лаймовый импульс (Лайм + Фиолетовый)',
    dark: { categoryColor: '#a3e635', repeatColor: '#c084fc' },
    light: { categoryColor: '#4d7c0f', repeatColor: '#6d28d9' },
  },
  {
    id: 'indigo_amber',
    name: '🔮 Индиго и Золото (Индиго + Янтарь)',
    dark: { categoryColor: '#818cf8', repeatColor: '#fbbf24' },
    light: { categoryColor: '#4338ca', repeatColor: '#b45309' },
  },
  {
    id: 'bronze_teal',
    name: '👑 Теплая бронза (Бронза + Бирюза)',
    dark: { categoryColor: '#fbbf24', repeatColor: '#2dd4bf' },
    light: { categoryColor: '#b45309', repeatColor: '#0f766e' },
  },
  {
    id: 'platinum_cyan',
    name: '🤍 Платиновый шторм (Серебро + Неон)',
    dark: { categoryColor: '#f8fafc', repeatColor: '#38bdf8' },
    light: { categoryColor: '#0f172a', repeatColor: '#0369a1' },
  },
];

// 2. Card Background Themes (10 Options)
export const CARD_BG_THEMES: CardBgThemeOption[] = [
  {
    id: 'classic',
    name: '✨ Классическое стекло (По умолчанию)',
    dark: {
      bgGradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    light: {
      bgGradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(243, 244, 246, 0.85) 100%)',
      borderColor: 'rgba(0, 0, 0, 0.08)',
    },
  },
  {
    id: 'midnight',
    name: '🌌 Полуночный край',
    dark: {
      bgGradient: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
      borderColor: 'rgba(99, 102, 241, 0.25)',
    },
    light: {
      bgGradient: 'linear-gradient(135deg, rgba(238, 242, 255, 0.85) 0%, rgba(255, 255, 255, 0.95) 100%)',
      borderColor: 'rgba(99, 102, 241, 0.25)',
    },
  },
  {
    id: 'amber_glow',
    name: '🔥 Янтарный отблеск',
    dark: {
      bgGradient: 'linear-gradient(135deg, rgba(251, 191, 36, 0.08) 0%, rgba(20, 24, 40, 0.7) 100%)',
      borderColor: 'rgba(251, 191, 36, 0.25)',
    },
    light: {
      bgGradient: 'linear-gradient(135deg, rgba(254, 243, 199, 0.7) 0%, rgba(255, 255, 255, 0.95) 100%)',
      borderColor: 'rgba(217, 119, 6, 0.25)',
    },
  },
  {
    id: 'cyan_mist',
    name: '💧 Бирюзовый туман',
    dark: {
      bgGradient: 'linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(15, 23, 42, 0.7) 100%)',
      borderColor: 'rgba(56, 189, 248, 0.25)',
    },
    light: {
      bgGradient: 'linear-gradient(135deg, rgba(224, 242, 254, 0.7) 0%, rgba(255, 255, 255, 0.95) 100%)',
      borderColor: 'rgba(2, 132, 199, 0.25)',
    },
  },
  {
    id: 'mint_aura',
    name: '🌿 Мятная аура',
    dark: {
      bgGradient: 'linear-gradient(135deg, rgba(52, 211, 153, 0.08) 0%, rgba(20, 24, 40, 0.7) 100%)',
      borderColor: 'rgba(52, 211, 153, 0.25)',
    },
    light: {
      bgGradient: 'linear-gradient(135deg, rgba(209, 250, 229, 0.7) 0%, rgba(255, 255, 255, 0.95) 100%)',
      borderColor: 'rgba(5, 150, 105, 0.25)',
    },
  },
  {
    id: 'lavender_silk',
    name: '✨ Лавандовый шелк',
    dark: {
      bgGradient: 'linear-gradient(135deg, rgba(192, 132, 252, 0.08) 0%, rgba(20, 24, 40, 0.7) 100%)',
      borderColor: 'rgba(192, 132, 252, 0.25)',
    },
    light: {
      bgGradient: 'linear-gradient(135deg, rgba(237, 233, 254, 0.7) 0%, rgba(255, 255, 255, 0.95) 100%)',
      borderColor: 'rgba(124, 58, 237, 0.25)',
    },
  },
  {
    id: 'rose_touch',
    name: '🌸 Коралловое прикосновение',
    dark: {
      bgGradient: 'linear-gradient(135deg, rgba(251, 113, 133, 0.08) 0%, rgba(20, 24, 40, 0.7) 100%)',
      borderColor: 'rgba(251, 113, 133, 0.25)',
    },
    light: {
      bgGradient: 'linear-gradient(135deg, rgba(254, 226, 226, 0.7) 0%, rgba(255, 255, 255, 0.95) 100%)',
      borderColor: 'rgba(225, 29, 72, 0.25)',
    },
  },
  {
    id: 'indigo_depth',
    name: '🔮 Индиго глубина',
    dark: {
      bgGradient: 'linear-gradient(135deg, rgba(129, 140, 248, 0.08) 0%, rgba(15, 23, 42, 0.7) 100%)',
      borderColor: 'rgba(129, 140, 248, 0.25)',
    },
    light: {
      bgGradient: 'linear-gradient(135deg, rgba(224, 231, 255, 0.7) 0%, rgba(255, 255, 255, 0.95) 100%)',
      borderColor: 'rgba(67, 56, 202, 0.25)',
    },
  },
  {
    id: 'dark_monochrome',
    name: '👑 Тёмный монохром',
    dark: {
      bgGradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(0, 0, 0, 0.45) 100%)',
      borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    light: {
      bgGradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(241, 245, 249, 0.9) 100%)',
      borderColor: 'rgba(0, 0, 0, 0.12)',
    },
  },
  {
    id: 'ultra_frosted',
    name: '❄️ Ультра матовое стекло',
    dark: {
      bgGradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
      borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    light: {
      bgGradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.8) 100%)',
      borderColor: 'rgba(0, 0, 0, 0.05)',
    },
  },
];

export const applyCategoryTextTheme = (themeId: string) => {
  if (typeof document === 'undefined') return;
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const themeOpt = CATEGORY_TEXT_THEMES.find((t) => t.id === themeId) || CATEGORY_TEXT_THEMES[0];
  const modeData = isLight ? themeOpt.light : themeOpt.dark;

  document.documentElement.style.setProperty('--category-text-color', modeData.categoryColor);
  document.documentElement.style.setProperty('--repeat-tag-color', modeData.repeatColor);
};

export const applyCardBgTheme = (themeId: string) => {
  if (typeof document === 'undefined') return;
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const themeOpt = CARD_BG_THEMES.find((t) => t.id === themeId) || CARD_BG_THEMES[0];
  const modeData = isLight ? themeOpt.light : themeOpt.dark;

  document.documentElement.style.setProperty('--card-bg-gradient', modeData.bgGradient);
  document.documentElement.style.setProperty('--card-border-color', modeData.borderColor);
};

export const getCategoryColor = (cat?: string, isLightOverride?: boolean): string => {
  if (!cat || !cat.trim() || cat.trim() === 'Без категории') {
    return isLightOverride ? 'rgba(0, 0, 0, 0.45)' : 'rgba(255, 255, 255, 0.45)';
  }
  const isLight = isLightOverride !== undefined 
    ? isLightOverride 
    : (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'light');

  const normalized = cat.trim();
  switch (normalized) {
    case 'Задача':
    case 'Задачи': return isLight ? '#0284c7' : '#38bdf8';
    case 'Проект': return isLight ? '#7e22ce' : '#a855f7';
    case 'Работа': return isLight ? '#0369a1' : '#0ea5e9';
    case 'Здоровье': return isLight ? '#047857' : '#10b981';
    case 'Обучение': return isLight ? '#b45309' : '#f59e0b';
    case 'Личное': return isLight ? '#be123c' : '#ec4899';
    case 'Финансы': return isLight ? '#6d28d9' : '#8b5cf6';
    case 'Практика Frontend': return isLight ? '#0e7490' : '#06b6d4';
    case 'Опыт на камеру': return isLight ? '#7e22ce' : '#a855f7';
    case 'Теория': return isLight ? '#1d4ed8' : '#3b82f6';
    default: {
      let hash = 0;
      for (let i = 0; i < cat.length; i++) {
        hash = cat.charCodeAt(i) + ((hash << 5) - hash);
      }
      const hue = Math.abs(hash) % 360;
      const lightness = isLight ? 36 : 65;
      return `hsl(${hue}, 85%, ${lightness}%)`;
    }
  }
};

export const getCategoryEmojiDot = (catName?: string, colorHex?: string): string => {
  if (!catName || catName.trim() === 'Без категории') return '⚪';
  const color = (colorHex || getCategoryColor(catName)).toLowerCase();

  const hslMatch = color.match(/hsl\(\s*(\d+)/);
  if (hslMatch) {
    const hue = parseInt(hslMatch[1], 10);
    if (hue >= 340 || hue < 20) return '🔴';
    if (hue >= 20 && hue < 45) return '🟠';
    if (hue >= 45 && hue < 75) return '🟡';
    if (hue >= 75 && hue < 165) return '🟢';
    if (hue >= 165 && hue < 260) return '🔵';
    if (hue >= 260 && hue < 340) return '🟣';
  }

  if (color.includes('#38bdf8') || color.includes('#0ea5e9') || color.includes('#0284c7') || 
      color.includes('#0369a1') || color.includes('#3b82f6') || color.includes('#06b6d4') || 
      color.includes('#1d4ed8') || color.includes('#0e7490') || color.includes('#6366f1') || color.includes('#a5b4fc')) {
    return '🔵';
  }
  if (color.includes('#10b981') || color.includes('#047857') || color.includes('#34d399') || 
      color.includes('#059669')) {
    return '🟢';
  }
  if (color.includes('#a855f7') || color.includes('#7e22ce') || color.includes('#8b5cf6') || 
      color.includes('#6d28d9') || color.includes('#c084fc') || color.includes('#818cf8')) {
    return '🟣';
  }
  if (color.includes('#f59e0b') || color.includes('#b45309') || color.includes('#fbbf24') || 
      color.includes('#d97706')) {
    return '🟡';
  }
  if (color.includes('#ec4899') || color.includes('#be123c') || color.includes('#ef4444') || 
      color.includes('#fb7185') || color.includes('#f43f5e')) {
    return '🔴';
  }
  if (color.includes('#fb923c') || color.includes('#c2410c') || color.includes('#f97316')) {
    return '🟠';
  }
  return '🔵';
};
