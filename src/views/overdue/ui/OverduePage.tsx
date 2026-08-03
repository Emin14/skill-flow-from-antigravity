'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Card, Typography } from '@/shared/ui';
import { useTaskStore, GlassmorphicTaskCard } from '@/entities/task';
import { Task } from '@/entities/task/model/types';
import { EditTaskModal } from '@/features/edit-task/ui/EditTaskModal';
import { RepeatingTaskDetailModal } from '@/features/edit-task/ui/RepeatingTaskDetailModal';
import { getTodayStr } from '@/shared/lib/dateUtils';
import { AlertCircle, Calendar, CheckCircle2 } from 'lucide-react';
import styles from './OverduePage.module.css';

export const OverduePage: React.FC = () => {
  const { tasks, isLoading, fetchTasks, toggleTaskStatus, deleteTask, updateTaskDetails } = useTaskStore();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const todayStr = useMemo(() => getTodayStr(), []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Filter tasks whose scheduledDate is strictly less than todayStr and status !== 'Done'
  const overdueTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (t.status === 'Done') return false;
      if (t.isRepeating) {
        const hasOverdueOcc = t.occurrences?.some((o) => o.date < todayStr && o.status !== 'Done');
        const isScheduledOverdue = t.scheduledDate && t.scheduledDate < todayStr;
        return hasOverdueOcc || isScheduledOverdue;
      }
      if (!t.scheduledDate || t.scheduledDate === '' || t.scheduledDate === 'anytime') return false;
      return t.scheduledDate < todayStr;
    });
  }, [tasks, todayStr]);

  const handleRescheduleToToday = async (task: Task) => {
    if (task.isRepeating && task.occurrences) {
      const updatedOccurrences = task.occurrences.map((o) => {
        if (o.date < todayStr && o.status !== 'Done') {
          return { ...o, date: todayStr };
        }
        return o;
      });
      await updateTaskDetails(task.id, { scheduledDate: todayStr, occurrences: updatedOccurrences });
    } else {
      await updateTaskDetails(task.id, { scheduledDate: todayStr });
    }
  };

  const handleRescheduleAllToToday = async () => {
    for (const t of overdueTasks) {
      await handleRescheduleToToday(t);
    }
  };

  const handleTaskClick = (task: Task) => {
    setDetailTask(task);
  };

  return (
    <div className={styles.container}>
      {/* Header Card */}
      <Card className={styles.headerCard}>
        <div className={styles.headerTitleRow}>
          <div className={styles.titleGroup}>
            <AlertCircle size={24} color="#ef4444" />
            <Typography variant="h1">Просроченные ({overdueTasks.length})</Typography>
          </div>

          {overdueTasks.length > 0 && (
            <button
              type="button"
              className={styles.bulkActionBtn}
              onClick={handleRescheduleAllToToday}
              title="Перенести все просроченные задачи на сегодня"
            >
              <Calendar size={14} />
              Перенести все на сегодня ☀️
            </button>
          )}
        </div>

        <Typography variant="body" className={styles.subtitle}>
          Задачи, срок выполнения которых уже прошёл. Перенесите их на сегодня или отметьте выполненными.
        </Typography>
      </Card>

      {/* Task List */}
      {isLoading ? (
        <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <Typography variant="body" style={{ color: 'var(--color-text-muted)' }}>
            Загрузка просроченных задач...
          </Typography>
        </Card>
      ) : overdueTasks.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 'var(--space-8)', borderRadius: '20px' }}>
          <CheckCircle2 size={40} color="#10b981" style={{ margin: '0 auto 12px auto' }} />
          <Typography variant="h2" style={{ color: '#10b981', marginBottom: 'var(--space-2)' }}>
            Всё чисто! Просроченных задач нет 🎉
          </Typography>
          <Typography variant="caption" style={{ color: 'var(--color-text-muted)' }}>
            Отличная работа с тайм-менеджментом. Все запланированные задачи выполняются вовремя.
          </Typography>
        </Card>
      ) : (
        <div className={styles.taskList}>
          {overdueTasks.map((task) => (
            <div key={task.id} className={styles.overdueCardItem}>
              <GlassmorphicTaskCard
                task={task}
                allTasks={tasks}
                showDragHandle={false}
                onToggleCheckbox={() => toggleTaskStatus(task.id)}
                onDelete={() => deleteTask(task.id)}
                onClick={() => handleTaskClick(task)}
              />
              <div className={styles.cardActionRow}>
                <button
                  type="button"
                  className={`${styles.actionChip} ${styles.actionChipToday}`}
                  onClick={() => handleRescheduleToToday(task)}
                  title="Перенести задачу на сегодня"
                >
                  ☀️ Перенести на сегодня
                </button>
              </div>
            </div>
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
