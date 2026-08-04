import React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  className = '',
  style,
  disabled,
  ...props
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
    if ((e.key === ' ' || e.key === 'Enter') && !disabled && onChange) {
      e.preventDefault();
      // Trigger onChange
      const syntheticEvent = {
        target: { checked: !checked },
        stopPropagation: () => {},
        preventDefault: () => {},
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  return (
    <label
      role="checkbox"
      aria-checked={!!checked}
      aria-label={label || 'Выполнить задачу'}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        userSelect: 'none',
        outline: 'none',
        ...style,
      }}
      className={className}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        style={{ display: 'none' }}
        {...props}
      />
      <div
        style={{
          width: '18px',
          height: '18px',
          borderRadius: 'var(--radius-sm)',
          border: checked ? 'none' : '1px solid var(--color-text-muted)',
          backgroundColor: checked ? 'var(--color-accent)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all var(--transition-fast)',
        }}
      >
        {checked && (
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 5L4.5 8.5L11 1.5" stroke="var(--color-accent-on-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      {label && (
        <span style={{ fontSize: 'var(--font-size-md)', color: checked ? 'var(--color-text-muted)' : 'var(--color-text-primary)', textDecoration: checked ? 'line-through' : 'none' }}>
          {label}
        </span>
      )}
    </label>
  );
};
