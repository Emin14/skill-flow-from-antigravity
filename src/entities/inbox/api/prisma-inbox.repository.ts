import { prisma } from '@/shared/lib/prisma';
import { Prisma } from '@prisma/client';
import { InboxItem } from '../model/types';
import { InboxMapper } from './inbox.mapper';
import { InboxRepository } from '@/shared/repository/interfaces/InboxRepository';

export class PrismaInboxRepository implements InboxRepository {
  async getAll(): Promise<InboxItem[]> {
    const list = await prisma.inboxItem.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return list.map(InboxMapper.toDto);
  }

  async getById(id: string): Promise<InboxItem | null> {
    const item = await prisma.inboxItem.findUnique({
      where: { id },
    });
    return item ? InboxMapper.toDto(item) : null;
  }

  async save(item: InboxItem): Promise<InboxItem> {
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
  }

  async update(id: string, updates: Partial<InboxItem>): Promise<InboxItem> {
    const data: Prisma.InboxItemUpdateInput = {};
    if (updates.text !== undefined) data.text = updates.text;
    if (updates.isPinned !== undefined) data.isPinned = updates.isPinned;

    const result = await prisma.inboxItem.update({
      where: { id },
      data,
    });
    return InboxMapper.toDto(result);
  }

  async delete(id: string): Promise<boolean> {
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
