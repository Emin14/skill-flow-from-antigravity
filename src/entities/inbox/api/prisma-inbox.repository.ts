import { prisma } from '@/shared/lib/prisma';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
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
    const itemId = (item.id && typeof item.id === 'string' && item.id.trim()) ? item.id.trim() : uuidv4();
    try {
      const result = await prisma.inboxItem.upsert({
        where: { id: itemId },
        create: {
          id: itemId,
          text: item.text || 'Без названия',
          isPinned: item.isPinned ?? false,
          createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
        },
        update: {
          text: item.text || 'Без названия',
          isPinned: item.isPinned ?? false,
        },
      });
      return InboxMapper.toDto(result);
    } catch (err) {
      console.error('[PrismaInboxRepository.save] Error:', err);
      throw err;
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
    } catch (err) {
      console.error(`[PrismaInboxRepository.update] Error updating inbox item ${id}:`, err);
      throw err;
    }
  }

  async delete(id: string): Promise<boolean> {
    if (typeof window !== 'undefined') return true;
    try {
      await prisma.inboxItem.delete({ where: { id } });
      return true;
    } catch (err) {
      console.error(`[PrismaInboxRepository.delete] Error deleting inbox item ${id}:`, err);
      throw err;
    }
  }
}

export const prismaInboxRepository = new PrismaInboxRepository();
export const inboxRepository = prismaInboxRepository;
