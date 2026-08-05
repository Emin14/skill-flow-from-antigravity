'use client';

import { create } from 'zustand';
import { APP_THEME_PRESETS, applyAppThemePreset } from '@/shared/config/appThemes';
import { applyAccentColorVars } from '@/shared/lib/colorUtils';
import { applyTaskCardStyle } from '@/shared/config/cardStyles';
import { STORAGE_KEYS } from '@/shared/config/storageKeys';

type Theme = 'dark' | 'light';

interface ThemeState {
  theme: Theme;
  activeLightPresetId: string;
  activeDarkPresetId: string;
  initTheme: () => void;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setPresetTheme: (presetId: string) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'dark',
  activeLightPresetId: 'default',
  activeDarkPresetId: 'dark_today',
  initTheme: () => {
    if (typeof window !== 'undefined') {
      const savedTheme = (localStorage.getItem('app-theme') as Theme) || 'dark';
      const savedLightPreset = localStorage.getItem('app-light-preset-id') || 'default';
      const savedDarkPreset = localStorage.getItem('app-dark-preset-id') || 'dark_today';
      const savedAccentColor = localStorage.getItem(STORAGE_KEYS.ACCENT_COLOR) || '#6366f1';
      const savedCardStyleId = localStorage.getItem('user-card-style-id');

      set({
        theme: savedTheme,
        activeLightPresetId: savedLightPreset,
        activeDarkPresetId: savedDarkPreset,
      });

      const activePresetToApply = savedTheme === 'light' ? savedLightPreset : savedDarkPreset;
      applyAppThemePreset(activePresetToApply);
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
      const targetPresetId = theme === 'light' ? get().activeLightPresetId : get().activeDarkPresetId;
      applyAppThemePreset(targetPresetId);
    }
  },
  setPresetTheme: (presetId: string) => {
    const preset = APP_THEME_PRESETS.find((t) => t.id === presetId);
    const category = preset ? preset.category : 'dark';

    if (category === 'light') {
      set({ activeLightPresetId: presetId });
      localStorage.setItem('app-light-preset-id', presetId);
    } else {
      set({ activeDarkPresetId: presetId });
      localStorage.setItem('app-dark-preset-id', presetId);
    }

    // Only apply theme styling to the document if the current app theme matches this category
    if (get().theme === category) {
      applyAppThemePreset(presetId);
    }
  },
}));
