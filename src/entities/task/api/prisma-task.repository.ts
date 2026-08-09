import { prisma } from '@/shared/lib/prisma';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskOccurrence } from '../model/types';
import { TaskMapper } from './task.mapper';

const safeDate = (val: string | Date | null | undefined): Date | null => {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
};

const parseNumInt = (val: any): number | null => {
  if (val === null || val === undefined || val === '') return null;
  const parsed = typeof val === 'number' ? val : parseInt(String(val), 10);
  return isNaN(parsed) ? null : parsed;
};

const parseNumFloat = (val: any): number | null => {
  if (val === null || val === undefined || val === '') return null;
  const parsed = typeof val === 'number' ? val : parseFloat(String(val));
  return isNaN(parsed) ? null : parsed;
};

export class PrismaTaskRepository {
  async getAll(): Promise<Task[]> {
    if (typeof window !== 'undefined') return [];
    try {
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
    } catch {
      return [];
    }
  }

  async getById(id: string): Promise<Task | null> {
    if (typeof window !== 'undefined') return null;
    try {
      const prismaTask = await prisma.task.findUnique({
        where: { id },
        include: {
          occurrences: true,
          tags: true,
          subtasks: true,
        },
      });
      return prismaTask ? TaskMapper.toDto(prismaTask) : null;
    } catch {
      return null;
    }
  }

  async getByTopicId(topicId: string): Promise<Task[]> {
    if (typeof window !== 'undefined') return [];
    try {
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
    } catch {
      return [];
    }
  }

  async getByDate(dateStr: string): Promise<Task[]> {
    if (typeof window !== 'undefined') return [];
    try {
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
    } catch {
      return [];
    }
  }

