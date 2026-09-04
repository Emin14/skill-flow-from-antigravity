'use client';

import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { CategoryItem } from '@/entities/category/model/useCategoryStore';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, color: string, excludeFromStats: boolean) => void;
  categoryToEdit?: CategoryItem | null;
}

const PRESET_COLORS = [
  '#38bdf8', // Sky Blue
  '#3b82f6', // Royal Blue
  '#6366f1', // Indigo
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#84cc16', // Lime
];

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categoryToEdit,
}) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#38bdf8');
  const [excludeFromStats, setExcludeFromStats] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setSelectedColor(categoryToEdit.color);
      setExcludeFromStats(Boolean(categoryToEdit.excludeFromStats));
    } else {
      setName('');
      setSelectedColor('#38bdf8');
      setExcludeFromStats(false);
    }
    setError('');
  }, [categoryToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Введите название категории');
      return;
    }
    onSave(name.trim(), selectedColor, excludeFromStats);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '16px',
        animation: 'fadeIn 0.15s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
          overflow: 'hidden',
          animation: 'scaleUp 0.15s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: selectedColor,
                boxShadow: `0 0 10px ${selectedColor}60`,
                transition: 'all 0.2s ease',
              }}
            />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {categoryToEdit ? 'Переименовать категорию' : 'Создать категорию'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Name Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              Название категории
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="Например: Проект, Дизайн, Обучение..."
              autoFocus
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: 'var(--color-surface-hover)',
                border: error ? '1px solid var(--color-danger)' : '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                fontSize: '14px',
                fontWeight: 500,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {error && <span style={{ fontSize: '11.5px', color: 'var(--color-danger)', fontWeight: 500 }}>{error}</span>}
          </div>

          {/* Color Selection Palette */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              Цвет метки
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
              {PRESET_COLORS.map((color) => {
                const isSelected = selectedColor.toLowerCase() === color.toLowerCase();
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    style={{
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: color,
                      border: isSelected ? '2px solid #ffffff' : 'none',
                      boxShadow: isSelected ? `0 0 12px ${color}80` : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.15s ease',
                      transform: isSelected ? 'scale(1.06)' : 'scale(1)',
                    }}
                  >
                    {isSelected && <Check size={16} color="#ffffff" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Exclude From Stats Setting */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-surface-hover)',
              border: '1px solid var(--color-border)',
            }}
          >
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                userSelect: 'none',
              }}
              title="Задачи этой категории по умолчанию не будут учитываться в статистике"
            >
              <input
                type="checkbox"
                checked={excludeFromStats}
                onChange={(e) => setExcludeFromStats(e.target.checked)}
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: 'var(--color-accent)',
                  cursor: 'pointer',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Не учитывать в статистике
                </span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  (для бытовых категорий, рутины и покупок)
                </span>
              </div>
            </label>
            <span style={{ fontSize: '11px', fontWeight: 600, color: excludeFromStats ? 'var(--color-text-muted)' : 'var(--color-accent-text)' }}>
              {excludeFromStats ? '☕ вне статистики' : '📊 в статистике'}
            </span>
          </div>

          {/* Footer Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 16px',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'transparent',
                color: 'var(--color-text-secondary)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Отмена
            </button>
            <button
              type="submit"
              style={{
                padding: '9px 20px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: 'var(--color-accent)',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px var(--color-accent-border)',
              }}
            >
              {categoryToEdit ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
