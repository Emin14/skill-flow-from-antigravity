'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, Typography, Checkbox, Button } from '@/shared/ui';
import { useTaskStore } from '@/entities/task';
import { useTopicStore } from '@/entities/topic';
import { Task } from '@/entities/task/model/types';
import { EditTaskModal } from '@/features/edit-task/ui/EditTaskModal';
import { RepeatingTaskDetailModal } from '@/features/edit-task/ui/RepeatingTaskDetailModal';
import styles from './AnytimePage.module.css';

export const AnytimePage: React.FC = () => {
  const { tasks, isLoading, fetchTasks, toggleTaskStatus, deleteTask } = useTaskStore();
  const { topics, fetchTopics } = useTopicStore();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
    fetchTopics();
  }, [fetchTasks, fetchTopics]);

  // Tasks without scheduledDate or marked anytime
  const anytimeTasks = useMemo(() => {
    return tasks.filter(
      (t) => !t.scheduledDate || t.scheduledDate === '' || t.scheduledDate === 'anytime'
    );
  }, [tasks]);

  const handleTaskClick = (task: Task) => {
    if (task.isRepeating) {
      setDetailTask(task);
    } else {
      setEditingTask(task);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <Typography variant="h1">♾️ В любое время ({anytimeTasks.length})</Typography>
        <Typography variant="body" style={{ color: 'var(--color-text-muted)' }}>
          Задачи без определенной даты выполнения. Выполняйте их по мере появления времени.
        </Typography>
      </Card>

      {/* List */}
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
            При создании задачи опустите дату выполнения, чтобы добавить ее сюда.
          </Typography>
        </Card>
      ) : (
        <div className={styles.taskList}>
          {anytimeTasks.map((task) => {
            const isDone = task.status === 'Done';
            const linkedTopic = task.topicId ? topics.find((tp) => tp.id === task.topicId) : null;

            return (
              <div
                key={task.id}
                className={styles.taskRow}
                onClick={() => handleTaskClick(task)}
                style={{ cursor: 'pointer' }}
                title="Нажмите на карточку"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1, minWidth: 0 }}>
                  <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={isDone} onChange={() => toggleTaskStatus(task.id)} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        fontSize: 'var(--font-size-md)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: isDone ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                        textDecoration: isDone ? 'line-through' : 'none',
                      }}
                    >
                      {task.title}
                    </span>
                    <div style={{ display: 'flex', gap: 'var(--space-3)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
                      <span style={{ color: 'var(--color-accent)' }}>🏷 {task.category}</span>
                      {linkedTopic && (
                        <Link
                          href={`/topics/${linkedTopic.id}`}
                          onClick={(e) => e.stopPropagation()}
                          style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}
                        >
                          🐘 {linkedTopic.title}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTask(task.id);
                  }}
                  style={{ color: 'var(--color-text-muted)', minWidth: '40px', minHeight: '40px' }}
                >
                  🗑
                </Button>
              </div>
            );
          })}
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
