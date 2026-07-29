import { useInboxStore } from '@/entities/inbox';
import { useTaskStore } from '@/entities/task';
import { useGoalStore } from '@/entities/goal';
import { useTopicStore } from '@/entities/topic';
import { useMaterialStore } from '@/entities/material';
import { TaskPriority } from '@/entities/task/model/types';
import { taskRepository, materialRepository } from '@/shared/repository';
import { v4 as uuidv4 } from 'uuid';

export const triageService = {
  /**
   * Convert InboxItem to a Task and delete InboxItem
   */
  async convertToTask(
    inboxItemId: string,
    data: { title: string; priority?: TaskPriority; topicId?: string | null; goalId?: string | null }
  ) {
    const { addTask, fetchTasks } = useTaskStore.getState();
    const { deleteItem } = useInboxStore.getState();

    // 1. Create Task
    const createdTask = await addTask(data.title, data.priority || 'P3');

    // 2. Link to Topic/Goal if specified
    if (data.topicId || data.goalId) {
      await taskRepository.update(createdTask.id, {
        topicId: data.topicId || null,
        goalId: data.goalId || null,
      });
      await fetchTasks();
    }

    // 3. Delete InboxItem
    await deleteItem(inboxItemId);
  },

  /**
   * Convert InboxItem to a Topic and delete InboxItem
   */
  async convertToTopic(
    inboxItemId: string,
    data: { title: string; goalId: string; parentId?: string | null; weight?: number }
  ) {
    const { addTopic } = useTopicStore.getState();
    const { deleteItem } = useInboxStore.getState();

    // 1. Create Topic
    await addTopic(data.title, data.goalId, data.parentId || null, data.weight || 1);

    // 2. Delete InboxItem
    await deleteItem(inboxItemId);
  },

  /**
   * Convert InboxItem to a Goal and delete InboxItem
   */
  async convertToGoal(
    inboxItemId: string,
    data: { title: string; color?: string; description?: string }
  ) {
    const { addGoal } = useGoalStore.getState();
    const { deleteItem } = useInboxStore.getState();

    // 1. Create Goal
    await addGoal(data.title, data.color || '#6366f1', data.description || '');

    // 2. Delete InboxItem
    await deleteItem(inboxItemId);
  },

  /**
   * Convert InboxItem to a Material (Note/Article) and delete InboxItem
   */
  async convertToMaterial(
    inboxItemId: string,
    data: { title: string; topicId: string; type?: 'Note' | 'Article' | 'Video' | 'Link'; content?: string }
  ) {
    const { deleteItem } = useInboxStore.getState();

    // 1. Save Material via repository
    await materialRepository.save({
      id: uuidv4(),
      topicId: data.topicId,
      title: data.title,
      type: data.type || 'Note',
      content: data.content || '',
      isCompleted: false,
      createdAt: new Date().toISOString(),
    });

    // 2. Delete InboxItem
    await deleteItem(inboxItemId);
  },
};
