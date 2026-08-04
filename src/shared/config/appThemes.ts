import { applyIdealWidgetCandidate } from '@/shared/config/idealWidgetThemes';

export interface AppThemePreset {
  id: string;
  name: string;
  category: 'light' | 'dark';
  bgColor: string;     // Общий фон приложения
  cardBgColor: string; // Фон карточки задач
  cardBorder: string;  // Контур карточки
  textColor: string;   // Основной цвет текста
  previewEmoji: string;
}

export const APP_THEME_PRESETS: AppThemePreset[] = [
  // ☀️ Светлые темы (9 вариантов)
  { id: 'default', name: 'Небесный (Default)', category: 'light', bgColor: '#EEF5FF', cardBgColor: '#FFFFFF', cardBorder: 'rgba(59, 130, 246, 0.12)', textColor: '#0f172a', previewEmoji: '☀️' },
  { id: 'pebble', name: 'Галька (Pebble)', category: 'light', bgColor: '#F2F4F7', cardBgColor: '#FFFFFF', cardBorder: 'rgba(0, 0, 0, 0.08)', textColor: '#1e293b', previewEmoji: '🪨' },
  { id: 'pearl', name: 'Жемчужный (Pearl)', category: 'light', bgColor: '#F5F5F7', cardBgColor: '#FFFFFF', cardBorder: 'rgba(0, 0, 0, 0.06)', textColor: '#0f172a', previewEmoji: '🦪' },
  { id: 'light_today', name: 'Чистый нейтрал', category: 'light', bgColor: '#FAFAFA', cardBgColor: '#FFFFFF', cardBorder: '#EFEFEF', textColor: '#18181b', previewEmoji: '⚪' },
  { id: 'sunshine', name: 'Солнечный', category: 'light', bgColor: '#FFFDF0', cardBgColor: '#FFFFFF', cardBorder: 'rgba(245, 158, 11, 0.15)', textColor: '#1e293b', previewEmoji: '☀️' },
  { id: 'spring', name: 'Весенний мятный', category: 'light', bgColor: '#E8F6DD', cardBgColor: '#FFFFFF', cardBorder: 'rgba(16, 185, 129, 0.15)', textColor: '#064e3b', previewEmoji: '🌱' },
  { id: 'peach', name: 'Персиковый', category: 'light', bgColor: '#FFF4F2', cardBgColor: '#FFFFFF', cardBorder: 'rgba(244, 63, 94, 0.15)', textColor: '#4c0519', previewEmoji: '🍑' },
  { id: 'turquoise', name: 'Бирюзовый', category: 'light', bgColor: '#F0FAF8', cardBgColor: '#FFFFFF', cardBorder: 'rgba(20, 184, 166, 0.15)', textColor: '#042f2e', previewEmoji: '💎' },
  { id: 'winter', name: 'Зимний морозный', category: 'light', bgColor: '#E4EFFD', cardBgColor: '#FFFFFF', cardBorder: 'rgba(56, 189, 248, 0.18)', textColor: '#0f172a', previewEmoji: '❄️' },

  // 🌙 Тёмные темы (5 вариантов)
  { id: 'dark_today', name: 'Темный графит (#1F1F1F)', category: 'dark', bgColor: '#1F1F1F', cardBgColor: '#2A2A2A', cardBorder: '#353535', textColor: '#f8fafc', previewEmoji: '🌙' },
  { id: 'oled_black', name: 'Глубокий OLED (#000000)', category: 'dark', bgColor: '#000000', cardBgColor: '#1C1C1E', cardBorder: '#2C2C2E', textColor: '#ffffff', previewEmoji: '🖤' },
  { id: 'midnight_blue', name: 'Полуночный синий (#1B1E28)', category: 'dark', bgColor: '#1B1E28', cardBgColor: '#232736', cardBorder: '#2D3245', textColor: '#f8fafc', previewEmoji: '🌌' },
  { id: 'midnight_neon', name: 'Неоновая ночь (#181A24)', category: 'dark', bgColor: '#181A24', cardBgColor: '#202434', cardBorder: '#2A3045', textColor: '#f8fafc', previewEmoji: '🔮' },
  { id: 'cyber_purple', name: 'Кибер фиолетовый (#1A1822)', category: 'dark', bgColor: '#1A1822', cardBgColor: '#242130', cardBorder: '#322E42', textColor: '#f8fafc', previewEmoji: '🔮' },
];

export const applyAppThemePreset = (themeId: string) => {
  if (typeof window === 'undefined') return;
  const preset = APP_THEME_PRESETS.find((t) => t.id === themeId) || APP_THEME_PRESETS.find((t) => t.id === 'dark_today') || APP_THEME_PRESETS[0];
  const root = document.documentElement;

  // Изменение фона приложения
  root.style.setProperty('--color-bg', preset.bgColor);
  
  // Применяем сопутствующие стили если карточка не переопределена пользовательским стилем
  const savedCardStyle = localStorage.getItem('user-card-style-id');
  if (!savedCardStyle) {
    root.style.setProperty('--color-surface', preset.cardBgColor);
    root.style.setProperty('--color-border', preset.cardBorder);
    root.style.setProperty('--color-text-primary', preset.textColor);
  }

  root.setAttribute('data-theme', preset.category);
  localStorage.setItem('app-preset-theme-id', preset.id);
  localStorage.setItem('app-theme', preset.category);

  // Применение идеального варианта виджета под данную тему
  applyIdealWidgetCandidate(preset.id);
};
