'use client';

import React from 'react';
import { Sidebar } from '@/widgets/sidebar/ui/Sidebar';
import { TopBar } from '@/widgets/topbar/ui/TopBar';
import { BottomNav } from '@/widgets/bottom-nav/ui/BottomNav';
import { ToastContainer } from '@/shared/ui';
import { QuickCreateModal } from '@/features/quick-create';
import styles from './MainLayout.module.css';

export interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className={styles.layoutContainer}>
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        <TopBar />
        <main className={styles.pageContent}>{children}</main>
      </div>

      {/* Mobile Bottom Navigation (iPhone 17 Pro / Mobile) */}
      <BottomNav />

      {/* Global Quick Creation Modal */}
      <QuickCreateModal />

      {/* Global Toast & Undo Notification System */}
      <ToastContainer />
    </div>
  );
};
