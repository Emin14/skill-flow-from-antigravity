import { create } from 'zustand';
import { Material, MaterialType } from './types';
import { materialRepository } from '@/shared/repository';
import { useToastStore } from '@/shared/ui';
import { v4 as uuidv4 } from 'uuid';

interface MaterialState {
  materials: Material[];
  isLoading: boolean;
  error: string | null;

  fetchMaterials: () => Promise<void>;
  addMaterial: (
    topicId: string,
    title: string,
    description?: string,
    readTimeMinutes?: number,
    type?: MaterialType
  ) => Promise<Material>;
  updateMaterial: (id: string, updates: Partial<Material>) => Promise<Material | null>;
  toggleCompletedMaterial: (id: string) => Promise<void>;
  deleteMaterial: (id: string) => Promise<void>;
}

export const useMaterialStore = create<MaterialState>((set, get) => ({
  materials: [],
  isLoading: false,
  error: null,

  fetchMaterials: async () => {
    set({ isLoading: true, error: null });
    try {
      const materials = await materialRepository.getAll();
      set({ materials, isLoading: false });
    } catch (e) {
      set({ error: (e as Error).message, isLoading: false });
    }
  },

  addMaterial: async (
    topicId: string,
    title: string,
    description = '',
    readTimeMinutes = 5,
    type = 'Note'
  ) => {
    const newMaterial: Material = {
      id: uuidv4(),
      topicId,
      title,
      description,
      readTimeMinutes,
      type,
      content: description,
      isCompleted: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
    };

    const saved = await materialRepository.save(newMaterial);
    set((state) => ({ materials: [saved, ...state.materials] }));
    useToastStore.getState().showToast(`Материал "${title}" создан`, 'success');
    return saved;
  },

  updateMaterial: async (id: string, updates: Partial<Material>) => {
    try {
      const updated = await materialRepository.update(id, updates);
      set((state) => ({
        materials: state.materials.map((m) => (m.id === id ? updated : m)),
      }));
      useToastStore.getState().showToast('Материал обновлен', 'success');
      return updated;
    } catch (e) {
      set({ error: (e as Error).message });
      return null;
    }
  },

  toggleCompletedMaterial: async (id: string) => {
    const mat = get().materials.find((m) => m.id === id);
    if (!mat) return;

    const newCompleted = !mat.isCompleted;
    const completedAt = newCompleted ? new Date().toISOString() : null;

    set((state) => ({
      materials: state.materials.map((m) =>
        m.id === id ? { ...m, isCompleted: newCompleted, completedAt } : m
      ),
    }));

    try {
      await materialRepository.update(id, { isCompleted: newCompleted, completedAt });
      useToastStore
        .getState()
        .showToast(newCompleted ? `Материал "${mat.title}" изучен!` : 'Отметка сброшена', 'success');
    } catch (e) {
      set((state) => ({
        materials: state.materials.map((m) => (m.id === id ? mat : m)),
        error: (e as Error).message,
      }));
    }
  },

  deleteMaterial: async (id: string) => {
    const deletedMaterial = get().materials.find((m) => m.id === id);
    if (!deletedMaterial) return;

    set((state) => ({ materials: state.materials.filter((m) => m.id !== id) }));
    await materialRepository.delete(id);

    // Undo toast for Material
    useToastStore.getState().showToast(
      `Материал "${deletedMaterial.title}" удален`,
      'undo',
      async () => {
        await materialRepository.save(deletedMaterial);
        set((state) => ({ materials: [deletedMaterial, ...state.materials] }));
        useToastStore.getState().showToast('Материал восстановлен', 'success');
      }
    );
  },
}));
