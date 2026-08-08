/**
 * Formats pomodoro counts for UI display.
 * If number has decimals (e.g. 0.99, 0.33), truncates to 1 decimal place (0.9, 0.3).
 * Whole numbers return cleanly as integers (1, 2, 3).
 */
export const formatPomodorosCount = (count?: number | null): string => {
  if (count === undefined || count === null || isNaN(count)) return '0';
  if (Number.isInteger(count)) return String(count);
  const truncated = Math.floor(count * 10) / 10;
  return String(truncated);
};
