import { Material as PrismaMaterial } from '@prisma/client';
import { Material, MaterialType } from '../model/types';

export class MaterialMapper {
  static toDto(prismaMaterial: PrismaMaterial): Material {
    return {
      id: prismaMaterial.id,
      topicId: prismaMaterial.topicId,
      title: prismaMaterial.title,
      description: prismaMaterial.description || undefined,
      readTimeMinutes: prismaMaterial.readTimeMinutes ?? undefined,
      type: (prismaMaterial.type as MaterialType) || 'Note',
      content: prismaMaterial.content || undefined,
      isCompleted: prismaMaterial.isCompleted,
      completedAt: prismaMaterial.completedAt ? prismaMaterial.completedAt.toISOString() : null,
      createdAt: prismaMaterial.createdAt instanceof Date ? prismaMaterial.createdAt.toISOString() : String(prismaMaterial.createdAt),
    };
  }
}