  async create(task: Task): Promise<Task> {
    if (typeof window !== 'undefined') return task;

    let effectiveParentId: string | null = null;
    if (task.parentTaskId && typeof task.parentTaskId === 'string' && task.parentTaskId.trim()) {
      const cleanParentId = task.parentTaskId.trim();
      const parentExists = await prisma.task.findUnique({
        where: { id: cleanParentId },
        select: { id: true },
      });
      if (parentExists) {
        effectiveParentId = cleanParentId;
      }
    }

    let effectiveTopicId: string | null = null;
    if (task.topicId && typeof task.topicId === 'string' && task.topicId.trim()) {
      const cleanTopicId = task.topicId.trim();
      const topicExists = await prisma.topic.findUnique({
        where: { id: cleanTopicId },
        select: { id: true },
      });
      if (topicExists) {
        effectiveTopicId = cleanTopicId;
      }
    }

    let effectiveGoalId: string | null = null;
    if (task.goalId && typeof task.goalId === 'string' && task.goalId.trim()) {
      const cleanGoalId = task.goalId.trim();
      const goalExists = await prisma.goal.findUnique({
        where: { id: cleanGoalId },
        select: { id: true },
      });
      if (goalExists) {
        effectiveGoalId = cleanGoalId;
      }
    }

    // Business Rule: Subtasks can NEVER be repeating (isRepeating is always false for subtasks)
    const effectiveIsRepeating = effectiveParentId ? false : (task.isRepeating ?? false);

    const todayStr = new Date().toISOString().split('T')[0];
    const defaultDate = (task.scheduledDate && typeof task.scheduledDate === 'string' && task.scheduledDate.trim())
      ? task.scheduledDate.trim()
      : todayStr;

    let occurrencesData = (task.occurrences || []).map((o) => ({
      id: (o.id && typeof o.id === 'string' && o.id.trim()) ? o.id.trim() : uuidv4(),
      date: (o.date && typeof o.date === 'string' && o.date.trim()) ? o.date.trim() : defaultDate,
      status: o.status || 'Todo',
      note: o.note || null,
      startedAt: safeDate((o as any).startedAt),
      activeMinutes: parseNumFloat(o.activeMinutes) ?? 0,
      pomodorosCount: parseNumFloat(o.pomodorosCount) ?? 0,
      smartRating: o.smartRating || null,
      completedAt: safeDate(o.completedAt),
    }));

    if (occurrencesData.length === 0) {
      occurrencesData = [{
        id: uuidv4(),
        date: defaultDate,
        status: 'Todo',
        note: null,
        startedAt: null,
        activeMinutes: 0,
        pomodorosCount: 0,
        smartRating: null,
        completedAt: null,
      }];
    }

    const taskId = (task.id && typeof task.id === 'string' && task.id.trim()) ? task.id.trim() : uuidv4();

    try {
      const result = await prisma.task.create({
        data: {
          id: taskId,
          title: (task.title && typeof task.title === 'string' && task.title.trim()) ? task.title.trim() : 'Без названия',
          priority: task.priority || 'P3',
          category: (task.category && typeof task.category === 'string' && task.category.trim()) ? task.category.trim() : 'Без категории',
          description: task.description || null,
          link: task.link || null,
          parentTaskId: effectiveParentId,
          isRepeating: effectiveIsRepeating,
          taskState: effectiveIsRepeating ? (task.taskState || 'active') : null,
          repetitionMode: effectiveIsRepeating ? (task.repetitionMode || null) : null,
          scheduleFrequency: effectiveIsRepeating ? (task.scheduleFrequency || null) : null,
          targetRepetitions: effectiveIsRepeating ? parseNumInt(task.targetRepetitions) : null,
          afterCompletionDays: effectiveIsRepeating ? parseNumInt(task.afterCompletionDays) : null,
          currentIntervalDays: effectiveIsRepeating ? parseNumFloat(task.currentIntervalDays) : null,
          spacedStepIndex: effectiveIsRepeating ? parseNumInt(task.spacedStepIndex) : null,
          sortOrder: parseNumInt(task.sortOrder),
          topicId: effectiveTopicId,
          goalId: effectiveGoalId,
          createdAt: safeDate(task.createdAt) || new Date(),
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
    } catch (err) {
      console.error('[prismaTaskRepository.create] Error creating task:', err);
      throw err;
    }
  }

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const fallback: Task = { id, title: updates.title || '', status: 'Todo', priority: 'P2', category: 'Без категории', scheduledDate: '', createdAt: new Date().toISOString() };
    if (typeof window !== 'undefined') return fallback;

    try {
      const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const existing = await tx.task.findUnique({
          where: { id },
          include: { occurrences: true, tags: true, subtasks: true },
        });

        if (!existing) {
          throw new Error(`Task with id ${id} not found`);
        }

        const effectiveParentId = updates.parentTaskId !== undefined ? updates.parentTaskId : existing.parentTaskId;
        const forceNonRepeating = Boolean(effectiveParentId);

        const taskUpdateData: Prisma.TaskUpdateInput = {};
        if (updates.title !== undefined) taskUpdateData.title = updates.title;
        if (updates.priority !== undefined) taskUpdateData.priority = updates.priority;
        if (updates.category !== undefined) taskUpdateData.category = updates.category;
        if (updates.description !== undefined) taskUpdateData.description = updates.description;
        if (updates.link !== undefined) taskUpdateData.link = updates.link;
        if (updates.parentTaskId !== undefined) {
          if (updates.parentTaskId && typeof updates.parentTaskId === 'string' && updates.parentTaskId.trim()) {
            const cleanPId = updates.parentTaskId.trim();
            const pExists = await tx.task.findUnique({ where: { id: cleanPId }, select: { id: true } });
            if (pExists) {
              taskUpdateData.parentTask = { connect: { id: cleanPId } };
            } else {
              taskUpdateData.parentTask = { disconnect: true };
            }
          } else {
            taskUpdateData.parentTask = { disconnect: true };
          }
        }
        if (updates.sortOrder !== undefined) taskUpdateData.sortOrder = parseNumInt(updates.sortOrder);

        if (forceNonRepeating) {
          taskUpdateData.isRepeating = false;
          taskUpdateData.taskState = null;
          taskUpdateData.repetitionMode = null;
          taskUpdateData.scheduleFrequency = null;
          taskUpdateData.targetRepetitions = null;
          taskUpdateData.afterCompletionDays = null;
          taskUpdateData.currentIntervalDays = null;
          taskUpdateData.spacedStepIndex = null;
        } else {
          if (updates.isRepeating !== undefined) taskUpdateData.isRepeating = updates.isRepeating;
          if (updates.taskState !== undefined) taskUpdateData.taskState = updates.taskState;
          if (updates.repetitionMode !== undefined) taskUpdateData.repetitionMode = updates.repetitionMode;
          if (updates.scheduleFrequency !== undefined) taskUpdateData.scheduleFrequency = updates.scheduleFrequency;
          if (updates.targetRepetitions !== undefined) taskUpdateData.targetRepetitions = parseNumInt(updates.targetRepetitions);
          if (updates.afterCompletionDays !== undefined) taskUpdateData.afterCompletionDays = parseNumInt(updates.afterCompletionDays);
          if (updates.currentIntervalDays !== undefined) taskUpdateData.currentIntervalDays = parseNumFloat(updates.currentIntervalDays);
          if (updates.spacedStepIndex !== undefined) taskUpdateData.spacedStepIndex = parseNumInt(updates.spacedStepIndex);
        }

        if (updates.topicId !== undefined) {
          if (updates.topicId && typeof updates.topicId === 'string' && updates.topicId.trim()) {
            const tExists = await tx.topic.findUnique({ where: { id: updates.topicId.trim() }, select: { id: true } });
            taskUpdateData.topicId = tExists ? tExists.id : null;
          } else {
            taskUpdateData.topicId = null;
          }
        }
        if (updates.goalId !== undefined) {
          if (updates.goalId && typeof updates.goalId === 'string' && updates.goalId.trim()) {
            const gExists = await tx.goal.findUnique({ where: { id: updates.goalId.trim() }, select: { id: true } });
            taskUpdateData.goalId = gExists ? gExists.id : null;
          } else {
            taskUpdateData.goalId = null;
          }
        }

        await tx.task.update({
          where: { id },
          data: taskUpdateData,
        });

        if (updates.occurrences) {
          await tx.taskOccurrence.deleteMany({
            where: { taskId: id },
          });

          if (updates.occurrences.length > 0) {
            const seenIds = new Set<string>();
            const defaultDate = updates.scheduledDate || new Date().toISOString().split('T')[0];
            const occData = updates.occurrences.map((o) => {
              let occId = o.id && typeof o.id === 'string' && o.id.trim() && !seenIds.has(o.id.trim()) ? o.id.trim() : uuidv4();
              seenIds.add(occId);
              return {
                id: occId,
                taskId: id,
                date: (o.date && typeof o.date === 'string' && o.date.trim()) ? o.date.trim() : defaultDate,
                status: o.status || 'Todo',
                note: o.note || null,
                startedAt: safeDate((o as any).startedAt),
                activeMinutes: o.activeMinutes ?? 0,
                pomodorosCount: o.pomodorosCount ?? 0,
                smartRating: o.smartRating || null,
                completedAt: safeDate(o.completedAt),
              };
            });

            await tx.taskOccurrence.createMany({
              data: occData,
            });
          }
        } else if (updates.isRepeating && existing.occurrences.length === 0) {
          // If updated to repeating and had 0 occurrences, create initial occurrence
          const defaultDate = updates.scheduledDate || new Date().toISOString().split('T')[0];
          await tx.taskOccurrence.create({
            data: {
              id: uuidv4(),
              taskId: id,
              date: defaultDate,
              status: 'Todo',
              activeMinutes: 0,
              pomodorosCount: 0,
            },
          });
        }

        return tx.task.findUniqueOrThrow({
          where: { id },
          include: { occurrences: true, tags: true, subtasks: true },
        });
      });

      return TaskMapper.toDto(result);
    } catch (err) {
      console.error(`[prismaTaskRepository.update] Error updating task ${id}:`, err);
      throw err;
    }
  }

