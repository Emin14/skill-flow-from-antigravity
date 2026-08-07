import { prisma } from '@/shared/lib/prisma';
import { Prisma } from '@prisma/client';
import { Topic } from '../model/types';
import { TopicMapper } from './topic.mapper';
import { TopicRepository } from '@/shared/repository/interfaces/TopicRepository';

export class PrismaTopicRepository implements TopicRepository {
  async getAll(): Promise<Topic[]> {
    const list = await prisma.topic.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return list.map(TopicMapper.toDto);
  }

  async getByGoalId(goalId: string): Promise<Topic[]> {
    const list = await prisma.topic.findMany({
      where: { goalId },
      orderBy: { createdAt: 'asc' },
    });
    return list.map(TopicMapper.toDto);
  }

  async getById(id: string): Promise<Topic | null> {
    const item = await prisma.topic.findUnique({
      where: { id },
    });
    return item ? TopicMapper.toDto(item) : null;
  }

  async save(topic: Topic): Promise<Topic> {
    const result = await prisma.topic.upsert({
      where: { id: topic.id },
      create: {
        id: topic.id,
        goalId: topic.goalId,
        parentId: topic.parentId || null,
        title: topic.title,
        weight: topic.weight ?? 1.0,
        createdAt: topic.createdAt ? new Date(topic.createdAt) : new Date(),
      },
      update: {
        goalId: topic.goalId,
        parentId: topic.parentId || null,
        title: topic.title,
        weight: topic.weight ?? 1.0,
      },
    });
    return TopicMapper.toDto(result);
  }

  async update(id: string, updates: Partial<Topic>): Promise<Topic> {
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
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.topic.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}

export const prismaTopicRepository = new PrismaTopicRepository();
export const topicRepository = prismaTopicRepository;
