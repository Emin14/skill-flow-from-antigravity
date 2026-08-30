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
  isReviewWord?: boolean;
  isAnswerRevealed?: boolean;
  onRevealAnswer?: () => void;
}
