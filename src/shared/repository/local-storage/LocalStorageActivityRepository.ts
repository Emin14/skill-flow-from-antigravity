import { ActivityLog } from '@/entities/activity/model/types';
import { ActivityRepository } from '../interfaces/ActivityRepository';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'skillflow_activity_log';
const MAX_LOGS = 20;

export class LocalStorageActivityRepository implements ActivityRepository {
  private getStorage(): ActivityLog[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private setStorage(logs: ActivityLog[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs.slice(0, MAX_LOGS)));
    } catch (e) {
      console.error('Failed to save activity log to LocalStorage', e);
    }
  }

  async getAll(): Promise<ActivityLog[]> {
    return this.getStorage();
  }

  async log(activity: Omit<ActivityLog, 'id' | 'createdAt'>): Promise<ActivityLog> {
    const logs = this.getStorage();
    const newEntry: ActivityLog = {
      ...activity,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };

    const updatedLogs = [newEntry, ...logs].slice(0, MAX_LOGS);
    this.setStorage(updatedLogs);
    return newEntry;
  }
}

export const activityRepository = new LocalStorageActivityRepository();
