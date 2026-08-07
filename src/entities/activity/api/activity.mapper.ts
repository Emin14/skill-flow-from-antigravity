import { ActivityLog as PrismaActivityLog } from '@prisma/client';
import { ActivityLog, ActivityType } from '../model/types';

export class ActivityMapper {
  static toDto(prismaActivity: PrismaActivityLog): ActivityLog {
    return {
      id: prismaActivity.id,
      type: prismaActivity.type as ActivityType,
      title: prismaActivity.title,
      createdAt: prismaActivity.createdAt instanceof Date ? prismaActivity.createdAt.toISOString() : String(prismaActivity.createdAt),
    };
  }
}
