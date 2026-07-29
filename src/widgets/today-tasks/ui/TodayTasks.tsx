'use client';

import React, { memo, useMemo } from 'react';
import Link from 'next/link';
import { Card, Typography, Button, Checkbox } from '@/shared/ui';
import { Task, TaskPriority } from '@/entities/task/model/types';
import { Topic } from '@/entities/topic/model/types';
import styles from './TodayTasks.module.css';

interface TodayTasksProps {
  tasks: Task[];
  topics: Topic[];
  dueCardsCount?: number;
  onAddTask?: (title: string, priority: TaskPriority) => Promise<void>;
  onToggleTask: (id: string) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
}

export const TodayTasks: React.FC<TodayTasksProps> = memo(({
  tasks,
  topics,
  dueCardsCount = 0,
  onToggleTask,
  onDeleteTask,
}) => {
  const priorityWeight: Record<TaskPriority, number> = { P1: 1, P2: 2, P3: 3, P4: 4 };

  // P1 > P2 > P3 > P4 Priority Sorting
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === 'Done' ? 1 : -1;
      }
      return priorityWeight[a.priority] - priorityWeight[b.priority];
    });
  }, [tasks]);

  const hasAnyItems = sortedTasks.length > 0 || dueCardsCount > 0;

  return (
    <Card className={styles.container}>
      <div className={styles.header}>
        <Typography variant="h2">🎯 На сегодня</Typography>
      </div>

      {!hasAnyItems ? (
        <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          🌱 На сегодня элементов пока нет
        </div>
      ) : (
        <div className={styles.taskList}>
          {/* Due Repeat Cards Action Item inside 🎯 На сегодня */}
          {dueCardsCount > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid var(--color-accent)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{ fontSize: '18px' }}>🧠</span>
                <span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                  Повторить карточки знаний ({dueCardsCount} шт.)
                </span>
              </div>
              <Link href="/review" style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="sm">
                  Начать ➔
                </Button>
              </Link>
            </div>
          )}

          {/* Regular Tasks List */}
          {sortedTasks.map((task) => {
            const linkedTopic = task.topicId ? topics.find((t) => t.id === task.topicId) : null;

            return (
              <div key={task.id} className={styles.taskItem}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1, minWidth: 0 }}>
                  <Checkbox checked={task.status === 'Done'} onChange={() => onToggleTask(task.id)} />
                  <span
                    style={{
                      fontSize: 'var(--font-size-md)',
                      color: task.status === 'Done' ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                      textDecoration: task.status === 'Done' ? 'line-through' : 'none',
                    }}
                  >
                    {task.title}
                  </span>
                  <span
                    style={{
                      fontSize: 'var(--font-size-xs)',
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor:
                        task.priority === 'P1'
                          ? 'var(--color-danger-light)'
                          : task.priority === 'P2'
                          ? 'var(--color-accent-light)'
                          : 'rgba(255, 255, 255, 0.05)',
                      color:
                        task.priority === 'P1'
                          ? 'var(--color-danger)'
                          : task.priority === 'P2'
                          ? 'var(--color-accent)'
                          : 'var(--color-text-muted)',
                      fontWeight: 600,
                    }}
                  >
                    {task.priority}
                  </span>
                  {linkedTopic && (
                    <Link
                      href={`/topics/${linkedTopic.id}`}
                      style={{
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--color-accent)',
                        textDecoration: 'none',
                      }}
                    >
                      🐘 {linkedTopic.title}
                    </Link>
                  )}
                </div>

                <Button variant="ghost" size="sm" onClick={() => onDeleteTask(task.id)}>
                  🗑
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
});

TodayTasks.displayName = 'TodayTasks';
