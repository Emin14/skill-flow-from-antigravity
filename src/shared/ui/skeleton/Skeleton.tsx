import React from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '24px',
  borderRadius = 'var(--radius-md)',
  className = '',
}) => {
  return (
    <div
      className={`${styles.skeleton} ${className}`}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  );
};
