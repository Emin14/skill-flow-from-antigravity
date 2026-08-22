import rawOxford5000 from '@/data/oxford_5000.json';
import {
  OxfordWord,
  CEFRLevel,
  TranslationMeaning,
  SentenceExample,
  WordForms,
} from '../model/types';

interface RawMeaning {
  id?: number;
  partOfSpeech?: string;
  translation?: string;
  primary?: boolean;
  register?: string[];
  synonyms?: string[];
  examples?: Array<{ en?: string; ru?: string }>;
}

interface RawForm {
  word?: string;
  types?: string[];
}

interface RawEntry {
  word: string;
  frequency_rank?: number;
  cefr?: string;
  phon_br?: string;
  phon_n_am?: string;
  forms?: RawForm[] | null;
  topics?: string[];
  lists?: {
    oxford3000?: boolean;
    oxford5000?: boolean;
  };
  meanings?: RawMeaning[];
}

let cachedDictionary: OxfordWord[] | null = null;
let cachedMap: Map<string, OxfordWord> | null = null;

function buildOxford5000(): OxfordWord[] {
  if (cachedDictionary) {
    return cachedDictionary;
  }

  const rawEntries = Object.values(rawOxford5000) as unknown as RawEntry[];

  cachedDictionary = rawEntries.map((entry, idx) => {
    const posMap = new Map<string, string[]>();
    const examples: SentenceExample[] = [];

    for (const m of entry.meanings || []) {
      const pos = m.partOfSpeech || 'other';
      if (!posMap.has(pos)) {
        posMap.set(pos, []);
      }
      if (m.translation) {
        posMap.get(pos)!.push(m.translation);
      }
      if (Array.isArray(m.examples)) {
        for (const ex of m.examples) {
          if (ex && ex.en) {
            examples.push({
              en: ex.en,
              ru: ex.ru || '',
            });
          }
        }
      }
    }

    const translations: TranslationMeaning[] = Array.from(posMap.entries()).map(
      ([partOfSpeech, meanings]) => ({
        partOfSpeech,
        meanings,
      })
    );

    const wordForms: WordForms = {};
    if (Array.isArray(entry.forms)) {
      for (const form of entry.forms) {
        if (!form.word) continue;
        const types = form.types || [];
        if (types.includes('past')) {
          if (!wordForms.verbForms) wordForms.verbForms = {};
          wordForms.verbForms.past = form.word;
        }
        if (types.includes('past_participle')) {
          if (!wordForms.verbForms) wordForms.verbForms = {};
          wordForms.verbForms.pastParticiple = form.word;
        }
        if (types.includes('plural')) {
          if (!wordForms.nounForms) wordForms.nounForms = {};
          wordForms.nounForms.plural = form.word;
        }
        if (types.includes('comparative')) {
          if (!wordForms.adjectiveForms) wordForms.adjectiveForms = {};
          wordForms.adjectiveForms.comparative = form.word;
        }
        if (types.includes('superlative')) {
          if (!wordForms.adjectiveForms) wordForms.adjectiveForms = {};
          wordForms.adjectiveForms.superlative = form.word;
        }
      }
    }

    const cefrRaw = (entry.cefr || 'A1').toUpperCase();
    const validLevels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];
    const cefrLevel: CEFRLevel = validLevels.includes(cefrRaw as CEFRLevel)
      ? (cefrRaw as CEFRLevel)
      : 'A1';

    const detailedMeanings = (entry.meanings || []).map((m, mIdx) => ({
      id: m.id || mIdx + 1,
      partOfSpeech: m.partOfSpeech || 'other',
      translation: m.translation || '',
      primary: m.primary,
      register: m.register || [],
      synonyms: m.synonyms || [],
      examples: Array.isArray(m.examples)
        ? m.examples
            .filter((ex) => ex && ex.en)
            .map((ex) => ({ en: ex.en!, ru: ex.ru || '' }))
        : [],
    }));

    return {
      id: `oxford-${String(idx + 1).padStart(4, '0')}`,
      word: entry.word,
      transcription: entry.phon_n_am || entry.phon_br || '',
      phonBr: entry.phon_br || '',
      phonNAm: entry.phon_n_am || '',
      cefrLevel,
      frequencyRank: entry.frequency_rank || idx + 1,
      meanings: detailedMeanings,
      translations,
      wordForms,
      examples,
      collocations: [],
      wordFamily: [],
      synonyms: [],
      antonyms: [],
      lists: entry.lists,
      topics: entry.topics || [],
    };
  });

  cachedMap = new Map(cachedDictionary.map((w) => [w.id, w]));
  return cachedDictionary;
}

export function getOxfordDictionary(): OxfordWord[] {
  return buildOxford5000();
}

export function getOxfordDictionaryMap(): Map<string, OxfordWord> {
  if (!cachedMap) {
    buildOxford5000();
  }
  return cachedMap!;
}

export function getOxfordWordById(id: string): OxfordWord | undefined {
  return getOxfordDictionaryMap().get(id);
}
