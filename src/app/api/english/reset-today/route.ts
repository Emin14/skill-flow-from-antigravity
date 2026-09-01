import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { getTodayStr } from '@/shared/lib/dateUtils';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    let clientDate: string | null = null;
    let tzOffsetMinutes: number | null = null;

    try {
      const body = await req.json();
      clientDate = body?.clientDate || null;
      tzOffsetMinutes = typeof body?.tzOffset === 'number' ? body.tzOffset : null;
    } catch {
      // Body might be empty
    }

    if (!clientDate) {
      const { searchParams } = new URL(req.url);
      clientDate = searchParams.get('clientDate');
      const tzRaw = searchParams.get('tzOffset');
      if (tzRaw) tzOffsetMinutes = parseInt(tzRaw, 10);
    }

    const todayStr = clientDate && clientDate.includes('-') ? clientDate.trim() : getTodayStr();

    // Helper to extract local date
    const getLocalReviewDate = (lastReviewedAt: any): string | null => {
      if (!lastReviewedAt) return null;
      try {
        const d = new Date(lastReviewedAt);
        if (tzOffsetMinutes !== null && !isNaN(tzOffsetMinutes)) {
          const localMs = d.getTime() - tzOffsetMinutes * 60 * 1000;
          return new Date(localMs).toISOString().split('T')[0];
        }
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      } catch {
        return null;
      }
    };

    // Find all progress items updated or reviewed today
    const allProgress = await prisma.englishWordProgress.findMany();
    
    const todayReviewedIds = allProgress
      .filter((p) => {
        const dStr = getLocalReviewDate(p.lastReviewedAt);
        return dStr === todayStr;
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
