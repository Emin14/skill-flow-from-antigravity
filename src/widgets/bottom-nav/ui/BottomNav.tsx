'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuickCreateModalStore } from '@/features/quick-create';
import { useFooterVariantStore } from '@/shared/model/useFooterVariantStore';
import { ChevronUp, Plus, MoreHorizontal, X, Layers } from 'lucide-react';
import styles from './BottomNav.module.css';

interface NavItemData {
  label: string;
  href: string;
  icon: string;
  badge?: string;
}

const ALL_NAV_ITEMS: NavItemData[] = [
  { label: 'Сегодня', href: '/today', icon: '☀️' },
  { label: 'Входящие', href: '/inbox', icon: '📥' },
  { label: 'Проекты', href: '/projects', icon: '📁' },
  { label: 'Просроченные', href: '/overdue', icon: '🚨', badge: '3' },
  { label: 'Повторить', href: '/repeats', icon: '🔄' },
  { label: 'Календарь', href: '/calendar', icon: '📅' },
  { label: 'Статистика', href: '/statistics', icon: '📊' },
];

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const openModal = useQuickCreateModalStore((s) => s.openModal);
  const { variant } = useFooterVariantStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
    <>
      {/* Drawer Overlay for variants with expandable drawer */}
      {isDrawerOpen && (
        <div className={styles.drawerOverlay} onClick={() => setIsDrawerOpen(false)}>
          <div className={styles.drawerSheet} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <span style={{ fontWeight: 700, fontSize: '15px' }}>Все разделы</span>
              <button type="button" className={styles.drawerCloseBtn} onClick={() => setIsDrawerOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className={styles.drawerGrid}>
              {ALL_NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.drawerItem} ${isItemActive(item.href) ? styles.drawerItemActive : ''}`}
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <span style={{ fontSize: '22px' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Render Variant specific Bottom Navigation Container */}
      <nav className={`${styles.bottomNav} ${styles[`variant_${variant}`]}`}>
        {/* VARIANT 1: Apple Icon-Only Bar (No text overlap) */}
        {variant === 1 && (
          <div className={styles.iconOnlyRow}>
            {ALL_NAV_ITEMS.slice(0, 3).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.iconItem} ${isItemActive(item.href) ? styles.iconItemActive : ''}`}
                title={item.label}
              >
                <span>{item.icon}</span>
                {isItemActive(item.href) && <span className={styles.activeDot} />}
              </Link>
            ))}
            {renderFab()}
            {ALL_NAV_ITEMS.slice(3).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.iconItem} ${isItemActive(item.href) ? styles.iconItemActive : ''}`}
                title={item.label}
              >
                <span>{item.icon}</span>
                {isItemActive(item.href) && <span className={styles.activeDot} />}
              </Link>
            ))}
          </div>
        )}

        {/* VARIANT 2: iOS Standard 4 Tabs + "Ещё..." Drawer */}
        {variant === 2 && (
          <div className={styles.standardRow}>
            {[ALL_NAV_ITEMS[0], ALL_NAV_ITEMS[2]].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.compactItem} ${isItemActive(item.href) ? styles.activeItem : ''}`}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.label}>{item.label}</span>
              </Link>
            ))}
            {renderFab()}
            {[ALL_NAV_ITEMS[5], ALL_NAV_ITEMS[6]].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.compactItem} ${isItemActive(item.href) ? styles.activeItem : ''}`}
              >
                <span className={styles.icon}>{item.icon}</span>
                <span className={styles.label}>{item.label}</span>
              </Link>
            ))}
            <button
              type="button"
              className={styles.compactItem}
              onClick={() => setIsDrawerOpen(true)}
              title="Открыть остальные разделы"
            >
              <MoreHorizontal size={20} />
              <span className={styles.label}>Ещё...</span>
            </button>
          </div>
        )}

        {/* VARIANT 3: Arc Search Floating Island Pill */}
        {variant === 3 && (
          <div className={styles.floatingIsland}>
            {ALL_NAV_ITEMS.slice(0, 3).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.islandItem} ${isItemActive(item.href) ? styles.islandItemActive : ''}`}
                title={item.label}
              >
                <span>{item.icon}</span>
              </Link>
            ))}
            {renderFab(styles.islandFab)}
            {ALL_NAV_ITEMS.slice(3, 6).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.islandItem} ${isItemActive(item.href) ? styles.islandItemActive : ''}`}
                title={item.label}
              >
                <span>{item.icon}</span>
              </Link>
            ))}
          </div>
        )}

        {/* VARIANT 4: Scrollable Horizontal Carousel Bar */}
        {variant === 4 && (
          <div className={styles.carouselContainer}>
            <div className={styles.carouselScroll}>
              {ALL_NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.carouselChip} ${isItemActive(item.href) ? styles.carouselChipActive : ''}`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
            {renderFab(styles.carouselFab)}
          </div>
        )}

        {/* VARIANT 5: Things 3 Action Corner FAB + Pill */}
        {variant === 5 && (
          <div className={styles.thingsContainer}>
            <div className={styles.thingsPill}>
              {[ALL_NAV_ITEMS[0], ALL_NAV_ITEMS[2], ALL_NAV_ITEMS[5]].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.thingsItem} ${isItemActive(item.href) ? styles.thingsItemActive : ''}`}
                >
                  <span>{item.icon}</span>
                </Link>
              ))}
              <button type="button" className={styles.thingsItem} onClick={() => setIsDrawerOpen(true)}>
                <MoreHorizontal size={18} />
              </button>
            </div>
            {renderFab(styles.thingsFab)}
          </div>
        )}

        {/* VARIANT 6: Linear Monospace Badge Bar */}
        {variant === 6 && (
          <div className={styles.linearBar}>
            {ALL_NAV_ITEMS.slice(0, 5).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.linearBadge} ${isItemActive(item.href) ? styles.linearBadgeActive : ''}`}
              >
                {item.label.slice(0, 4).toUpperCase()}
              </Link>
            ))}
            {renderFab(styles.linearFab)}
          </div>
        )}

        {/* VARIANT 7: Telegram Segmented Badge Bar */}
        {variant === 7 && (
          <div className={styles.telegramBar}>
            {ALL_NAV_ITEMS.slice(0, 4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.telegramItem} ${isItemActive(item.href) ? styles.telegramItemActive : ''}`}
              >
                <div style={{ position: 'relative' }}>
                  <span>{item.icon}</span>
                  {item.badge && <span className={styles.telegramBadge}>{item.badge}</span>}
                </div>
                <span className={styles.telegramLabel}>{item.label}</span>
              </Link>
            ))}
            {renderFab(styles.telegramFab)}
          </div>
        )}

        {/* VARIANT 8: Spotify-style 3 Main Items + FAB Center */}
        {variant === 8 && (
          <div className={styles.spotifyBar}>
            <Link href="/today" className={`${styles.spotifyItem} ${isItemActive('/today') ? styles.spotifyItemActive : ''}`}>
              <span>☀️</span>
              <span>Сегодня</span>
            </Link>
            <Link href="/projects" className={`${styles.spotifyItem} ${isItemActive('/projects') ? styles.spotifyItemActive : ''}`}>
              <span>📁</span>
              <span>Проекты</span>
            </Link>
            {renderFab(styles.spotifyFab)}
            <Link href="/calendar" className={`${styles.spotifyItem} ${isItemActive('/calendar') ? styles.spotifyItemActive : ''}`}>
              <span>📅</span>
              <span>Календарь</span>
            </Link>
            <button type="button" className={styles.spotifyItem} onClick={() => setIsDrawerOpen(true)}>
              <MoreHorizontal size={20} />
              <span>Ещё</span>
            </button>
          </div>
        )}

        {/* VARIANT 9: Minimalist Floating Category Dots Bar */}
        {variant === 9 && (
          <div className={styles.dotsBar}>
            {ALL_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.dotItem} ${isItemActive(item.href) ? styles.dotItemActive : ''}`}
                title={item.label}
              >
                <span className={styles.dotIcon}>{item.icon}</span>
              </Link>
            ))}
            {renderFab(styles.dotFab)}
          </div>
        )}

        {/* VARIANT 10: Notion Mobile Flat Micro Bar */}
        {variant === 10 && (
          <div className={styles.notionBar}>
            {ALL_NAV_ITEMS.slice(0, 6).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.notionItem} ${isItemActive(item.href) ? styles.notionItemActive : ''}`}
              >
                <span style={{ fontSize: '15px' }}>{item.icon}</span>
                <span style={{ fontSize: '9.5px', fontWeight: 600 }}>{item.label}</span>
              </Link>
            ))}
            {renderFab(styles.notionFab)}
          </div>
        )}

        {/* VARIANT 11: Arc Search Bottom Capsule */}
        {variant === 11 && (
          <div className={styles.arcCapsule}>
            <Link href="/today" className={styles.arcIcon}>☀️</Link>
            <Link href="/projects" className={styles.arcIcon}>📁</Link>
            {renderFab(styles.arcFab)}
            <Link href="/calendar" className={styles.arcIcon}>📅</Link>
            <button type="button" className={styles.arcIcon} onClick={() => setIsDrawerOpen(true)}>
              <Layers size={18} />
            </button>
          </div>
        )}

        {/* VARIANT 12: Craft Frosted Glass Drawer Tab */}
        {variant === 12 && (
          <div className={styles.craftBar}>
            <div className={styles.craftContent} onClick={() => setIsDrawerOpen(true)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ChevronUp size={18} color="#38bdf8" />
                <span style={{ fontSize: '13px', fontWeight: 700 }}>Все разделы ({ALL_NAV_ITEMS.length})</span>
              </div>
            </div>
            {renderFab(styles.craftFab)}
          </div>
        )}

        {/* VARIANT 13: Apple Fitness Circular Icon Badges */}
        {variant === 13 && (
          <div className={styles.fitnessBar}>
            {ALL_NAV_ITEMS.slice(0, 5).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.fitnessBadge} ${isItemActive(item.href) ? styles.fitnessBadgeActive : ''}`}
                title={item.label}
              >
                <span>{item.icon}</span>
              </Link>
            ))}
            {renderFab(styles.fitnessFab)}
          </div>
        )}

        {/* VARIANT 14: Instagram Icon Grid Bar */}
        {variant === 14 && (
          <div className={styles.instaBar}>
            <Link href="/today" className={`${styles.instaItem} ${isItemActive('/today') ? styles.instaItemActive : ''}`}>☀️</Link>
            <Link href="/inbox" className={`${styles.instaItem} ${isItemActive('/inbox') ? styles.instaItemActive : ''}`}>📥</Link>
            {renderFab(styles.instaFab)}
            <Link href="/projects" className={`${styles.instaItem} ${isItemActive('/projects') ? styles.instaItemActive : ''}`}>📁</Link>
            <Link href="/calendar" className={`${styles.instaItem} ${isItemActive('/calendar') ? styles.instaItemActive : ''}`}>📅</Link>
          </div>
        )}

        {/* VARIANT 15: Raycast Mobile Command Capsule */}
        {variant === 15 && (
          <div className={styles.raycastCapsule}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', paddingRight: '6px', borderRight: '1px solid rgba(255,255,255,0.1)' }}>⌘</span>
            {ALL_NAV_ITEMS.slice(0, 4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.raycastItem} ${isItemActive(item.href) ? styles.raycastItemActive : ''}`}
              >
                <span>{item.icon}</span>
              </Link>
            ))}
            {renderFab(styles.raycastFab)}
          </div>
        )}

        {/* VARIANT 16: Slack Mobile Top-Indicator Tab Bar */}
        {variant === 16 && (
          <div className={styles.slackBar}>
            {ALL_NAV_ITEMS.slice(0, 4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.slackItem} ${isItemActive(item.href) ? styles.slackItemActive : ''}`}
              >
                {isItemActive(item.href) && <div className={styles.slackTopIndicator} />}
                <span>{item.icon}</span>
                <span style={{ fontSize: '10px' }}>{item.label}</span>
              </Link>
            ))}
            {renderFab(styles.slackFab)}
          </div>
        )}

        {/* VARIANT 17: Double Tier Stacked Bar */}
        {variant === 17 && (
          <div className={styles.doubleTierContainer}>
            <div className={styles.topTierRow}>
              {ALL_NAV_ITEMS.slice(3).map((item) => (
                <Link key={item.href} href={item.href} className={styles.tierChip}>
                  <span>{item.icon}</span> {item.label}
                </Link>
              ))}
            </div>
            <div className={styles.bottomTierRow}>
              {ALL_NAV_ITEMS.slice(0, 3).map((item) => (
                <Link key={item.href} href={item.href} className={styles.tierMainItem}>
                  <span>{item.icon}</span>
                </Link>
              ))}
              {renderFab(styles.tierFab)}
            </div>
          </div>
        )}

        {/* VARIANT 18: Neumorphic Soft Shadow Bar */}
        {variant === 18 && (
          <div className={styles.neumorphismBar}>
            {ALL_NAV_ITEMS.slice(0, 5).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.neuItem} ${isItemActive(item.href) ? styles.neuItemActive : ''}`}
                title={item.label}
              >
                <span>{item.icon}</span>
              </Link>
            ))}
            {renderFab(styles.neuFab)}
          </div>
        )}

        {/* VARIANT 19: Side Floating Radial Action Bar */}
        {variant === 19 && (
          <div className={styles.radialBar}>
            <div className={styles.radialPill}>
              <Link href="/today" className={styles.radialItem}>☀️</Link>
              <Link href="/projects" className={styles.radialItem}>📁</Link>
              <Link href="/calendar" className={styles.radialItem}>📅</Link>
            </div>
            {renderFab(styles.radialFab)}
          </div>
        )}

        {/* VARIANT 20: Ultra-Compact Micro Bar */}
        {variant === 20 && (
          <div className={styles.microBar}>
            {ALL_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.microItem} ${isItemActive(item.href) ? styles.microItemActive : ''}`}
                title={item.label}
              >
                <span>{item.icon}</span>
              </Link>
            ))}
            {renderFab(styles.microFab)}
          </div>
        )}
      </nav>
    </>
  );
};
