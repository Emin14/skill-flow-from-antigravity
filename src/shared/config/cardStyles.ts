'use client';

export interface TaskCardStyleOption {
  id: string;
  name: string;
  cardBgColor: string;
  cardBorder: string;
  textColor: string;
  isFramelessNeon?: boolean;
}

export const TASK_CARD_STYLES: TaskCardStyleOption[] = [
  {
    id: 'white',
    name: '1. #FFFFFF (Светлая карточка)',
    cardBgColor: '#FFFFFF',
    cardBorder: 'rgba(0, 0, 0, 0.08)',
    textColor: '#18181b',
  },
  {
    id: 'dark_2a2a2a',
    name: '2. #2A2A2A (Темно-серый + рамка #353535)',
    cardBgColor: '#2A2A2A',
    cardBorder: '#353535',
    textColor: '#f8fafc',
  },
  {
    id: 'dark_1c1c1e',
    name: '3. #1C1C1E (Тёмно-серый уголь)',
    cardBgColor: '#1C1C1E',
    cardBorder: '#2C2C2E',
    textColor: '#ffffff',
  },
  {
    id: 'dark_1c1c1e_orange',
    name: '4. #1C1C1E (Темно-серый + оранжевый #FF6B00)',
    cardBgColor: '#1C1C1E',
    cardBorder: '#FF6B00',
    textColor: '#ffffff',
  },
  {
    id: 'dark_1e2222',
    name: '5. #1E2222 (Темный графит + бордер #242828)',
    cardBgColor: '#1E2222',
    cardBorder: '#242828',
    textColor: '#f1f5f9',
  },
  {
    id: 'dark_1b1e28_frameless',
    name: '6. #1B1E28 (Бескаркасный / темный синий)',
    cardBgColor: '#1B1E28',
    cardBorder: 'transparent',
    textColor: '#f8fafc',
  },
  {
    id: 'frameless_neon_capsules',
    name: '7. Бескаркасный список с неоновыми капсулами',
    cardBgColor: 'rgba(255, 255, 255, 0.02)',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    textColor: '#f8fafc',
    isFramelessNeon: true,
  },
];

export const applyTaskCardStyle = (styleId: string) => {
  if (typeof window === 'undefined') return;
  const styleOpt = TASK_CARD_STYLES.find((s) => s.id === styleId) || TASK_CARD_STYLES[0];
  const root = document.documentElement;

  root.style.setProperty('--color-surface', styleOpt.cardBgColor);
  root.style.setProperty('--color-border', styleOpt.cardBorder);
  if (styleOpt.textColor) {
    root.style.setProperty('--color-text-primary', styleOpt.textColor);
  }

  if (styleOpt.isFramelessNeon) {
    root.setAttribute('data-card-frameless-neon', 'true');
  } else {
    root.removeAttribute('data-card-frameless-neon');
  }

  localStorage.setItem('user-card-style-id', styleOpt.id);
};
