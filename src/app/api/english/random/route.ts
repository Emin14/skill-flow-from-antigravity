import { NextResponse } from 'next/server';
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

    const shuffled = [...dictionary].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    const sessionCards: SessionWordCard[] = selected.map((w) => ({
      ...w,
      isNew: true,
    }));

    return NextResponse.json({ words: sessionCards });
  } catch (error) {
    console.error('Error fetching random English words:', error);
    return NextResponse.json({ words: [] }, { status: 500 });
  }
}
