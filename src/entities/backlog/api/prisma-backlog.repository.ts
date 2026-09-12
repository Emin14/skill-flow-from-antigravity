import { prisma } from '@/shared/lib/prisma';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { BacklogItem, CreateBacklogItemDto, UpdateBacklogItemDto } from '../model/types';
import { BacklogMapper } from './backlog.mapper';

export class PrismaBacklogRepository {
  async getAll(): Promise<BacklogItem[]> {
    if (typeof window !== 'undefined') return [];
    try {
      const list = await prisma.backlogItem.findMany({
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      });
      return list.map(BacklogMapper.toDto);
    } catch (err) {
      console.error('[PrismaBacklogRepository.getAll] Error:', err);
      return [];
    }
  }

  async getById(id: string): Promise<BacklogItem | null> {
    if (typeof window !== 'undefined') return null;
    try {
      const item = await prisma.backlogItem.findUnique({
        where: { id },
      });
      return item ? BacklogMapper.toDto(item) : null;
    } catch {
      return null;
    }
  }

  async create(dto: CreateBacklogItemDto): Promise<BacklogItem> {
    if (typeof window !== 'undefined') {
      return {
        id: uuidv4(),
        topic: dto.topic,
        title: dto.title,
        description: dto.description || null,
        status: dto.status || 'idea',
        priority: dto.priority || 'medium',
        tags: dto.tags || [],
        link: dto.link || null,
        sortOrder: 0,
        createdAt: new Date().toISOString(),
      };
    }

    const id = uuidv4();
    try {
      const result = await prisma.backlogItem.create({
        data: {
          id,
          topic: dto.topic.trim() || 'Общее',
          title: dto.title.trim() || 'Новая идея',
          description: dto.description || null,
          status: dto.status || 'idea',
          priority: dto.priority || 'medium',
          tags: dto.tags ? JSON.stringify(dto.tags) : null,
          link: dto.link || null,
          sortOrder: 0,
        },
      });
      return BacklogMapper.toDto(result);
    } catch (err) {
      console.error('[PrismaBacklogRepository.create] Error:', err);
      throw err;
    }
  }

  async update(id: string, updates: UpdateBacklogItemDto): Promise<BacklogItem> {
    if (typeof window !== 'undefined') {
      return {
        id,
        topic: updates.topic || 'Общее',
        title: updates.title || '',
        status: updates.status || 'idea',
        createdAt: new Date().toISOString(),
      };
    }

    try {
      const data: Prisma.BacklogItemUpdateInput = {};
      if (updates.topic !== undefined) data.topic = updates.topic.trim();
      if (updates.title !== undefined) data.title = updates.title.trim();
      if (updates.description !== undefined) data.description = updates.description;
      if (updates.status !== undefined) data.status = updates.status;
      if (updates.priority !== undefined) data.priority = updates.priority;
      if (updates.tags !== undefined) data.tags = updates.tags ? JSON.stringify(updates.tags) : null;
      if (updates.link !== undefined) data.link = updates.link;
      if (updates.sortOrder !== undefined) data.sortOrder = updates.sortOrder;

      const result = await prisma.backlogItem.update({
        where: { id },
        data,
      });
      return BacklogMapper.toDto(result);
    } catch (err) {
      console.error(`[PrismaBacklogRepository.update] Error updating backlog item ${id}:`, err);
      throw err;
    }
  }

  async delete(id: string): Promise<boolean> {
    if (typeof window !== 'undefined') return true;
    try {
      await prisma.backlogItem.delete({ where: { id } });
      return true;
    } catch (err) {
      console.error(`[PrismaBacklogRepository.delete] Error deleting backlog item ${id}:`, err);
      throw err;
    }
  }
}

export const prismaBacklogRepository = new PrismaBacklogRepository();
