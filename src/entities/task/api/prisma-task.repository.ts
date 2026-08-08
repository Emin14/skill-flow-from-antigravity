import { prisma } from '@/shared/lib/prisma';
import { Prisma } from '@prisma/client';
import { Task } from '../model/types';
import { TaskMapper } from './task.mapper';

export class PrismaTaskRepository {
  async getAll(): Promise<Task[]> {
    const prismaTasks = await prisma.task.findMany({
      include: {
        occurrences: true,
        tags: true,
        subtasks: true,
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'asc' },
      ],
    });
    return prismaTasks.map(TaskMapper.toDto);
  }

  async getById(id: string): Promise<Task | null> {
    const prismaTask = await prisma.task.findUnique({
      where: { id },
      include: {
        occurrences: true,
        tags: true,
        subtasks: true,
      },
    });
    return prismaTask ? TaskMapper.toDto(prismaTask) : null;
  }

  async getByTopicId(topicId: string): Promise<Task[]> {
    const prismaTasks = await prisma.task.findMany({
      where: {
        OR: [
          { topicId },
          { parentTaskId: topicId },
        ],
      },
      include: {
        occurrences: true,
        tags: true,
        subtasks: true,
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'asc' },
      ],
    });
    return prismaTasks.map(TaskMapper.toDto);
  }

  async getByDate(dateStr: string): Promise<Task[]> {
    const prismaTasks = await prisma.task.findMany({
      where: {
        occurrences: { some: { date: dateStr } },
      },
      include: {
        occurrences: true,
        tags: true,
        subtasks: true,
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'asc' },
      ],
    });
    return prismaTasks.map(TaskMapper.toDto);
  }

  async create(task: Task): Promise<Task> {
    const occurrencesData = (task.occurrences || []).map((o) => ({
      id: o.id,
      date: o.date,
      status: o.status || 'Todo',
      note: o.note || null,
      startedAt: o.startedAt ? new Date(o.startedAt) : null,
      activeMinutes: o.activeMinutes ?? 0,
      pomodorosCount: o.pomodorosCount ?? 0,
      smartRating: o.smartRating || null,
      completedAt: o.completedAt ? new Date(o.completedAt) : null,
    }));

    const result = await prisma.task.create({
      data: {
        id: task.id,
        title: task.title,
        priority: task.priority || 'P2',
        category: task.category || 'Без категории',
        description: task.description || null,
        link: task.link || null,
        parentTaskId: task.parentTaskId || null,
        sortOrder: task.sortOrder ?? null,
        isRepeating: task.isRepeating ?? false,
        taskState: task.taskState || (task.isRepeating ? 'active' : null),
        repetitionMode: task.repetitionMode || null,
        scheduleFrequency: task.scheduleFrequency || null,
        afterCompletionDays: task.afterCompletionDays ?? null,
        spacedStepIndex: task.spacedStepIndex ?? null,
        currentIntervalDays: task.currentIntervalDays ?? null,
        targetRepetitions: task.targetRepetitions ?? null,
        topicId: task.topicId || null,
        goalId: task.goalId || null,
        createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
        occurrences: {
          create: occurrencesData,
        },
      },
      include: {
        occurrences: true,
        tags: true,
        subtasks: true,
      },
    });

    return TaskMapper.toDto(result);
  }

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const existing = await tx.task.findUnique({
        where: { id },
        include: { occurrences: true, tags: true, subtasks: true },
      });

      if (!existing) {
        throw new Error(`Task with id ${id} not found`);
      }

      const taskUpdateData: Prisma.TaskUncheckedUpdateInput = {};
      if (updates.title !== undefined) taskUpdateData.title = updates.title;
      if (updates.priority !== undefined) taskUpdateData.priority = updates.priority;
      if (updates.category !== undefined) taskUpdateData.category = updates.category;
      if (updates.description !== undefined) taskUpdateData.description = updates.description;
      if (updates.link !== undefined) taskUpdateData.link = updates.link;
      if (updates.parentTaskId !== undefined) taskUpdateData.parentTaskId = updates.parentTaskId;
      if (updates.sortOrder !== undefined) taskUpdateData.sortOrder = updates.sortOrder;
      if (updates.isRepeating !== undefined) taskUpdateData.isRepeating = updates.isRepeating;
      if (updates.taskState !== undefined) taskUpdateData.taskState = updates.taskState;
      if (updates.repetitionMode !== undefined) taskUpdateData.repetitionMode = updates.repetitionMode;
      if (updates.scheduleFrequency !== undefined) taskUpdateData.scheduleFrequency = updates.scheduleFrequency;
      if (updates.afterCompletionDays !== undefined) taskUpdateData.afterCompletionDays = updates.afterCompletionDays;
      if (updates.spacedStepIndex !== undefined) taskUpdateData.spacedStepIndex = updates.spacedStepIndex;
      if (updates.currentIntervalDays !== undefined) taskUpdateData.currentIntervalDays = updates.currentIntervalDays;
      if (updates.targetRepetitions !== undefined) taskUpdateData.targetRepetitions = updates.targetRepetitions;
      if (updates.topicId !== undefined) taskUpdateData.topicId = updates.topicId;
      if (updates.goalId !== undefined) taskUpdateData.goalId = updates.goalId;

      await tx.task.update({
        where: { id },
        data: taskUpdateData,
      });

      if (updates.occurrences) {
        await tx.taskOccurrence.deleteMany({
          where: { taskId: id },
        });

        if (updates.occurrences.length > 0) {
          await tx.taskOccurrence.createMany({
            data: updates.occurrences.map((o) => ({
              id: o.id,
              taskId: id,
              date: o.date,
              status: o.status || 'Todo',
              note: o.note || null,
              startedAt: o.startedAt ? new Date(o.startedAt) : null,
              activeMinutes: o.activeMinutes ?? 0,
              pomodorosCount: o.pomodorosCount ?? 0,
              smartRating: o.smartRating || null,
              completedAt: o.completedAt ? new Date(o.completedAt) : null,
            })),
          });
        }
      }

      return tx.task.findUniqueOrThrow({
        where: { id },
        include: { occurrences: true, tags: true, subtasks: true },
      });
    });

    return TaskMapper.toDto(result);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.task.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async updateCategoryBatch(oldCategory: string, newCategory: string): Promise<number> {
    const result = await prisma.task.updateMany({
      where: { category: oldCategory },
      data: { category: newCategory },
    });
    return result.count;
  }
}

export const prismaTaskRepository = new PrismaTaskRepository();
export const taskRepository = prismaTaskRepository;
