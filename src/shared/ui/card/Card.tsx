import React from 'react';
import styles from './Card.module.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  style,
  ...props
}) => {
  return (
    <div className={`${styles.card} ${className}`} style={style} {...props}>
      {children}
    </div>
  );
};
