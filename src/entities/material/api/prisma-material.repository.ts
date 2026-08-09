import { prisma } from '@/shared/lib/prisma';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { Material } from '../model/types';
import { MaterialMapper } from './material.mapper';
import { MaterialRepository } from '@/shared/repository/interfaces/MaterialRepository';

export class PrismaMaterialRepository implements MaterialRepository {
  async getAll(): Promise<Material[]> {
    if (typeof window !== 'undefined') return [];
    try {
      const list = await prisma.material.findMany({
        orderBy: { createdAt: 'asc' },
      });
      return list.map(MaterialMapper.toDto);
    } catch {
      return [];
    }
  }

  async getByTopicId(topicId: string): Promise<Material[]> {
    if (typeof window !== 'undefined') return [];
    try {
      const list = await prisma.material.findMany({
        where: { topicId },
        orderBy: { createdAt: 'asc' },
      });
      return list.map(MaterialMapper.toDto);
    } catch {
      return [];
    }
  }

  async getById(id: string): Promise<Material | null> {
    if (typeof window !== 'undefined') return null;
    try {
      const item = await prisma.material.findUnique({
        where: { id },
      });
      return item ? MaterialMapper.toDto(item) : null;
    } catch {
      return null;
    }
  }

  async save(material: Material): Promise<Material> {
    if (typeof window !== 'undefined') return material;
    const materialId = (material.id && typeof material.id === 'string' && material.id.trim()) ? material.id.trim() : uuidv4();
    try {
      const result = await prisma.material.upsert({
        where: { id: materialId },
        create: {
          id: materialId,
          topicId: material.topicId,
          title: material.title || 'Без названия',
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
          title: material.title || 'Без названия',
          description: material.description || null,
          readTimeMinutes: material.readTimeMinutes ?? null,
          type: material.type || 'Note',
          content: material.content || null,
          isCompleted: material.isCompleted ?? false,
          completedAt: material.completedAt ? new Date(material.completedAt) : null,
        },
      });
      return MaterialMapper.toDto(result);
    } catch (err) {
      console.error('[PrismaMaterialRepository.save] Error:', err);
      throw err;
    }
  }

  async update(id: string, updates: Partial<Material>): Promise<Material> {
    const fallback: Material = { id, topicId: updates.topicId || '', title: updates.title || '', type: updates.type || 'Note', isCompleted: false, createdAt: new Date().toISOString() };
    if (typeof window !== 'undefined') return fallback;
    try {
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
    } catch (err) {
      console.error(`[PrismaMaterialRepository.update] Error updating material ${id}:`, err);
      throw err;
    }
  }

  async delete(id: string): Promise<boolean> {
    if (typeof window !== 'undefined') return true;
    try {
      await prisma.material.delete({ where: { id } });
      return true;
    } catch (err) {
      console.error(`[PrismaMaterialRepository.delete] Error deleting material ${id}:`, err);
      throw err;
    }
  }
}

export const prismaMaterialRepository = new PrismaMaterialRepository();
export const materialRepository = prismaMaterialRepository;
