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

const colorPalettes = [
  { name: 'Индиго (Aura)', hex: '#6366f1' },
  { name: 'Сапфировый (Default / Sky Blue)', hex: '#3b82f6' },
  { name: 'Небесно-голубой (iCloud)', hex: '#38a5f8' },
  { name: 'Бирюзовый (Aqua / Cyan)', hex: '#47b8c4' },
  { name: 'Изумрудный (Dark Emerald)', hex: '#10b981' },
  { name: 'Салатовый (Spring)', hex: '#84cc16' },
  { name: 'Ярко-оранжевый (Dark Amber)', hex: '#ff6b00' },
  { name: 'Солнечно-янтарный (Sunshine)', hex: '#f59e0b' },
  { name: 'Кораллово-красный (Сегодня Red)', hex: '#ef4444' },
  { name: 'Розово-персиковый (Peach)', hex: '#f43f5e' },
  { name: 'Сиреневый (Lilac Violet)', hex: '#8b5cf6' },
  { name: 'Пурпурный (Magenta)', hex: '#d946ef' },
];

export const SettingsPage: React.FC = () => {
  const showToast = useToastStore((s) => s.showToast);
  const { activePresetId, setPresetTheme } = useThemeStore();

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedColor, setSelectedColor] = useState('#6366f1');
  const [selectedCategoryThemeId, setSelectedCategoryThemeId] = useState('amber');
  const [selectedCardBgThemeId, setSelectedCardBgThemeId] = useState('classic');
  const [bannerVariant, setBannerVariant] = useState('3');
  const [daySwitcherVariant, setDaySwitcherVariant] = useState('12');
  const [firstDayOfWeek, setFirstDayOfWeek] = useState<'Monday' | 'Sunday'>('Monday');
  const [dateFormat, setDateFormat] = useState<'DD.MM.YYYY' | 'YYYY-MM-DD'>('DD.MM.YYYY');

  useEffect(() => {
    const savedTheme = (localStorage.getItem(STORAGE_KEYS.THEME) as 'dark' | 'light') || 'dark';
    const savedColor = localStorage.getItem(STORAGE_KEYS.ACCENT_COLOR) || '#6366f1';
    const savedCatId = localStorage.getItem(STORAGE_KEYS.CATEGORY_THEME_ID) || 'amber';
    const savedBgId = localStorage.getItem(STORAGE_KEYS.CARD_BG_THEME_ID) || 'classic';
    const savedBannerVar = localStorage.getItem(STORAGE_KEYS.HABIT_BANNER_VARIANT) || '3';
    const savedDaySwitcherVar = localStorage.getItem(STORAGE_KEYS.DAY_SWITCHER_VARIANT) || '12';

    setTheme(savedTheme);
    setSelectedColor(savedColor);
    setSelectedCategoryThemeId(savedCatId);
    setSelectedCardBgThemeId(savedBgId);
    setBannerVariant(savedBannerVar);
    setDaySwitcherVariant(savedDaySwitcherVar);
    applyCategoryTextTheme(savedCatId);
    applyCardBgTheme(savedBgId);
  }, []);

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    if (newTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    applyCategoryTextTheme(selectedCategoryThemeId);
    applyCardBgTheme(selectedCardBgThemeId);
    showToast(`Тема переключена на ${newTheme === 'dark' ? 'Темную' : 'Светлую'}`, 'success');
  };

  const handleColorChange = (hex: string) => {
    setSelectedColor(hex);
    localStorage.setItem(STORAGE_KEYS.ACCENT_COLOR, hex);
    document.documentElement.style.setProperty('--color-accent', hex);
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
      {/* Header */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <Typography variant="h1">⚙️ Настройки Приложения</Typography>
        <Typography variant="body" style={{ color: 'var(--color-text-muted)' }}>
          Персонализация внешнего вида, поведения системы и резервного копирования
        </Typography>
      </Card>

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
              onClick={() => handleThemeChange('dark')}
            >
              🌙 Темная
            </Button>
            <Button
              variant={theme === 'light' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handleThemeChange('light')}
            >
              ☀️ Светлая
            </Button>
          </div>
        </div>

        {/* 17 Theme Presets Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
          <div>
            <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
              🎨 Пресеты тем оформления (Уникальные сочетания фона)
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              Темы отвечают <b>строго за общий фон приложения и цвет карточек задач</b> в разделе «Сегодня»
            </div>
          </div>

          <div className={styles.presetThemesGrid}>
            {APP_THEME_PRESETS.map((preset) => {
              const isActive = activePresetId === preset.id;
              return (
                <div
                  key={preset.id}
                  className={`${styles.presetThemeCard} ${isActive ? styles.presetThemeCardActive : ''}`}
                  onClick={() => {
                    setPresetTheme(preset.id);
                    setTheme(preset.category);
                    showToast(`Тема «${preset.name}» успешно применена!`, 'success');
                  }}
                >
                  <div className={styles.presetNameRow}>
                    <span>{preset.previewEmoji} {preset.name}</span>
                    {isActive && <span className={styles.activeCheckBadge}>✓</span>}
                  </div>

                  {/* Visual Color Preview Box */}
                  <div className={styles.presetPreviewBox} style={{ backgroundColor: preset.bgColor }}>
                    <div
                      className={styles.presetPreviewCardMini}
                      style={{
                        backgroundColor: preset.cardBgColor,
                        border: `1px solid ${preset.cardBorder}`,
                        color: preset.textColor,
                      }}
                    >
                      <span style={{ fontSize: '10px' }}>✓ Задача</span>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: selectedColor }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.settingRow}>
          <div>
            <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
              🎯 Акцентный цвет интерфейса
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              Управляет кнопкой <b>«Добавить задачу» (+)</b>, фоном <b>активных виджетов</b> и выделением <b>в календаре</b>
            </div>
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
        <div className={styles.settingRow}>
          <div>
            <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
              🎨 Цвета надписей категории и повторов
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              Гармонично подобранные палитры текста категорий и повторений
            </div>
          </div>
          <div style={{ minWidth: '220px' }}>
            <select
              className={styles.themeSelect}
              value={selectedCategoryThemeId}
              onChange={(e) => handleCategoryThemeChange(e.target.value)}
            >
              {CATEGORY_TEXT_THEMES.map((opt) => (
                <option key={opt.id} value={opt.id} style={{ background: '#0f172a', color: '#f8fafc' }}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Card Background Themes Select */}
        <div className={styles.settingRow}>
          <div>
            <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
              🎴 Фоновое оформление карточек задач
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              Стеклянные градиенты, свечения и контуры карточек задач
            </div>
          </div>
          <div style={{ minWidth: '220px' }}>
            <select
              className={styles.themeSelect}
              value={selectedCardBgThemeId}
              onChange={(e) => handleCardBgThemeChange(e.target.value)}
            >
              {CARD_BG_THEMES.map((opt) => (
                <option key={opt.id} value={opt.id} style={{ background: '#0f172a', color: '#f8fafc' }}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Habit Progress Banner Variant Select */}
        <div className={styles.settingRow}>
          <div>
            <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
              📊 Стиль виджета прогресса дня
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              Оформление полосы выполнения задач на главной странице «Сегодня»
            </div>
          </div>
          <div style={{ minWidth: '220px' }}>
            <select
              className={styles.themeSelect}
              value={bannerVariant}
              onChange={(e) => handleBannerVariantChange(e.target.value)}
            >
              <option value="1" style={{ background: '#0f172a', color: '#f8fafc' }}>Вариант 1 — Кибер-стекло с кольцом</option>
              <option value="2" style={{ background: '#0f172a', color: '#f8fafc' }}>Вариант 2 — Голубая неоновая капсула</option>
              <option value="3" style={{ background: '#0f172a', color: '#f8fafc' }}>Вариант 3 — Пин-бейдж над треком (По умолчанию)</option>
              <option value="4" style={{ background: '#0f172a', color: '#f8fafc' }}>Вариант 4 — Метрическая панель</option>
              <option value="5" style={{ background: '#0f172a', color: '#f8fafc' }}>Вариант 5 — Янтарно-изумрудное стекло</option>
              <option value="6" style={{ background: '#0f172a', color: '#f8fafc' }}>Вариант 6 — Кольцо активности Apple Style</option>
              <option value="7" style={{ background: '#0f172a', color: '#f8fafc' }}>Вариант 7 — Геймифицированная полоса XP</option>
              <option value="8" style={{ background: '#0f172a', color: '#f8fafc' }}>Вариант 8 — Тонкая линия по нижнему краю</option>
              <option value="9" style={{ background: '#0f172a', color: '#f8fafc' }}>Вариант 9 — Компактный дашборд-ряд</option>
              <option value="10" style={{ background: '#0f172a', color: '#f8fafc' }}>Вариант 10 — Капсула с текстом внутри</option>
            </select>
          </div>
        </div>

        {/* Day Switcher Variant Select */}
        <div className={styles.settingRow}>
          <div>
            <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
              🗓️ Стиль переключателя дней («Сегодня»)
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              Выберите между 12 и 19 вариантом отображения ленты дней
            </div>
          </div>
          <div style={{ minWidth: '220px' }}>
            <select
              className={styles.themeSelect}
              value={daySwitcherVariant}
              onChange={(e) => handleDaySwitcherVariantChange(e.target.value)}
            >
              <option value="12" style={{ background: '#0f172a', color: '#f8fafc' }}>Вариант 12 — Компактная лента с акцентным центром</option>
              <option value="19" style={{ background: '#0f172a', color: '#f8fafc' }}>Вариант 19 — Крупные карточки с экстра-числами</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Regional & Calendar Settings */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Typography variant="h2">📅 Региональные настройки и Календарь</Typography>

        <div className={styles.settingRow}>
          <div>
            <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
              Первый день недели
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              С какого дня начинается расписание в сетке
            </div>
          </div>
          <select
            className={styles.selectInput}
            value={firstDayOfWeek}
            onChange={(e) => setFirstDayOfWeek(e.target.value as 'Monday' | 'Sunday')}
          >
            <option value="Monday">Понедельник</option>
            <option value="Sunday">Воскресенье</option>
          </select>
        </div>

        <div className={styles.settingRow}>
          <div>
            <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
              Формат отображения дат
            </div>
          </div>
          <select
            className={styles.selectInput}
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value as 'DD.MM.YYYY' | 'YYYY-MM-DD')}
          >
            <option value="DD.MM.YYYY">ДД.ММ.ГГГГ (29.07.2026)</option>
            <option value="YYYY-MM-DD">ГГГГ-ММ-ДД (2026-07-29)</option>
          </select>
        </div>
      </Card>

      {/* Export & Import Data Backup */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Typography variant="h2">💾 Данные и Резервное Копирование</Typography>
        <Typography variant="body" style={{ color: 'var(--color-text-muted)' }}>
          Все ваши цели, темы, задачи, материалы и прогресс FSRS хранятся локально на этом устройстве.
        </Typography>

        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
          <Button variant="primary" onClick={handleExportData}>
            📥 Экспортировать бэкап (JSON)
          </Button>

          <label style={{ cursor: 'pointer' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-md)',
                fontWeight: 'var(--font-weight-medium)',
                minHeight: '44px',
              }}
            >
              📤 Импортировать бэкап (JSON)
            </span>
            <input type="file" accept=".json" onChange={handleImportData} style={{ display: 'none' }} />
          </label>

          <Button variant="danger" onClick={handleResetData}>
            🗑 Сбросить все данные
          </Button>
        </div>
      </Card>
    </div>
  );
};
