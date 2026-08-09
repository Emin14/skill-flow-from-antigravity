import { prisma } from '@/shared/lib/prisma';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { Goal } from '../model/types';
import { GoalMapper } from './goal.mapper';
import { GoalRepository } from '@/shared/repository/interfaces/GoalRepository';

export class PrismaGoalRepository implements GoalRepository {
  async getAll(): Promise<Goal[]> {
    if (typeof window !== 'undefined') return [];
    try {
      const list = await prisma.goal.findMany({
        orderBy: { createdAt: 'asc' },
      });
      return list.map(GoalMapper.toDto);
    } catch {
      return [];
    }
  }

  async getById(id: string): Promise<Goal | null> {
    if (typeof window !== 'undefined') return null;
    try {
      const item = await prisma.goal.findUnique({
        where: { id },
      });
      return item ? GoalMapper.toDto(item) : null;
    } catch {
      return null;
    }
  }

  async save(goal: Goal): Promise<Goal> {
    if (typeof window !== 'undefined') return goal;
    const goalId = (goal.id && typeof goal.id === 'string' && goal.id.trim()) ? goal.id.trim() : uuidv4();
    try {
      const result = await prisma.goal.upsert({
        where: { id: goalId },
        create: {
          id: goalId,
          title: goal.title || 'Без названия',
          description: goal.description || null,
          color: goal.color || '#6366f1',
          status: goal.status || 'Active',
          createdAt: goal.createdAt ? new Date(goal.createdAt) : new Date(),
        },
        update: {
          title: goal.title || 'Без названия',
          description: goal.description || null,
          color: goal.color || '#6366f1',
          status: goal.status || 'Active',
        },
      });
      return GoalMapper.toDto(result);
    } catch (err) {
      console.error('[PrismaGoalRepository.save] Error:', err);
      throw err;
    }
  }

  async update(id: string, updates: Partial<Goal>): Promise<Goal> {
    const fallback: Goal = { id, title: updates.title || '', color: updates.color || '', status: 'Active', createdAt: new Date().toISOString() };
    if (typeof window !== 'undefined') return fallback;
    try {
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
    } catch (err) {
      console.error(`[PrismaGoalRepository.update] Error updating goal ${id}:`, err);
      throw err;
    }
  }

  async delete(id: string): Promise<boolean> {
    if (typeof window !== 'undefined') return true;
    try {
      await prisma.goal.delete({ where: { id } });
      return true;
    } catch (err) {
      console.error(`[PrismaGoalRepository.delete] Error deleting goal ${id}:`, err);
      throw err;
    }
  }
}

export const prismaGoalRepository = new PrismaGoalRepository();
export const goalRepository = prismaGoalRepository;
