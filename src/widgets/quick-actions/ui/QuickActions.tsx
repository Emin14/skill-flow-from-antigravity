'use client';

import React, { useState, memo } from 'react';
import { Card, Typography, Button, Input } from '@/shared/ui';
import { useTaskStore } from '@/entities/task';
import { useGoalStore } from '@/entities/goal';
import { useInboxStore } from '@/entities/inbox';
import { useActivityStore } from '@/entities/activity';
import styles from './QuickActions.module.css';

export const QuickActions: React.FC = memo(() => {
  const [activeModal, setActiveModal] = useState<'Task' | 'Goal' | 'Inbox' | null>(null);
  const [title, setTitle] = useState('');

  const addTask = useTaskStore((s) => s.addTask);
  const addGoal = useGoalStore((s) => s.addGoal);
  const addItem = useInboxStore((s) => s.addItem);
  const logActivity = useActivityStore((s) => s.logActivity);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (activeModal === 'Task') {
      await addTask(title.trim(), 'P3');
      await logActivity('task_created', `Создана задача: "${title.trim()}"`);
    } else if (activeModal === 'Goal') {
      await addGoal(title.trim(), '#6366f1');
      await logActivity('goal_created', `Создана цель: "${title.trim()}"`);
    } else if (activeModal === 'Inbox') {
      await addItem(title.trim());
      await logActivity('task_created', `Добавлена мысль: "${title.trim()}"`);
    }

    setTitle('');
    setActiveModal(null);
  };

  return (
    <>
      <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <Typography variant="h3">⚡ Быстрые действия</Typography>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <Button variant="secondary" size="sm" onClick={() => setActiveModal('Task')}>
            🎯 Задача
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setActiveModal('Goal')}>
            🏆 Цель
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setActiveModal('Inbox')}>
            💡 Мысль
          </Button>
        </div>
      </Card>

      {/* Quick Modal */}
      {activeModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 'var(--z-index-modal)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4)',
          }}
          onClick={() => setActiveModal(null)}
        >
          <Card
            style={{ width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <Typography variant="h2">
              ➕ {activeModal === 'Task' ? 'Быстрая задача' : activeModal === 'Goal' ? 'Новая цель' : 'Быстрая мысль'}
            </Typography>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <Input
                placeholder="Введите название..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                required
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                <Button type="button" variant="secondary" onClick={() => setActiveModal(null)}>
                  Отмена
                </Button>
                <Button type="submit" variant="primary" disabled={!title.trim()}>
                  Создать
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </>
  );
});

QuickActions.displayName = 'QuickActions';
