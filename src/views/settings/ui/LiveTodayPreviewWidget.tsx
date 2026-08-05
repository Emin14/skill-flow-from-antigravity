'use client';

import React from 'react';
import { APP_THEME_PRESETS } from '@/shared/config/appThemes';
import { useThemeStore } from '@/shared/model/useThemeStore';

interface LiveTodayPreviewWidgetProps {
  theme: 'dark' | 'light';
  selectedColor: string;
  selectedCategoryThemeId: string;
  selectedCardBgThemeId: string;
  bannerVariant: string;
  daySwitcherVariant: string;
  previewPresetId?: string | null;
}

export const LiveTodayPreviewWidget: React.FC<LiveTodayPreviewWidgetProps> = ({
  theme: propsTheme,
  selectedColor,
  selectedCategoryThemeId,
  selectedCardBgThemeId,
  bannerVariant,
  daySwitcherVariant,
  previewPresetId,
}) => {
  const { theme: storeTheme, activeLightPresetId, activeDarkPresetId } = useThemeStore();

  const currentThemeMode = storeTheme || propsTheme;
  const effectivePresetId = previewPresetId || (currentThemeMode === 'light' ? activeLightPresetId : activeDarkPresetId);
  const currentPreset = APP_THEME_PRESETS.find((p) => p.id === effectivePresetId) || APP_THEME_PRESETS[0];

  const isLightPreset = currentPreset.category === 'light';
  const previewBg = currentPreset.bgColor;
  const previewCardBg = currentPreset.cardBgColor;
  const previewCardBorder = currentPreset.cardBorder;
  const previewTextPrimary = currentPreset.textColor;
  const previewTextMuted = isLightPreset ? '#64748b' : '#94a3b8';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {/* Minimalist Top Preview Label */}
      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', paddingLeft: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>👁️ Предпросмотр оформления («Сегодня»)</span>
      </div>

      {/* Single Clean Live Preview Block */}
      <div
        style={{
          position: 'relative',
          borderRadius: '20px',
          padding: '18px',
          paddingBottom: '56px',
          backgroundColor: previewBg,
          border: `1px solid ${previewCardBorder}`,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          transition: 'all 0.3s ease',
          userSelect: 'none',
          overflow: 'hidden',
        }}
      >
        {/* Top Bar Preview */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: previewTextPrimary }}>
              Сегодня
            </div>
            <div style={{ fontSize: '11px', color: previewTextMuted, fontWeight: 500 }}>среда, 5 августа</div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <span
              style={{
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '14px',
                backgroundColor: selectedColor,
                color: '#ffffff',
                fontWeight: 700,
                boxShadow: `0 2px 8px ${selectedColor}50`,
              }}
            >
              Все (4)
            </span>
            <span
              style={{
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '14px',
                backgroundColor: previewCardBg,
                color: previewTextMuted,
                border: `1px solid ${previewCardBorder}`,
                fontWeight: 600,
              }}
            >
              Задачи
            </span>
          </div>
        </div>

        {/* Day Switcher Widget Preview */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            borderRadius: '12px',
            backgroundColor: previewCardBg,
            border: `1px solid ${previewCardBorder}`,
          }}
        >
          {['Пн 3', 'Вт 4', 'Ср 5', 'Чт 6', 'Пт 7', 'Сб 8', 'Вс 9'].map((day, idx) => {
            const isActive = idx === 2;
            return (
              <div
                key={day}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '4px 8px',
                  borderRadius: '10px',
                  backgroundColor: isActive ? selectedColor : 'transparent',
                  color: isActive ? '#ffffff' : previewTextMuted,
                  fontSize: '11px',
                  fontWeight: isActive ? 700 : 500,
                  boxShadow: isActive ? `0 2px 8px ${selectedColor}60` : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{day.split(' ')[0]}</span>
                <span style={{ fontSize: '12px', fontWeight: 800 }}>{day.split(' ')[1]}</span>
              </div>
            );
          })}
        </div>

        {/* Habit Progress Banner Preview */}
        <div
          style={{
            padding: '10px 14px',
            borderRadius: '12px',
            backgroundColor: previewCardBg,
            border: `1px solid ${previewCardBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: previewTextPrimary }}>
              🔥 Прогресс дня: 3 из 4 выполнено
            </div>
            <div style={{ fontSize: '10px', color: previewTextMuted, marginTop: '2px' }}>
              Отличный темп выполнения
            </div>
          </div>

          <div
            style={{
              width: '80px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: previewCardBorder,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '75%',
                height: '100%',
                backgroundColor: selectedColor,
                borderRadius: '4px',
                boxShadow: `0 0 8px ${selectedColor}`,
              }}
            />
          </div>
        </div>

        {/* Task Cards Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
          {/* Card 1: Completed */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '12px',
              backgroundColor: previewCardBg,
              border: `1px solid ${previewCardBorder}`,
              opacity: 0.85,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 'bold',
                }}
              >
                ✓
              </div>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: previewTextMuted,
                  textDecoration: 'line-through',
                }}
              >
                Подготовить презентацию для команды
              </span>
            </div>

            <span
              style={{
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '6px',
                backgroundColor: `${selectedColor}20`,
                color: selectedColor,
                border: `1px solid ${selectedColor}40`,
                fontWeight: 600,
              }}
            >
              📁 Проект
            </span>
          </div>

          {/* Card 2: Active */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '12px',
              backgroundColor: previewCardBg,
              border: `1.5px solid ${selectedColor}`,
              boxShadow: `0 4px 14px ${selectedColor}20`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: `2px solid ${selectedColor}`,
                  backgroundColor: 'transparent',
                }}
              />
              <span style={{ fontSize: '13px', fontWeight: 700, color: previewTextPrimary }}>
                Провести ревью архитектуры приложения
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: '#ef4444',
                  fontWeight: 700,
                }}
              >
                🔴 P1
              </span>
              <span style={{ fontSize: '11px', color: previewTextMuted }}>🕒 16:00</span>
            </div>
          </div>
        </div>

        {/* ➕ Mock Floating Add Button (+) */}
        <div
          style={{
            position: 'absolute',
            right: '14px',
            bottom: '14px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: selectedColor,
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            fontWeight: '300',
            boxShadow: `0 4px 14px ${selectedColor}70`,
            zIndex: 5,
            cursor: 'default',
          }}
        >
          +
        </div>
      </div>
    </div>
  );
};
