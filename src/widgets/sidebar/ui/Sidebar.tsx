'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useQuickCreateModalStore } from '@/features/quick-create';
import styles from './Sidebar.module.css';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'Сегодня', href: '/today', icon: '☀️' },
  { label: 'Английский', href: '/english', icon: '🇬🇧' },
  { label: 'Входящие', href: '/inbox', icon: '📥' },
  { label: 'Крупные задачи', href: '/projects', icon: '📁' },
  { label: 'Просроченные', href: '/overdue', icon: '🚨' },
  { label: 'В любое время', href: '/anytime', icon: '♾️' },
  { label: 'Цели', href: '/goals', icon: '🎯' },
  { label: 'Достижения', href: '/achievements', icon: '🏆' },
  { label: 'Календарь', href: '/calendar', icon: '📅' },
  { label: 'Повторить', href: '/repeats', icon: '🔄' },
  { label: 'Статистика', href: '/statistics', icon: '📊' },
  { label: 'Настройки', href: '/settings', icon: '⚙️' },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const openModal = useQuickCreateModalStore((s) => s.openModal);

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ''}`}>
      {/* Brand & Collapse Button */}
      <div className={`${styles.header} ${isCollapsed ? styles.headerCollapsed : ''}`}>
        {!isCollapsed && (
          <div className={styles.brand}>
            <span style={{ fontSize: '20px' }}>⚡</span>
            <span className={styles.brandName}>SkillFlow</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Развернуть меню' : 'Свернуть меню'}
          className={styles.toggleBtn}
        >
          {isCollapsed ? '➔' : '◀'}
        </button>
      </div>

      {/* PC Create Action Button */}
      <button
        onClick={() => openModal('Task')}
        className={`${styles.createBtn} ${isCollapsed ? styles.createBtnCollapsed : ''}`}
        title="Создать элемент"
      >
        <span>➕</span>
        {!isCollapsed && <span>Создать</span>}
      </button>

      {/* Nav Items */}
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/today' && pathname === '/');

          if (item.href === '/settings') {
            return (
              <button
                key={item.href}
                type="button"
                onClick={() => {
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
                }}
                title={isCollapsed ? item.label : undefined}
                className={`
                  ${styles.navItem} 
                  ${isCollapsed ? styles.navItemCollapsed : ''} 
                  ${isActive ? styles.navItemActive : ''}
                `}
                style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={`
                ${styles.navItem} 
                ${isCollapsed ? styles.navItemCollapsed : ''} 
                ${isActive ? styles.navItemActive : ''}
              `}
              onClick={() => {
                if (pathname !== '/settings' && typeof window !== 'undefined') {
                  sessionStorage.setItem('pre_settings_path', pathname);
                }
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Streak Badge */}
      {!isCollapsed && (
        <div className={styles.footer}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            🔥 <strong style={{ color: 'var(--color-warning)' }}>12</strong> Дней серия
          </span>
        </div>
      )}
    </aside>
  );
};
