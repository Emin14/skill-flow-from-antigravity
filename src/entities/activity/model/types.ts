export type ActivityType =
  | 'task_created'
  | 'task_completed'
  | 'material_completed'
  | 'fsrs_reviewed'
  | 'goal_created'
  | 'topic_created';

export interface ActivityLog {
  id: string;
  type: ActivityType;
  title: string;
  createdAt: string;
}
