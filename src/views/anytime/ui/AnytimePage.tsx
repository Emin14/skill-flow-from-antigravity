'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Card, Typography } from '@/shared/ui';
import { useTaskStore, GlassmorphicTaskCard } from '@/entities/task';
import { Task } from '@/entities/task/model/types';
import { EditTaskModal } from '@/features/edit-task/ui/EditTaskModal';
import { RepeatingTaskDetailModal } from '@/features/edit-task/ui/RepeatingTaskDetailModal';
import styles from './AnytimePage.module.css';

export const AnytimePage: React.FC = () => {
  const { tasks, isLoading, fetchTasks, toggleTaskStatus, deleteTask } = useTaskStore();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Tasks without scheduledDate or marked anytime
  const anytimeTasks = useMemo(() => {
    return tasks.filter(
      (t) => !t.scheduledDate || t.scheduledDate === '' || t.scheduledDate === 'anytime'
    );
  }, [tasks]);

  const handleTaskClick = (task: Task) => {
    setDetailTask(task);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', borderRadius: '20px' }}>
        <Typography variant="h1">♾️ В любое время ({anytimeTasks.length})</Typography>
        <Typography variant="body" style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
          Задачи без определенной даты выполнения. Выполняйте их по мере появления времени.
        </Typography>
      </Card>

      {/* Unified Task List using shared GlassmorphicTaskCard */}
      {isLoading ? (
        <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <Typography variant="body" style={{ color: 'var(--color-text-muted)' }}>
            Загрузка задач...
          </Typography>
        </Card>
      ) : anytimeTasks.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <Typography variant="body" style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
            🌱 Нет задач в разделе «В любое время».
          </Typography>
          <Typography variant="caption" style={{ color: 'var(--color-text-muted)' }}>
            При создании задачи очистите дату выполнения, чтобы добавить ее сюда.
          </Typography>
        </Card>
      ) : (
        <div className={styles.taskList}>
          {anytimeTasks.map((task) => (
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
