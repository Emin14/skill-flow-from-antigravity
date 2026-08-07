import { Prisma, TaskOccurrence as PrismaTaskOccurrence } from '@prisma/client';
import { Task, TaskStatus, TaskPriority, RepeatStatus, TaskOccurrence } from '../model/types';
import { TaskCategory } from '@/shared/config/categories';
import { RepetitionMode, ScheduleFrequency } from '@/shared/config/repetitionRules';

export type TaskWithOccurrences = Prisma.TaskGetPayload<{
  include: { occurrences: true };
}>;

export class TaskMapper {
  static toDto(prismaTask: TaskWithOccurrences): Task {
    return {
      id: prismaTask.id,
      title: prismaTask.title,
      status: (prismaTask.status as TaskStatus) || 'Todo',
      priority: (prismaTask.priority as TaskPriority) || 'P2',
      category: (prismaTask.category as TaskCategory) || 'Без категории',
      description: prismaTask.description || undefined,
      link: prismaTask.link || undefined,
      parentTaskId: prismaTask.parentTaskId || null,
      scheduledDate: prismaTask.scheduledDate,
      isRepeating: prismaTask.isRepeating,
      repeatStatus: (prismaTask.repeatStatus as RepeatStatus) || undefined,
      repetitionMode: (prismaTask.repetitionMode as RepetitionMode) || undefined,
      scheduleFrequency: (prismaTask.scheduleFrequency as ScheduleFrequency) || undefined,
      topicId: prismaTask.topicId || null,
      goalId: prismaTask.goalId || null,
      createdAt: prismaTask.createdAt instanceof Date ? prismaTask.createdAt.toISOString() : String(prismaTask.createdAt),
      occurrences: (prismaTask.occurrences || []).map(TaskMapper.toOccurrenceDto),
    };
  }

  static toOccurrenceDto(occ: PrismaTaskOccurrence): TaskOccurrence {
    return {
      id: occ.id,
      taskId: occ.taskId,
      date: occ.date,
      status: (occ.status as TaskStatus) || 'Todo',
      completedAt: occ.completedAt ? occ.completedAt.toISOString() : null,
      pomodorosCount: occ.pomodorosCount ?? undefined,
    };
  }
}
