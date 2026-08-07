export * from './interfaces/GoalRepository';
export * from './interfaces/TopicRepository';
export * from './interfaces/TaskRepository';
export * from './interfaces/MaterialRepository';
export * from './interfaces/InboxRepository';
export * from './interfaces/RepeatCardRepository';
export * from './interfaces/ActivityRepository';

export { PrismaTaskRepository, prismaTaskRepository, taskRepository } from '@/entities/task/api/prisma-task.repository';
export { PrismaGoalRepository, prismaGoalRepository, goalRepository } from '@/entities/goal/api/prisma-goal.repository';
export { PrismaTopicRepository, prismaTopicRepository, topicRepository } from '@/entities/topic/api/prisma-topic.repository';
export { PrismaMaterialRepository, prismaMaterialRepository, materialRepository } from '@/entities/material/api/prisma-material.repository';
export { PrismaInboxRepository, prismaInboxRepository, inboxRepository } from '@/entities/inbox/api/prisma-inbox.repository';
export { PrismaRepeatCardRepository, prismaRepeatCardRepository, repeatCardRepository } from '@/entities/repeat-card/api/prisma-repeat-card.repository';
export { PrismaActivityRepository, prismaActivityRepository, activityRepository } from '@/entities/activity/api/prisma-activity.repository';
