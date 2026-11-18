import { PrismaClient } from '@prisma/client';
import wordIds from '../src/data/oxford_word_ids.json';

const prisma = new PrismaClient();
const mapping = new Map(wordIds.entries.map((entry) => [entry.legacyId, entry.stableId]));

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  if (dryRun) {
    console.log(`Stable Oxford IDs available: ${mapping.size}`);
    console.log(`Example: oxford-0001 -> ${mapping.get('oxford-0001')}`);
    return;
  }

  const progressRows = await prisma.englishWordProgress.findMany({
    select: { wordId: true },
  });
  const reviewRows = await prisma.englishWordReviewLog.findMany({
    select: { wordId: true },
    distinct: ['wordId'],
  });
  const storedIds = new Set([
    ...progressRows.map((row) => row.wordId),
    ...reviewRows.map((row) => row.wordId),
  ]);
  const unknownIds = [...storedIds].filter((id) => !mapping.has(id) && !id.startsWith('oxford:'));

  if (unknownIds.length > 0) {
    throw new Error(`Unknown legacy English word IDs: ${unknownIds.join(', ')}`);
  }

  await prisma.$transaction(async (tx) => {
    for (const [legacyId, stableId] of mapping) {
      if (legacyId === stableId) continue;

      await tx.englishWordReviewLog.updateMany({
        where: { wordId: legacyId },
        data: { wordId: stableId },
      });

      const oldProgress = await tx.englishWordProgress.findUnique({
        where: { wordId: legacyId },
      });
      if (!oldProgress) continue;

      const existingStableProgress = await tx.englishWordProgress.findUnique({
        where: { wordId: stableId },
      });
      if (existingStableProgress) {
        throw new Error(`Both legacy and stable progress exist for ${legacyId} -> ${stableId}`);
      }

      await tx.englishWordProgress.create({
        data: {
          wordId: stableId,
          status: oldProgress.status,
          nextReviewDate: oldProgress.nextReviewDate,
          intervalDays: oldProgress.intervalDays,
          easeFactor: oldProgress.easeFactor,
          repetitions: oldProgress.repetitions,
          errorCount: oldProgress.errorCount,
          lastReviewedAt: oldProgress.lastReviewedAt,
          createdAt: oldProgress.createdAt,
          updatedAt: oldProgress.updatedAt,
        },
      });
      await tx.englishWordProgress.delete({
        where: { wordId: legacyId },
      });
    }
  });

  console.log(`Migrated ${mapping.size} Oxford ID mappings.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
