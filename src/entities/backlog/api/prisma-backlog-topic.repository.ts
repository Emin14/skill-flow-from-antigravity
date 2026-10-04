import { prisma } from '@/shared/lib/prisma';
import type { BacklogTopic as DbTopic } from '@prisma/client';
import type { BacklogTopic, SaveBacklogTopicDto } from '../model/types';

const toDto = (topic: DbTopic): BacklogTopic => ({ ...topic,
  archivedAt: topic.archivedAt?.toISOString() ?? null,
  createdAt: topic.createdAt.toISOString(), updatedAt: topic.updatedAt.toISOString(),
});
export const prismaBacklogTopicRepository = {
  async getAll(): Promise<BacklogTopic[]> {
    return (await prisma.backlogTopic.findMany({ orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }, { id: 'asc' }] })).map(toDto);
  },
  async create(dto: SaveBacklogTopicDto): Promise<BacklogTopic> {
    return toDto(await prisma.backlogTopic.create({ data: {
      name: dto.name.trim(), description: dto.description?.trim() || null,
      sortOrder: dto.sortOrder ?? 0, archivedAt: dto.archived ? new Date() : null,
    } }));
  },
  async update(id: string, dto: SaveBacklogTopicDto): Promise<BacklogTopic> {
    return toDto(await prisma.backlogTopic.update({ where: { id }, data: {
      name: dto.name.trim(),
      ...(dto.description !== undefined ? { description: dto.description?.trim() || null } : {}),
      ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
      ...(dto.archived !== undefined ? { archivedAt: dto.archived ? new Date() : null } : {}),
    } }));
  },
};
