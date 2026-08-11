export type RepetitionMode = 'none' | 'spaced' | 'schedule' | 'specific_days' | 'after_completion' | 'smart';
export type ScheduleFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type SmartRating = 'easy' | 'normal' | 'hard' | 'again';

export interface RepetitionModeOption {
  id: RepetitionMode;
  label: string;
  description?: string;
  enabled?: boolean;
}

// Global list of repetition options (comment out any item or set enabled: false to disable)
export const REPETITION_MODE_OPTIONS: RepetitionModeOption[] = [
  { id: 'none', label: 'Без повторения', enabled: true },
  { id: 'spaced', label: 'Интервальное (1 • 3 • 7 • 14 • 30 • 90)', enabled: true },
  { id: 'schedule', label: 'По расписанию', enabled: true },
  { id: 'specific_days', label: 'По определенным дням', enabled: true },
  { id: 'after_completion', label: 'После выполнения', enabled: true },
  { id: 'smart', label: 'Умное повторение', enabled: true },
];

export const SCHEDULE_FREQUENCY_OPTIONS: { id: ScheduleFrequency; label: string }[] = [
  { id: 'daily', label: 'Каждый день' },
  { id: 'weekly', label: 'Каждую неделю' },
  { id: 'monthly', label: 'Каждый месяц' },
  { id: 'yearly', label: 'Каждый год' },
];

export interface WeekdayOption {
  id: number; // 1 = Пн, 2 = Вт, 3 = Ср, 4 = Чт, 5 = Пт, 6 = Сб, 0 = Вс
  label: string;
  short: string;
}

export const WEEKDAY_OPTIONS: WeekdayOption[] = [
  { id: 1, label: 'Понедельник', short: 'Пн' },
  { id: 2, label: 'Вторник', short: 'Вт' },
  { id: 3, label: 'Среда', short: 'Ср' },
  { id: 4, label: 'Четверг', short: 'Чт' },
  { id: 5, label: 'Пятница', short: 'Пт' },
  { id: 6, label: 'Суббота', short: 'Сб' },
  { id: 0, label: 'Воскресенье', short: 'Вс' },
];

export const formatWeeklyDays = (days?: number[] | null): string => {
  if (!days || days.length === 0) return 'По дням';
  const map: Record<number, string> = { 1: 'Пн', 2: 'Вт', 3: 'Ср', 4: 'Чт', 5: 'Пт', 6: 'Сб', 0: 'Вс' };
  const ordered = [1, 2, 3, 4, 5, 6, 0].filter((d) => days.includes(d));
  return ordered.map((d) => map[d]).join(', ');
};

export const SMART_RATING_OPTIONS: {
  id: SmartRating;
  label: string;
  icon: string;
  factor: number | null;
}[] = [
  { id: 'easy', label: 'Легко', icon: '😄', factor: 2.5 },
  { id: 'normal', label: 'Нормально', icon: '🙂', factor: 1.7 },
  { id: 'hard', label: 'Сложно', icon: '😣', factor: 1.2 },
  { id: 'again', label: 'Не помню', icon: '❌', factor: null },
];

// Spaced repetition interval steps: 1, 3, 7, 14, 30, 90 days
export const SPACED_INTERVAL_STEPS = [1, 3, 7, 14, 30, 90];

/** Метки режимов повторения для UI (единый источник). */
export const REPEAT_LABELS: Record<RepetitionMode, string> = {
  none: '🔕 Без повторений',
  smart: '🧠 Умное',
  spaced: '📐 Интервальное',
  schedule: '📅 По расписанию',
  specific_days: '🗓️ По определенным дням',
  after_completion: '✅ После выполнения',
};

/** Метки частоты расписания для UI (единый источник). */
export const FREQ_LABELS: Record<ScheduleFrequency, string> = {
  daily: 'Каждый день',
  weekly: 'Каждую неделю',
  monthly: 'Каждый месяц',
  yearly: 'Каждый год',
};
