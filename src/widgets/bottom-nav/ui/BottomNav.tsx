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

      {/* Center Floating FAB -> Opens Quick Creation Modal */}
      <button
        className={styles.createFab}
        title="Быстрое создание"
        onClick={() => openModal('Task')}
        aria-label="Быстрое создание"
      >
        ➕
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
