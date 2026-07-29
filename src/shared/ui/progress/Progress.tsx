import React from 'react';
import styles from './Progress.module.css';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  color?: string;
  height?: number;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  color = 'var(--color-accent)',
  height = 6,
  className = '',
  style,
  ...props
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={`${styles.track} ${className}`}
      style={{ height: `${height}px`, ...style }}
      {...props}
    >
      <div
        className={styles.fill}
        style={{
          width: `${clampedValue}%`,
          backgroundColor: color,
        }}
      />
    </div>
  );
};
