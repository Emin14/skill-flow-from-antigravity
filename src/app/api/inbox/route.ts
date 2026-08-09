import { NextResponse } from 'next/server';
import { prismaInboxRepository } from '@/entities/inbox/api/prisma-inbox.repository';

export async function GET() {
  try {
    const items = await prismaInboxRepository.getAll();
    return NextResponse.json(items);
  } catch (error: any) {
    console.error('[GET /api/inbox] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch inbox items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await prismaInboxRepository.save(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error('[POST /api/inbox] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create inbox item' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const updated = await prismaInboxRepository.update(id, updates);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('[PUT /api/inbox] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update inbox item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing inbox item id' }, { status: 400 });

    await prismaInboxRepository.delete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[DELETE /api/inbox] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete inbox item' }, { status: 500 });
  }
}
