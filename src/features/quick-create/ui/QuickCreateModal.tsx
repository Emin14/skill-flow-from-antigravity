'use client';

import React, { useState, useEffect } from 'react';
import { useQuickCreateModalStore } from '../model/quickCreateStore';
import { useTaskStore } from '@/entities/task';
import { useActivityStore } from '@/entities/activity';
import { Typography, Input, Textarea, Button } from '@/shared/ui';
import { TASK_CATEGORIES, TaskCategory } from '@/shared/config/categories';
import styles from './QuickCreateModal.module.css';

export const QuickCreateModal: React.FC = () => {
  const { isOpen, closeModal } = useQuickCreateModalStore();
  const todayStr = new Date().toISOString().split('T')[0];

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Задача');
  const [scheduledDate, setScheduledDate] = useState(todayStr);
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [parentTaskId, setParentTaskId] = useState('');
  const [isRepeating, setIsRepeating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { tasks, fetchTasks, addTask } = useTaskStore();
  const logActivity = useActivityStore((s) => s.logActivity);

  // Lock body scroll on modal open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      fetchTasks();
      setScheduledDate(new Date().toISOString().split('T')[0]);
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen, fetchTasks]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addTask({
        title: title.trim(),
        category,
        scheduledDate,
        description: description.trim(),
        link: link.trim(),
        parentTaskId: parentTaskId || null,
        isRepeating,
        targetRepetitions: 8,
      });

      await logActivity('task_created', `Создана задача: "${title.trim()}"`);

      // Reset & Close
      setTitle('');
      setDescription('');
      setLink('');
      setParentTaskId('');
      setIsRepeating(false);
      closeModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h2">➕ Создать задачу</Typography>
          <button
            onClick={closeModal}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              fontSize: '22px',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Title */}
          <Input
            label="Название задачи *"
            placeholder="Введите название..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
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

          {/* Optional Description */}
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
                {tasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pure Borderless Illuminated Icon Toggle Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
              Повторение:
            </span>
            <button
              type="button"
              onClick={() => setIsRepeating(!isRepeating)}
              style={{
                background: 'transparent',
                border: 'none',
                color: isRepeating ? '#10b981' : 'var(--color-text-muted)',
                filter: isRepeating ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.85))' : 'none',
                opacity: isRepeating ? 1 : 0.4,
                transform: isRepeating ? 'scale(1.2)' : 'scale(1)',
                fontSize: '22px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              title={isRepeating ? 'Повторение включено' : 'Включить повторение'}
            >
              🔄
            </button>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
            <Button type="button" variant="secondary" onClick={closeModal}>
              Отмена
            </Button>
            <Button type="submit" variant="primary" disabled={!title.trim() || isSubmitting}>
              Создать задачу
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
