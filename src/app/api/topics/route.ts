import { NextResponse } from 'next/server';
import { prismaTopicRepository } from '@/entities/topic/api/prisma-topic.repository';

export async function GET() {
  try {
    const topics = await prismaTopicRepository.getAll();
    return NextResponse.json(topics);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch topics' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await prismaTopicRepository.save(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create topic' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const updated = await prismaTopicRepository.update(id, updates);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update topic' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing topic id' }, { status: 400 });

    await prismaTopicRepository.delete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete topic' }, { status: 500 });
  }
}
