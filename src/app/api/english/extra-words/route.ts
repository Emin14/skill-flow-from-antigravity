import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { getTodayStr } from '@/shared/lib/dateUtils';

export const dynamic = 'force-dynamic';

/**
 * Set today's goal so that `count` MORE words remain, on top of what was
 * already studied. The goal is stored as an absolute number for the date,
 * which is why the client sends how many words are done — otherwise a user who
 * finished 6 of 5 would get 4 extra words instead of the requested batch.
 * The daily setting is never touched.
 */
export async function POST(req: Request) {
  try {
    let clientDate: string | null = null;
    let count = 5;
    let learnedToday = 0;

    try {
      const body = await req.json();
      clientDate = body?.clientDate || null;
      const rawCount = Number(body?.count);
      if (Number.isFinite(rawCount) && rawCount > 0) count = Math.min(Math.floor(rawCount), 100);
      const rawLearned = Number(body?.learnedToday);
      if (Number.isFinite(rawLearned) && rawLearned >= 0) learnedToday = Math.floor(rawLearned);
    } catch {
      // Body might be empty; fall back to query params below.
    }

    if (!clientDate) {
      const { searchParams } = new URL(req.url);
      clientDate = searchParams.get('clientDate');
      const rawCount = Number(searchParams.get('count'));
      if (Number.isFinite(rawCount) && rawCount > 0) count = Math.min(Math.floor(rawCount), 100);
      const rawLearned = Number(searchParams.get('learnedToday'));
      if (Number.isFinite(rawLearned) && rawLearned >= 0) learnedToday = Math.floor(rawLearned);
    }

    const todayStr = clientDate && clientDate.includes('-') ? clientDate.trim() : getTodayStr();
    const targetGoal = learnedToday + count;

    // Never lower an existing goal (two taps must add up, not reset).
    const existing = await prisma.englishDayGoal.findUnique({ where: { date: todayStr } });
    const goalCount = Math.max(targetGoal, existing?.goalCount ?? 0);

    const goal = await prisma.englishDayGoal.upsert({
      where: { date: todayStr },
      create: { date: todayStr, goalCount },
      update: { goalCount },
    });

    return NextResponse.json({ success: true, date: todayStr, goalCount: goal.goalCount });
  } catch (error) {
    console.error('Error raising the English day goal:', error);
    return NextResponse.json({ error: 'Failed to raise the day goal' }, { status: 500 });
  }
}
