'use client';

import React, { useState, useEffect } from 'react';
import { Task } from '@/entities/task/model/types';
import { useTaskStore } from '@/entities/task';
import { Typography, Input, Textarea, Button, Checkbox } from '@/shared/ui';
import { TASK_CATEGORIES, TaskCategory } from '@/shared/config/categories';
import styles from './EditTaskModal.module.css';

interface EditTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, isOpen, onClose }) => {
  const { tasks, updateTaskDetails, deleteTask } = useTaskStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Задача');
  const [scheduledDate, setScheduledDate] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [parentTaskId, setParentTaskId] = useState('');
  const [isRepeating, setIsRepeating] = useState(false);
  const [targetRepetitions, setTargetRepetitions] = useState(8);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task && isOpen) {
      setTitle(task.title || '');
      setCategory(task.category || 'Задача');
      setScheduledDate(task.scheduledDate || new Date().toISOString().split('T')[0]);
      setDescription(task.description || '');
      setLink(task.link || '');
      setParentTaskId(task.parentTaskId || '');
      setIsRepeating(!!task.isRepeating);
      setTargetRepetitions(task.targetRepetitions || 8);
    }
  }, [task, isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen || !task) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await updateTaskDetails(task.id, {
        title: title.trim(),
        category,
        scheduledDate,
        description: description.trim(),
        link: link.trim(),
        parentTaskId: parentTaskId || null,
        isRepeating,
        targetRepetitions: Number(targetRepetitions) || 8,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Удалить задачу "${task.title}"?`)) {
      await deleteTask(task.id);
      onClose();
    }
  };

  const currentCount = task.repetitionsCount || 0;
  const targetCount = task.targetRepetitions || 8;
  const progressPercent = Math.min(100, Math.round((currentCount / targetCount) * 100));

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h2">✏️ Редактировать задачу</Typography>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '18px' }}
          >
            ✕
          </button>
        </div>

        {/* Visual Repetition Progress Box with Filled Sticks */}
        {task.isRepeating && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
              padding: '14px 16px',
              borderRadius: '16px',
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'bold', color: 'var(--color-success)' }}>
                🔄 Повторения: {currentCount} из {targetCount}
              </span>
              <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'bold', color: 'var(--color-success)' }}>
                {progressPercent}%
              </span>
            </div>

            {/* Filled Segment Sticks / Bars */}
            <div style={{ display: 'flex', gap: '5px', width: '100%', marginTop: '4px' }}>
              {Array.from({ length: Math.max(8, targetCount) }).map((_, index) => {
                const isFilled = index < currentCount;
                return (
                  <div
                    key={index}
                    style={{
                      flex: 1,
                      height: '14px',
                      borderRadius: '4px',
                      backgroundColor: isFilled ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                      border: isFilled ? '1px solid #059669' : '1px solid var(--color-border)',
                      boxShadow: isFilled ? '0 0 8px rgba(16, 185, 129, 0.4)' : 'none',
                      transition: 'all 0.3s ease',
                    }}
                    title={isFilled ? `Повторение #${index + 1} выполнено` : `Повторение #${index + 1}`}
                  />
                );
              })}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Title */}
          <Input
            label="Название задачи *"
            placeholder="Введите название..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Category & Date Row */}
          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                Категория:
              </label>
              <select
                className={styles.selectInput}
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
              >
                {TASK_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formCol}>
              <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                Дата выполнения:
              </label>
              <input
                type="date"
                className={styles.selectInput}
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Description */}
          <Textarea
            label="Описание (необязательно)"
            placeholder="Подробности задачи..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Link & Parent Task */}
          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <Input
                label="Ссылка (необязательно)"
                placeholder="https://..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>

            <div className={styles.formCol}>
              <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                Родительская задача:
              </label>
              <select
                className={styles.selectInput}
                value={parentTaskId}
                onChange={(e) => setParentTaskId(e.target.value)}
              >
                <option value="">-- Без родительской --</option>
                {tasks
                  .filter((t) => t.id !== task.id)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Repetition */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--color-border)',
              flexWrap: 'wrap',
              gap: 'var(--space-2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <Checkbox checked={isRepeating} onChange={(e) => setIsRepeating(e.target.checked)} />
              <div>
                <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                  🔄 Повторять задачу
                </div>
              </div>
            </div>

            {isRepeating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Цель:</span>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={targetRepetitions}
                  onChange={(e) => setTargetRepetitions(Number(e.target.value))}
                  className={styles.selectInput}
                  style={{ width: '60px', padding: '4px 8px', textAlign: 'center' }}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-2)' }}>
            <Button type="button" variant="ghost" onClick={handleDelete} style={{ color: 'var(--color-error)' }}>
              🗑 Удалить
            </Button>

            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Button type="button" variant="secondary" onClick={onClose}>
                Отмена
              </Button>
              <Button type="submit" variant="primary" disabled={!title.trim() || isSubmitting}>
                Сохранить
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
