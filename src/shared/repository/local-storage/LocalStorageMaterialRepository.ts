import { Material } from '@/entities/material/model/types';
import { MaterialRepository } from '../interfaces/MaterialRepository';

const STORAGE_KEY = 'skillflow_materials';

export class LocalStorageMaterialRepository implements MaterialRepository {
  private getStorage(): Material[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private setStorage(materials: Material[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(materials));
    } catch (e) {
      console.error('Failed to save materials to LocalStorage', e);
    }
  }

  async getAll(): Promise<Material[]> {
    return this.getStorage();
  }

  async getByTopicId(topicId: string): Promise<Material[]> {
    const materials = this.getStorage();
    return materials.filter((m) => m.topicId === topicId);
  }

  async getById(id: string): Promise<Material | null> {
    const materials = this.getStorage();
    return materials.find((m) => m.id === id) || null;
  }

  async save(material: Material): Promise<Material> {
    const materials = this.getStorage();
    const index = materials.findIndex((m) => m.id === material.id);
    if (index >= 0) {
      materials[index] = material;
    } else {
      materials.push(material);
    }
    this.setStorage(materials);
    return material;
  }

  async update(id: string, updates: Partial<Material>): Promise<Material> {
    const materials = this.getStorage();
    const index = materials.findIndex((m) => m.id === id);
    if (index === -1) {
      throw new Error(`Material with id ${id} not found`);
    }

    const updated = { ...materials[index], ...updates };
    materials[index] = updated;
    this.setStorage(materials);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const materials = this.getStorage();
    const filtered = materials.filter((m) => m.id !== id);
    if (filtered.length === materials.length) return false;

    this.setStorage(filtered);
    return true;
  }
}

export const materialRepository = new LocalStorageMaterialRepository();
