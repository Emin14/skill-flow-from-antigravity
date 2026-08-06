/**
 * shared/lib/dateUtils.ts
 * Единый источник утилит для работы с датами в формате 'YYYY-MM-DD'.
 * Все функции расчёта используют ЛОКАЛЬНОЕ время (Local Timezone),
 * исключая ошибки сдвига дат из-за UTC-преобразований вокруг полуночи.
 */

/** Вспомогательное форматирование объекта Date в строку 'YYYY-MM-DD' по локальному времени */
export const formatLocalDateStr = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/** Возвращает строку текущей даты в формате 'YYYY-MM-DD' по локальному времени */
export const getTodayStr = (): string => formatLocalDateStr(new Date());

/** Возвращает строку завтрашней даты в формате 'YYYY-MM-DD' по локальному времени */
export const getTomorrowStr = (): string => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return formatLocalDateStr(d);
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
 * Если dateStr некорректен — считает от текущей даты по локальному времени.
 */
export const addDaysToDateStr = (dateStr: string, days: number): string => {
  if (!dateStr || !dateStr.includes('-')) {
    const today = new Date();
    today.setDate(today.getDate() + days);
    return formatLocalDateStr(today);
  }
  const parts = dateStr.split('-').map(Number);
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  d.setDate(d.getDate() + days);
  return formatLocalDateStr(d);
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

/**
 * Проверяет, относится ли задача к адаптивному Умному повтору (smart).
 * Только для таких задач при выполнении чекбоксом должна выпадать оценка сложности (SmartRatingModal).
 * Для интервального (spaced), по расписанию (schedule), через N дней (after_completion) окно НЕ выпадает.
 */
export const isSmartRepeatTask = (task: {
  isRepeating?: boolean;
  repetitionMode?: string;
  repeatConfig?: { repeatType?: string };
}): boolean => {
  const mode = task.repetitionMode;
  const type = task.repeatConfig?.repeatType;
  return mode === 'smart' || mode === 'spaced' || type === 'smart' || type === 'spaced' || (!!task.isRepeating && (!mode || mode === 'smart' || mode === 'spaced'));
};
