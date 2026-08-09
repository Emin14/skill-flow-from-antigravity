import { Prisma, TaskOccurrence as PrismaTaskOccurrence, Tag as PrismaTag } from '@prisma/client';
import { Task, TaskStatus, TaskPriority, TaskState, RepeatStatus, TaskOccurrence, Tag } from '../model/types';
import { TaskCategory } from '@/shared/config/categories';
import { RepetitionMode, ScheduleFrequency, SmartRating } from '@/shared/config/repetitionRules';

export type TaskWithOccurrences = Prisma.TaskGetPayload<{
  include: { occurrences: true; tags: true; subtasks: true };
}>;

export class TaskMapper {
  static toDto(prismaTask: TaskWithOccurrences): Task {
    let occurrences = (prismaTask.occurrences || []).map(TaskMapper.toOccurrenceDto);
    const tags = (prismaTask.tags || []).map(TaskMapper.toTagDto);

    const fallbackDate = prismaTask.createdAt instanceof Date 
      ? prismaTask.createdAt.toISOString().split('T')[0] 
      : (String(prismaTask.createdAt).split('T')[0] || new Date().toISOString().split('T')[0]);

    if (occurrences.length === 0) {
      occurrences = [{
        id: `synthetic-${prismaTask.id}`,
        taskId: prismaTask.id,
        date: fallbackDate,
        status: 'Todo',
        pomodorosCount: 0,
        activeMinutes: 0,
        note: null,
        smartRating: null,
        completedAt: null,
      }];
    }

    // Compute dynamic repetitionsCount
    const repetitionsCount = occurrences.filter((o) => o.status === 'Done').length;

    // Compute dynamic lastSmartRating: latest completed occurrence with non-null smartRating
    const completedWithRating = occurrences
      .filter((o) => o.status === 'Done' && o.smartRating != null)
      .sort((a, b) => {
        const timeA = a.completedAt || a.date;
        const timeB = b.completedAt || b.date;
        return timeB.localeCompare(timeA);
      });
    const lastSmartRating = (completedWithRating[0]?.smartRating as SmartRating) ?? null;

    // Compute dynamic hasSubtasks
    const hasSubtasks = Boolean(prismaTask.subtasks && prismaTask.subtasks.length > 0);

    // Derive scheduledDate, status, repeatStatus, completedAt, pomodorosCount for backward compatibility
    const firstTodoOcc = occurrences.find((o) => o.status === 'Todo') || occurrences[0];
    const scheduledDate = firstTodoOcc.date;
    const status = firstTodoOcc.status;
    const repeatStatus: RepeatStatus = prismaTask.taskState === 'paused'
      ? 'Paused'
      : (prismaTask.taskState === 'completed' ? 'Completed' : 'Active');

    const lastDoneOcc = occurrences.filter((o) => o.status === 'Done').pop();
    const completedAt = lastDoneOcc?.completedAt || null;
    const pomodorosCount = occurrences[0].pomodorosCount || 1;

    return {
      id: prismaTask.id,
      title: prismaTask.title,
      description: prismaTask.description || undefined,
      category: (prismaTask.category as TaskCategory) || 'Без категории',
      tags,
      priority: (prismaTask.priority as TaskPriority) || 'P2',
      parentTaskId: prismaTask.parentTaskId || null,
      sortOrder: prismaTask.sortOrder ?? null,
      currentIntervalDays: prismaTask.currentIntervalDays ?? null,
      taskState: (prismaTask.taskState as TaskState) ?? null,
      isRepeating: prismaTask.isRepeating ?? false,
      repetitionMode: (prismaTask.repetitionMode as RepetitionMode) ?? null,
      targetRepetitions: prismaTask.targetRepetitions ?? null,
      scheduleFrequency: (prismaTask.scheduleFrequency as ScheduleFrequency) ?? null,
      createdAt: prismaTask.createdAt instanceof Date ? prismaTask.createdAt.toISOString() : String(prismaTask.createdAt),
      updatedAt: prismaTask.updatedAt instanceof Date ? prismaTask.updatedAt.toISOString() : String(prismaTask.updatedAt),
      link: prismaTask.link || null,
      topicId: prismaTask.topicId || null,
      goalId: prismaTask.goalId || null,
      afterCompletionDays: prismaTask.afterCompletionDays ?? null,
      spacedStepIndex: prismaTask.spacedStepIndex ?? null,

      occurrences,

      // Computed properties (NOT stored in DB)
      hasSubtasks,
      repetitionsCount,
      lastSmartRating,

      // Derived compatibility getters
      scheduledDate,
      status,
      repeatStatus,
      completedAt,
      pomodorosCount,
      repetitionHistory: occurrences,
    };
  }

  static toOccurrenceDto(occ: PrismaTaskOccurrence): TaskOccurrence {
    return {
      id: occ.id,
      taskId: occ.taskId,
      date: occ.date,
      status: (occ.status as TaskStatus) || 'Todo',
      note: occ.note || null,
      pomodorosCount: occ.pomodorosCount ?? undefined,
      activeMinutes: occ.activeMinutes ?? undefined,
      smartRating: (occ.smartRating as SmartRating) ?? null,
      completedAt: occ.completedAt ? occ.completedAt.toISOString() : null,
    };
  }

  static toTagDto(tag: PrismaTag): Tag {
    return {
      id: tag.id,
      name: tag.name,
      color: tag.color || null,
    };
  }
}
