import { prisma } from '@/shared/lib/prisma';
import { Prisma } from '@prisma/client';
import { Material } from '../model/types';
import { MaterialMapper } from './material.mapper';
import { MaterialRepository } from '@/shared/repository/interfaces/MaterialRepository';

export class PrismaMaterialRepository implements MaterialRepository {
  async getAll(): Promise<Material[]> {
    const list = await prisma.material.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return list.map(MaterialMapper.toDto);
  }

  async getByTopicId(topicId: string): Promise<Material[]> {
    const list = await prisma.material.findMany({
      where: { topicId },
      orderBy: { createdAt: 'asc' },
    });
    return list.map(MaterialMapper.toDto);
  }

  async getById(id: string): Promise<Material | null> {
    const item = await prisma.material.findUnique({
      where: { id },
    });
    return item ? MaterialMapper.toDto(item) : null;
  }

  async save(material: Material): Promise<Material> {
    const result = await prisma.material.upsert({
      where: { id: material.id },
      create: {
        id: material.id,
        topicId: material.topicId,
        title: material.title,
        description: material.description || null,
        readTimeMinutes: material.readTimeMinutes ?? null,
        type: material.type || 'Note',
        content: material.content || null,
        isCompleted: material.isCompleted ?? false,
        completedAt: material.completedAt ? new Date(material.completedAt) : null,
        createdAt: material.createdAt ? new Date(material.createdAt) : new Date(),
      },
      update: {
        topicId: material.topicId,
        title: material.title,
        description: material.description || null,
        readTimeMinutes: material.readTimeMinutes ?? null,
        type: material.type || 'Note',
        content: material.content || null,
        isCompleted: material.isCompleted ?? false,
        completedAt: material.completedAt ? new Date(material.completedAt) : null,
      },
    });
    return MaterialMapper.toDto(result);
  }

  async update(id: string, updates: Partial<Material>): Promise<Material> {
    const data: Prisma.MaterialUpdateInput = {};
    if (updates.topicId !== undefined) data.topicId = updates.topicId;
    if (updates.title !== undefined) data.title = updates.title;
    if (updates.description !== undefined) data.description = updates.description;
    if (updates.readTimeMinutes !== undefined) data.readTimeMinutes = updates.readTimeMinutes;
    if (updates.type !== undefined) data.type = updates.type;
    if (updates.content !== undefined) data.content = updates.content;
    if (updates.isCompleted !== undefined) data.isCompleted = updates.isCompleted;
    if (updates.completedAt !== undefined) data.completedAt = updates.completedAt ? new Date(updates.completedAt) : null;

    const result = await prisma.material.update({
      where: { id },
      data,
    });
    return MaterialMapper.toDto(result);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.material.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}

export const prismaMaterialRepository = new PrismaMaterialRepository();
export const materialRepository = prismaMaterialRepository;
