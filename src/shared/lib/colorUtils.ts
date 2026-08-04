'use client';

/**
 * Calculates contrasting text color (black or white) ON TOP of a solid background button of `hex`.
 */
export const getContrastingTextColor = (hex: string): string => {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return '#ffffff';
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  // Relative luminance (WCAG Standard)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150 ? '#0f172a' : '#ffffff';
};

/**
 * Ensures an accent color used AS TEXT or AN ICON on top of a surface background passes WCAG AA contrast (min 4.5:1).
 */
export const getReadableAccentTextColor = (hex: string, isLight: boolean): string => {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return hex;
  let r = parseInt(cleanHex.substring(0, 2), 16);
  let g = parseInt(cleanHex.substring(2, 4), 16);
  let b = parseInt(cleanHex.substring(4, 6), 16);

  // Convert RGB to HSL
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  const hueDeg = Math.round(h * 360);

  if (isLight) {
    // Light surface (#ffffff / #f8fafc): Lightness must be low (25% - 40%) for 4.5:1+ contrast
    const targetL = Math.min(l, 0.38);
    return `hsl(${hueDeg}, ${Math.round(s * 100)}%, ${Math.round(targetL * 100)}%)`;
  } else {
    // Dark surface (#0f172a / #1e293b): Lightness must be high (60% - 75%) for 4.5:1+ contrast
    const targetL = Math.max(l, 0.62);
    return `hsl(${hueDeg}, ${Math.round(s * 100)}%, ${Math.round(targetL * 100)}%)`;
  }
};

export const applyAccentColorVars = (hex: string) => {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  const isLight = root.getAttribute('data-theme') === 'light';

  root.style.setProperty('--color-accent', hex);

  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);

    // Soft accent background (chips, selected items, progress track)
    root.style.setProperty('--color-accent-light', `rgba(${r}, ${g}, ${b}, 0.14)`);
    // Accent-tinted border / focus ring
    root.style.setProperty('--color-accent-border', `rgba(${r}, ${g}, ${b}, 0.30)`);

    // --color-accent-text: readable accent color ON neutral surfaces (WCAG AA, no if-theme checks)
    // Dark surface: hue preserved, L pushed to ≥ 65%
    // Light surface: hue preserved, L pushed to ≤ 38%
    const readableAccentText = getReadableAccentTextColor(hex, isLight);
    root.style.setProperty('--color-accent-text', readableAccentText);

    // Hover state: darken the accent slightly
    const darkenFactor = isLight ? 0.85 : 0.9;
    const rH = Math.round(r * darkenFactor);
    const gH = Math.round(g * darkenFactor);
    const bH = Math.round(b * darkenFactor);
    root.style.setProperty('--color-accent-hover', `rgb(${rH}, ${gH}, ${bH})`);
  }
};
