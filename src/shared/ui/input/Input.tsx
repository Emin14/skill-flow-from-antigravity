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
      autoComplete = 'one-time-code',
      autoCorrect = 'off',
      autoCapitalize = 'sentences',
      spellCheck = false,
      name,
      ...props
    },
    ref
  ) => {
    const safeName = name || 'task_field_input';

    return (
      <div className={styles.wrapper}>
        {label && <label className={styles.label}>{label}</label>}
        <input
          ref={ref}
          name={safeName}
          autoComplete={disableAutofill ? 'one-time-code' : autoComplete}
          autoCorrect={autoCorrect}
          autoCapitalize={autoCapitalize}
          spellCheck={spellCheck}
          data-lpignore="true"
          data-form-type="other"
          className={`${styles.input} ${error ? styles.inputError : ''} ${className}`}
          {...props}
        />
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
