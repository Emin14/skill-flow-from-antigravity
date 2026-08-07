import { Goal as PrismaGoal } from '@prisma/client';
import { Goal } from '../model/types';

export class GoalMapper {
  static toDto(prismaGoal: PrismaGoal): Goal {
    return {
      id: prismaGoal.id,
      title: prismaGoal.title,
      description: prismaGoal.description || undefined,
      color: prismaGoal.color,
      status: (prismaGoal.status as Goal['status']) || 'Active',
      createdAt: prismaGoal.createdAt instanceof Date ? prismaGoal.createdAt.toISOString() : String(prismaGoal.createdAt),
    };
  }
}
