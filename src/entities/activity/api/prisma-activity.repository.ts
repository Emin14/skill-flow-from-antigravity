import { prisma } from '@/shared/lib/prisma';
import { ActivityLog } from '../model/types';
import { ActivityMapper } from './activity.mapper';
import { ActivityRepository } from '@/shared/repository/interfaces/ActivityRepository';

export class PrismaActivityRepository implements ActivityRepository {
  async getAll(): Promise<ActivityLog[]> {
    const list = await prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return list.map(ActivityMapper.toDto);
  }

  async log(activity: Omit<ActivityLog, 'id' | 'createdAt'>): Promise<ActivityLog> {
    const created = await prisma.activityLog.create({
      data: {
        type: activity.type,
        title: activity.title,
      },
    });
    return ActivityMapper.toDto(created);
  }
}

export const prismaActivityRepository = new PrismaActivityRepository();
export const activityRepository = prismaActivityRepository;
