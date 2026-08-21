import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { getTodayStr } from '@/shared/lib/dateUtils';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const todayStr = getTodayStr();

    // Find all progress items updated or reviewed today
    const allProgress = await prisma.englishWordProgress.findMany();
    
    const todayReviewedIds = allProgress
      .filter((p) => {
        if (!p.lastReviewedAt) return false;
        try {
          const d = new Date(p.lastReviewedAt);
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd}` === todayStr;
        } catch {
          return false;
        }
      })
      .map((p) => p.wordId);

    if (todayReviewedIds.length > 0) {
      // Revert words reviewed today back to NEW so user can practice them again
      await prisma.englishWordProgress.updateMany({
        where: {
          wordId: { in: todayReviewedIds },
        },
        data: {
          status: 'NEW',
          lastReviewedAt: null,
          repetitions: 0,
          intervalDays: 1,
        },
      });
    }

    return NextResponse.json({ success: true, resetCount: todayReviewedIds.length });
  } catch (error) {
    console.error('Error resetting today English progress:', error);
    return NextResponse.json({ error: 'Failed to reset progress' }, { status: 500 });
  }
}
