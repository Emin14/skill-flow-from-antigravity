import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  className = '',
  style,
  ...props
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', width: '100%' }}>
      {label && (
        <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', fontWeight: 'var(--font-weight-medium)' }}>
          {label}
        </label>
      )}
      <textarea
        style={{
          width: '100%',
          minHeight: '80px',
          padding: 'var(--space-3) var(--space-4)',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text-primary)',
          fontSize: 'var(--font-size-md)',
          fontFamily: 'var(--font-family-base)',
          outline: 'none',
          resize: 'vertical',
          transition: 'border-color var(--transition-fast)',
          ...style,
        }}
        className={className}
        {...props}
      />
      {error && (
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger)' }}>{error}</span>
      )}
    </div>
  );
};
