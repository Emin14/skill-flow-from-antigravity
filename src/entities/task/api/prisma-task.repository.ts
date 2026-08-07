import { prisma } from '@/shared/lib/prisma';
import { Prisma } from '@prisma/client';
import { Task, TaskOccurrence } from '../model/types';
import { TaskMapper } from './task.mapper';

export class PrismaTaskRepository {
  async getAll(): Promise<Task[]> {
    const prismaTasks = await prisma.task.findMany({
      include: {
        occurrences: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    return prismaTasks.map(TaskMapper.toDto);
  }

  async getById(id: string): Promise<Task | null> {
    const prismaTask = await prisma.task.findUnique({
      where: { id },
      include: {
        occurrences: true,
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
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    return prismaTasks.map(TaskMapper.toDto);
  }

  async getByDate(dateStr: string): Promise<Task[]> {
    const prismaTasks = await prisma.task.findMany({
      where: {
        OR: [
          { scheduledDate: dateStr },
          { occurrences: { some: { date: dateStr } } },
        ],
      },
      include: {
        occurrences: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    return prismaTasks.map(TaskMapper.toDto);
  }

  async create(task: Task): Promise<Task> {
    const occurrencesData = (task.occurrences || []).map((o) => ({
      id: o.id,
      date: o.date,
      status: o.status || 'Todo',
      completedAt: o.completedAt ? new Date(o.completedAt) : null,
      pomodorosCount: o.pomodorosCount ?? null,
    }));

    const result = await prisma.task.create({
      data: {
        id: task.id,
        title: task.title,
        status: task.status || 'Todo',
        priority: task.priority || 'P2',
        category: task.category || 'Без категории',
        description: task.description || null,
        link: task.link || null,
        parentTaskId: task.parentTaskId || null,
        scheduledDate: task.scheduledDate,
        isRepeating: task.isRepeating ?? false,
        repeatStatus: task.repeatStatus || 'Active',
        repetitionMode: task.repetitionMode || 'smart',
        scheduleFrequency: task.scheduleFrequency || null,
        topicId: task.topicId || null,
        goalId: task.goalId || null,
        createdAt: task.createdAt ? new Date(task.createdAt) : new Date(),
        occurrences: {
          create: occurrencesData,
        },
      },
      include: {
        occurrences: true,
      },
    });

    return TaskMapper.toDto(result);
  }

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.task.findUnique({
        where: { id },
        include: { occurrences: true },
      });

      if (!existing) {
        throw new Error(`Task with id ${id} not found`);
      }

      const taskUpdateData: Prisma.TaskUpdateInput = {};
      if (updates.title !== undefined) taskUpdateData.title = updates.title;
      if (updates.status !== undefined) taskUpdateData.status = updates.status;
      if (updates.priority !== undefined) taskUpdateData.priority = updates.priority;
      if (updates.category !== undefined) taskUpdateData.category = updates.category;
      if (updates.description !== undefined) taskUpdateData.description = updates.description;
      if (updates.link !== undefined) taskUpdateData.link = updates.link;
      if (updates.parentTaskId !== undefined) taskUpdateData.parentTaskId = updates.parentTaskId;
      if (updates.scheduledDate !== undefined) taskUpdateData.scheduledDate = updates.scheduledDate;
      if (updates.isRepeating !== undefined) taskUpdateData.isRepeating = updates.isRepeating;
      if (updates.repeatStatus !== undefined) taskUpdateData.repeatStatus = updates.repeatStatus;
      if (updates.repetitionMode !== undefined) taskUpdateData.repetitionMode = updates.repetitionMode;
      if (updates.scheduleFrequency !== undefined) taskUpdateData.scheduleFrequency = updates.scheduleFrequency;
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
              completedAt: o.completedAt ? new Date(o.completedAt) : null,
              pomodorosCount: o.pomodorosCount ?? null,
            })),
          });
        }
      }

      return tx.task.findUniqueOrThrow({
        where: { id },
        include: { occurrences: true },
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

  // TaskOccurrence CRUD
  async createOccurrence(taskId: string, occ: TaskOccurrence): Promise<TaskOccurrence> {
    const created = await prisma.taskOccurrence.create({
      data: {
        id: occ.id,
        taskId,
        date: occ.date,
        status: occ.status || 'Todo',
        completedAt: occ.completedAt ? new Date(occ.completedAt) : null,
        pomodorosCount: occ.pomodorosCount ?? null,
      },
    });
    return TaskMapper.toOccurrenceDto(created);
  }

  async updateOccurrence(id: string, updates: Partial<TaskOccurrence>): Promise<TaskOccurrence> {
    const data: Prisma.TaskOccurrenceUpdateInput = {};
    if (updates.date !== undefined) data.date = updates.date;
    if (updates.status !== undefined) data.status = updates.status;
    if (updates.completedAt !== undefined) data.completedAt = updates.completedAt ? new Date(updates.completedAt) : null;
    if (updates.pomodorosCount !== undefined) data.pomodorosCount = updates.pomodorosCount;

    const updated = await prisma.taskOccurrence.update({
      where: { id },
      data,
    });
    return TaskMapper.toOccurrenceDto(updated);
  }

  async deleteOccurrence(id: string): Promise<boolean> {
    try {
      await prisma.taskOccurrence.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async getOccurrences(taskId: string): Promise<TaskOccurrence[]> {
    const list = await prisma.taskOccurrence.findMany({
      where: { taskId },
    });
    return list.map(TaskMapper.toOccurrenceDto);
  }
}

export const prismaTaskRepository = new PrismaTaskRepository();
export const taskRepository = prismaTaskRepository;
