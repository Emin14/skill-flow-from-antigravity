import { Prisma, TaskOccurrence as PrismaTaskOccurrence, Tag as PrismaTag } from '@prisma/client';
import { Task, TaskStatus, TaskPriority, TaskState, TaskOccurrence, TagItem, getDerivedRepetitionsCount, getDerivedLastSmartRating } from '../model/types';
import { TaskCategory } from '@/shared/config/categories';
import { RepetitionMode, ScheduleFrequency } from '@/shared/config/repetitionRules';

export type TaskWithRelations = Prisma.TaskGetPayload<{
  include: { occurrences: true; tags: true; subtasks: true };
}>;

export class TaskMapper {
  static toDto(prismaTask: TaskWithRelations): Task {
    const occurrences = (prismaTask.occurrences || []).map(TaskMapper.toOccurrenceDto);
    const tags = (prismaTask.tags || []).map(TaskMapper.toTagDto);

    // Derived status and scheduledDate from active occurrence
    const firstTodoOcc = occurrences.find((o) => o.status === 'Todo') || occurrences[0];
    const derivedStatus: TaskStatus = firstTodoOcc ? firstTodoOcc.status : 'Todo';
    const derivedScheduledDate = firstTodoOcc ? firstTodoOcc.date : '';

    const taskDto: Task = {
      id: prismaTask.id,
      title: prismaTask.title,
      status: derivedStatus,
      priority: (prismaTask.priority as TaskPriority) || 'P2',
      category: (prismaTask.category as TaskCategory) || 'Без категории',
      description: prismaTask.description || undefined,
      link: prismaTask.link || undefined,
      parentTaskId: prismaTask.parentTaskId || null,
      scheduledDate: derivedScheduledDate,
      sortOrder: prismaTask.sortOrder ?? null,
      
      isRepeating: prismaTask.isRepeating,
      taskState: (prismaTask.taskState as TaskState) || (prismaTask.isRepeating ? 'active' : null),
      repeatStatus: (prismaTask.taskState === 'paused' ? 'Paused' : prismaTask.taskState === 'completed' ? 'Completed' : 'Active'),
      repetitionMode: (prismaTask.repetitionMode as RepetitionMode) || null,
      scheduleFrequency: (prismaTask.scheduleFrequency as ScheduleFrequency) || null,
      afterCompletionDays: prismaTask.afterCompletionDays ?? null,
      spacedStepIndex: prismaTask.spacedStepIndex ?? null,
      currentIntervalDays: prismaTask.currentIntervalDays ?? null,
      targetRepetitions: prismaTask.targetRepetitions ?? null,
      
      hasSubtasks: Boolean(prismaTask.subtasks && prismaTask.subtasks.length > 0),
      topicId: prismaTask.topicId || null,
      goalId: prismaTask.goalId || null,
      createdAt: prismaTask.createdAt instanceof Date ? prismaTask.createdAt.toISOString() : String(prismaTask.createdAt),
      updatedAt: prismaTask.updatedAt instanceof Date ? prismaTask.updatedAt.toISOString() : String(prismaTask.updatedAt),
      tags,
      occurrences,
    };

    // Calculate derived repetitionsCount and lastSmartRating on the fly
    taskDto.repetitionsCount = getDerivedRepetitionsCount(taskDto);
    taskDto.lastSmartRating = getDerivedLastSmartRating(taskDto);

    return taskDto;
  }

  static toOccurrenceDto(occ: PrismaTaskOccurrence): TaskOccurrence {
    return {
      id: occ.id,
      taskId: occ.taskId,
      date: occ.date,
      status: (occ.status as TaskStatus) || 'Todo',
      note: occ.note || null,
      startedAt: occ.startedAt ? occ.startedAt.toISOString() : null,
      activeMinutes: occ.activeMinutes ?? 0,
      pomodorosCount: occ.pomodorosCount ?? 0,
      smartRating: (occ.smartRating as any) || undefined,
      completedAt: occ.completedAt ? occ.completedAt.toISOString() : null,
    };
  }

  static toTagDto(tag: PrismaTag): TagItem {
    return {
      id: tag.id,
      name: tag.name,
      color: tag.color || null,
      icon: tag.icon || null,
      createdAt: tag.createdAt instanceof Date ? tag.createdAt.toISOString() : String(tag.createdAt),
    };
  }
}
