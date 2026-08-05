'use client';

import React from 'react';
import { APP_THEME_PRESETS } from '@/shared/config/appThemes';
import { useThemeStore } from '@/shared/model/useThemeStore';

interface ThemeArchitectureSelectorProps {
  theme: 'dark' | 'light';
  selectedColor: string;
  onSelectPreset: (presetId: string) => void;
}

export const ThemeArchitectureSelector: React.FC<ThemeArchitectureSelectorProps> = ({
  theme,
  selectedColor,
  onSelectPreset,
}) => {
  const { activeLightPresetId, activeDarkPresetId, setPresetTheme } = useThemeStore();

  const lightPresets = APP_THEME_PRESETS.filter((p) => p.category === 'light');
  const darkPresets = APP_THEME_PRESETS.filter((p) => p.category === 'dark');

  const currentLightPreset = lightPresets.find((p) => p.id === activeLightPresetId) || lightPresets[0];
  const currentDarkPreset = darkPresets.find((p) => p.id === activeDarkPresetId) || darkPresets[0];

  const handleLightChange = (presetId: string) => {
    setPresetTheme(presetId);
    onSelectPreset(presetId);
  };

  const handleDarkChange = (presetId: string) => {
    setPresetTheme(presetId);
    onSelectPreset(presetId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '4px' }}>
      {/* ☀️ Светлая тема селектор */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>☀️ Светлая тема</span>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 400 }}>
            ({currentLightPreset.name})
          </span>
        </div>

        <div style={{ position: 'relative', width: '100%' }}>
          <select
            value={activeLightPresetId || 'default'}
            onChange={(e) => handleLightChange(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              paddingRight: '36px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-surface)',
              border: `1px solid ${theme === 'light' ? selectedColor : 'var(--color-border)'}`,
              color: 'var(--color-text-primary)',
              fontSize: '13.5px',
              fontWeight: 500,
              outline: 'none',
              cursor: 'pointer',
              appearance: 'none',
              WebkitAppearance: 'none',
              boxShadow: theme === 'light' ? `0 2px 10px ${selectedColor}20` : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            {lightPresets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.previewEmoji} {preset.name}
              </option>
            ))}
          </select>

          <span
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: 'var(--color-text-muted)',
              fontSize: '11px',
            }}
          >
            ▼
          </span>
        </div>
      </div>

      {/* 🌙 Тёмная тема селектор */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🌙 Тёмная тема</span>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 400 }}>
            ({currentDarkPreset.name})
          </span>
        </div>

        <div style={{ position: 'relative', width: '100%' }}>
          <select
            value={activeDarkPresetId || 'dark_today'}
            onChange={(e) => handleDarkChange(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              paddingRight: '36px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-surface)',
              border: `1px solid ${theme === 'dark' ? selectedColor : 'var(--color-border)'}`,
              color: 'var(--color-text-primary)',
              fontSize: '13.5px',
              fontWeight: 500,
              outline: 'none',
              cursor: 'pointer',
              appearance: 'none',
              WebkitAppearance: 'none',
              boxShadow: theme === 'dark' ? `0 2px 10px ${selectedColor}20` : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            {darkPresets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.previewEmoji} {preset.name}
              </option>
            ))}
          </select>

          <span
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: 'var(--color-text-muted)',
              fontSize: '11px',
            }}
          >
            ▼
          </span>
        </div>
      </div>
    </div>
  );
};
