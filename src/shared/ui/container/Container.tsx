import React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  maxWidth?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = '1200px',
  className = '',
  style,
  ...props
}) => {
  return (
    <div
      style={{
        maxWidth,
        width: '100%',
        margin: '0 auto',
        padding: '0 24px',
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};
