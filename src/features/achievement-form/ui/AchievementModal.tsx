'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input } from '@/shared/ui';
import { useCategoryStore } from '@/entities/category/model/useCategoryStore';
import { Achievement, useAchievementStore } from '@/entities/achievement';
import { getTodayStr } from '@/shared/lib/dateUtils';
import { getCategoryColor } from '@/shared/config/categoryColors';

const EMOJI_PALETTE = [
  '🏆', '🏋️‍♂️', '🇬🇧', '💼', '📚', '🎓',
  '🎯', '⭐', '💰', '🚀', '🧘‍♂️', '💡',
  '🏃‍♂️', '💻', '🧗‍♂️', '💪', '🔥', '⚡',
];

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievementToEdit?: Achievement | null;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({
  isOpen,
  onClose,
  achievementToEdit,
}) => {
  const { addAchievement, updateAchievement } = useAchievementStore();
  const categories = useCategoryStore((s) => s.categories);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(getTodayStr());
  const [category, setCategory] = useState('');
  const [icon, setIcon] = useState('🏆');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (achievementToEdit) {
      setTitle(achievementToEdit.title);
      setDate(achievementToEdit.date);
      setCategory(achievementToEdit.category || '');
      setIcon(achievementToEdit.icon || '🏆');
      setDescription(achievementToEdit.description || '');
    } else {
      setTitle('');
      setDate(getTodayStr());
      setCategory(categories[0]?.name || 'Здоровье');
      setIcon('🏆');
      setDescription('');
    }
  }, [achievementToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    setIsSubmitting(true);
    try {
      if (achievementToEdit) {
        await updateAchievement(achievementToEdit.id, {
          title: title.trim(),
          date,
          category: category.trim() || undefined,
          icon,
          description: description.trim() || undefined,
        });
      } else {
        await addAchievement({
          title: title.trim(),
          date,
          category: category.trim() || undefined,
          icon,
          description: description.trim() || undefined,
        });
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const validCategories = categories.filter((c) => c.name.trim().toLowerCase() !== 'без категории');

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>{icon}</span>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
              {achievementToEdit ? 'Редактировать победу' : 'Зафиксировать победу'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Emoji Picker Row */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
              Иконка рекорда
            </label>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                padding: '8px',
                borderRadius: '12px',
                backgroundColor: 'var(--color-surface-hover)',
                border: '1px solid var(--color-border)',
                maxHeight: '80px',
                overflowY: 'auto',
              }}
            >
              {EMOJI_PALETTE.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setIcon(em)}
                  style={{
                    fontSize: '18px',
                    padding: '4px 6px',
                    borderRadius: '8px',
                    border: icon === em ? '2px solid var(--color-accent)' : '1px solid transparent',
                    backgroundColor: icon === em ? 'var(--color-accent-light)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'transform 0.1s ease',
                  }}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
              Название победы / рекорда *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Жим лёжа 100 кг, IELTS 7.5..."
              autoFocus
              required
            />
          </div>

          {/* Date & Category Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                Дата *
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                Сфера / Категория
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  height: '40px',
                  padding: '0 12px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {validCategories.map((c) => (
                  <option key={c.id || c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
              Заметка / Детали (необязательно)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Как это было, сколько готовился, эмоции..."
              rows={3}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                fontSize: '13.5px',
                fontFamily: 'inherit',
                outline: 'none',
                resize: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <Button variant="ghost" type="button" onClick={onClose} disabled={isSubmitting}>
              Отмена
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting || !title.trim()}>
              {isSubmitting ? 'Сохранение...' : achievementToEdit ? 'Сохранить' : 'Зафиксировать'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
