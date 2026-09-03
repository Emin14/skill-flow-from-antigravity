import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const wordId = searchParams.get('wordId');

    if (!wordId) {
      return NextResponse.json({ error: 'wordId is required' }, { status: 400 });
    }

    const [progress, history] = await Promise.all([
      prisma.englishWordProgress.findUnique({
        where: { wordId },
      }),
      prisma.englishWordReviewLog.findMany({
        where: { wordId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
    ]);

    return NextResponse.json({
      success: true,
      progress,
      history,
    });
  } catch (error) {
    console.error('Error fetching English word history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch word history' },
      { status: 500 }
    );
  }
}
