'use client';

import React, { useCallback, useLayoutEffect, useRef } from 'react';

export interface AutoGrowTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Minimum visible height in text lines (default 1). */
  minRows?: number;
  /** Height stops growing after this many lines; the rest scrolls (default 6). */
  maxRows?: number;
  /** Enter saves instead of inserting a newline; Shift+Enter still breaks the line. */
  submitOnEnter?: boolean;
  onRequestSubmit?: () => void;
}

/**
 * Textarea that grows with its content between `minRows` and `maxRows`.
 * Height is written in JS so it also works on iOS Safari, which still ignores
 * `field-sizing: content`.
 */
export const AutoGrowTextarea = React.forwardRef<HTMLTextAreaElement, AutoGrowTextareaProps>(
  (
    {
      minRows = 1,
      maxRows = 6,
      submitOnEnter = false,
      onRequestSubmit,
      className = '',
      style,
      value,
      onChange,
      onKeyDown,
      ...props
    },
    forwardedRef
  ) => {
    const innerRef = useRef<HTMLTextAreaElement | null>(null);

    const setRefs = (el: HTMLTextAreaElement | null) => {
      innerRef.current = el;
      if (typeof forwardedRef === 'function') forwardedRef(el);
      else if (forwardedRef) forwardedRef.current = el;
    };

    const resize = useCallback(() => {
      const el = innerRef.current;
      if (!el) return;
      const cs = window.getComputedStyle(el);
      const lineHeight = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.4 || 20;
      const padding = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
      const border = (parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.borderBottomWidth) || 0);
      const min = Math.round(lineHeight * minRows + padding + border);
      const max = Math.round(lineHeight * maxRows + padding + border);
      el.style.height = 'auto';
      el.style.height = `${Math.min(Math.max(el.scrollHeight, min), max)}px`;
      el.style.overflowY = el.scrollHeight > max + 1 ? 'auto' : 'hidden';
    }, [minRows, maxRows]);

    useLayoutEffect(() => {
      resize();
    }, [resize, value]);

    // A width change (rotation, modal resize) changes how many lines the same
    // text needs, so re-measure — but only on width, otherwise it loops.
    useLayoutEffect(() => {
      const el = innerRef.current;
      if (!el || typeof ResizeObserver === 'undefined') return;
      let lastWidth = el.clientWidth;
      const observer = new ResizeObserver(() => {
        const current = innerRef.current;
        if (!current) return;
        const width = current.clientWidth;
        if (Math.abs(width - lastWidth) < 1) return;
        lastWidth = width;
        resize();
      });
      observer.observe(el);
      return () => observer.disconnect();
    }, [resize]);

    return (
      <textarea
        ref={setRefs}
        rows={minRows}
        value={value}
        onChange={(event) => {
          resize();
          onChange?.(event);
        }}
        onKeyDown={(event) => {
          if (
            submitOnEnter &&
            event.key === 'Enter' &&
            !event.shiftKey &&
            !event.nativeEvent.isComposing
          ) {
            event.preventDefault();
            onRequestSubmit?.();
            return;
          }
          onKeyDown?.(event);
        }}
        className={className}
        style={{ resize: 'none', ...style }}
        {...props}
      />
    );
  }
);

AutoGrowTextarea.displayName = 'AutoGrowTextarea';
