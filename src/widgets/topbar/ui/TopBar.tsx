'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Settings } from 'lucide-react';
import { useThemeStore } from '@/shared/model/useThemeStore';
import { APP_THEME_PRESETS, applyAppThemePreset } from '@/shared/config/appThemes';
import { TASK_CARD_STYLES, applyTaskCardStyle } from '@/shared/config/cardStyles';
import styles from './TopBar.module.css';

const pathTitles: Record<string, string> = {
  '/': 'Сегодня',
  '/today': 'Сегодня',
  '/inbox': 'Входящие',
  '/overdue': 'Просроченные',
  '/anytime': 'В любое время',
  '/goals': 'Цели и Навыки',
  '/calendar': 'Календарь',
  '/repeats': 'Повторить',
  '/statistics': 'Аналитика',
  '/projects': 'Проекты',
  '/settings': 'Настройки',
};

export const TopBar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const currentTitle = pathTitles[pathname] || 'SkillFlow';
  const isTodayPage = pathname === '/' || pathname === '/today';

  const { theme, initTheme, toggleTheme } = useThemeStore();

  const [selectedBg, setSelectedBg] = useState<string>('dark_today');
  const [selectedCardStyle, setSelectedCardStyle] = useState<string>('dark_2a2a2a');

  useEffect(() => {
    initTheme();
    if (typeof window !== 'undefined') {
      const savedBg = localStorage.getItem('app-preset-theme-id') || 'dark_today';
      const savedCard = localStorage.getItem('user-card-style-id') || 'dark_2a2a2a';
      setSelectedBg(savedBg);
      setSelectedCardStyle(savedCard);
    }
  }, [initTheme]);

  const handleBgChange = (bgId: string) => {
    setSelectedBg(bgId);
    applyAppThemePreset(bgId);
  };

  const handleCardStyleChange = (styleId: string) => {
    setSelectedCardStyle(styleId);
    applyTaskCardStyle(styleId);
  };

  const todayFormatted = new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const handleSettingsToggle = () => {
    if (pathname === '/settings') {
      const prev = typeof window !== 'undefined' ? sessionStorage.getItem('pre_settings_path') : null;
      const target = prev && prev !== '/settings' ? prev : '/today';
      router.push(target);
    } else {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pre_settings_path', pathname);
      }
      router.push('/settings');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.titleWrapper}>
        <div className={styles.headerTitleRow}>
          <h1 className={styles.title}>{currentTitle}</h1>
          {isTodayPage && (
            <span className={styles.dateSubtitle}>
              • {todayFormatted}
            </span>
          )}
        </div>
      </div>

      {/* Temporary Theme & Card Style Switcher */}
      <div className={styles.tempThemeBar}>
        <span className={styles.tempBadge}>⚡ Тест:</span>
        <select
          value={selectedBg}
          onChange={(e) => handleBgChange(e.target.value)}
          className={styles.themeSelect}
          title="Выбор фона приложения (20 вариантов)"
        >
          <option disabled value="">🎨 Фон приложения</option>
          {APP_THEME_PRESETS.map((preset, idx) => (
            <option key={preset.id} value={preset.id}>
              {idx + 1}. {preset.previewEmoji} {preset.name}
            </option>
          ))}
        </select>

        <select
          value={selectedCardStyle}
          onChange={(e) => handleCardStyleChange(e.target.value)}
          className={styles.themeSelect}
          title="Выбор карточки задачи (7 вариантов)"
        >
          <option disabled value="">🎴 Карточка задачи</option>
          {TASK_CARD_STYLES.map((style) => (
            <option key={style.id} value={style.id}>
              {style.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на темную тему'}
          aria-label="Смена темы"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 12px',
            color: 'var(--color-text-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 500,
            transition: 'all var(--transition-fast)',
            whiteSpace: 'nowrap',
            height: '34px',
          }}
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>

        <button
          onClick={handleSettingsToggle}
          title={pathname === '/settings' ? "Вернуться назад" : "Открыть Настройки"}
          aria-label="Настройки"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--color-border)',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            color: 'var(--color-text-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all var(--transition-fast)',
            flexShrink: 0,
          }}
        >
          <Settings size={17} />
        </button>
      </div>
    </header>
  );
};
