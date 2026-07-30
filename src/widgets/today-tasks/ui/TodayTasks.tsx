'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Checkbox } from '@/shared/ui';
import { useTaskStore } from '@/entities/task';
import { useTopicStore } from '@/entities/topic';
import { Task, TaskStatus } from '@/entities/task/model/types';
import { EditTaskModal } from '@/features/edit-task/ui/EditTaskModal';
import { RepeatingTaskDetailModal } from '@/features/edit-task/ui/RepeatingTaskDetailModal';
import styles from './TodayTasks.module.css';

const getShortLink = (url: string) => {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace('www.', '');
  } catch {
    return 'Ссылка';
  }
};

const formatActiveDuration = (task: Task): string | null => {
  let totalSec = task.totalActiveSeconds || 0;
  if (task.status === 'InProgress' && task.lastStartedAt) {
    const startedMs = new Date(task.lastStartedAt).getTime();
    const elapsedSec = Math.max(0, Math.round((Date.now() - startedMs) / 1000));
    totalSec += elapsedSec;
  }
  if (totalSec <= 0) return null;
  const mins = Math.max(1, Math.round(totalSec / 60));
  return `${mins} мин`;
};

export const TodayTasks: React.FC = () => {
  const { tasks, toggleTaskStatus, updateTaskStatus, updateTaskDetails, updateTaskPomodoros, deleteTask } = useTaskStore();
  const { topics } = useTopicStore();

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Strictly filter today's tasks by scheduledDate
  const todayTasks = tasks.filter((t) => t.scheduledDate === todayStr);

  const pendingTasks = todayTasks.filter((t) => t.status === 'Todo');
  const inProgressTasks = todayTasks.filter((t) => t.status === 'InProgress');
  const completedTasks = todayTasks.filter((t) => t.status === 'Done');

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = draggedTaskId || e.dataTransfer.getData('text/plain');
    if (taskId) {
      await updateTaskStatus(taskId, targetStatus);
    }
    setDraggedTaskId(null);
  };

  const handleTaskClick = (task: Task) => {
    if (task.isRepeating) {
      setDetailTask(task);
    } else {
      setEditingTask(task);
    }
  };

  return (
    <div className={styles.container}>
      {/* 3 Vertical Kanban Sections */}
      <div className={styles.kanbanSections}>
        {/* Column 1: Ожидает */}
        <KanbanColumn
          title="⏳ Ожидает"
          count={pendingTasks.length}
          status="Todo"
          tasks={pendingTasks}
          topics={topics}
          isDragOver={dragOverColumn === 'Todo'}
          onDragOver={(e) => handleDragOver(e, 'Todo')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'Todo')}
          onDragStart={handleDragStart}
          onCheckboxToggle={(id) => updateTaskStatus(id, 'Done')}
          onUpdateStatus={updateTaskStatus}
          onUpdateDetails={updateTaskDetails}
          onUpdatePomodoros={updateTaskPomodoros}
          onDeleteTask={deleteTask}
          onTaskClick={handleTaskClick}
        />

        {/* Column 2: В процессе */}
        <KanbanColumn
          title="⚡ В процессе"
          count={inProgressTasks.length}
          status="InProgress"
          tasks={inProgressTasks}
          topics={topics}
          isDragOver={dragOverColumn === 'InProgress'}
          onDragOver={(e) => handleDragOver(e, 'InProgress')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'InProgress')}
          onDragStart={handleDragStart}
          onCheckboxToggle={(id) => updateTaskStatus(id, 'Done')}
          onUpdateStatus={updateTaskStatus}
          onUpdateDetails={updateTaskDetails}
          onUpdatePomodoros={updateTaskPomodoros}
          onDeleteTask={deleteTask}
          onTaskClick={handleTaskClick}
        />

        {/* Column 3: Выполнено */}
        <KanbanColumn
          title="✅ Выполнено"
          count={completedTasks.length}
          status="Done"
          tasks={completedTasks}
          topics={topics}
          isDragOver={dragOverColumn === 'Done'}
          onDragOver={(e) => handleDragOver(e, 'Done')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, 'Done')}
          onDragStart={handleDragStart}
          onCheckboxToggle={(id) => toggleTaskStatus(id)}
          onUpdateStatus={updateTaskStatus}
          onUpdateDetails={updateTaskDetails}
          onUpdatePomodoros={updateTaskPomodoros}
          onDeleteTask={deleteTask}
          onTaskClick={handleTaskClick}
        />
      </div>

      {/* Modal for Editing Selected Task */}
      <EditTaskModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
      />

      {/* Modal for Repeating Task Detail / History */}
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

