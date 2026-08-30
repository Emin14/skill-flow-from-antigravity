export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

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
  register?: string;
}

export interface PhraseItem {
  id?: number;
  phrase: string;
  partOfSpeech?: string;
  translation: string;
  register?: string[];
  examples?: SentenceExample[];
}

export interface WordMeaningItem {
  id?: number;
  partOfSpeech: string;
  translation: string;
  primary?: boolean;
  register?: string[];
  synonyms?: string[];
  examples?: SentenceExample[];
  phrases?: PhraseItem[];
}

export interface OxfordWord {
  id: string;
  word: string;
  transcription: string;
  phonBr?: string;
  phonNAm?: string;
  cefrLevel: CEFRLevel;
  frequencyRank: number;
  meanings: WordMeaningItem[];
  translations: TranslationMeaning[];
  wordForms: WordForms;
  relatedWords?: RelatedWord[];
  wordFamily?: RelatedWord[];
  synonyms?: RelatedWord[];
  antonyms?: RelatedWord[];
  collocations: Collocation[];
  examples: SentenceExample[];
  phrases?: PhraseItem[];
  lists?: {
    oxford3000?: boolean;
    oxford5000?: boolean;
  };
  topics?: string[];
  status?: WordStatus;
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

export interface LevelProgressItem {
  level: CEFRLevel;
  title: string;
  total: number;
  learned: number;
  mastered: number;
  percent: number;
  isCurrent: boolean;
  isCompleted: boolean;
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
  levelStats?: Record<CEFRLevel, LevelProgressItem>;
  currentLevel?: CEFRLevel;
}

export interface EnglishSettingsConfig {
  dailyNewWords: number;
  maxReviewsPerDay: number;
  activeLevels: CEFRLevel[];
  autoPronounce: boolean;
  accent: 'us' | 'uk';
}
