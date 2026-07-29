import { ActivityLog } from '@/entities/activity/model/types';

export interface ActivityRepository {
  getAll(): Promise<ActivityLog[]>;
  log(activity: Omit<ActivityLog, 'id' | 'createdAt'>): Promise<ActivityLog>;
}
