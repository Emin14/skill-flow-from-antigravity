import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prismaBacklogTopicRepository } from '@/entities/backlog/api/prisma-backlog-topic.repository';

const topicSchema = z.object({
  name: z.string().trim().min(1, 'Введите название темы'), description: z.string().nullable().optional(),
  sortOrder: z.number().int().min(-2147483648).max(2147483647).optional(), archived: z.boolean().optional(),
});
function errorResponse(error: unknown) {
  if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0]?.message }, { status: 400 });
  if (error instanceof SyntaxError) return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 });
  const code = (error as { code?: string })?.code;
  if (code === 'P2002') return NextResponse.json({ error: 'Тема с таким названием уже существует' }, { status: 409 });
  if (code === 'P2025') return NextResponse.json({ error: 'Тема не найдена' }, { status: 404 });
  if (error instanceof Error && error.message.startsWith('Нельзя удалить тему')) return NextResponse.json({ error: error.message }, { status: 409 });
  console.error('[Backlog topics]', error);
  return NextResponse.json({ error: 'Не удалось сохранить или загрузить темы' }, { status: 500 });
}
export async function GET() {
  try { return NextResponse.json(await prismaBacklogTopicRepository.getAll()); }
  catch (error) { return errorResponse(error); }
}
export async function POST(request: Request) {
  try { return NextResponse.json(await prismaBacklogTopicRepository.create(topicSchema.parse(await request.json())), { status: 201 }); }
  catch (error) { return errorResponse(error); }
}
export async function PUT(request: Request) {
  try {
    const { id, ...data } = topicSchema.extend({ id: z.string().min(1) }).parse(await request.json());
    return NextResponse.json(await prismaBacklogTopicRepository.update(id, data));
  } catch (error) { return errorResponse(error); }
}
export async function DELETE(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Не указан идентификатор темы' }, { status: 400 });
    await prismaBacklogTopicRepository.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) { return errorResponse(error); }
}
