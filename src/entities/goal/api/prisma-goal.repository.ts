import { prisma } from '@/shared/lib/prisma';
import { Prisma } from '@prisma/client';
import { Goal } from '../model/types';
import { GoalMapper } from './goal.mapper';
import { GoalRepository } from '@/shared/repository/interfaces/GoalRepository';

export class PrismaGoalRepository implements GoalRepository {
  async getAll(): Promise<Goal[]> {
    const list = await prisma.goal.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return list.map(GoalMapper.toDto);
  }

  async getById(id: string): Promise<Goal | null> {
    const item = await prisma.goal.findUnique({
      where: { id },
    });
    return item ? GoalMapper.toDto(item) : null;
  }

  async save(goal: Goal): Promise<Goal> {
    const result = await prisma.goal.upsert({
      where: { id: goal.id },
      create: {
        id: goal.id,
        title: goal.title,
        description: goal.description || null,
        color: goal.color,
        status: goal.status || 'Active',
        createdAt: goal.createdAt ? new Date(goal.createdAt) : new Date(),
      },
      update: {
        title: goal.title,
        description: goal.description || null,
        color: goal.color,
        status: goal.status || 'Active',
      },
    });
    return GoalMapper.toDto(result);
  }

  async update(id: string, updates: Partial<Goal>): Promise<Goal> {
    const data: Prisma.GoalUpdateInput = {};
    if (updates.title !== undefined) data.title = updates.title;
    if (updates.description !== undefined) data.description = updates.description;
    if (updates.color !== undefined) data.color = updates.color;
    if (updates.status !== undefined) data.status = updates.status;

    const result = await prisma.goal.update({
      where: { id },
      data,
    });
    return GoalMapper.toDto(result);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.goal.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}

export const prismaGoalRepository = new PrismaGoalRepository();
export const goalRepository = prismaGoalRepository;
