'use client';

import React, { useEffect, useState } from 'react';
import { Card, Typography, Button, Input, Textarea } from '@/shared/ui';
import { useGoalStore, GoalCard } from '@/entities/goal';
import { useTopicStore } from '@/entities/topic';
import { useTaskStore } from '@/entities/task';

export const GoalsPage: React.FC = () => {
  const { goals, isLoading, fetchGoals, addGoal, archiveGoal, unarchiveGoal, deleteGoal } = useGoalStore();
  const { topics, fetchTopics } = useTopicStore();
  const { tasks, fetchTasks } = useTaskStore();

  const [isCreating, setIsCreating] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newColor, setNewColor] = useState('#6366f1');

  useEffect(() => {
    fetchGoals();
    fetchTopics();
    fetchTasks();
  }, [fetchGoals, fetchTopics, fetchTasks]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await addGoal(newTitle.trim(), newColor, newDescription.trim());
    setNewTitle('');
    setNewDescription('');
    setIsCreating(false);
  };

  const activeGoals = goals.filter((g) => g.status === 'Active');
  const archivedGoals = goals.filter((g) => g.status === 'Archived');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <Card style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h1">🏆 Стратегические Цели</Typography>
          <Typography variant="body" style={{ color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Управление долгосрочными целями и картами навыков
          </Typography>
        </div>
        <Button variant="primary" onClick={() => setIsCreating(!isCreating)}>
          {isCreating ? 'Отмена' : '➕ Создать цель'}
        </Button>
      </Card>

      {/* Create Goal Form */}
      {isCreating && (
        <Card style={{ border: '1px solid var(--color-accent)' }}>
          <Typography variant="h3" style={{ marginBottom: 'var(--space-4)' }}>
            🎯 Новая цель
          </Typography>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Input
              label="Название цели"
              placeholder="Например: Стать Fullstack-разработчиком"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
            <Textarea
              label="Описание цели (опционально)"
              placeholder="Чего вы планируете достичь?"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                Цвет цели:
              </label>
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                style={{ width: '40px', height: '32px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
              <Button type="button" variant="secondary" onClick={() => setIsCreating(false)}>
                Отмена
              </Button>
              <Button type="submit" variant="primary" disabled={!newTitle.trim()}>
                Сохранить цель
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Active Goals Grid */}
      {isLoading ? (
        <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <Typography variant="body" style={{ color: 'var(--color-text-muted)' }}>
            Загрузка целей...
          </Typography>
        </Card>
      ) : activeGoals.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <Typography variant="body" style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>
            🌱 У вас пока нет активных целей
          </Typography>
          <Button variant="primary" onClick={() => setIsCreating(true)}>
            ➕ Создать первую цель
          </Button>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 'var(--space-4)' }}>
          {activeGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              allTopics={topics}
              allTasks={tasks}
              onArchiveGoal={archiveGoal}
              onDeleteGoal={deleteGoal}
            />
          ))}
        </div>
      )}

      {/* Archive Goals Section */}
      <Card style={{ marginTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => setShowArchive(!showArchive)}
        >
          <Typography variant="caption" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            📂 Архив целей ({archivedGoals.length}) — архивированные цели сохраняются здесь
          </Typography>
          <Button variant="ghost" size="sm">
            {showArchive ? 'Скрыть ▲' : 'Показать ▼'}
          </Button>
        </div>

        {showArchive && (
          <div style={{ marginTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {archivedGoals.length === 0 ? (
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                В архиве нет целей.
              </div>
            ) : (
              archivedGoals.map((goal) => (
                <div
                  key={goal.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: goal.color }} />
                    <span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-secondary)' }}>
                      {goal.title}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Button variant="secondary" size="sm" onClick={() => unarchiveGoal(goal.id)}>
                      🔄 Извлечь из архива
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Вы действительно хотите навсегда удалить цель "${goal.title}" из архива?`)) {
                          deleteGoal(goal.id);
                        }
                      }}
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      🗑
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
