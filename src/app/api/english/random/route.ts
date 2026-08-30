import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { getOxfordDictionary, SessionWordCard } from '@/entities/english';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count') || '5', 10);
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

    // Pick unlearned words first
    const unlearned = dictionary.filter((w) => !learnedIds.has(w.id));
    const pool = unlearned.length > 0 ? unlearned : dictionary;

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