  // Delete parent task only (DB automatically sets subtasks parentTaskId = null via onDelete: SetNull)
  async delete(id: string): Promise<boolean> {
    if (typeof window !== 'undefined') return true;
    try {
      await prisma.task.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  // Explicitly delete parent task together with all child subtasks (and their occurrences)
  async deleteWithSubtasks(id: string): Promise<boolean> {
    if (typeof window !== 'undefined') return true;
    try {
      await prisma.$transaction(async (tx) => {
        const subtasks = await tx.task.findMany({
          where: { parentTaskId: id },
          select: { id: true },
        });
        const subtaskIds = subtasks.map((s) => s.id);

        if (subtaskIds.length > 0) {
          await tx.task.deleteMany({
            where: { id: { in: subtaskIds } },
          });
        }

        await tx.task.delete({
          where: { id },
        });
      });
      return true;
    } catch {
      return false;
    }
  }

  async updateCategoryBatch(oldCategory: string, newCategory: string): Promise<number> {
    if (typeof window !== 'undefined') return 0;
    try {
      const result = await prisma.task.updateMany({
        where: { category: oldCategory },
        data: { category: newCategory },
      });
      return result.count;
    } catch {
      return 0;
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
        note: occ.note || null,
        startedAt: safeDate((occ as any).startedAt),
        activeMinutes: occ.activeMinutes ?? 0,
        pomodorosCount: occ.pomodorosCount ?? 0,
        smartRating: occ.smartRating || null,
        completedAt: safeDate(occ.completedAt),
      },
    });
    return TaskMapper.toOccurrenceDto(created);
  }

  async updateOccurrence(id: string, updates: Partial<TaskOccurrence>): Promise<TaskOccurrence> {
    const data: Prisma.TaskOccurrenceUpdateInput = {};
    if (updates.date !== undefined) data.date = updates.date;
    if (updates.status !== undefined) data.status = updates.status;
    if (updates.note !== undefined) data.note = updates.note;
    if (updates.completedAt !== undefined) data.completedAt = safeDate(updates.completedAt);
    if (updates.pomodorosCount !== undefined) data.pomodorosCount = updates.pomodorosCount;
    if (updates.activeMinutes !== undefined) data.activeMinutes = updates.activeMinutes;
    if (updates.smartRating !== undefined) data.smartRating = updates.smartRating;

    const updated = await prisma.taskOccurrence.update({
      where: { id },
      data,
    });
    return TaskMapper.toOccurrenceDto(updated);
  }

  async deleteOccurrence(id: string): Promise<boolean> {
    if (typeof window !== 'undefined') return true;
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
    if (typeof window !== 'undefined') return [];
    try {
      const list = await prisma.taskOccurrence.findMany({
        where: { taskId },
      });
      return list.map(TaskMapper.toOccurrenceDto);
    } catch {
      return [];
    }
  }
}

export const prismaTaskRepository = new PrismaTaskRepository();
export const taskRepository = prismaTaskRepository;
