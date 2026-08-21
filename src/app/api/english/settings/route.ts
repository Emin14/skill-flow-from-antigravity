import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';
import { EnglishSettingsConfig } from '@/entities/english/model/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let settings = await prisma.englishSettings.findUnique({
      where: { id: 'default' },
    });

    if (!settings) {
      settings = await prisma.englishSettings.create({
        data: {
          id: 'default',
          dailyNewWords: 5,
          maxReviewsPerDay: 30,
          activeLevels: JSON.stringify(['A1', 'A2', 'B1', 'B2', 'C1']),
          autoPronounce: true,
          accent: 'us',
        },
      });
    }

    const config: EnglishSettingsConfig = {
      dailyNewWords: settings.dailyNewWords,
      maxReviewsPerDay: settings.maxReviewsPerDay,
      activeLevels: JSON.parse(settings.activeLevels || '["A1","A2","B1","B2","C1"]'),
      autoPronounce: settings.autoPronounce,
      accent: settings.accent as 'us' | 'uk',
    };

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error getting English settings:', error);
    return NextResponse.json({ error: 'Failed to get settings' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const updated = await prisma.englishSettings.upsert({
      where: { id: 'default' },
      create: {
        id: 'default',
        dailyNewWords: body.dailyNewWords ?? 5,
        maxReviewsPerDay: body.maxReviewsPerDay ?? 30,
        activeLevels: JSON.stringify(body.activeLevels ?? ['A1', 'A2', 'B1', 'B2', 'C1']),
        autoPronounce: body.autoPronounce ?? true,
        accent: body.accent ?? 'us',
      },
      update: {
        dailyNewWords: body.dailyNewWords,
        maxReviewsPerDay: body.maxReviewsPerDay,
        activeLevels: body.activeLevels ? JSON.stringify(body.activeLevels) : undefined,
        autoPronounce: body.autoPronounce,
        accent: body.accent,
      },
    });

    return NextResponse.json({
      dailyNewWords: updated.dailyNewWords,
      maxReviewsPerDay: updated.maxReviewsPerDay,
      activeLevels: JSON.parse(updated.activeLevels),
      autoPronounce: updated.autoPronounce,
      accent: updated.accent,
    });
  } catch (error) {
    console.error('Error updating English settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
