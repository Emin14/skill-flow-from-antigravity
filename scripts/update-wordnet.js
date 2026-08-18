"use strict";
const fs = require("fs");
const path = require("path");

const DICT = path.join("scripts", "wordnet", "dict");
const OXFORD_PATH = "oxford_3000.json";
const OUTPUT_PATHS = ["oxford_3000.json", "src/data/oxford_3000.json"];

process.stdout.write("Loading WordNet data...");
const wnRaw = {
  noun: fs.readFileSync(path.join(DICT, "data.noun"), "utf-8"),
  verb: fs.readFileSync(path.join(DICT, "data.verb"), "utf-8"),
  adj:  fs.readFileSync(path.join(DICT, "data.adj"),  "utf-8"),
  adv:  fs.readFileSync(path.join(DICT, "data.adv"),  "utf-8"),
};
console.log(" OK");

process.stdout.write("Loading indices...");
function loadIndex(f) {
  const map = new Map();
  for (const line of fs.readFileSync(path.join(DICT, "index." + f), "utf-8").split("\n")) {
    if (!line || line.startsWith(" ")) continue;
    const sp = line.indexOf(" ");
    if (sp > 0) map.set(line.slice(0, sp), line);
  }
  return map;
}
const wnIdx = { noun: loadIndex("noun"), verb: loadIndex("verb"), adj: loadIndex("adj"), adv: loadIndex("adv") };
console.log(" OK");

function parseSynset(line) {
  if (!line || !line.trim() || line.startsWith(" ")) return null;
  const sep = line.indexOf("| ");
  const gloss = sep > -1 ? line.slice(sep + 2).trim() : "";
  const body = (sep > -1 ? line.slice(0, sep) : line).trim();
  const parts = body.split(/\s+/);
  if (parts.length < 5) return null;
  const ss_type = parts[2];
  const wCnt = parseInt(parts[3], 16);
  if (isNaN(wCnt)) return null;
  const words = [];
  let i = 4;
  for (let w = 0; w < wCnt; w++) {
    if (i >= parts.length) break;
    const raw = parts[i].replace(/\([^)]+\)/g, "").replace(/_/g, " ").toLowerCase().trim();
    if (raw) words.push(raw);
    i += 2;
  }
  const pCnt = parseInt(parts[i] || "0");
  i++;
  const ptrs = [];
  for (let p = 0; p < pCnt; p++) {
    if (i + 3 > parts.length) break;
    ptrs.push({ sym: parts[i], off: parts[i + 1], pos: parts[i + 2] });
    i += 4;
  }
  return { ss_type, words, gloss, ptrs };
}

function getSynset(off, posKey) {
  const raw = wnRaw[posKey];
  if (!raw || !off) return null;
  const start = parseInt(off);
  if (isNaN(start) || start < 0) return null;
  const end = raw.indexOf("\n", start);
  return parseSynset(raw.slice(start, end > -1 ? end : start + 600));
}

function getOffsets(word, posKey) {
  const lemma = word.toLowerCase().replace(/[\s-]/g, "_");
  const entry = wnIdx[posKey] && wnIdx[posKey].get(lemma);
  if (!entry) return [];
  const parts = entry.trim().split(/\s+/);
  const sCnt = parseInt(parts[2]);
  const pCnt = parseInt(parts[3]);
  const base = 4 + pCnt + 2;
  return parts.slice(base, base + sCnt);
}

const POSCHAR = { n: "noun", v: "verb", a: "adj", s: "adj", r: "adv" };
const POS_WN = { noun: "noun", verb: "verb", adjective: "adj", adverb: "adv", "adjective/adverb": "adj" };

// ─── Morphological Validation for Word Family ──────────────────────────────
const PREFIXES = new Set([
  "un", "in", "im", "ir", "il", "dis", "re", "pre", "over", "under", "mis",
  "non", "anti", "ex", "sub", "super", "co", "de", "out"
]);

