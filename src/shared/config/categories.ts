export const TASK_CATEGORIES = [
  'Без категории',
  'Задача',
  'Опыт на камеру',
  'Теория',
  'Здоровье',
  'Практика Frontend',
] as const;

export type TaskCategory = (typeof TASK_CATEGORIES)[number] | string;
