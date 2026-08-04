'use client';

/**
 * Calculates contrasting text color (#0f172a or #ffffff) ON TOP of a solid accent element of `hex`.
 * Uses WCAG 2.1 relative luminance calculation.
 */
export const getContrastingTextColor = (hex: string): string => {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return '#ffffff';
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  // Relative luminance (WCAG Standard formula)
  const sR = r / 255;
  const sG = g / 255;
  const sB = b / 255;
  const R = sR <= 0.03928 ? sR / 12.92 : Math.pow((sR + 0.055) / 1.055, 2.4);
  const G = sG <= 0.03928 ? sG / 12.92 : Math.pow((sG + 0.055) / 1.055, 2.4);
  const B = sB <= 0.03928 ? sB / 12.92 : Math.pow((sB + 0.055) / 1.055, 2.4);
  const L = 0.2126 * R + 0.7152 * G + 0.0722 * B;

  return L > 0.45 ? '#0f172a' : '#ffffff';
};

/**
 * Ensures an accent color used AS LEVEL 2 TEXT or AN ICON on top of a surface background is clear, readable,
 * and maintains perfect visual hierarchy relative to Level 1 primary headings.
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
  const satPercent = Math.round(s * 100);

  if (isLight) {
    // Light surface (#ffffff / #f8fafc): Level 2 Accent Text (Lightness <= 30%)
    const targetL = Math.min(l, 0.30);
    const minSat = Math.max(satPercent, 65);
    return `hsl(${hueDeg}, ${minSat}%, ${Math.round(targetL * 100)}%)`;
  } else {
    // Dark surface (#0f172a / #1e293b): Level 2 Accent Text (Lightness >= 68%)
    const targetL = Math.max(l, 0.68);
    const minSat = Math.max(satPercent, 70);
    return `hsl(${hueDeg}, ${minSat}%, ${Math.round(targetL * 100)}%)`;
  }
};

/**
 * Systemic Accent Token Injector — computes and sets all dynamic accent tokens
 * on documentElement without any theme conditional hacks in components.
 */
export const applyAccentColorVars = (hex: string) => {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  const isLight = root.getAttribute('data-theme') === 'light';

  root.style.setProperty('--color-accent', hex);
  localStorage.setItem('user-accent-color', hex);

  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);

    // Soft accent background (chips, selected items, progress track)
    root.style.setProperty('--color-accent-light', `rgba(${r}, ${g}, ${b}, ${isLight ? 0.12 : 0.16})`);
    // Accent-tinted border / focus ring
    root.style.setProperty('--color-accent-border', `rgba(${r}, ${g}, ${b}, ${isLight ? 0.28 : 0.35})`);

    // --color-accent-text: Level 2 accent text ON neutral surfaces
    const readableAccentText = getReadableAccentTextColor(hex, isLight);
    root.style.setProperty('--color-accent-text', readableAccentText);

    // --color-accent-on-accent: high contrast text ON TOP OF solid accent elements (buttons, active tabs)
    const onAccentText = getContrastingTextColor(hex);
    root.style.setProperty('--color-accent-on-accent', onAccentText);

    // Hover state: adjust accent brightness
    const darkenFactor = isLight ? 0.85 : 0.9;
    const rH = Math.round(r * darkenFactor);
    const gH = Math.round(g * darkenFactor);
    const bH = Math.round(b * darkenFactor);
    root.style.setProperty('--color-accent-hover', `rgb(${rH}, ${gH}, ${bH})`);
  }
};
