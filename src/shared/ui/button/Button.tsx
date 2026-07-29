import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const combinedClassName = [
    styles.button,
    styles[variant],
    styles[size],
    className,
  ].filter(Boolean).join(' ');

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};
