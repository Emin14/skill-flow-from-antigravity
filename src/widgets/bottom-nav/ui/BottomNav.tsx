'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuickCreateModalStore } from '@/features/quick-create';
import { useFooterVariantStore } from '@/shared/model/useFooterVariantStore';
import { Plus } from 'lucide-react';
import styles from './BottomNav.module.css';

interface NavItemData {
  label: string;
  href: string;
  icon: string;
}

const NAV_ITEMS_LEFT: NavItemData[] = [
  { label: 'Сегодня', href: '/today', icon: '☀️' },
  { label: 'Входящие', href: '/inbox', icon: '📥' },
  { label: 'Проекты', href: '/projects', icon: '📁' },
];

const NAV_ITEMS_RIGHT: NavItemData[] = [
  { label: 'Просроченные', href: '/overdue', icon: '🚨' },
  { label: 'Повторить', href: '/repeats', icon: '🔄' },
  { label: 'Календарь', href: '/calendar', icon: '📅' },
  { label: 'Статистика', href: '/statistics', icon: '📊' },
];

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const openModal = useQuickCreateModalStore((s) => s.openModal);
  const { variant } = useFooterVariantStore();

  const isItemActive = (href: string) => {
    return pathname === href || (href === '/today' && pathname === '/');
  };

  const renderFab = (customClass?: string) => (
    <button
      type="button"
      className={customClass || styles.createFab}
      title="Быстрое создание задачи"
      onClick={() => openModal('Task')}
      aria-label="Быстрое создание задачи"
    >
      <Plus size={22} strokeWidth={2.8} />
    </button>
  );

  return (
    <nav className={`${styles.bottomNav} ${styles[`variant_${variant}`]}`}>
      <div className={styles.iconOnlyRow}>
        {/* Left 3 Icons */}
        {NAV_ITEMS_LEFT.map((item) => {
          const active = isItemActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.iconItem} ${active ? styles.iconItemActive : ''}`}
              title={item.label}
            >
              {active && <div className={styles.topIndicatorLine} />}
              <span className={styles.iconSpan}>{item.icon}</span>
              {active && <span className={styles.activeDot} />}
            </Link>
          );
        })}

        {/* Center Elevated FAB */}
        {renderFab(styles[`fab_v${variant}`] || styles.createFab)}

        {/* Right 4 Icons */}
        {NAV_ITEMS_RIGHT.map((item) => {
          const active = isItemActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.iconItem} ${active ? styles.iconItemActive : ''}`}
              title={item.label}
            >
              {active && <div className={styles.topIndicatorLine} />}
              <span className={styles.iconSpan}>{item.icon}</span>
              {active && <span className={styles.activeDot} />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
