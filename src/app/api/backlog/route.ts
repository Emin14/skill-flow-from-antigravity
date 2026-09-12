import { NextResponse } from 'next/server';
import { prismaBacklogRepository } from '@/entities/backlog/api/prisma-backlog.repository';

export async function GET() {
  try {
    const items = await prismaBacklogRepository.getAll();
    return NextResponse.json(items);
  } catch (error: any) {
    console.error('[GET /api/backlog] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch backlog items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await prismaBacklogRepository.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error('[POST /api/backlog] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create backlog item' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: 'Missing backlog item id' }, { status: 400 });

    const updated = await prismaBacklogRepository.update(id, updates);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('[PUT /api/backlog] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update backlog item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing backlog item id' }, { status: 400 });

    await prismaBacklogRepository.delete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[DELETE /api/backlog] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete backlog item' }, { status: 500 });
  }
}
