import { Topic } from '../model/types';
import { Task } from '@/entities/task/model/types';
import { Material } from '@/entities/material/model/types';

export function calculateTopicProgress(
  topicId: string,
  allTopics: Topic[],
  allTasks: Task[],
  allMaterials: Material[] = []
): number {
  const childTopics = allTopics.filter((t) => t.parentId === topicId);

  // Case 1: Leaf Topic (No child topics)
  if (childTopics.length === 0) {
    const topicTasks = allTasks.filter((t) => t.topicId === topicId);
    const topicMaterials = allMaterials.filter((m) => m.topicId === topicId);

    const totalItems = topicTasks.length + topicMaterials.length;
    if (totalItems === 0) return 0;

    const completedTasks = topicTasks.filter((t) => t.status === 'Done').length;
    const completedMaterials = topicMaterials.filter((m) => m.isCompleted).length;

    return Math.round(((completedTasks + completedMaterials) / totalItems) * 100);
  }

  // Case 2: Topic with Child Topics (Weighted Rollup)
  let totalWeightedProgress = 0;
  let totalWeight = 0;

  for (const child of childTopics) {
    const childProgress = calculateTopicProgress(child.id, allTopics, allTasks, allMaterials);
    const weight = child.weight || 1;

    totalWeightedProgress += childProgress * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return 0;
  return Math.round(totalWeightedProgress / totalWeight);
}

export function calculateGoalProgress(
  goalId: string,
  allTopics: Topic[],
  allTasks: Task[],
  allMaterials: Material[] = []
): number {
  const rootTopics = allTopics.filter((t) => t.goalId === goalId && !t.parentId);
  if (rootTopics.length === 0) return 0;

  let totalWeightedProgress = 0;
  let totalWeight = 0;

  for (const rootTopic of rootTopics) {
    const topicProgress = calculateTopicProgress(rootTopic.id, allTopics, allTasks, allMaterials);
    const weight = rootTopic.weight || 1;

    totalWeightedProgress += topicProgress * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return 0;
  return Math.round(totalWeightedProgress / totalWeight);
}