function isStrictlyDerived(head, derived) {
  const h = head.toLowerCase();
  const d = derived.toLowerCase();
  if (h === d) return false;
  if (h.length < 4 || d.length < 5) return false;
  const roots = [
    h,
    h.replace(/e$/, ""),
    h.replace(/y$/, "i"),
    h.replace(/([bcdfghjklmnpqrstvwxyz])\1$/, "$1")
  ].filter(r => r.length >= 3);
  const minRootLen = Math.max(4, h.length - 1);
  if (roots.some(r => r.length >= minRootLen && d.startsWith(r))) return true;
  if (h.length >= 5 && roots.some(r => r.length >= 4 && d.startsWith(r))) return true;
  if (h.length >= 5 && d.endsWith(h)) {
    const pfx = d.slice(0, d.length - h.length);
    if (PREFIXES.has(pfx)) return true;
  }
  return false;
}

// ─── Oxford Dataset ────────────────────────────────────────────────────────
console.log("Loading Oxford JSON...");
const oxford = JSON.parse(fs.readFileSync(OXFORD_PATH, "utf-8"));
const oxSet = new Set(oxford.map(e => e.word.toLowerCase()));
const oxMap = new Map(oxford.map(e => [e.word.toLowerCase(), e]));

function makeItem(w) {
  const ox = oxMap.get(w.toLowerCase());
  const tr = ox?.translations?.[0]?.meanings?.[0] || "";
  return tr ? { word: ox ? ox.word : w, translation: tr } : { word: ox ? ox.word : w };
}

