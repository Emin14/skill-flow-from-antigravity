import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function GET() {
  try {
    const achievements = await (prisma as any).achievement.findMany({
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json(achievements);
  } catch (error: any) {
    console.error('GET /api/achievements error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, title, date, category, icon, description } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    const created = await (prisma as any).achievement.create({
      data: {
        id: id || undefined,
        title: title.trim(),
        date,
        category: category?.trim() || null,
        icon: icon?.trim() || '🏆',
        description: description?.trim() || null,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/achievements error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, date, category, icon, description } = body;

    if (!id) {
      return NextResponse.json({ error: 'Achievement ID is required' }, { status: 400 });
    }

    const updated = await (prisma as any).achievement.update({
      where: { id },
      data: {
        title: title !== undefined ? title.trim() : undefined,
        date: date !== undefined ? date : undefined,
        category: category !== undefined ? (category ? category.trim() : null) : undefined,
        icon: icon !== undefined ? (icon ? icon.trim() : '🏆') : undefined,
        description: description !== undefined ? (description ? description.trim() : null) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('PUT /api/achievements error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Achievement ID is required' }, { status: 400 });
    }

    await (prisma as any).achievement.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('DELETE /api/achievements error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
