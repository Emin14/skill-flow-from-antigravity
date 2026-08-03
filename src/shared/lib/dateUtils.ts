/**
 * shared/lib/dateUtils.ts
 * Единый источник утилит для работы с датами в формате 'YYYY-MM-DD'.
 * Все компоненты и хуки должны импортировать отсюда.
 */

/** Возвращает строку текущей даты в формате 'YYYY-MM-DD' */
export const getTodayStr = (): string => new Date().toISOString().split('T')[0];

/** Возвращает строку завтрашней даты в формате 'YYYY-MM-DD' */
export const getTomorrowStr = (): string => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

/**
 * Форматирует строку даты 'YYYY-MM-DD' → 'DD.MM.YYYY'
 * для отображения пользователю.
 */
export const formatDateDisplay = (dateStr: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) return `${parts[2]}.${parts[1]}.${parts[0]}`;
  return dateStr;
};

/**
 * Добавляет указанное количество дней к строке даты 'YYYY-MM-DD'.
 * Если dateStr некорректен — считает от текущей даты.
 */
export const addDaysToDateStr = (dateStr: string, days: number): string => {
  if (!dateStr || !dateStr.includes('-')) {
    const today = new Date();
    today.setDate(today.getDate() + days);
    return today.toISOString().split('T')[0];
  }
  const parts = dateStr.split('-').map(Number);
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Форматирует год, месяц (0-based) и день в строку 'YYYY-MM-DD'.
 * Используется для построения сетки календаря.
 */
export const formatDateStr = (y: number, m: number, d: number): string => {
  const year = y;
  const month = String(m + 1).padStart(2, '0');
  const day = String(d).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Форматирует дату для заголовка календаря на русском языке.
 * Пример: '2026-08-03' → 'понедельник, 3 августа 2026 г.'
 */
export const formatSelectedDateTitle = (dateStr: string): string => {
  if (!dateStr || !dateStr.includes('-')) return dateStr;
  const parts = dateStr.split('-').map(Number);
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  return d.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};
