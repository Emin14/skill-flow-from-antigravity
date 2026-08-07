import { Topic as PrismaTopic } from '@prisma/client';
import { Topic } from '../model/types';

export class TopicMapper {
  static toDto(prismaTopic: PrismaTopic): Topic {
    return {
      id: prismaTopic.id,
      goalId: prismaTopic.goalId,
      parentId: prismaTopic.parentId || undefined,
      title: prismaTopic.title,
      weight: prismaTopic.weight,
      createdAt: prismaTopic.createdAt instanceof Date ? prismaTopic.createdAt.toISOString() : String(prismaTopic.createdAt),
    };
  }
}
