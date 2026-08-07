import { RepeatCard as PrismaRepeatCard } from '@prisma/client';
import { RepeatCard } from '../model/types';

export class RepeatCardMapper {
  static toDto(prismaCard: PrismaRepeatCard): RepeatCard {
    return {
      id: prismaCard.id,
      materialId: prismaCard.materialId,
      front: prismaCard.front,
      back: prismaCard.back,
      interval: prismaCard.interval,
      repetitions: prismaCard.repetitions,
      easeFactor: prismaCard.easeFactor,
      nextReviewDate: prismaCard.nextReviewDate,
      lastReviewedAt: prismaCard.lastReviewedAt ? prismaCard.lastReviewedAt.toISOString() : null,
      createdAt: prismaCard.createdAt instanceof Date ? prismaCard.createdAt.toISOString() : String(prismaCard.createdAt),
    };
  }
}
