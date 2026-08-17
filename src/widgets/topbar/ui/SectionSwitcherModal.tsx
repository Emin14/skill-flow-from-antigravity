'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, X } from 'lucide-react';
import styles from './SectionSwitcherModal.module.css';

interface NavSectionItem {
  label: string;
  href: string;
  icon: string;
  description: string;
}

interface NavSectionGroup {
  groupTitle: string;
  items: NavSectionItem[];
}

const SECTION_GROUPS: NavSectionGroup[] = [
  {
    groupTitle: 'Ежедневные',
    items: [
      { label: 'Сегодня', href: '/today', icon: '☀️', description: 'Фокус дня и текущие дела' },
      { label: 'Английский', href: '/english', icon: '🇬🇧', description: 'Словарь Oxford 3000 и карточки' },
      { label: 'Календарь', href: '/calendar', icon: '📅', description: 'Сетка расписания и недели' },
      { label: 'Входящие', href: '/inbox', icon: '📥', description: 'Быстрый сбор мыслей и идей' },
      { label: 'Просроченные', href: '/overdue', icon: '🚨', description: 'Задачи, требующие внимания' },
    ],
  },
  {
    groupTitle: 'Структура и цели',
    items: [
      { label: 'Крупные задачи', href: '/projects', icon: '📁', description: 'Каталог проектов с подзадачами' },
      { label: 'Повторяющиеся', href: '/repeats', icon: '🔄', description: 'Регулярные привычки и рутины' },
      { label: 'Цели', href: '/goals', icon: '🎯', description: 'Главные жизненные ориентиры' },
      { label: 'Достижения', href: '/achievements', icon: '🏆', description: 'Личный зал славы и рекорды' },
      { label: 'В любое время', href: '/anytime', icon: '♾️', description: 'Задачи без жесткой привязки к дате' },
    ],
  },
  {
    groupTitle: 'Аналитика и система',
    items: [
      { label: 'Статистика', href: '/statistics', icon: '📊', description: 'Темп роста и сводные метрики' },
      { label: 'Итоги дня', href: '/review', icon: '🌙', description: 'Вечерняя рефлексия и закрытие дня' },
      { label: 'Настройки', href: '/settings', icon: '⚙️', description: 'Темы, экспорт данных и параметры' },
    ],
  },
];

interface SectionSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

export const SectionSwitcherModal: React.FC<SectionSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentPath,
}) => {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNavigate = (href: string) => {
    if (href === '/settings') {
      if (currentPath === '/settings') {
        const prev = typeof window !== 'undefined' ? sessionStorage.getItem('pre_settings_path') : null;
        const target = prev && prev !== '/settings' ? prev : '/today';
        router.push(target);
      } else {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('pre_settings_path', currentPath);
        }
        router.push('/settings');
      }
    } else {
      router.push(href);
    }
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={styles.modalContent}
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={styles.header}>
          <div className={styles.headerTitleGroup}>
            <span className={styles.headerIcon}>⚡</span>
            <div>
              <h2 className={styles.headerTitle}>Разделы приложения</h2>
              <p className={styles.headerSubtitle}>Быстрый переход к любому экрану SkillFlow</p>
            </div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Закрыть меню"
            title="Закрыть (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sections Groups */}
        <div className={styles.groupsContainer}>
          {SECTION_GROUPS.map((group) => (
            <div key={group.groupTitle} className={styles.group}>
              <div className={styles.groupHeader}>
                <span className={styles.groupTitle}>{group.groupTitle}</span>
                <div className={styles.groupDivider} />
              </div>

              <div className={styles.itemsGrid}>
                {group.items.map((item) => {
                  const isActive =
                    currentPath === item.href ||
                    (item.href === '/today' && (currentPath === '/' || currentPath === '/today'));

                  return (
                    <button
                      key={item.href}
                      type="button"
                      onClick={() => handleNavigate(item.href)}
                      className={`${styles.itemCard} ${isActive ? styles.itemCardActive : ''}`}
                    >
                      <div className={styles.itemIconWrapper}>
                        <span className={styles.itemIcon}>{item.icon}</span>
                      </div>

                      <div className={styles.itemTextWrapper}>
                        <div className={styles.itemTitleRow}>
                          <span className={styles.itemLabel}>{item.label}</span>
                          {isActive && (
                            <span className={styles.activeBadge}>
                              <Check size={11} strokeWidth={3} />
                              <span>Выбрано</span>
                            </span>
                          )}
                        </div>
                        <span className={styles.itemDescription}>{item.description}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
