'use client';

import React from 'react';

export const ProjectSectionBannerWidget: React.FC = () => {
  return (
    <div style={{ width: '100%', marginBottom: '12px', boxSizing: 'border-box' }}>
      {/* Locked Variant 1: Hero Dual Gradient Ribbon (No Left Icon, Theme Adaptive Gradient) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
          padding: '12px 16px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, var(--color-accent-light) 0%, var(--color-surface) 100%)',
          border: '1px solid var(--color-accent-border)',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>🚀 Крупные задачи</h2>
        <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: '2px 0 0 0', lineHeight: 1.4 }}>
          Каталог проектов: организуйте рабочие процессы с любой нужной глубиной вложенности подзадач.
        </p>
      </div>
    </div>
  );
};
