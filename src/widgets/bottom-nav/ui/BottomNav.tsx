'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuickCreateModalStore } from '@/features/quick-create';
import styles from './BottomNav.module.css';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const openModal = useQuickCreateModalStore((s) => s.openModal);

  const navItemsLeft = [
    { label: 'Сегодня', href: '/today', icon: '☀️' },
    { label: 'Просроченные', href: '/overdue', icon: '🚨' },
    { label: 'Входящие', href: '/inbox', icon: '📥' },
  ];

  const navItemsRight = [
    { label: 'Повторить', href: '/repeats', icon: '🔄' },
    { label: 'Календарь', href: '/calendar', icon: '📅' },
    { label: 'Статистика', href: '/statistics', icon: '📊' },
  ];

  return (
    <nav className={styles.bottomNav}>
      {navItemsLeft.map((item) => {
        const isActive = pathname === item.href || (item.href === '/today' && pathname === '/');
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}

      {/* Sleek Gradient Floating FAB Button */}
      <button
        className={styles.createFab}
        title="Быстрое создание задачи"
        onClick={() => openModal('Task')}
        aria-label="Быстрое создание задачи"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {navItemsRight.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
