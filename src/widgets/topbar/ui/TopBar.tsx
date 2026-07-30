'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useThemeStore } from '@/shared/model/useThemeStore';
import styles from './TopBar.module.css';

const pathTitles: Record<string, string> = {
  '/': 'Сегодня',
  '/today': 'Сегодня',
  '/inbox': 'Входящие',
  '/goals': 'Цели и Навыки',
  '/calendar': 'Календарь',
  '/repeats': 'Повторить',
  '/statistics': 'Аналитика',
  '/settings': 'Настройки',
};

export const TopBar: React.FC = () => {
  const pathname = usePathname();
  const currentTitle = pathTitles[pathname] || 'SkillFlow';
  const isTodayPage = pathname === '/' || pathname === '/today';

  const { theme, initTheme, toggleTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  const todayFormatted = new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <header className={styles.header}>
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>{currentTitle}</h1>
        {isTodayPage && (
          <span className={styles.dateSubtitle}>
            • {todayFormatted}
          </span>
        )}
      </div>

      <div className={styles.actions}>
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
          }}
        >
          {theme === 'dark' ? '🌙 Темная' : '☀️ Светлая'}
        </button>
      </div>
    </header>
  );
};
