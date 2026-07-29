'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/shared/ui';
import styles from './TopBar.module.css';

const pathTitles: Record<string, string> = {
  '/': 'Сегодня',
  '/today': 'Сегодня',
  '/inbox': 'Входящие',
  '/goals': 'Цели и Навыки',
  '/calendar': 'Календарь',
  '/statistics': 'Аналитика',
  '/settings': 'Настройки',
};

export const TopBar: React.FC = () => {
  const pathname = usePathname();
  const currentTitle = pathTitles[pathname] || 'SkillFlow';

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{currentTitle}</h1>

      <div className={styles.actions}>
        <Button variant="secondary" size="sm">
          <span>🔍</span> Поиск <kbd className={styles.shortcutKbd}>⌘K</kbd>
        </Button>
      </div>
    </header>
  );
};
