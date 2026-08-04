'use client';

import { create } from 'zustand';
import { APP_THEME_PRESETS, applyAppThemePreset } from '@/shared/config/appThemes';
import { applyAccentColorVars } from '@/shared/lib/colorUtils';
import { applyTaskCardStyle } from '@/shared/config/cardStyles';
import { STORAGE_KEYS } from '@/shared/config/storageKeys';

type Theme = 'dark' | 'light';

interface ThemeState {
  theme: Theme;
  activePresetId: string;
  initTheme: () => void;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setPresetTheme: (presetId: string) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'dark',
  activePresetId: 'dark_today',
  initTheme: () => {
    if (typeof window !== 'undefined') {
      const savedPresetId = localStorage.getItem('app-preset-theme-id') || 'dark_today';
      const savedTheme = (localStorage.getItem('app-theme') as Theme) || 'dark';
      const savedAccentColor = localStorage.getItem(STORAGE_KEYS.ACCENT_COLOR) || '#6366f1';
      const savedCardStyleId = localStorage.getItem('user-card-style-id');

      set({ theme: savedTheme, activePresetId: savedPresetId });
      applyAppThemePreset(savedPresetId);
      applyAccentColorVars(savedAccentColor);

      if (savedCardStyleId) {
        applyTaskCardStyle(savedCardStyleId);
      }
    }
  },
  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    get().setTheme(nextTheme);
  },
  setTheme: (theme: Theme) => {
    set({ theme });
    if (typeof window !== 'undefined') {
      const defaultForCategory = theme === 'dark' ? 'dark_today' : 'default';
      set({ activePresetId: defaultForCategory });
      applyAppThemePreset(defaultForCategory);
    }
  },
  setPresetTheme: (presetId: string) => {
    const preset = APP_THEME_PRESETS.find((t) => t.id === presetId);
    const category = preset ? preset.category : 'dark';
    set({ activePresetId: presetId, theme: category });
    applyAppThemePreset(presetId);
  },
}));
