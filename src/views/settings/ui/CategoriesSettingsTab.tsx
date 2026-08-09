'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, ChevronDown, Check } from 'lucide-react';
import { useCategoryStore, CategoryItem } from '@/entities/category/model/useCategoryStore';
import { useTaskStore } from '@/entities/task';
import { CategoryModal } from './CategoryModal';
import { useToastStore } from '@/shared/ui';

export const CategoriesSettingsTab: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { categories, fetchCategories, syncCategoriesWithTasks, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const { tasks, fetchTasks } = useTaskStore();
  const showToast = useToastStore((s) => s.showToast);

  const [selectedCatId, setSelectedCatId] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (categories.length > 0 && !selectedCatId) {
      const defaultItem = categories.find((c) => !c.isSystem) || categories[0];
      setSelectedCatId(defaultItem.id);
    }
  }, [categories, selectedCatId]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentSelectedCat = useMemo(() => {
    return categories.find((c) => c.id === selectedCatId) || categories[0];
  }, [categories, selectedCatId]);

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = () => {
    if (!currentSelectedCat) return;
    setEditingCategory(currentSelectedCat);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = () => {
    if (!currentSelectedCat || currentSelectedCat.isSystem) return;
    if (!confirm(`Вы действительно хотите удалить категорию "${currentSelectedCat.name}"?`)) {
      return;
    }
    deleteCategory(currentSelectedCat.id);
    showToast(`Категория "${currentSelectedCat.name}" удалена`, 'info');
    setSelectedCatId('');
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      {/* Label line + Add Category button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
          🏷️ Категория задач
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '6px 12px',
            borderRadius: '10px',
            backgroundColor: 'var(--color-accent)',
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 8px var(--color-accent-border)',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <Plus size={14} />
          <span>Добавить</span>
        </button>
      </div>

      {/* Custom Select Bar with Glowing Color Dots in Dropdown List */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
        {/* Custom Select Trigger */}
        <div ref={dropdownRef} style={{ position: 'relative', flex: 1, minWidth: 0 }}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-surface)',
              border: isDropdownOpen ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              fontSize: '13.5px',
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: isDropdownOpen ? '0 0 10px var(--color-accent-border)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              {currentSelectedCat && (
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: currentSelectedCat.color,
                    boxShadow: `0 0 8px ${currentSelectedCat.color}80`,
                    flexShrink: 0,
                  }}
                />
              )}
              <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentSelectedCat ? currentSelectedCat.name : 'Выберите категорию'}
              </span>
            </div>

            <ChevronDown
              size={15}
              style={{
                color: 'var(--color-text-muted)',
                transition: 'transform 0.2s ease',
                transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </button>

          {/* Custom Dropdown Popup Menu with Color Dots */}
          {isDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: 0,
                right: 0,
                zIndex: 200,
                backgroundColor: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-border)',
                borderRadius: '14px',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
                padding: '4px',
                maxHeight: '240px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                animation: 'fadeIn 0.1s ease-out',
              }}
            >
              {categories.map((cat) => {
                const isSelected = cat.id === selectedCatId;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCatId(cat.id);
                      setIsDropdownOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: isSelected ? 'var(--color-surface-hover)' : 'transparent',
                      color: isSelected ? 'var(--color-accent-text)' : 'var(--color-text-primary)',
                      fontSize: '13px',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.12s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
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
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {cat.name}
                      </span>
                    </div>

                    {isSelected && <Check size={14} color="var(--color-accent-text)" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Edit Button */}
        <button
          type="button"
          onClick={handleOpenEditModal}
          title="Изменить название или цвет"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            height: '44px',
            padding: '0 14px',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface-hover)',
            color: 'var(--color-text-primary)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          <Edit2 size={14} color="var(--color-accent-text)" />
          <span>Изменить</span>
        </button>

        {/* Delete Button (always occupies fixed layout width to prevent jumping) */}
        <button
          type="button"
          onClick={handleDeleteCategory}
          disabled={!currentSelectedCat || currentSelectedCat.isSystem}
          title={currentSelectedCat?.isSystem ? 'Системную категорию нельзя удалить' : 'Удалить категорию'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '44px',
            padding: '0 14px',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface-hover)',
            color: 'var(--color-danger)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: !currentSelectedCat || currentSelectedCat.isSystem ? 'not-allowed' : 'pointer',
            opacity: !currentSelectedCat || currentSelectedCat.isSystem ? 0.3 : 1,
            transition: 'all 0.15s ease',
            flexShrink: 0,
          }}
        >
          <Trash2 size={15} />
        </button>
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
