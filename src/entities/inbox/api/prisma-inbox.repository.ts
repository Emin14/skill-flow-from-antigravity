import { prisma } from '@/shared/lib/prisma';
import { Prisma } from '@prisma/client';
import { InboxItem } from '../model/types';
import { InboxMapper } from './inbox.mapper';
import { InboxRepository } from '@/shared/repository/interfaces/InboxRepository';

export class PrismaInboxRepository implements InboxRepository {
  async getAll(): Promise<InboxItem[]> {
    if (typeof window !== 'undefined') return [];
    try {
      const list = await prisma.inboxItem.findMany({
        orderBy: { createdAt: 'asc' },
      });
      return list.map(InboxMapper.toDto);
    } catch {
      return [];
    }
  }

  async getById(id: string): Promise<InboxItem | null> {
    if (typeof window !== 'undefined') return null;
    try {
      const item = await prisma.inboxItem.findUnique({
        where: { id },
      });
      return item ? InboxMapper.toDto(item) : null;
    } catch {
      return null;
    }
  }

  async save(item: InboxItem): Promise<InboxItem> {
    if (typeof window !== 'undefined') return item;
    try {
      const result = await prisma.inboxItem.upsert({
        where: { id: item.id },
        create: {
          id: item.id,
          text: item.text,
          isPinned: item.isPinned ?? false,
          createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
        },
        update: {
          text: item.text,
          isPinned: item.isPinned ?? false,
        },
      });
      return InboxMapper.toDto(result);
    } catch {
      return item;
    }
  }

  async update(id: string, updates: Partial<InboxItem>): Promise<InboxItem> {
    const fallback: InboxItem = { id, text: updates.text || '', createdAt: new Date().toISOString() };
    if (typeof window !== 'undefined') return fallback;
    try {
      const data: Prisma.InboxItemUpdateInput = {};
      if (updates.text !== undefined) data.text = updates.text;
      if (updates.isPinned !== undefined) data.isPinned = updates.isPinned;

      const result = await prisma.inboxItem.update({
        where: { id },
        data,
      });
      return InboxMapper.toDto(result);
    } catch {
      return fallback;
    }
  }

  async delete(id: string): Promise<boolean> {
    if (typeof window !== 'undefined') return true;
    try {
      await prisma.inboxItem.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}

export const prismaInboxRepository = new PrismaInboxRepository();
export const inboxRepository = prismaInboxRepository;
