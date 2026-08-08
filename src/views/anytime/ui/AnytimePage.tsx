'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Card, Typography } from '@/shared/ui';
import { useTaskStore, GlassmorphicTaskCard } from '@/entities/task';
import { Task } from '@/entities/task/model/types';
import { TaskCategory } from '@/shared/config/categories';
import { useCategoryStore } from '@/entities/category/model/useCategoryStore';
import { EditTaskModal } from '@/features/edit-task/ui/EditTaskModal';
import { RepeatingTaskDetailModal } from '@/features/edit-task/ui/RepeatingTaskDetailModal';
import styles from './AnytimePage.module.css';

export const AnytimePage: React.FC = () => {
  const { tasks, isLoading, fetchTasks, toggleTaskStatus, deleteTask } = useTaskStore();
  const storeCategories = useCategoryStore((s) => s.categories);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [activeCategory, setActiveCategory] = useState<TaskCategory | 'all'>('all');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Tasks without scheduledDate or marked anytime (EXCLUDING parent tasks with subtasks)
  const anytimeTasks = useMemo(() => {
    return tasks.filter((t) => {
      const hasChildren = tasks.some((sub) => sub.parentTaskId === t.id);
      if (t.hasSubtasks || hasChildren) return false;
      return !t.scheduledDate || t.scheduledDate === '' || t.scheduledDate === 'anytime';
    });
  }, [tasks]);

  // Available categories (only those with tasks)
  const usedCategories = useMemo(() => {
    const cats = new Set(anytimeTasks.map((t) => t.category || 'Без категории'));
    return storeCategories.map((c) => c.name).filter((name) => cats.has(name));
  }, [anytimeTasks, storeCategories]);

  // Filtered tasks by selected category
  const filteredTasks = useMemo(() => {
    if (activeCategory === 'all') return anytimeTasks;
    return anytimeTasks.filter((t) => (t.category || 'Без категории') === activeCategory);
  }, [anytimeTasks, activeCategory]);

  const handleTaskClick = (task: Task) => {
    setDetailTask(task);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', borderRadius: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <Typography variant="h1">♾️ В любое время</Typography>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            {filteredTasks.length} задач{filteredTasks.length !== anytimeTasks.length ? ` из ${anytimeTasks.length}` : ''}
          </span>
        </div>
        <Typography variant="body" style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
          Задачи без определённой даты. Выполняйте по мере появления времени.
        </Typography>

        {/* Category Filter Pills */}
        {usedCategories.length > 1 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              style={{
                background: activeCategory === 'all' ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.04)',
                border: activeCategory === 'all' ? '1px solid rgba(99,102,241,0.6)' : '1px solid var(--color-border)',
                color: activeCategory === 'all' ? '#a5b4fc' : 'var(--color-text-muted)',
                borderRadius: '8px',
                padding: '4px 10px',
                fontSize: '12px',
                fontWeight: activeCategory === 'all' ? 700 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Все ({anytimeTasks.length})
            </button>
            {usedCategories.map((cat) => {
              const count = anytimeTasks.filter((t) => (t.category || 'Без категории') === cat).length;
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    background: isActive ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                    border: isActive ? '1px solid rgba(99,102,241,0.5)' : '1px solid var(--color-border)',
                    color: isActive ? '#a5b4fc' : 'var(--color-text-muted)',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    fontSize: '11.5px',
                    fontWeight: isActive ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        )}
      </Card>

      {/* Task List */}
      {isLoading ? (
        <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <Typography variant="body" style={{ color: 'var(--color-text-muted)' }}>
            Загрузка задач...
          </Typography>
        </Card>
      ) : filteredTasks.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <Typography variant="body" style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
            {activeCategory === 'all'
              ? '🌱 Нет задач в разделе «В любое время».'
              : `🌱 Нет задач в категории «${activeCategory}».`}
          </Typography>
          <Typography variant="caption" style={{ color: 'var(--color-text-muted)' }}>
            {activeCategory === 'all'
              ? 'При создании задачи очистите дату выполнения, чтобы добавить её сюда.'
              : 'Попробуйте выбрать другую категорию или «Все».'}
          </Typography>
        </Card>
      ) : (
        <div className={styles.taskList}>
          {filteredTasks.map((task) => (
            <GlassmorphicTaskCard
              key={task.id}
              task={task}
              allTasks={tasks}
              showDragHandle={true}
              onToggleCheckbox={() => toggleTaskStatus(task.id)}
              onDelete={() => deleteTask(task.id)}
              onClick={() => handleTaskClick(task)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <EditTaskModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
      />

      <RepeatingTaskDetailModal
        task={detailTask}
        isOpen={!!detailTask}
        onClose={() => setDetailTask(null)}
        onOpenEdit={() => {
          setEditingTask(detailTask);
          setDetailTask(null);
        }}
      />
    </div>
  );
};
