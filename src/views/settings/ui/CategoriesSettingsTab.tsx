'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useCategoryStore, CategoryItem } from '@/entities/category/model/useCategoryStore';
import { useTaskStore } from '@/entities/task';
import { CategoryModal } from './CategoryModal';
import { useToastStore } from '@/shared/ui';

export const CategoriesSettingsTab: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { categories, fetchCategories, syncCategoriesWithTasks, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const { tasks, fetchTasks } = useTaskStore();
  const showToast = useToastStore((s) => s.showToast);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchCategories();
    fetchTasks();
  }, [fetchCategories, fetchTasks]);

  useEffect(() => {
    if (tasks && tasks.length > 0) {
      syncCategoriesWithTasks(tasks);
    }
  }, [tasks, syncCategoriesWithTasks]);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleSaveCategory = (name: string, color: string) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, name, color);
      showToast(`Категория "${name}" обновлена`, 'success');
    } else {
      addCategory(name, color);
      showToast(`Категория "${name}" создана`, 'success');
    }
  };

  if (!mounted) {
    return <div style={{ minHeight: '44px' }} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      {/* Header line + Add Category button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            🏷️ Категории задач ({categories.length})
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            Все доступные категории задач. Вы можете добавлять новые, менять цвета и названия.
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '12px',
            backgroundColor: 'var(--color-accent)',
            color: '#ffffff',
            fontSize: '12.5px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 10px var(--color-accent-border)',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          <Plus size={15} />
          <span>Добавить категорию</span>
        </button>
      </div>

      {/* Grid of ALL Categories */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '8px',
          width: '100%',
          marginTop: '4px',
        }}
      >
        {categories.map((cat) => (
          <div
            key={cat.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: cat.color,
                  boxShadow: `0 0 8px ${cat.color}80`,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat.name}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => {
                  setEditingCategory(cat);
                  setIsModalOpen(true);
                }}
                title="Изменить название или цвет"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'var(--color-surface-hover)',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                }}
              >
                <Edit2 size={13} color="var(--color-accent-text)" />
              </button>

              {!cat.isSystem && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Удалить категорию "${cat.name}"?`)) {
                      deleteCategory(cat.id);
                      showToast(`Категория "${cat.name}" удалена`, 'info');
                    }
                  }}
                  title="Удалить категорию"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--color-surface-hover)',
                    color: 'var(--color-danger)',
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Category Modal (Add / Rename / Color) */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCategory}
        categoryToEdit={editingCategory}
      />
    </div>
  );
};
