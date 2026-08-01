'use client';

import React, { useState, forwardRef } from 'react';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  disableAutofill?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      disableAutofill = true,
      className = '',
      autoComplete = 'off',
      autoCorrect = 'off',
      autoCapitalize = 'sentences',
      spellCheck = false,
      onFocus,
      onTouchStart,
      name,
      ...props
    },
    ref
  ) => {
    // Top 1 Safari/iOS WebKit Autofill Bypass: Dynamic readOnly state
    const [isReadOnly, setIsReadOnly] = useState<boolean>(disableAutofill);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (disableAutofill && isReadOnly) {
        setIsReadOnly(false);
      }
      if (onFocus) {
        onFocus(e);
      }
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLInputElement>) => {
      if (disableAutofill && isReadOnly) {
        setIsReadOnly(false);
      }
      if (onTouchStart) {
        onTouchStart(e);
      }
    };

    const safeName = name || 'app_input_field';

    return (
      <div className={styles.wrapper}>
        {label && <label className={styles.label}>{label}</label>}
        <input
          ref={ref}
          name={safeName}
          readOnly={isReadOnly}
          autoComplete={autoComplete}
          autoCorrect={autoCorrect}
          autoCapitalize={autoCapitalize}
          spellCheck={spellCheck}
          onFocus={handleFocus}
          onTouchStart={handleTouchStart}
          className={`${styles.input} ${className}`}
          {...props}
        />
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
