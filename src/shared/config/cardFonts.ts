'use client';

export interface TaskCardFontOption {
  id: string;
  name: string;
  appName: string;
  fontFamily: string;
  sampleText?: string;
  description: string;
}

export const TASK_CARD_FONTS: TaskCardFontOption[] = [
  {
    id: 'system_ios',
    name: 'SF Pro / iOS System',
    appName: 'Things 3 / Apple Reminders',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", sans-serif',
    sampleText: 'Посмотреть курс TypeScript на Stepik',
    description: 'Нативный системный шрифт iOS / Apple — чистый, четкий и знакомый миллионам пользователей.',
  },
  {
    id: 'inter_todoist',
    name: 'Inter (Todoist / Linear)',
    appName: 'Todoist / Linear / Notion',
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    sampleText: 'Посмотреть курс TypeScript на Stepik',
    description: 'Ультрасовременный гротеск с глубокой поддержкой кириллицы. Идеально для продуктивности.',
  },
  {
    id: 'roboto_ticktick',
    name: 'Roboto (TickTick / Google Tasks)',
    appName: 'TickTick / Google Tasks',
    fontFamily: '"Roboto", -apple-system, sans-serif',
    sampleText: 'Посмотреть курс TypeScript на Stepik',
    description: 'Официальный шрифт Material Design с отточенной кириллической типографикой.',
  },
  {
    id: 'rubik_yandex',
    name: 'Rubik (Яндекс Трекер / VK Work)',
    appName: 'Яндекс Трекер / VK WorkSpace',
    fontFamily: '"Rubik", -apple-system, sans-serif',
    sampleText: 'Посмотреть курс TypeScript на Stepik',
    description: 'Округлый современный гротеск с превосходной поддержкой русского языка.',
  },
  {
    id: 'montserrat_modern',
    name: 'Montserrat (Any.do / Singularity)',
    appName: 'Any.do / Minimalist Apps',
    fontFamily: '"Montserrat", sans-serif',
    sampleText: 'Посмотреть курс TypeScript на Stepik',
    description: 'Геометрический стильный шрифт с широкими буквами и выразительными штрихами.',
  },
  {
    id: 'outfit_asana',
    name: 'Outfit (Asana / Taskade)',
    appName: 'Asana / Taskade',
    fontFamily: '"Outfit", sans-serif',
    sampleText: 'Посмотреть курс TypeScript на Stepik',
    description: 'Модный технологичный геометрик с сочной современной кириллицей.',
  },
  {
    id: 'jetbrains_mono',
    name: 'JetBrains Mono (Linear / Raycast)',
    appName: 'Linear / Raycast / Developer Edition',
    fontFamily: '"JetBrains Mono", monospace',
    sampleText: 'Посмотреть курс TypeScript на Stepik',
    description: 'Инженерный моноширинный шрифт с четким разделением символов для IT-задач.',
  },
  {
    id: 'playfair_serif',
    name: 'Editorial Serif (Notion / Craft)',
    appName: 'Notion / Craft Journaling',
    fontFamily: '"Playfair Display", "Georgia", serif',
    sampleText: 'Посмотреть курс TypeScript на Stepik',
    description: 'Элегантная книжная антиква с аккуратными засечками для сфокусированной работы.',
  },
];

export const applyTaskCardFont = (fontId: string | null) => {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;

  if (!fontId || fontId === 'default' || fontId === 'system') {
    root.style.removeProperty('--task-card-font-family');
    localStorage.removeItem('user-card-font-id');
    return;
  }

  const fontOpt = TASK_CARD_FONTS.find((f) => f.id === fontId);
  if (!fontOpt) {
    root.style.removeProperty('--task-card-font-family');
    return;
  }

  root.style.setProperty('--task-card-font-family', fontOpt.fontFamily);
  localStorage.setItem('user-card-font-id', fontOpt.id);
};
