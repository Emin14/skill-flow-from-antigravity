import React from 'react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionButton?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '🌱',
  title,
  description,
  actionButton,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.title}>{title}</div>
      {description && <div className={styles.description}>{description}</div>}
      {actionButton && <div style={{ marginTop: 'var(--space-2)' }}>{actionButton}</div>}
    </div>
  );
};
