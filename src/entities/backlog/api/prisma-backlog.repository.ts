import { prisma } from '@/shared/lib/prisma';
import type { Prisma } from '@prisma/client';
import type { BacklogItem, CreateBacklogItemDto, UpdateBacklogItemDto } from '../model/types';
import { BacklogMapper } from './backlog.mapper';

async function resolveTopic(tx: Prisma.TransactionClient, topicId?: string, name?: string) {
  if (topicId) return tx.backlogTopic.findUniqueOrThrow({ where: { id: topicId } });
  const topicName = name?.trim() || 'Общее';
  return tx.backlogTopic.upsert({ where: { name: topicName }, create: { name: topicName }, update: {} });
}
export const prismaBacklogRepository = {
  async getAll(): Promise<BacklogItem[]> {
    const list = await prisma.backlogItem.findMany({ include: { topicRecord: { select: { name: true } } }, orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }] });
    return list.map(BacklogMapper.toDto);
  },
  async getById(id: string): Promise<BacklogItem | null> {
    const item = await prisma.backlogItem.findUnique({ where: { id }, include: { topicRecord: { select: { name: true } } } });
    return item ? BacklogMapper.toDto(item) : null;
  },
  async create(dto: CreateBacklogItemDto): Promise<BacklogItem> {
    return prisma.$transaction(async tx => {
      const topic = await resolveTopic(tx, dto.topicId, dto.topic);
      return BacklogMapper.toDto(await tx.backlogItem.create({ data: {
        topicId: topic.id, topic: topic.name, title: dto.title.trim() || 'Новая заметка',
        description: dto.description || null, status: dto.status || 'idea', priority: dto.priority || 'medium',
        tags: dto.tags ? JSON.stringify(dto.tags) : null, link: dto.link || null, sortOrder: 0,
      }, include: { topicRecord: { select: { name: true } } } }));
    });
  },
  async update(id: string, updates: UpdateBacklogItemDto): Promise<BacklogItem> {
    return prisma.$transaction(async tx => {
      const data: Prisma.BacklogItemUncheckedUpdateInput = {};
      if (updates.topicId !== undefined || updates.topic !== undefined) {
        const topic = await resolveTopic(tx, updates.topicId, updates.topic);
        if (topic.archivedAt) {
          const current = await tx.backlogItem.findUniqueOrThrow({ where: { id } });
          if (current.topicId !== topic.id) throw new Error('Нельзя переносить заметки в архивную тему');
        }
        data.topicId = topic.id; data.topic = topic.name;
      }
      if (updates.title !== undefined) data.title = updates.title.trim();
      if (updates.description !== undefined) data.description = updates.description;
      if (updates.status !== undefined) data.status = updates.status;
      if (updates.priority !== undefined) data.priority = updates.priority;
      if (updates.tags !== undefined) data.tags = updates.tags ? JSON.stringify(updates.tags) : null;
      if (updates.link !== undefined) data.link = updates.link;
      if (updates.sortOrder !== undefined) data.sortOrder = updates.sortOrder;
      return BacklogMapper.toDto(await tx.backlogItem.update({ where: { id }, data, include: { topicRecord: { select: { name: true } } } }));
    });
  },
  async delete(id: string): Promise<boolean> {
    await prisma.backlogItem.delete({ where: { id } }); return true;
  },
};
