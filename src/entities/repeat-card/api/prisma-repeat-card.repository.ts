import { prisma } from '@/shared/lib/prisma';
import { Prisma } from '@prisma/client';
import { RepeatCard } from '../model/types';
import { RepeatCardMapper } from './repeat-card.mapper';
import { RepeatCardRepository } from '@/shared/repository/interfaces/RepeatCardRepository';

export class PrismaRepeatCardRepository implements RepeatCardRepository {
  async getAll(): Promise<RepeatCard[]> {
    if (typeof window !== 'undefined') return [];
    try {
      const list = await prisma.repeatCard.findMany({
        orderBy: { createdAt: 'asc' },
      });
      return list.map(RepeatCardMapper.toDto);
    } catch {
      return [];
    }
  }

  async getById(id: string): Promise<RepeatCard | null> {
    if (typeof window !== 'undefined') return null;
    try {
      const item = await prisma.repeatCard.findUnique({
        where: { id },
      });
      return item ? RepeatCardMapper.toDto(item) : null;
    } catch {
      return null;
    }
  }

  async getByMaterialId(materialId: string): Promise<RepeatCard[]> {
    if (typeof window !== 'undefined') return [];
    try {
      const list = await prisma.repeatCard.findMany({
        where: { materialId },
        orderBy: { createdAt: 'asc' },
      });
      return list.map(RepeatCardMapper.toDto);
    } catch {
      return [];
    }
  }

  async save(card: RepeatCard): Promise<RepeatCard> {
    if (typeof window !== 'undefined') return card;
    try {
      const result = await prisma.repeatCard.upsert({
        where: { id: card.id },
        create: {
          id: card.id,
          materialId: card.materialId,
          front: card.front,
          back: card.back,
          interval: card.interval ?? 1,
          repetitions: card.repetitions ?? 0,
          easeFactor: card.easeFactor ?? 2.5,
          nextReviewDate: card.nextReviewDate,
          lastReviewedAt: card.lastReviewedAt ? new Date(card.lastReviewedAt) : null,
          createdAt: card.createdAt ? new Date(card.createdAt) : new Date(),
        },
        update: {
          materialId: card.materialId,
          front: card.front,
          back: card.back,
          interval: card.interval ?? 1,
          repetitions: card.repetitions ?? 0,
          easeFactor: card.easeFactor ?? 2.5,
          nextReviewDate: card.nextReviewDate,
          lastReviewedAt: card.lastReviewedAt ? new Date(card.lastReviewedAt) : null,
        },
      });
      return RepeatCardMapper.toDto(result);
    } catch {
      return card;
    }
  }

  async update(id: string, updates: Partial<RepeatCard>): Promise<RepeatCard> {
    const fallback: RepeatCard = { id, materialId: updates.materialId || '', front: updates.front || '', back: updates.back || '', interval: 1, repetitions: 0, easeFactor: 2.5, nextReviewDate: '', createdAt: new Date().toISOString() };
    if (typeof window !== 'undefined') return fallback;
    try {
      const data: Prisma.RepeatCardUpdateInput = {};
      if (updates.materialId !== undefined) data.materialId = updates.materialId;
      if (updates.front !== undefined) data.front = updates.front;
      if (updates.back !== undefined) data.back = updates.back;
      if (updates.interval !== undefined) data.interval = updates.interval;
      if (updates.repetitions !== undefined) data.repetitions = updates.repetitions;
      if (updates.easeFactor !== undefined) data.easeFactor = updates.easeFactor;
      if (updates.nextReviewDate !== undefined) data.nextReviewDate = updates.nextReviewDate;
      if (updates.lastReviewedAt !== undefined) data.lastReviewedAt = updates.lastReviewedAt ? new Date(updates.lastReviewedAt) : null;

      const result = await prisma.repeatCard.update({
        where: { id },
        data,
      });
      return RepeatCardMapper.toDto(result);
    } catch {
      return fallback;
    }
  }

  async delete(id: string): Promise<boolean> {
    if (typeof window !== 'undefined') return true;
    try {
      await prisma.repeatCard.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}

export const prismaRepeatCardRepository = new PrismaRepeatCardRepository();
export const repeatCardRepository = prismaRepeatCardRepository;
