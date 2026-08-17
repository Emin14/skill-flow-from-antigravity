'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Settings, ChevronDown } from 'lucide-react';
import { useThemeStore } from '@/shared/model/useThemeStore';
import { SectionSwitcherModal } from './SectionSwitcherModal';
import styles from './TopBar.module.css';

interface PathMeta {
  title: string;
  icon: string;
}

const pathMetaMap: Record<string, PathMeta> = {
  '/': { title: 'Сегодня', icon: '☀️' },
  '/today': { title: 'Сегодня', icon: '☀️' },
  '/english': { title: 'Английский', icon: '🇬🇧' },
  '/inbox': { title: 'Входящие', icon: '📥' },
  '/calendar': { title: 'Календарь', icon: '📅' },
  '/overdue': { title: 'Просроченные', icon: '🚨' },
  '/projects': { title: 'Крупные задачи', icon: '📁' },
  '/repeats': { title: 'Повторить', icon: '🔄' },
  '/goals': { title: 'Цели', icon: '🎯' },
  '/achievements': { title: 'Достижения', icon: '🏆' },
  '/anytime': { title: 'В любое время', icon: '♾️' },
  '/statistics': { title: 'Статистика', icon: '📊' },
  '/review': { title: 'Итоги дня', icon: '🌙' },
  '/settings': { title: 'Настройки', icon: '⚙️' },
};

export const TopBar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const currentMeta = pathMetaMap[pathname] || { title: 'SkillFlow', icon: '⚡' };
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
    <>
      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          <div className={styles.headerTitleRow}>
            {/* Linear-Style Interactive Section Switcher Trigger */}
            <button
              type="button"
              className={`${styles.switcherTriggerBtn} ${isSwitcherOpen ? styles.switcherTriggerBtnOpen : ''}`}
              onClick={() => setIsSwitcherOpen((prev) => !prev)}
              aria-expanded={isSwitcherOpen}
              aria-label="Открыть меню всех разделов"
              title="Переключить раздел"
            >
              <span className={styles.switcherIcon}>{currentMeta.icon}</span>
              <h1 className={styles.title}>{currentMeta.title}</h1>
              <ChevronDown
                size={16}
                className={`${styles.chevronIcon} ${isSwitcherOpen ? styles.chevronIconRotated : ''}`}
              />
            </button>

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
            {theme === 'dark' ? '🌙' : '☀️'}
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

      {/* Section Switcher Modal Overlay */}
      <SectionSwitcherModal
        isOpen={isSwitcherOpen}
        onClose={() => setIsSwitcherOpen(false)}
        currentPath={pathname}
      />
    </>
  );
};
