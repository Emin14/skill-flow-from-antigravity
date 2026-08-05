'use client';

import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, useToastStore } from '@/shared/ui';
import styles from './SettingsPage.module.css';
import {
  CATEGORY_TEXT_THEMES,
  CARD_BG_THEMES,
  applyCategoryTextTheme,
  applyCardBgTheme,
} from '@/shared/config/categoryColors';
import { APP_THEME_PRESETS, AppThemePreset } from '@/shared/config/appThemes';
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
  const [selectedCategoryThemeId, setSelectedCategoryThemeId] = useState('amber');
  const [selectedCardBgThemeId, setSelectedCardBgThemeId] = useState('classic');
  const [bannerVariant, setBannerVariant] = useState('3');
  const [daySwitcherVariant, setDaySwitcherVariant] = useState('12');
  const [firstDayOfWeek, setFirstDayOfWeek] = useState<'Monday' | 'Sunday'>('Monday');
  const [dateFormat, setDateFormat] = useState<'DD.MM.YYYY' | 'YYYY-MM-DD'>('DD.MM.YYYY');

  useEffect(() => {
    const savedColor = localStorage.getItem(STORAGE_KEYS.ACCENT_COLOR) || '#6366f1';
    const savedCatId = localStorage.getItem(STORAGE_KEYS.CATEGORY_THEME_ID) || 'amber';
    const savedBgId = localStorage.getItem(STORAGE_KEYS.CARD_BG_THEME_ID) || 'classic';
    const savedBannerVar = localStorage.getItem(STORAGE_KEYS.HABIT_BANNER_VARIANT) || '3';
    const savedDaySwitcherVar = localStorage.getItem(STORAGE_KEYS.DAY_SWITCHER_VARIANT) || '12';

    setSelectedColor(savedColor);
    applyAccentColorVars(savedColor);
    setSelectedCategoryThemeId(savedCatId);
    setSelectedCardBgThemeId(savedBgId);
    setBannerVariant(savedBannerVar);
    setDaySwitcherVariant(savedDaySwitcherVar);
    applyCategoryTextTheme(savedCatId);
    applyCardBgTheme(savedBgId);
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
    showToast('Основной цвет интерфейса обновлен!', 'success');
  };

  const handleCategoryThemeChange = (optId: string) => {
    setSelectedCategoryThemeId(optId);
    localStorage.setItem(STORAGE_KEYS.CATEGORY_THEME_ID, optId);
    applyCategoryTextTheme(optId);
    const opt = CATEGORY_TEXT_THEMES.find((o) => o.id === optId) || CATEGORY_TEXT_THEMES[0];
    showToast(`Цвета текста категории и повторов изменены на: ${opt.name}`, 'info');
  };

  const handleCardBgThemeChange = (bgId: string) => {
    setSelectedCardBgThemeId(bgId);
    localStorage.setItem(STORAGE_KEYS.CARD_BG_THEME_ID, bgId);
    applyCardBgTheme(bgId);
    const opt = CARD_BG_THEMES.find((o) => o.id === bgId) || CARD_BG_THEMES[0];
    showToast(`Фон карточек изменен на: ${opt.name}`, 'info');
  };

  const handleBannerVariantChange = (varId: string) => {
    setBannerVariant(varId);
    localStorage.setItem(STORAGE_KEYS.HABIT_BANNER_VARIANT, varId);
    window.dispatchEvent(new Event('storage'));
    showToast(`Стиль виджета прогресса дня изменен на Вариант ${varId}`, 'info');
  };

  const handleDaySwitcherVariantChange = (varId: string) => {
    setDaySwitcherVariant(varId);
    localStorage.setItem(STORAGE_KEYS.DAY_SWITCHER_VARIANT, varId);
    window.dispatchEvent(new Event('storage'));
    showToast(`Переключатель дней на странице «Сегодня» изменен на Вариант ${varId}`, 'info');
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
      {/* 📱 1. LIVE TODAY PREVIEW WIDGET (Before theme selection) */}
      <LiveTodayPreviewWidget
        theme={theme}
        selectedColor={selectedColor}
        selectedCategoryThemeId={selectedCategoryThemeId}
        selectedCardBgThemeId={selectedCardBgThemeId}
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

        {/* 🎨 CLEAN DUAL SELECTORS: 1 FOR LIGHT THEME, 1 FOR DARK THEME */}
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

        {/* Category Text Themes Select */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            🎨 Цвета надписей категории и повторов
          </div>
          <div style={{ position: 'relative', width: '100%' }}>
            <select
              value={selectedCategoryThemeId}
              onChange={(e) => handleCategoryThemeChange(e.target.value)}
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
              {CATEGORY_TEXT_THEMES.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
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

        {/* Card Background Themes Select */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            🎴 Фоновое оформление карточек задач
          </div>
          <div style={{ position: 'relative', width: '100%' }}>
            <select
              value={selectedCardBgThemeId}
              onChange={(e) => handleCardBgThemeChange(e.target.value)}
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
              {CARD_BG_THEMES.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
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
              <option value="1">1 — Кибер-стекло с кольцом</option>
              <option value="2">2 — Голубая неоновая капсула</option>
              <option value="3">3 — Пин-бейдж над треком</option>
              <option value="4">4 — Метрическая панель</option>
              <option value="5">5 — Янтарно-изумрудное стекло</option>
              <option value="6">6 — Кольцо активности Apple Style</option>
              <option value="7">7 — Геймифицированная полоса XP</option>
              <option value="8">8 — Тонкая линия по нижнему краю</option>
              <option value="9">9 — Компактный дашборд-ряд</option>
              <option value="10">10 — Капсула с текстом внутри</option>
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
            🗓️ Стиль переключателя дней («Сегодня»)
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
              <option value="12">12 — Компактная лента с акцентным центром</option>
              <option value="19">19 — Крупные карточки с экстра-числами</option>
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
              <option value="DD.MM.YYYY">ДД.ММ.ГГГГ (29.07.2026)</option>
              <option value="YYYY-MM-DD">ГГГГ-ММ-ДД (2026-07-29)</option>
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

      {/* Export & Import Data Backup */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Typography variant="h2">💾 Данные и Резервное Копирование</Typography>
        <Typography variant="body" style={{ color: 'var(--color-text-muted)', fontSize: '12.5px' }}>
          Все ваши цели, темы, задачи, материалы и прогресс FSRS хранятся локально на этом устройстве.
        </Typography>

        <div style={{ display: 'flex', gap: '8px', width: '100%', alignItems: 'center', marginTop: '4px', boxSizing: 'border-box' }}>
          <Button
            variant="primary"
            onClick={handleExportData}
            style={{
              flex: '1 1 0px',
              minWidth: 0,
              padding: '8px 6px',
              fontSize: '12px',
              fontWeight: 600,
              justifyContent: 'center',
              whiteSpace: 'nowrap',
              minHeight: '40px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            📥 Экспорт
          </Button>

          <label style={{ cursor: 'pointer', flex: '1 1 0px', minWidth: 0, margin: 0 }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 6px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                fontSize: '12px',
                fontWeight: 600,
                minHeight: '40px',
                width: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease',
              }}
            >
              📤 Импорт
            </span>
            <input type="file" accept=".json" onChange={handleImportData} style={{ display: 'none' }} />
          </label>

          <Button
            variant="danger"
            onClick={handleResetData}
            style={{
              flex: '1 1 0px',
              minWidth: 0,
              padding: '8px 6px',
              fontSize: '12px',
              fontWeight: 600,
              justifyContent: 'center',
              whiteSpace: 'nowrap',
              minHeight: '40px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            🗑 Сбросить
          </Button>
        </div>
      </Card>
    </div>
  );
};
