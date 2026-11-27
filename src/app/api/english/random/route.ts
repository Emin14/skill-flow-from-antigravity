import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { getOxfordDictionary, SessionWordCard } from '@/entities/english';
import { getTodayStr, formatLocalDateStr } from '@/shared/lib/dateUtils';
import { subDays } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count') || '5', 10);
    const clientDate = searchParams.get('clientDate');
    const tzOffsetRaw = searchParams.get('tzOffset');
    const tzOffsetMinutes = tzOffsetRaw !== null ? parseInt(tzOffsetRaw, 10) : null;
    const dictionary = getOxfordDictionary();

    if (!dictionary || dictionary.length === 0) {
      return NextResponse.json({ words: [] });
    }

    let progressList: any[] = [];
    try {
      progressList = await prisma.englishWordProgress.findMany();
    } catch (e) {
      console.warn('Prisma EnglishWordProgress fallback to empty:', e);
    }
    const learnedIds = new Set(
      progressList.filter((p) => p.status !== 'NEW').map((p) => p.wordId)
    );

    // Words rated «Не помню» today have no usable progress and are parked until
    // tomorrow, so an extra-word request cannot hand them out again immediately.
    const todayStr = clientDate && clientDate.includes('-') ? clientDate.trim() : getTodayStr();
    const tzOffset = tzOffsetMinutes !== null && !Number.isNaN(tzOffsetMinutes)
      ? tzOffsetMinutes
      : new Date().getTimezoneOffset();
    const resetTodayIds = new Set<string>();
    try {
      const logs = await prisma.englishWordReviewLog.findMany({
        where: { createdAt: { gte: subDays(new Date(), 1) }, rating: 'again' },
        select: { wordId: true, createdAt: true },
      });
      for (const log of logs) {
        const localMs = new Date(log.createdAt).getTime() - tzOffset * 60 * 1000;
        if (formatLocalDateStr(new Date(localMs)) === todayStr) {
          resetTodayIds.add(log.wordId);
        }
      }
    } catch (e) {
      console.warn('Prisma EnglishWordReviewLog fallback to empty:', e);
    }

    // Pick unlearned words first
    const unlearned = dictionary.filter(
      (w) => !learnedIds.has(w.id) && !resetTodayIds.has(w.id)
    );
    // If there are no untouched words left, extra practice may use learned
    // words, but it must still exclude words forgotten today. Falling back to
    // the whole dictionary would immediately reintroduce a reset word.
    const pool = unlearned.length > 0
      ? unlearned
      : dictionary.filter((w) => !resetTodayIds.has(w.id));

    const selected = pool.slice(0, count);

    const sessionCards: SessionWordCard[] = selected.map((w) => ({
      ...w,
      isNew: true,
    }));

    return NextResponse.json({ words: sessionCards });
  } catch (error) {
    console.error('Error fetching extra English words:', error);
    return NextResponse.json({ words: [] }, { status: 500 });
  }
}
