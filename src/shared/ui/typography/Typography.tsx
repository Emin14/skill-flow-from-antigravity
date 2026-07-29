import React from 'react';
import styles from './Typography.module.css';

export interface TypographyProps extends React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  children?: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  children,
  className = '',
  style,
  ...props
}) => {
  const Component = variant === 'h1' ? 'h1' : variant === 'h2' ? 'h2' : variant === 'h3' ? 'h3' : 'p';

  return (
    <Component
      style={style}
      className={`${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
