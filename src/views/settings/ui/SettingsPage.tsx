'use client';

import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, useToastStore } from '@/shared/ui';
import styles from './SettingsPage.module.css';
import { APP_THEME_PRESETS } from '@/shared/config/appThemes';
import { useThemeStore } from '@/shared/model/useThemeStore';
import { STORAGE_KEYS } from '@/shared/config/storageKeys';
import { applyAccentColorVars } from '@/shared/lib/colorUtils';

import { LiveTodayPreviewWidget } from './LiveTodayPreviewWidget';
import { ThemeArchitectureSelector } from './ThemeArchitectureSelector';

const colorPalettes = [
  { name: 'Индиго (Aura)', hex: '#6366f1' },
  { name: 'Сапфировый (Default / Sky Blue)', hex: '#3b82f6' },
  { name: 'Небесно-голубой (iCloud)', hex: '#38a5f8' },
  { name: 'Бирюзовый (Aqua / Cyan)', hex: '#47b8c4' },
  { name: 'Изумрудный (Dark Emerald)', hex: '#10b981' },
  { name: 'Салатовый (Spring)', hex: '#84cc16' },
  { name: 'Солнечно-янтарный (Sunshine)', hex: '#f59e0b' },
  { name: 'Розово-персиковый (Peach)', hex: '#f43f5e' },
];

