'use client';

import React, { useState, useEffect } from 'react';
import { useQuickCreateModalStore, QuickCreateType } from '../model/quickCreateStore';
import { useTaskStore } from '@/entities/task';
import { useGoalStore } from '@/entities/goal';
import { useTopicStore } from '@/entities/topic';
import { useMaterialStore } from '@/entities/material';
import { useInboxStore } from '@/entities/inbox';
import { useActivityStore } from '@/entities/activity';
import { Typography, Input, Textarea, Button } from '@/shared/ui';
import { TaskPriority } from '@/entities/task/model/types';
import styles from './QuickCreateModal.module.css';

export const QuickCreateModal: React.FC = () => {
  const { isOpen, initialType, closeModal } = useQuickCreateModalStore();
  const [activeType, setActiveType] = useState<QuickCreateType>('Task');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('P3');
  const [goalId, setGoalId] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { goals, fetchGoals } = useGoalStore();
  const { topics, fetchTopics } = useTopicStore();
  const addTask = useTaskStore((s) => s.addTask);
  const addGoal = useGoalStore((s) => s.addGoal);
  const addTopic = useTopicStore((s) => s.addTopic);
  const addMaterial = useMaterialStore((s) => s.addMaterial);
  const addItem = useInboxStore((s) => s.addItem);
  const logActivity = useActivityStore((s) => s.logActivity);

  useEffect(() => {
    if (isOpen) {
      setActiveType(initialType);
      fetchGoals();
      fetchTopics();
    }
  }, [isOpen, initialType, fetchGoals, fetchTopics]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (activeType === 'Task') {
        const created = await addTask(title.trim(), priority);
        if (goalId) {
          const { taskRepository } = await import('@/shared/repository');
          await taskRepository.update(created.id, { goalId: goalId || null });
        }
        await logActivity('task_created', `Создана задача: "${title.trim()}"`);
      } else if (activeType === 'Goal') {
        await addGoal(title.trim(), color, description.trim());
        await logActivity('goal_created', `Создана цель: "${title.trim()}"`);
      } else if (activeType === 'Topic') {
        if (!goalId && goals.length > 0) {
          await addTopic(title.trim(), goals[0].id);
        } else if (goalId) {
          await addTopic(title.trim(), goalId);
        }
        await logActivity('topic_created', `Создана тема: "${title.trim()}"`);
      } else if (activeType === 'Material') {
        const targetTopicId = topics.length > 0 ? topics[0].id : '';
        if (targetTopicId) {
          await addMaterial(targetTopicId, title.trim(), description.trim());
          await logActivity('material_completed', `Добавлен материал: "${title.trim()}"`);
        }
      } else if (activeType === 'Inbox') {
        await addItem(title.trim());
        await logActivity('task_created', `Захвачена мысль: "${title.trim()}"`);
      }

      // Reset & Close
      setTitle('');
      setDescription('');
      closeModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <Typography variant="h2">➕ Быстрое создание</Typography>

        {/* Tab Switcher */}
        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeType === 'Task' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveType('Task')}
          >
            <span>🎯</span> Задача
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeType === 'Goal' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveType('Goal')}
          >
            <span>🏆</span> Цель
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeType === 'Topic' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveType('Topic')}
          >
            <span>🐘</span> Тема
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeType === 'Material' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveType('Material')}
          >
            <span>📄</span> Материал
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeType === 'Inbox' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveType('Inbox')}
          >
            <span>💡</span> Мысль
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input
            label="Название элемента"
            placeholder="Введите название..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            required
          />

          {activeType === 'Task' && (
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>Приоритет:</label>
                <select
                  className={styles.selectInput}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                >
                  <option value="P1">🔴 P1 Срочно</option>
                  <option value="P2">🔵 P2 Высокий</option>
                  <option value="P3">🟡 P3 Обычный</option>
                  <option value="P4">⚪ P4 Низкий</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>Привязать к цели:</label>
                <select
                  className={styles.selectInput}
                  value={goalId}
                  onChange={(e) => setGoalId(e.target.value)}
                >
                  <option value="">-- Без цели --</option>
                  {goals.map((g) => (
                    <option key={g.id} value={g.id}>{g.title}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activeType === 'Goal' && (
            <>
              <Textarea
                label="Описание цели"
                placeholder="Чего планируете достичь..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>Цвет цели:</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  style={{ width: '40px', height: '32px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                />
              </div>
            </>
          )}

          {activeType === 'Topic' && (
            <div>
              <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>Привязать к цели:</label>
              <select
                className={styles.selectInput}
                value={goalId}
                onChange={(e) => setGoalId(e.target.value)}
                required
              >
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>{g.title}</option>
                ))}
              </select>
            </div>
          )}

          {activeType === 'Material' && (
            <Textarea
              label="Описание / Заметки"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
            <Button type="button" variant="secondary" onClick={closeModal}>
              Отмена
            </Button>
            <Button type="submit" variant="primary" disabled={!title.trim() || isSubmitting}>
              Создать
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
