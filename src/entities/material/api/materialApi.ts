import { Material } from '../model/types';

export const materialApi = {
  async getAll(): Promise<Material[]> {
    const res = await fetch('/api/materials');
    if (!res.ok) throw new Error(`Failed to fetch materials: ${res.statusText}`);
    return res.json();
  },

  async create(material: Material): Promise<Material> {
    const res = await fetch('/api/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(material),
    });
    if (!res.ok) throw new Error(`Failed to create material: ${res.statusText}`);
    return res.json();
  },

  async update(id: string, updates: Partial<Material>): Promise<Material> {
    const res = await fetch('/api/materials', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    if (!res.ok) throw new Error(`Failed to update material: ${res.statusText}`);
    return res.json();
  },

  async delete(id: string): Promise<boolean> {
    const res = await fetch(`/api/materials?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Failed to delete material: ${res.statusText}`);
    const data = await res.json();
    return data.success;
  },
};
