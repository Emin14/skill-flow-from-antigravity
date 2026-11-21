/**
 * Перенос прогресса английских слов с legacy-ID (oxford-0001) на stable-ID (oxford:a:5:a1:0).
 *
 * Зачем: словарь отдаёт stable-ID, а в БД у части слов остались legacy. Без переноса
 * прогресс этих слов не подтягивается к словарю.
 *
 * Коллизии. У 13 слов на проде есть И legacy, И stable запись, причём у 11 legacy БОГАЧЕ
 * (MASTERED, 4-5 повторов, интервал 42-101 день), а stable — свежая REVIEW с 1 повтором.
 * Прежняя версия падала на этом с ошибкой «Both legacy and stable progress exist»:
 * защита от потери есть, задача не решена. Здесь записи сливаются:
 *   status         — по рангу (MASTERED > REVIEW > LEARNING > NEW)
 *   repetitions    — max
 *   intervalDays   — max (более поздняя стадия)
 *   errorCount     — max (историю ошибок не теряем)
 *   easeFactor     — от более продвинутой записи
 *   nextReviewDate — более поздняя дата (расписание не откатываем)
 *   lastReviewedAt — самая свежая
 *   createdAt      — самый ранний (возраст слова сохраняется)
 *
 * JSON читается через fs, а не import: в образе миграций не включён resolveJsonModule,
 * поэтому `import ... from '...json'` там не компилируется (прежний скрипт из-за этого
 * не запускался вовсе).
 *
 * Запуск:
 *   npx ts-node prisma/migrate-english-word-ids.ts --dry-run
 *   npx ts-node prisma/migrate-english-word-ids.ts
 */
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const prisma = new PrismaClient();

type WordIdEntry = {
  legacyId: string;
  stableId: string;
  word: string;
  frequencyRank?: number | null;
  cefr: string;
  ordinal: number;
};

// В образе миграций файл исполняется как ESM, где __dirname отсутствует.
// Поэтому базовый каталог берём из cwd (в контейнере это /app).
const dataFile = join(process.cwd(), 'src/data/oxford_word_ids.json');
const rawIds = JSON.parse(readFileSync(dataFile, 'utf8')) as { entries: WordIdEntry[] };

const mapping = new Map<string, string>();
const wordOf = new Map<string, string>();
for (const entry of rawIds.entries) {
  mapping.set(entry.legacyId, entry.stableId);
  wordOf.set(entry.legacyId, entry.word);
}

const STATUS_RANK: Record<string, number> = { NEW: 0, LEARNING: 1, REVIEW: 2, MASTERED: 3 };

type Progress = {
  wordId: string;
  status: string;
  nextReviewDate: string;
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  errorCount: number;
  lastReviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

function laterDate(a: string, b: string): string {
  return a >= b ? a : b;
}

function latestTimestamp(a: Date | null, b: Date | null): Date | null {
  if (!a) return b;
  if (!b) return a;
  return a > b ? a : b;
}

function mergeProgress(legacy: Progress, stable: Progress) {
  const rank = (s: string) => STATUS_RANK[s] ?? 0;
  const winner = rank(legacy.status) >= rank(stable.status) ? legacy : stable;

  return {
    status: winner.status,
    nextReviewDate: laterDate(legacy.nextReviewDate, stable.nextReviewDate),
    intervalDays: Math.max(legacy.intervalDays, stable.intervalDays),
    easeFactor: winner.easeFactor,
    repetitions: Math.max(legacy.repetitions, stable.repetitions),
    errorCount: Math.max(legacy.errorCount, stable.errorCount),
    lastReviewedAt: latestTimestamp(legacy.lastReviewedAt, stable.lastReviewedAt),
    createdAt: legacy.createdAt < stable.createdAt ? legacy.createdAt : stable.createdAt,
    updatedAt: new Date(),
  };
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  const progressRows = (await prisma.englishWordProgress.findMany()) as Progress[];
  const reviewWordIds = await prisma.englishWordReviewLog.findMany({
    select: { wordId: true },
    distinct: ['wordId'],
  });

  const progressById = new Map(progressRows.map((r) => [r.wordId, r]));
  const allIds = new Set<string>([
    ...progressRows.map((r) => r.wordId),
    ...reviewWordIds.map((r) => r.wordId),
  ]);

  const legacyIds = [...allIds].filter((id) => mapping.has(id));
  const unknownIds = [...allIds].filter((id) => !mapping.has(id) && !id.startsWith('oxford:'));

  if (unknownIds.length > 0) {
    throw new Error(`Unknown English word IDs: ${unknownIds.join(', ')}`);
  }

  const merges: Array<{ legacy: Progress; stable: Progress; merged: ReturnType<typeof mergeProgress> }> = [];
  const renames: Array<{ legacyId: string; stableId: string }> = [];

  for (const legacyId of legacyIds) {
    const stableId = mapping.get(legacyId) as string;
    const legacy = progressById.get(legacyId);
    const stable = progressById.get(stableId);
    if (legacy && stable) {
      merges.push({ legacy, stable, merged: mergeProgress(legacy, stable) });
    } else {
      renames.push({ legacyId, stableId });
    }
  }

  console.log(`legacy-ID найдено: ${legacyIds.length}`);
  console.log(`  к слиянию (есть обе записи): ${merges.length}`);
  console.log(`  к простому переносу: ${renames.length}`);

  for (const { legacy, stable, merged } of merges) {
    const word = wordOf.get(legacy.wordId) ?? '?';
    console.log(
      `   ${word.padEnd(9)} ${legacy.status}/${legacy.repetitions}/${legacy.intervalDays}d` +
        ` + ${stable.status}/${stable.repetitions}/${stable.intervalDays}d` +
        ` => ${merged.status}/${merged.repetitions}/${merged.intervalDays}d`
    );
  }

  if (dryRun) {
    console.log('\n--dry-run: изменения не применены');
    return;
  }

  await prisma.$transaction(
    async (tx) => {
      for (const { legacy, stable, merged } of merges) {
        await tx.englishWordProgress.update({ where: { wordId: stable.wordId }, data: merged });
        await tx.englishWordProgress.delete({ where: { wordId: legacy.wordId } });
      }
      for (const legacyId of legacyIds) {
        const stableId = mapping.get(legacyId) as string;
        const res = await tx.englishWordReviewLog.updateMany({
          where: { wordId: legacyId },
          data: { wordId: stableId },
        });
        if (res.count > 0) console.log(`   логов перенесено ${legacyId} -> ${stableId}: ${res.count}`);
      }
      for (const { legacyId, stableId } of renames) {
        const row = progressById.get(legacyId);
        if (!row) continue;
        await tx.englishWordProgress.create({
          data: { ...row, wordId: stableId, updatedAt: new Date() },
        });
        await tx.englishWordProgress.delete({ where: { wordId: legacyId } });
      }
    },
    { timeout: 120_000 }
  );

  const left = await prisma.englishWordProgress.count({
    where: { wordId: { startsWith: 'oxford-' } },
  });
  const total = await prisma.englishWordProgress.count();
  console.log(`\nготово: legacy осталось ${left}, всего записей ${total}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