export const SettingsPage: React.FC = () => {
  const showToast = useToastStore((s) => s.showToast);
  const { theme, setTheme: setStoreTheme } = useThemeStore();

  const [previewPresetId, setPreviewPresetId] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState('#6366f1');
  const [bannerVariant, setBannerVariant] = useState('1');
  const [daySwitcherVariant, setDaySwitcherVariant] = useState('12');
  const [firstDayOfWeek, setFirstDayOfWeek] = useState<'Monday' | 'Sunday'>('Monday');
  const [dateFormat, setDateFormat] = useState<'DD.MM.YYYY' | 'YYYY-MM-DD'>('DD.MM.YYYY');

  useEffect(() => {
    const savedColor = localStorage.getItem(STORAGE_KEYS.ACCENT_COLOR) || '#6366f1';
    const savedBannerVar = localStorage.getItem(STORAGE_KEYS.HABIT_BANNER_VARIANT) || '1';
    const savedDaySwitcherVar = localStorage.getItem(STORAGE_KEYS.DAY_SWITCHER_VARIANT) || '12';

    setSelectedColor(savedColor);
    applyAccentColorVars(savedColor);
    setBannerVariant(savedBannerVar);
    setDaySwitcherVariant(savedDaySwitcherVar);
  }, []);

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setStoreTheme(newTheme);
    const { activeLightPresetId, activeDarkPresetId } = useThemeStore.getState();
    setPreviewPresetId(newTheme === 'light' ? activeLightPresetId : activeDarkPresetId);
  };

  const handleColorChange = (hex: string) => {
    setSelectedColor(hex);
    localStorage.setItem(STORAGE_KEYS.ACCENT_COLOR, hex);
    applyAccentColorVars(hex);
  };

  const handleBannerVariantChange = (varId: string) => {
    setBannerVariant(varId);
    localStorage.setItem(STORAGE_KEYS.HABIT_BANNER_VARIANT, varId);
    window.dispatchEvent(new Event('storage'));
  };

  const handleDaySwitcherVariantChange = (varId: string) => {
    setDaySwitcherVariant(varId);
    localStorage.setItem(STORAGE_KEYS.DAY_SWITCHER_VARIANT, varId);
    window.dispatchEvent(new Event('storage'));
  };

  // Export JSON Backup
  const handleExportData = () => {
    const backupData: Record<string, unknown> = {};
    const keys = [
      STORAGE_KEYS.GOALS,
      STORAGE_KEYS.TOPICS,
      STORAGE_KEYS.TASKS,
      STORAGE_KEYS.MATERIALS,
      STORAGE_KEYS.REPEAT_CARDS,
      STORAGE_KEYS.INBOX,
      STORAGE_KEYS.ACTIVITY_LOG,
    ];

    keys.forEach((key) => {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          backupData[key] = JSON.parse(item);
        } catch {
          backupData[key] = item;
        }
      }
    });

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `skillflow_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Экспорт бэкапа завершен успешно!', 'success');
  };

  // Import JSON Backup
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          Object.keys(parsed).forEach((key) => {
            localStorage.setItem(key, JSON.stringify(parsed[key]));
          });
          showToast('Данные успешно импортированы! Перезагрузка...', 'success');
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } catch (err) {
          showToast('Ошибка при чтении файла бэкапа JSON', 'error');
        }
      };
    }
  };

  const handleResetData = () => {
    if (confirm('Вы действительно хотите сбросить ВСЕ локальные данные? Это действие необратимо.')) {
      localStorage.clear();
      showToast('Все данные сброшены. Перезагрузка...', 'warning');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className={styles.container}>
      {/* 📱 1. LIVE TODAY PREVIEW WIDGET */}
      <LiveTodayPreviewWidget
        theme={theme}
        selectedColor={selectedColor}
        selectedCategoryThemeId="amber"
        selectedCardBgThemeId="classic"
        bannerVariant={bannerVariant}
        daySwitcherVariant={daySwitcherVariant}
        previewPresetId={previewPresetId}
      />

      {/* Appearance Settings */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Typography variant="h2">🎨 Внешний вид и Тема</Typography>

        <div className={styles.settingRow}>
          <div>
            <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
              Тема оформления
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              Быстрое переключение темная / светлая
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button
              variant={theme === 'dark' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => {
                setPreviewPresetId(null);
                handleThemeChange('dark');
              }}
            >
              🌙 Темная
            </Button>
            <Button
              variant={theme === 'light' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => {
                setPreviewPresetId(null);
                handleThemeChange('light');
              }}
            >
              ☀️ Светлая
            </Button>
          </div>
        </div>

        {/* CLEAN DUAL SELECTORS: 1 FOR LIGHT THEME, 1 FOR DARK THEME */}
        <ThemeArchitectureSelector
          theme={theme}
          selectedColor={selectedColor}
          onSelectPreset={(presetId) => {
            setPreviewPresetId(presetId);
          }}
        />

        {/* Accent Color Section - Centered */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', width: '100%', padding: '8px 0' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', textAlign: 'center' }}>
            🎯 Акцентный цвет интерфейса
          </div>
          <div className={styles.colorPickerRow}>
            {colorPalettes.map((pal) => (
              <button
                key={pal.hex}
                title={pal.name}
                className={`${styles.colorSwatch} ${selectedColor === pal.hex ? styles.colorSwatchActive : ''}`}
                style={{ backgroundColor: pal.hex }}
                onClick={() => handleColorChange(pal.hex)}
              />
            ))}
          </div>
        </div>

        {/* Habit Progress Banner Variant Select */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            📊 Стиль виджета прогресса дня
          </div>
          <div style={{ position: 'relative', width: '100%' }}>
            <select
              value={bannerVariant}
              onChange={(e) => handleBannerVariantChange(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                paddingRight: '36px',
                borderRadius: '12px',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                fontSize: '13.5px',
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <option value="1">Кибер-стекло с кольцом</option>
              <option value="2">Метрическая панель</option>
              <option value="3">Изумрудно-акцентная панель</option>
              <option value="4">Кольцо активности Apple Style</option>
              <option value="5">Геймифицированная полоса XP</option>
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

        {/* Day Switcher Variant Select */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            🗓️ Стиль виджета «Переключатель дней»
          </div>
          <div style={{ position: 'relative', width: '100%' }}>
            <select
              value={daySwitcherVariant}
              onChange={(e) => handleDaySwitcherVariantChange(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                paddingRight: '36px',
                borderRadius: '12px',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                fontSize: '13.5px',
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <option value="12">Компактная лента с акцентным центром</option>
              <option value="19">Крупные карточки с экстра-числами</option>
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
      </Card>

      {/* Regional & Calendar Settings */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Typography variant="h2">📅 Региональные настройки и Календарь</Typography>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Первый день недели
          </div>
          <div style={{ position: 'relative', width: '100%' }}>
            <select
              value={firstDayOfWeek}
              onChange={(e) => setFirstDayOfWeek(e.target.value as 'Monday' | 'Sunday')}
              style={{
                width: '100%',
                padding: '12px 16px',
                paddingRight: '36px',
                borderRadius: '12px',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                fontSize: '13.5px',
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <option value="Monday">Понедельник</option>
              <option value="Sunday">Воскресенье</option>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Формат отображения дат
          </div>
          <div style={{ position: 'relative', width: '100%' }}>
            <select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value as 'DD.MM.YYYY' | 'YYYY-MM-DD')}
              style={{
                width: '100%',
                padding: '12px 16px',
                paddingRight: '36px',
                borderRadius: '12px',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                fontSize: '13.5px',
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <option value="DD.MM.YYYY">ДД.ММ.ГГГГ (24.08.2026)</option>
              <option value="YYYY-MM-DD">ГГГГ-ММ-ДД (2026-08-24)</option>
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
      </Card>

      {/* Data Management Section */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Typography variant="h2">💾 Управление данными и Бэкап</Typography>
        <Typography variant="body" color="muted">
          Экспортируйте ваши задачи, цели и статистику в JSON файл или восстановите данные из бэкапа.
        </Typography>

        <div className={styles.backupActions}>
          <Button variant="secondary" onClick={handleExportData}>
            📥 Экспорт бэкапа (JSON)
          </Button>

          <label className={styles.fileInputLabel}>
            📤 Импорт бэкапа (JSON)
            <input type="file" accept=".json" onChange={handleImportData} style={{ display: 'none' }} />
          </label>
        </div>

        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
          <Button variant="danger" size="sm" onClick={handleResetData}>
            ⚠️ Сбросить все данные приложения
          </Button>
        </div>
      </Card>
    </div>
  );
};