const KanbanColumn: React.FC<{
  title: string;
  count: number;
  status: TaskStatus;
  tasks: Task[];
  topics: any[];
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onCheckboxToggle: (id: string) => void;
  onUpdateStatus: (id: string, status: TaskStatus) => void;
  onUpdateDetails: (id: string, updates: Partial<Task>) => void;
  onUpdatePomodoros: (id: string, count: number) => void;
  onDeleteTask: (id: string) => void;
  onTaskClick: (task: Task) => void;
}> = ({
  title,
  count,
  status,
  tasks,
  topics,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragStart,
  onCheckboxToggle,
  onUpdateStatus,
  onUpdateDetails,
  onUpdatePomodoros,
  onDeleteTask,
  onTaskClick,
}) => {
  return (
    <div
      className={`${styles.kanbanColumn} ${isDragOver ? styles.kanbanColumnDragOver : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className={styles.columnHeader}>
        <div className={styles.columnTitle}>
          <span>{title}</span>
          <span className={styles.badgeCount}>{count}</span>
        </div>
      </div>

      <div className={styles.columnTasks}>
        {tasks.length === 0 ? (
          <div className={styles.emptyState}>Нет задач в этом статусе</div>
        ) : (
          tasks.map((task) => {
            const isDone = task.status === 'Done';
            const isInProgress = task.status === 'InProgress';
            const linkedTopic = task.topicId ? topics.find((tp) => tp.id === task.topicId) : null;

            const activeDurationStr = formatActiveDuration(task);
            const pomodoros = task.pomodorosCount || 1;

            return (
              <div
                key={task.id}
                onClick={() => onTaskClick(task)}
                className={`${styles.taskCard} ${isInProgress ? styles.taskCardInProgress : ''} ${
                  isDone ? styles.taskCardDone : ''
                }`}
                title="Нажмите на карточку"
              >
                {/* Header: Checkbox + Title + Drag Handle + Trash */}
                <div className={styles.cardHeader}>
                  <div className={styles.cardMain}>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Checkbox checked={isDone} onChange={() => onCheckboxToggle(task.id)} />
                    </div>
                    <span className={`${styles.cardTitle} ${isDone ? styles.cardTitleDone : ''}`}>
                      {task.title}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {/* Dedicated Drag Handle */}
                    <div
                      className={styles.dragHandle}
                      draggable
                      onDragStart={(e) => onDragStart(e, task.id)}
                      onClick={(e) => e.stopPropagation()}
                      title="Зажмите ⋮⋮ для перетаскивания"
                    >
                      ⋮⋮
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className={styles.trashBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTask(task.id);
                      }}
                    >
                      🗑
                    </Button>
                  </div>
                </div>

                {/* Category, Topic, Short Link & ONLY Illuminated Repeat Toggle Icon */}
                <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-accent)' }}>🏷 {task.category}</span>
                  {linkedTopic && (
                    <Link
                      href={`/topics/${linkedTopic.id}`}
                      onClick={(e) => e.stopPropagation()}
                      style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textDecoration: 'none' }}
                    >
                      🐘 {linkedTopic.title}
                    </Link>
                  )}
                  {task.link && (
                    <a
                      href={task.link.startsWith('http') ? task.link : `https://${task.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        fontSize: '11px',
                        color: '#60a5fa',
                        textDecoration: 'none',
                        backgroundColor: 'rgba(96, 165, 250, 0.1)',
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(96, 165, 250, 0.2)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '2px',
                      }}
                      title={task.link}
                    >
                      🔗 {getShortLink(task.link)} ↗
                    </a>
                  )}

                  {/* Illuminated Repeat Toggle Icon ONLY */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateDetails(task.id, { isRepeating: !task.isRepeating, targetRepetitions: 8 });
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: task.isRepeating ? '#10b981' : 'var(--color-text-muted)',
                      filter: task.isRepeating ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.85))' : 'none',
                      opacity: task.isRepeating ? 1 : 0.4,
                      transform: task.isRepeating ? 'scale(1.2)' : 'scale(1)',
                      fontSize: '18px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      marginLeft: 'auto',
                    }}
                    title={task.isRepeating ? 'Повторение включено' : 'Включить повторение'}
                  >
                    🔄
                  </button>
                </div>

                {/* Meta Row: Cumulative Active Duration ONLY & Pomodoros Adjuster */}
                <div className={styles.metaRow}>
                  <div className={styles.timeInfo}>
                    {activeDurationStr && <span>⏱ ({activeDurationStr})</span>}
                  </div>

                  {/* Manual Pomodoro Adjustment Control */}
                  <div
                    className={styles.pomodoroControl}
                    onClick={(e) => e.stopPropagation()}
                    title="Потрачено помидоров (25 мин)"
                  >
                    <button
                      type="button"
                      className={styles.pomoBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdatePomodoros(task.id, pomodoros - 1);
                      }}
                    >
                      -
                    </button>
                    <span>🍅 {pomodoros}</span>
                    <button
                      type="button"
                      className={styles.pomoBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdatePomodoros(task.id, pomodoros + 1);
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Quick Touch Movement Buttons */}
                <div className={styles.actionBtns} onClick={(e) => e.stopPropagation()}>
                  {status !== 'Todo' && (
                    <button
                      className={styles.moveBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateStatus(task.id, 'Todo');
                      }}
                    >
                      ⏳ Ожидает
                    </button>
                  )}
                  {status !== 'InProgress' && (
                    <button
                      className={styles.moveBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateStatus(task.id, 'InProgress');
                      }}
                    >
                      ⚡ В процесс
                    </button>
                  )}
                  {status !== 'Done' && (
                    <button
                      className={styles.moveBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateStatus(task.id, 'Done');
                      }}
                    >
                      ✅ Выполнено
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
