import { prisma } from '@/shared/lib/prisma';
import { ActivityLog } from '../model/types';
import { ActivityMapper } from './activity.mapper';
import { ActivityRepository } from '@/shared/repository/interfaces/ActivityRepository';

export class PrismaActivityRepository implements ActivityRepository {
  async getAll(): Promise<ActivityLog[]> {
    if (typeof window !== 'undefined') {
      return [];
    }
    try {
      const list = await prisma.activityLog.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return list.map(ActivityMapper.toDto);
    } catch {
      return [];
    }
  }

  async log(activity: Omit<ActivityLog, 'id' | 'createdAt'>): Promise<ActivityLog> {
    const fallback: ActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: activity.type,
      title: activity.title,
      createdAt: new Date().toISOString(),
    };
    if (typeof window !== 'undefined') {
      return fallback;
    }
    try {
      const created = await prisma.activityLog.create({
        data: {
          type: activity.type,
          title: activity.title,
        },
      });
      return ActivityMapper.toDto(created);
    } catch {
      return fallback;
    }
  }
}

export const prismaActivityRepository = new PrismaActivityRepository();
export const activityRepository = prismaActivityRepository;
