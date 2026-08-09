import { prisma } from '@/shared/lib/prisma';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { Topic } from '../model/types';
import { TopicMapper } from './topic.mapper';
import { TopicRepository } from '@/shared/repository/interfaces/TopicRepository';

export class PrismaTopicRepository implements TopicRepository {
  async getAll(): Promise<Topic[]> {
    if (typeof window !== 'undefined') return [];
    try {
      const list = await prisma.topic.findMany({
        orderBy: { createdAt: 'asc' },
      });
      return list.map(TopicMapper.toDto);
    } catch {
      return [];
    }
  }

  async getByGoalId(goalId: string): Promise<Topic[]> {
    if (typeof window !== 'undefined') return [];
    try {
      const list = await prisma.topic.findMany({
        where: { goalId },
        orderBy: { createdAt: 'asc' },
      });
      return list.map(TopicMapper.toDto);
    } catch {
      return [];
    }
  }

  async getById(id: string): Promise<Topic | null> {
    if (typeof window !== 'undefined') return null;
    try {
      const item = await prisma.topic.findUnique({
        where: { id },
      });
      return item ? TopicMapper.toDto(item) : null;
    } catch {
      return null;
    }
  }

  async save(topic: Topic): Promise<Topic> {
    if (typeof window !== 'undefined') return topic;
    const topicId = (topic.id && typeof topic.id === 'string' && topic.id.trim()) ? topic.id.trim() : uuidv4();
    try {
      const result = await prisma.topic.upsert({
        where: { id: topicId },
        create: {
          id: topicId,
          goalId: topic.goalId,
          parentId: topic.parentId || null,
          title: topic.title || 'Без названия',
          weight: topic.weight ?? 1.0,
          createdAt: topic.createdAt ? new Date(topic.createdAt) : new Date(),
        },
        update: {
          goalId: topic.goalId,
          parentId: topic.parentId || null,
          title: topic.title || 'Без названия',
          weight: topic.weight ?? 1.0,
        },
      });
      return TopicMapper.toDto(result);
    } catch (err) {
      console.error('[PrismaTopicRepository.save] Error:', err);
      throw err;
    }
  }

  async update(id: string, updates: Partial<Topic>): Promise<Topic> {
    const fallback: Topic = { id, goalId: updates.goalId || '', title: updates.title || '', weight: 1.0, createdAt: new Date().toISOString() };
    if (typeof window !== 'undefined') return fallback;
    try {
      const data: Prisma.TopicUpdateInput = {};
      if (updates.goalId !== undefined) data.goalId = updates.goalId;
      if (updates.parentId !== undefined) data.parentId = updates.parentId;
      if (updates.title !== undefined) data.title = updates.title;
      if (updates.weight !== undefined) data.weight = updates.weight;

      const result = await prisma.topic.update({
        where: { id },
        data,
      });
      return TopicMapper.toDto(result);
    } catch (err) {
      console.error(`[PrismaTopicRepository.update] Error updating topic ${id}:`, err);
      throw err;
    }
  }

  async delete(id: string): Promise<boolean> {
    if (typeof window !== 'undefined') return true;
    try {
      await prisma.topic.delete({ where: { id } });
      return true;
    } catch (err) {
      console.error(`[PrismaTopicRepository.delete] Error deleting topic ${id}:`, err);
      throw err;
    }
  }
}

export const prismaTopicRepository = new PrismaTopicRepository();
export const topicRepository = prismaTopicRepository;
