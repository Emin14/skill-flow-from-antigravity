/**
 * shared/config/storageKeys.ts
 * Единый источник всех ключей localStorage.
 * Никаких magic strings — только эти константы.
 */
export const STORAGE_KEYS = {
  THEME: 'skillflow_theme',
  ACCENT_COLOR: 'skillflow_accent_color',
  CATEGORY_THEME_ID: 'skillflow_category_text_theme_id',
  CARD_BG_THEME_ID: 'skillflow_card_bg_theme_id',
  TASKS: 'skillflow_tasks',
  TOPICS: 'skillflow_topics',
  GOALS: 'skillflow_goals',
  MATERIALS: 'skillflow_materials',
  INBOX: 'skillflow_inbox',
  ACTIVITY_LOG: 'skillflow_activity_log',
  REPEAT_CARDS: 'skillflow_repeat_cards',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
