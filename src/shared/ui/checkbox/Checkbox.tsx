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
          width: '20px',
          height: '20px',
          aspectRatio: '1 / 1',
          boxSizing: 'border-box',
          flexShrink: 0,
          borderRadius: '50%',
          border: checked ? '1.5px solid var(--color-accent)' : '1.5px solid var(--color-text-muted)',
          backgroundColor: checked ? 'var(--color-accent)' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s ease',
        }}
      >
        {checked && (
          <svg width="11" height="9" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 5L4.5 8L10.5 2" stroke="var(--color-accent-on-accent, #ffffff)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
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
