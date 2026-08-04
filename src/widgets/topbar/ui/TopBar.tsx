'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Settings } from 'lucide-react';
import { useThemeStore } from '@/shared/model/useThemeStore';
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

  useEffect(() => {
    initTheme();
  }, [initTheme]);

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

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Переключить на светлый режим (День)' : 'Переключить на тёмный режим (Ночь)'}
          aria-label="Смена темы"
          className={styles.iconActionBtn}
        >
          {theme === 'dark' ? '🌙 Ночь' : '☀️ День'}
        </button>

        <button
          onClick={handleSettingsToggle}
          title={pathname === '/settings' ? "Вернуться назад" : "Открыть Настройки"}
          aria-label="Настройки"
          className={`${styles.iconActionBtn} ${styles.iconRoundBtn}`}
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
};
