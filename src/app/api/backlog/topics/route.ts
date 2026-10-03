import { NextResponse } from 'next/server';
import { prismaBacklogRepository } from '@/entities/backlog/api/prisma-backlog.repository';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { oldTopic, newTopic } = body;
    
    if (!oldTopic || !newTopic) {
      return NextResponse.json({ error: 'Missing oldTopic or newTopic' }, { status: 400 });
    }

    const count = await prismaBacklogRepository.renameTopic(oldTopic, newTopic);
    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    console.error('[PUT /api/backlog/topics] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to rename topic' }, { status: 500 });
  }
}
