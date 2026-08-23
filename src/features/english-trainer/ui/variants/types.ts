import React from 'react';
import {
  SessionWordCard,
  WordMeaningItem,
  EnglishSettingsConfig,
} from '@/entities/english';

export interface BaseWordCardProps {
  currentCard: SessionWordCard;
  meaningsList: WordMeaningItem[];
  safeMeaningIndex: number;
  currentMeaning: WordMeaningItem;
  displayTranscription: string;
  settings: EnglishSettingsConfig;
  onSelectMeaning: (index: number) => void;
  renderHighlightedSentence: (text: string, target: string) => React.ReactNode;
}

export interface CardVariantOption {
  id: number;
  name: string;
  subtitle: string;
  tag: string;
}

export const CARD_VARIANTS: CardVariantOption[] = [
  {
    id: 1,
    name: 'Вариант 1: Степпер (круглые точки и стрелки)',
    subtitle: 'Нижние круглые точки (до 9 с авто-центрированием) + переключатель [+N доп.]',
    tag: 'Точки-степпер',
  },
  {
    id: 2,
    name: 'Вариант 2: Трек плашек + боковые стрелки быстрого переключения',
    subtitle: 'Горизонтальный трек плашек над карточкой со стрелками [‹] и [›] по бокам для мгновенного перехода',
    tag: 'Плашки + стрелки',
  },
];
