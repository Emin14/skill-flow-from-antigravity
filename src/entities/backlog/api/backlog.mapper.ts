import { BacklogItem as PrismaBacklogItem } from '@prisma/client';
import { BacklogItem, BacklogStatus, BacklogPriority } from '../model/types';

export class BacklogMapper {
  static toDto(raw: PrismaBacklogItem & { topicRecord?: { name: string } }): BacklogItem {
    let tags: string[] = [];
    if (raw.tags) {
      try {
        tags = JSON.parse(raw.tags);
      } catch {
        tags = [];
      }
    }

    return {
      id: raw.id,
      topic: raw.topicRecord?.name ?? raw.topic ?? 'Общее',
      topicId: raw.topicId,
      title: raw.title,
      description: raw.description,
      status: (raw.status as BacklogStatus) || 'idea',
      priority: (raw.priority as BacklogPriority) || 'medium',
      tags,
      link: raw.link,
      sortOrder: raw.sortOrder,
      createdAt: raw.createdAt.toISOString(),
      updatedAt: raw.updatedAt.toISOString(),
    };
  }
}
