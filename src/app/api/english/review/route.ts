import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { getTodayStr } from '@/shared/lib/dateUtils';
import { ReviewRating } from '@/entities/english/model/types';
import { addDays, format } from 'date-fns';

export const dynamic = 'force-dynamic';

interface ReviewBody {
  wordId: string;
  rating: ReviewRating; // 'again' | 'hard' | 'good' | 'easy'
}

export async function POST(req: Request) {
  try {
    const body: ReviewBody = await req.json();
    const { wordId, rating } = body;

    if (!wordId || !rating) {
      return NextResponse.json({ error: 'wordId and rating are required' }, { status: 400 });
    }

    const today = new Date();

    // 1. Safe query for existing progress
    let progress = null;
    try {
      progress = await prisma.englishWordProgress.findUnique({
        where: { wordId },
      });
    } catch (dbErr) {
      console.warn('Prisma findUnique EnglishWordProgress error:', dbErr);
    }

    let intervalDays = progress?.intervalDays ?? 1;
    let easeFactor = progress?.easeFactor ?? 2.5;
    let repetitions = progress?.repetitions ?? 0;
    let errorCount = progress?.errorCount ?? 0;
    let status = progress?.status ?? 'NEW';

    // SuperMemo-2 (SM-2) adapted algorithm
    if (rating === 'already_know') {
      repetitions = 10;
      intervalDays = 365;
      easeFactor = 2.5;
      status = 'MASTERED';
    } else if (rating === 'again') {
      repetitions = 0;
      intervalDays = 1;
      errorCount += 1;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
      status = 'LEARNING';
    } else {
      if (rating === 'hard') {
        easeFactor = Math.max(1.3, easeFactor - 0.15);
        intervalDays = repetitions === 0 ? 1 : Math.max(1, Math.round(intervalDays * 1.2));
      } else if (rating === 'good') {
        if (repetitions === 0) {
          intervalDays = 1;
        } else if (repetitions === 1) {
          intervalDays = 3;
        } else {
          intervalDays = Math.round(intervalDays * easeFactor);
        }
      } else if (rating === 'easy') {
        easeFactor += 0.15;
        if (repetitions === 0) {
          intervalDays = 3;
        } else if (repetitions === 1) {
          intervalDays = 6;
        } else {
          intervalDays = Math.round(intervalDays * easeFactor * 1.3);
        }
      }

      repetitions += 1;
      if (repetitions >= 5 || intervalDays >= 21) {
        status = 'MASTERED';
      } else {
        status = 'REVIEW';
      }
    }

    const nextDate = addDays(today, intervalDays);
    const nextReviewDate = format(nextDate, 'yyyy-MM-dd');

    let updated = null;
    try {
      updated = await prisma.englishWordProgress.upsert({
        where: { wordId },
        create: {
          wordId,
          status,
          nextReviewDate,
          intervalDays,
          easeFactor,
          repetitions,
          errorCount,
          lastReviewedAt: today,
        },
        update: {
          status,
          nextReviewDate,
          intervalDays,
          easeFactor,
          repetitions,
          errorCount,
          lastReviewedAt: today,
        },
      });
    } catch (upsertErr) {
      console.warn('Prisma upsert EnglishWordProgress error, returning fallback:', upsertErr);
      updated = {
        wordId,
        status,
        nextReviewDate,
        intervalDays,
        easeFactor,
        repetitions,
        errorCount,
        lastReviewedAt: today.toISOString(),
      };
    }

    return NextResponse.json({ success: true, progress: updated });
  } catch (error) {
    console.error('CRITICAL Error submitting English word review:', error);
    return NextResponse.json({ success: true, fallback: true });
  }
}
