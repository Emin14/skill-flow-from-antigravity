'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Checkbox } from '@/shared/ui';
import { useTaskStore } from '@/entities/task';
import { useTopicStore } from '@/entities/topic';
import { Task, TaskStatus } from '@/entities/task/model/types';
import { EditTaskModal } from '@/features/edit-task/ui/EditTaskModal';
import styles from './TodayTasks.module.css';

const getShortLink = (url: string) => {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace('www.', '');
  } catch {
    return 'Ссылка';
  }
};

export const TodayTasks: React.FC = () => {
  const { tasks, toggleTaskStatus, updateTaskStatus, updateTaskPomodoros, deleteTask } = useTaskStore();
  const { topics } = useTopicStore();

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter today's tasks
  const todayTasks = tasks.filter(
    (t) => t.scheduledDate === todayStr || t.completedAt?.startsWith(todayStr)
  );

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
          onUpdatePomodoros={updateTaskPomodoros}
          onDeleteTask={deleteTask}
          onEditTask={(t) => setEditingTask(t)}
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
          onUpdatePomodoros={updateTaskPomodoros}
          onDeleteTask={deleteTask}
          onEditTask={(t) => setEditingTask(t)}
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
          onUpdatePomodoros={updateTaskPomodoros}
          onDeleteTask={deleteTask}
          onEditTask={(t) => setEditingTask(t)}
        />
      </div>

      {/* Modal for Editing Selected Task */}
      <EditTaskModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
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
  onUpdatePomodoros: (id: string, count: number) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
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
  onUpdatePomodoros,
  onDeleteTask,
  onEditTask,
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

            let durationMinutes: number | null = null;
            if (task.startedAt && task.completedAt) {
              const start = new Date(task.startedAt).getTime();
              const end = new Date(task.completedAt).getTime();
              durationMinutes = Math.max(1, Math.round((end - start) / (1000 * 60)));
            }

            const startTimeStr = task.startedAt
              ? new Date(task.startedAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
              : null;

            const completedTimeStr = task.completedAt
              ? new Date(task.completedAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
              : null;

            const pomodoros = task.pomodorosCount || 1;
            const repetitionsCount = task.repetitionsCount || 0;
            const targetRepetitions = task.targetRepetitions || 8;

            return (
              <div
                key={task.id}
                onClick={() => onEditTask(task)}
                className={`${styles.taskCard} ${isInProgress ? styles.taskCardInProgress : ''} ${
                  isDone ? styles.taskCardDone : ''
                }`}
                title="Нажмите в любое место блока для редактирования"
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
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTask(task.id);
                      }}
                      style={{ color: 'var(--color-text-muted)', padding: '2px 4px' }}
                    >
                      🗑
                    </Button>
                  </div>
                </div>

                {/* Category, Topic, Short Link & Repetitions Ticks Badge */}
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

                  {/* Repetition Visual Sticks Badge */}
                  {task.isRepeating && (
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-sm)',
                      }}
                      title={`Пройдено ${repetitionsCount} из ${targetRepetitions} повторений`}
                    >
                      <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>
                        🔄 {repetitionsCount}/{targetRepetitions}
                      </span>
                      <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                        {Array.from({ length: Math.min(8, targetRepetitions) }).map((_, i) => (
                          <div
                            key={i}
                            style={{
                              width: '3px',
                              height: '9px',
                              borderRadius: '1px',
                              backgroundColor: i < repetitionsCount ? '#10b981' : 'rgba(255, 255, 255, 0.18)',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Meta Row: Timestamps, Duration & Pomodoros Manual Adjuster */}
                <div className={styles.metaRow}>
                  <div className={styles.timeInfo}>
                    {startTimeStr && <span>⚡ Начато в {startTimeStr}</span>}
                    {completedTimeStr && <span>✓ Завершено в {completedTimeStr}</span>}
                    {durationMinutes !== null && <span>⏱ ({durationMinutes} мин)</span>}
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
