'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuickCreateModalStore } from '@/features/quick-create';
import styles from './BottomNav.module.css';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const openModal = useQuickCreateModalStore((s) => s.openModal);

  const navItems = [
    { label: 'Сегодня', href: '/today', icon: '☀️' },
    { label: 'Входящие', href: '/inbox', icon: '📥' },
    { label: 'Цели', href: '/goals', icon: '🏆' },
    { label: 'Календарь', href: '/calendar', icon: '📅' },
  ];

  return (
    <nav className={styles.bottomNav}>
      {navItems.slice(0, 2).map((item) => {
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

      {navItems.slice(2).map((item) => {
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