function isValidWord(w) {
  return Boolean(w && !w.includes(" ") && w.length <= 18 && /^[a-z'-]+$/.test(w));
}

// ─── Syllable & Comparison Logic ───────────────────────────────────────────
function syllables(word) {
  const w = word.toLowerCase().replace(/e$/, "");
  const m = w.match(/[aeiouy]+/g);
  return m ? Math.max(1, m.length) : 1;
}

const PERIPH_SUFFIXES = ["ful", "ous", "less", "ive", "al", "ic", "ent", "ant", "ble", "ish", "ing", "ed"];

// Non-gradable / inherently comparative words that should NOT have comparative forms
const NON_GRADABLE_ADJ = new Set([
  "best", "better", "worst", "worse", "furthest", "further", "latest", "later",
  "former", "latter", "outer", "inner", "upper", "lower", "elder", "eldest",
  "east", "west", "north", "south", "eastern", "western", "northern", "southern",
  "past", "present", "future", "next", "final", "initial", "main", "only", "chief",
  "primary", "principal", "unique", "equal", "same", "dead", "alive", "pregnant",
  "male", "female", "single", "double", "triple", "annual", "daily", "weekly",
  "monthly", "yearly", "chemical", "medical", "electrical", "electronic", "nuclear",
  "solar", "military", "political", "rubber", "silver", "gold", "wooden", "other"
]);

function needsPeriph(word) {
  const w = word.toLowerCase();
  const syl = syllables(w);
  if (syl >= 3) return true;
  if (PERIPH_SUFFIXES.some(s => w.endsWith(s))) return true;
  if (syl === 2) {
    if (w[w.length - 1] === "y") return false; // happy -> happier
    if (w.endsWith("le") || w.endsWith("er") || w.endsWith("ow") || w.endsWith("ure")) return false;
    return true;
  }
  return false;
}

function fixAdjForms(word, forms) {
  if (!forms) return forms;
  const w = word.toLowerCase();

  // If word is non-gradable or inherently comparative, remove comparative forms
  if (NON_GRADABLE_ADJ.has(w)) {
    return undefined;
  }

  // Explicit irregular corrections
  if (w === "good" || w === "well") {
    return { comparative: "better", superlative: "best" };
  }
  if (w === "bad" || w === "ill") {
    return { comparative: "worse", superlative: "worst" };
  }
  if (w === "far") {
    return { comparative: "farther", superlative: "farthest" };
  }
  if (w === "little") {
    return { comparative: "less", superlative: "least" };
  }
  if (w === "wrong") {
    return { comparative: "more wrong", superlative: "most wrong" };
  }
  if (w === "proper") {
    return { comparative: "more proper", superlative: "most proper" };
  }

  const comp = (forms.comparative || "").toLowerCase();
  const synthCheck = comp === w + "er" || comp === w.replace(/e$/, "") + "er" || comp === w.replace(/y$/, "i") + "er";

  if (synthCheck && needsPeriph(w)) {
    return { comparative: "more " + word, superlative: "most " + word };
  }
  if (comp === "more " + w && !needsPeriph(w)) {
    const root = w[w.length - 1] === "y" ? w.slice(0, -1) + "i" : w.replace(/e$/, "");
    return { comparative: root + "er", superlative: root + "est" };
  }

  // If comparative is nonsense like "cleverer" / "bitterer", keep or normalize
  if (comp.endsWith("erer") || comp.endsWith("erest")) {
    if (needsPeriph(w)) {
      return { comparative: "more " + word, superlative: "most " + word };
    }
  }

  return forms;
}

// ─── Uncountable / Non-plural Nouns ─────────────────────────────────────────
const UNCOUNTABLE = new Set([
  "knowledge", "information", "advice", "news", "progress", "research", "equipment",
  "furniture", "luggage", "baggage", "traffic", "weather", "homework", "evidence",
  "proof", "harm", "damage", "health", "help", "luck", "music", "access",
  "accommodation", "attention", "behaviour", "behavior", "bread", "butter", "cash",
  "chaos", "confidence", "courage", "education", "electricity", "energy",
  "entertainment", "freedom", "fun", "grammar", "happiness", "honesty", "hunger",
  "independence", "intelligence", "justice", "kindness", "laughter", "leisure",
  "literature", "logic", "love", "loyalty", "nonsense", "patience", "peace",
  "poverty", "pride", "reality", "relief", "respect", "responsibility", "safety",
  "silence", "sleep", "snow", "speed", "strength", "stress", "support", "technology",
  "training", "trust", "truth", "understanding", "violence", "vocabulary",
  "waste", "wealth", "wisdom",
  // Non-noun entries or positional adjectives with bogus plurals
  "east", "west", "north", "south", "best", "worst", "next", "past"
]);

const stats = {
  syn: 0,
  ant: 0,
  famKept: 0,
  famRemoved: 0,
  famAdded: 0,
  formsFixed: 0,
  pluralFixed: 0,
};

console.log("Processing " + oxford.length + " words...");

for (const entry of oxford) {
  const head = entry.word.toLowerCase();
  const oxPOS = entry.translations?.[0]?.partOfSpeech || "";
  const posKey = POS_WN[oxPOS] || "";

  if (!Array.isArray(entry.wordFamily)) entry.wordFamily = [];

  // WordNet derived (+) from all POS
  const wnDerived = new Set();
  for (const pk of ["noun", "verb", "adj", "adv"]) {
    for (const off of getOffsets(head, pk)) {
      const ss = getSynset(off, pk);
      if (!ss) continue;
      for (const ptr of ss.ptrs) {
        if (ptr.sym !== "+") continue;
        const tKey = POSCHAR[ptr.pos] || pk;
        const tSS = getSynset(ptr.off, tKey);
        if (tSS) {
          for (const w of tSS.words) {
            if (isValidWord(w) && w !== head) wnDerived.add(w);
          }
        }
      }
    }
  }

  // wordFamily validation: strict morphological check
  const validatedFamily = [];
  for (const item of entry.wordFamily) {
    const w = (item.word || "").toLowerCase();
    if (!w) continue;
    if (isStrictlyDerived(head, w)) {
      validatedFamily.push(makeItem(w));
      stats.famKept++;
    } else {
      stats.famRemoved++;
    }
  }
  const existFamSet = new Set(validatedFamily.map(i => i.word.toLowerCase()));
  for (const w of wnDerived) {
    if (validatedFamily.length >= 5) break;
    if (oxSet.has(w) && !existFamSet.has(w) && w !== head && isStrictlyDerived(head, w)) {
      validatedFamily.push(makeItem(w));
      existFamSet.add(w);
      stats.famAdded++;
    }
  }
  entry.wordFamily = validatedFamily.slice(0, 5);

  // Synonyms: skip adjectives (unreliable); noun/verb/adv -> first synset only
  entry.synonyms = [];
  if (posKey && posKey !== "adj") {
    const offs = getOffsets(head, posKey);
    if (offs.length > 0) {
      const ss = getSynset(offs[0], posKey);
      if (ss) {
        const filtered = ss.words.filter(w => isValidWord(w) && w !== head && oxSet.has(w)).slice(0, 5);
        entry.synonyms = filtered.map(w => makeItem(w));
        if (filtered.length > 0) stats.syn++;
      }
    }
  }

  // Antonyms: ! pointer, first 3 synsets, Oxford 3000 only
  entry.antonyms = [];
  if (posKey) {
    const offs = getOffsets(head, posKey);
    const antSet = new Set();
    for (const off of offs.slice(0, 3)) {
      const ss = getSynset(off, posKey);
      if (!ss) continue;
      for (const ptr of ss.ptrs) {
        if (ptr.sym !== "!") continue;
        const tKey = POSCHAR[ptr.pos] || posKey;
        const tSS = getSynset(ptr.off, tKey);
        if (tSS) {
          for (const w of tSS.words) {
            if (isValidWord(w) && w !== head) antSet.add(w);
          }
        }
      }
    }
    const filtered = [...antSet].filter(w => oxSet.has(w)).slice(0, 4);
    entry.antonyms = filtered.map(w => makeItem(w));
    if (filtered.length > 0) stats.ant++;
  }

  // wordForms: fix adjectiveForms
  if (entry.wordForms?.adjectiveForms) {
    const before = JSON.stringify(entry.wordForms.adjectiveForms);
    const fixed = fixAdjForms(entry.word, entry.wordForms.adjectiveForms);
    if (JSON.stringify(fixed) !== before) {
      if (fixed) {
        entry.wordForms.adjectiveForms = fixed;
      } else {
        delete entry.wordForms.adjectiveForms;
      }
      stats.formsFixed++;
    }
  }

  // wordForms: remove plural from uncountable & non-gradables
  if (UNCOUNTABLE.has(head) && entry.wordForms?.nounForms?.plural) {
    delete entry.wordForms.nounForms.plural;
    if (Object.keys(entry.wordForms.nounForms).length === 0) {
      delete entry.wordForms.nounForms;
    }
    stats.pluralFixed++;
  }
}

console.log("\n=== СТАТИСТИКА ===");
console.log("Слов с synonyms:          ", oxford.filter(e => e.synonyms?.length > 0).length);
console.log("Слов с antonyms:          ", oxford.filter(e => e.antonyms?.length > 0).length);
console.log("Слов с wordFamily:        ", oxford.filter(e => e.wordFamily?.length > 0).length);
console.log("  сохранено в wordFamily: ", stats.famKept);
console.log("  удалено из wordFamily:  ", stats.famRemoved);
console.log("  добавлено в wordFamily: ", stats.famAdded);
console.log("Исправлено adjectiveForms:", stats.formsFixed);
console.log("Убрано plural (uncountable):", stats.pluralFixed);

const CHECKS = [
  "difficult", "improve", "knowledge", "beautiful", "happy", "achieve", "decide",
  "strong", "good", "bad", "fast", "possible", "correct", "wrong", "employ",
  "attract", "nation", "complete", "active", "polite", "best", "better", "east",
  "rubber", "other", "proper", "little"
];

console.log("\n=== ПРОВЕРКА КЛЮЧЕВЫХ СЛОВ ===");
for (const name of CHECKS) {
  const e = oxford.find(x => x.word === name);
  if (!e) continue;
  const syn = (e.synonyms || []).map(s => s.word).join(", ") || "—";
  const ant = (e.antonyms || []).map(a => a.word).join(", ") || "—";
  const fam = (e.wordFamily || []).map(f => f.word).join(", ") || "—";
  const forms = JSON.stringify(e.wordForms || {});
  console.log(`${name.padEnd(12)} syn=[${syn}] ant=[${ant}] fam=[${fam}] forms=${forms}`);
}

const json = JSON.stringify(oxford, null, 2);
for (const p of OUTPUT_PATHS) {
  try {
    fs.writeFileSync(p, json, "utf-8");
    console.log("\nСохранено:", p);
  } catch (e2) {
    console.warn("Пропущено:", p, e2.message);
  }
}
