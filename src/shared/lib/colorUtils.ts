'use client';

export const getContrastingTextColor = (hex: string): string => {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return '#ffffff';
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  // Calculate relative luminance (W3C WCAG Standard)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 160 ? '#0f172a' : '#ffffff';
};

export const applyAccentColorVars = (hex: string) => {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--color-accent', hex);

  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);

    root.style.setProperty('--color-accent-light', `rgba(${r}, ${g}, ${b}, 0.14)`);
    root.style.setProperty('--color-accent-light-bg', `rgba(${r}, ${g}, ${b}, 0.08)`);
    root.style.setProperty('--color-accent-border', `rgba(${r}, ${g}, ${b}, 0.28)`);

    const textContrastColor = getContrastingTextColor(hex);
    root.style.setProperty('--color-accent-text', textContrastColor);
  }
};
