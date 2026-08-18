export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2';

export type WordStatus = 'NEW' | 'LEARNING' | 'REVIEW' | 'MASTERED';

export type ReviewRating = 'again' | 'hard' | 'good' | 'easy' | 'already_know';

export interface TranslationMeaning {
  partOfSpeech: string;
  meanings: string[];
}

export interface WordForms {
  verbForms?: {
    past?: string;
    pastParticiple?: string;
    thirdPerson?: string;
    ing?: string;
  };
  nounForms?: {
    plural?: string;
  };
  adjectiveForms?: {
    comparative?: string;
    superlative?: string;
  };
}

export interface RelatedWord {
  word: string;
  translation: string;
}

export interface Collocation {
  en: string;
  ru: string;
}

export interface SentenceExample {
  en: string;
  ru: string;
}

export interface OxfordWord {
  id: string;
  word: string;
  transcription: string;
  cefrLevel: CEFRLevel;
  frequencyRank: number;
  translations: TranslationMeaning[];
  wordForms: WordForms;
  relatedWords?: RelatedWord[];
  wordFamily?: RelatedWord[];
  synonyms?: RelatedWord[];
  antonyms?: RelatedWord[];
  collocations: Collocation[];
  examples: SentenceExample[];
}

export interface EnglishWordProgressItem {
  wordId: string;
  status: WordStatus;
  nextReviewDate: string;
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  errorCount: number;
  lastReviewedAt: string | null;
}

export interface SessionWordCard extends OxfordWord {
  progress?: EnglishWordProgressItem;
  isNew: boolean;
}

export interface EnglishSessionResponse {
  todayStr: string;
  newWords: SessionWordCard[];
  reviewWords: SessionWordCard[];
  dailyLearnedCount: number; // How many of today's target words have been learned today (e.g. 2)
  dailyTargetCount: number;  // Today's target quota (e.g. 5)
  totalLearned: number;
  totalMastered: number;
  totalWords: number;
  streakDays: number;
  isCompletedToday: boolean;
}

export interface EnglishSettingsConfig {
  dailyNewWords: number;
  maxReviewsPerDay: number;
  activeLevels: CEFRLevel[];
  autoPronounce: boolean;
  accent: 'us' | 'uk';
}
