'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, Typography, Checkbox } from '@/shared/ui';
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

      {/* Unified Task List */}
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
            <AnytimeTaskCardItem
              key={task.id}
              task={task}
              topics={topics}
              onToggleStatus={() => toggleTaskStatus(task.id)}
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

interface AnytimeTaskCardItemProps {
  task: Task;
  topics: any[];
  onToggleStatus: () => void;
  onDelete: () => void;
  onClick: () => void;
}

const AnytimeTaskCardItem: React.FC<AnytimeTaskCardItemProps> = ({
  task,
  topics,
  onToggleStatus,
  onDelete,
  onClick,
}) => {
  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isSwipedLeft, setIsSwipedLeft] = useState<boolean>(false);

  const isDone = task.status === 'Done';
  const linkedTopic = task.topicId ? topics.find((tp) => tp.id === task.topicId) : null;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.targetTouches[0].clientX;
    const diff = touchStartX - currentX;

    if (isSwipedLeft) {
      const newOffset = Math.min(0, Math.max(-80, -80 - diff));
      setSwipeOffset(newOffset);
    } else {
      if (diff > 0 && diff <= 80) {
        setSwipeOffset(-diff);
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (isSwipedLeft) {
      setIsSwipedLeft(false);
      setSwipeOffset(0);
    } else {
      if (diff > 45) {
        setIsSwipedLeft(true);
        setSwipeOffset(-80);
      } else {
        setIsSwipedLeft(false);
        setSwipeOffset(0);
      }
    }
    setTouchStartX(null);
  };

  return (
    <div className={styles.taskCardWrapper}>
      {/* Swipe Delete Action: Centered text WITHOUT trash icon */}
      <div className={styles.deleteSwipeAction} onClick={onDelete}>
        Удалить
      </div>

      {/* Main Ultra-Slim Unified Card */}
      <div
        className={styles.taskCard}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={onClick}
      >
        {/* Line 1: Checkbox, Title & Drag handle */}
        <div className={styles.cardHeaderRow}>
          <div className={styles.titleArea}>
            <div onClick={(e) => { e.stopPropagation(); onToggleStatus(); }}>
              <Checkbox checked={isDone} onChange={() => {}} />
            </div>
            <span className={`${styles.taskTitle} ${isDone ? styles.taskTitleDone : ''}`}>
              {task.title}
            </span>
          </div>

          <div
            className={styles.dragHandleTop}
            title="Перетащите карточку"
            onClick={(e) => e.stopPropagation()}
          >
            ⋮⋮⋮
          </div>
        </div>

        {/* Line 2: Category Badge ONLY without border outline */}
        <div className={styles.metaInlineRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className={styles.categoryBadgeNoBorder}>🏷 {task.category}</span>
            {linkedTopic && (
              <Link
                href={`/topics/${linkedTopic.id}`}
                onClick={(e) => e.stopPropagation()}
                style={{ color: 'var(--color-text-secondary)', textDecoration: 'none', fontSize: '11.5px' }}
              >
                🐘 {linkedTopic.title}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
