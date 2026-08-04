'use client';

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
  }
};
