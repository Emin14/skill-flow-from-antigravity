import { NextResponse } from 'next/server';
import { prisma } from '@/shared/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error('GET /api/categories error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, color, excludeFromStats } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const created = await prisma.category.upsert({
      where: { name: name.trim() },
      create: {
        name: name.trim(),
        color: color || '#38bdf8',
        excludeFromStats: Boolean(excludeFromStats),
      },
      update: {
        color: color || '#38bdf8',
        excludeFromStats: excludeFromStats !== undefined ? Boolean(excludeFromStats) : undefined,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/categories error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, color, excludeFromStats } = body;

    if (!id && !name) {
      return NextResponse.json({ error: 'ID or Name is required' }, { status: 400 });
    }

    const updated = await prisma.category.updateMany({
      where: {
        OR: [{ id: id || '' }, { name: name || '' }],
      },
      data: {
        name: name ? name.trim() : undefined,
        color: color || undefined,
        excludeFromStats: excludeFromStats !== undefined ? Boolean(excludeFromStats) : undefined,
      },
    });

    return NextResponse.json({ success: true, count: updated.count });
  } catch (error: any) {
    console.error('PUT /api/categories error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const name = searchParams.get('name');

    if (!id && !name) {
      return NextResponse.json({ error: 'ID or Name parameter is required' }, { status: 400 });
    }

    const deleted = await prisma.category.deleteMany({
      where: {
        OR: [
          ...(id ? [{ id }] : []),
          ...(name ? [{ name }] : []),
        ],
      },
    });

    return NextResponse.json({ success: true, count: deleted.count });
  } catch (error: any) {
    console.error('DELETE /api/categories error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
