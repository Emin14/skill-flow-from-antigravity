import { NextResponse } from 'next/server';
import { prismaRepeatCardRepository } from '@/entities/repeat-card/api/prisma-repeat-card.repository';

export async function GET() {
  try {
    const cards = await prismaRepeatCardRepository.getAll();
    return NextResponse.json(cards);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch repeat cards' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await prismaRepeatCardRepository.save(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create repeat card' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const updated = await prismaRepeatCardRepository.update(id, updates);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update repeat card' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing repeat card id' }, { status: 400 });

    await prismaRepeatCardRepository.delete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete repeat card' }, { status: 500 });
  }
}
