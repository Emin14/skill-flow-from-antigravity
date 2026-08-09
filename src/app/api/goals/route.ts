import { NextResponse } from 'next/server';
import { prismaGoalRepository } from '@/entities/goal/api/prisma-goal.repository';

export async function GET() {
  try {
    const goals = await prismaGoalRepository.getAll();
    return NextResponse.json(goals);
  } catch (error: any) {
    console.error('[GET /api/goals] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch goals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await prismaGoalRepository.save(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error('[POST /api/goals] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create goal' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const updated = await prismaGoalRepository.update(id, updates);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('[PUT /api/goals] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update goal' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing goal id' }, { status: 400 });

    await prismaGoalRepository.delete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[DELETE /api/goals] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete goal' }, { status: 500 });
  }
}
