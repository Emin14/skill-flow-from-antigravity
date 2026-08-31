import { NextResponse } from 'next/server';
import { prismaTaskRepository } from '@/entities/task/api/prisma-task.repository';

export async function GET() {
  try {
    const tasks = await prismaTaskRepository.getAll();
    return NextResponse.json(tasks);
  } catch (error: any) {
    console.error('[GET /api/tasks] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await prismaTaskRepository.create(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error('[POST /api/tasks] Error creating task:', error);
    return NextResponse.json({ error: error.message || 'Failed to create task' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (body.action === 'batchUpdateCategory') {
      const { oldCategory, newCategory } = body;
      const count = await prismaTaskRepository.updateCategoryBatch(oldCategory, newCategory);
      return NextResponse.json({ success: true, count });
    }

    if (body.action === 'reorder') {
      const { orderedTaskIds } = body;
      await prismaTaskRepository.reorder(orderedTaskIds || []);
      return NextResponse.json({ success: true });
    }

    const { id, ...updates } = body;
    const updated = await prismaTaskRepository.update(id, updates);
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('[PUT /api/tasks] Error updating task:', error);
    return NextResponse.json({ error: error.message || 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const deleteSubtasks = searchParams.get('deleteSubtasks') === 'true';
    if (!id) return NextResponse.json({ error: 'Missing task id' }, { status: 400 });

    if (deleteSubtasks) {
      await prismaTaskRepository.deleteWithSubtasks(id);
    } else {
      await prismaTaskRepository.delete(id);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[DELETE /api/tasks] Error deleting task:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete task' }, { status: 500 });
  }
}
