'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Checkbox } from '@/shared/ui';
import { useTaskStore } from '@/entities/task';
import { useTopicStore } from '@/entities/topic';
import { Task, TaskStatus } from '@/entities/task/model/types';
import { SmartRating } from '@/shared/config/repetitionRules';
import { EditTaskModal } from '@/features/edit-task/ui/EditTaskModal';
import { RepeatingTaskDetailModal } from '@/features/edit-task/ui/RepeatingTaskDetailModal';
import { SmartRatingModal } from '@/features/smart-rating-modal/ui/SmartRatingModal';
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
  const [smartTask, setSmartTask] = useState<Task | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Strictly filter today's tasks by scheduledDate
  const todayTasks = tasks.filter((t) => t.scheduledDate === todayStr);

  const pendingTasks = todayTasks.filter((t) => t.status === 'Todo');
  const inProgressTasks = todayTasks.filter((t) => t.status === 'InProgress');
  const completedTasks = todayTasks.filter((t) => t.status === 'Done');

  const handleCheckboxToggle = (task: Task) => {
    if (task.status !== 'Done' && task.repetitionMode === 'smart') {
      setSmartTask(task);
    } else {
      toggleTaskStatus(task.id);
    }
  };

  const handleStatusChange = (task: Task, newStatus: TaskStatus, smartRating?: SmartRating) => {
    if (newStatus === 'Done' && task.repetitionMode === 'smart' && task.status !== 'Done' && !smartRating) {
      setSmartTask(task);
    } else {
      updateTaskStatus(task.id, newStatus, smartRating);
    }
  };

  const handleSelectSmartRating = (rating: SmartRating) => {
    if (smartTask) {
      updateTaskStatus(smartTask.id, 'Done', rating);
      setSmartTask(null);
    }
  };

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

  const handleDropColumn = async (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = draggedTaskId || e.dataTransfer.getData('text/plain');
    if (taskId) {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        handleStatusChange(task, targetStatus);
      }
    }
    setDraggedTaskId(null);
  };

  // Drag task onto another task card to make it a subtask
  const handleDropOnTaskCard = async (e: React.DragEvent, targetTask: Task) => {
    e.preventDefault();
    e.stopPropagation();
    const draggedId = draggedTaskId || e.dataTransfer.getData('text/plain');
    if (draggedId && draggedId !== targetTask.id) {
      await updateTaskDetails(targetTask.id, { hasSubtasks: true });
      await updateTaskDetails(draggedId, { parentTaskId: targetTask.id });
    }
    setDraggedTaskId(null);
  };

  const handleTaskClick = (task: Task) => {
    setDetailTask(task);
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
          onDropColumn={(e) => handleDropColumn(e, 'Todo')}
          onDropOnTaskCard={handleDropOnTaskCard}
          onDragStart={handleDragStart}
          onCheckboxToggle={(t) => handleCheckboxToggle(t)}
          onUpdateStatus={(t, st, rating) => handleStatusChange(t, st, rating)}
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
          onDropColumn={(e) => handleDropColumn(e, 'InProgress')}
          onDropOnTaskCard={handleDropOnTaskCard}
          onDragStart={handleDragStart}
          onCheckboxToggle={(t) => handleCheckboxToggle(t)}
          onUpdateStatus={(t, st, rating) => handleStatusChange(t, st, rating)}
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
          onDropColumn={(e) => handleDropColumn(e, 'Done')}
          onDropOnTaskCard={handleDropOnTaskCard}
          onDragStart={handleDragStart}
          onCheckboxToggle={(t) => handleCheckboxToggle(t)}
          onUpdateStatus={(t, st, rating) => handleStatusChange(t, st, rating)}
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

      {/* Modal for Habit Detail / Lifetime Grid / History */}
      <RepeatingTaskDetailModal
        task={detailTask}
        isOpen={!!detailTask}
        onClose={() => setDetailTask(null)}
        onOpenEdit={() => {
          setEditingTask(detailTask);
          setDetailTask(null);
        }}
      />

      {/* Modal for Smart Repetition Rating */}
      <SmartRatingModal
        task={smartTask}
        isOpen={!!smartTask}
        onClose={() => setSmartTask(null)}
        onSelectRating={handleSelectSmartRating}
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
  onDropColumn: (e: React.DragEvent) => void;
  onDropOnTaskCard: (e: React.DragEvent, targetTask: Task) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onCheckboxToggle: (task: Task) => void;
  onUpdateStatus: (task: Task, status: TaskStatus, smartRating?: SmartRating) => void;
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
  onDropColumn,
  onDropOnTaskCard,
  onDragStart,
  onCheckboxToggle,
  onUpdateStatus,
  onUpdatePomodoros,
  onDeleteTask,
  onTaskClick,
}) => {
  return (
    <div
      className={`${styles.kanbanColumn} ${isDragOver ? styles.kanbanColumnDragOver : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDropColumn}
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
          tasks.map((task) => (
            <SwipeableTaskCardItem
              key={task.id}
              task={task}
              status={status}
              topics={topics}
              onCheckboxToggle={() => onCheckboxToggle(task)}
              onUpdateStatus={(st, rating) => onUpdateStatus(task, st, rating)}
              onUpdatePomodoros={onUpdatePomodoros}
              onDeleteTask={onDeleteTask}
              onTaskClick={onTaskClick}
              onDragStart={onDragStart}
              onDropOnTaskCard={(e) => onDropOnTaskCard(e, task)}
            />
          ))
        )}
      </div>
    </div>
  );
};

/* Swipeable Task Card Component with Drag Handle ⋮⋮⋮ on top line and Drop target support */
const SwipeableTaskCardItem: React.FC<{
  task: Task;
  status: TaskStatus;
  topics: any[];
  onCheckboxToggle: () => void;
  onUpdateStatus: (status: TaskStatus, smartRating?: SmartRating) => void;
  onUpdatePomodoros: (id: string, count: number) => void;
  onDeleteTask: (id: string) => void;
  onTaskClick: (task: Task) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDropOnTaskCard: (e: React.DragEvent) => void;
}> = ({
  task,
  status,
  topics,
  onCheckboxToggle,
  onUpdateStatus,
  onUpdatePomodoros,
  onDeleteTask,
  onTaskClick,
  onDragStart,
  onDropOnTaskCard,
}) => {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const [isDragOverCard, setIsDragOverCard] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.targetTouches[0].clientX;
    const diffX = currentX - touchStartX;
    if (diffX < 0) {
      setSwipeOffset(Math.max(-100, diffX));
    }
  };

  const handleTouchEnd = () => {
    if (swipeOffset < -60) {
      setSwipeOffset(-80);
    } else {
      setSwipeOffset(0);
    }
    setTouchStartX(null);
  };

  const isDone = task.status === 'Done';
  const isInProgress = task.status === 'InProgress';
  const linkedTopic = task.topicId ? topics.find((tp) => tp.id === task.topicId) : null;
  const activeDurationStr = formatActiveDuration(task);
  const currentPomo = task.pomodorosCount || 1;
  const activeRating = task.lastSmartRating;

  // Fractional & whole pomodoro options
  const pomodoroOptions = [
    { label: '⅓', val: 0.33 },
    { label: '½', val: 0.5 },
    { label: '1', val: 1 },
    { label: '2', val: 2 },
    { label: '3', val: 3 },
    { label: '4', val: 4 },
    { label: '5', val: 5 },
  ];

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-md)' }}>
      {/* Red Background Swipe-Left Delete Action */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          onDeleteTask(task.id);
        }}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '80px',
          backgroundColor: '#ef4444',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '12px',
          cursor: 'pointer',
          zIndex: 1,
          borderRadius: '0 var(--radius-md) var(--radius-md) 0',
          visibility: swipeOffset < 0 ? 'visible' : 'hidden',
          opacity: Math.min(1, Math.abs(swipeOffset) / 40),
        }}
        title="Нажмите для удаления"
      >
        🗑 Удалить
      </div>

      {/* Swipeable Task Card */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragOverCard(true);
        }}
        onDragLeave={() => setIsDragOverCard(false)}
        onDrop={(e) => {
          setIsDragOverCard(false);
          onDropOnTaskCard(e);
        }}
        onClick={() => onTaskClick(task)}
        className={`${styles.taskCard} ${isInProgress ? styles.taskCardInProgress : ''} ${
          isDone ? styles.taskCardDone : ''
        }`}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: touchStartX !== null ? 'none' : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          zIndex: 2,
          cursor: 'pointer',
          border: isDragOverCard ? '2px dashed #3b82f6' : undefined,
          backgroundColor: isDragOverCard ? 'rgba(59, 130, 246, 0.1)' : undefined,
        }}
        title="Нажмите для открытия Lifetime Grid и истории"
      >
        {/* Header Row: Checkbox on top line + Title with Category BELOW title + Drag Handle ⋮⋮⋮ at far right */}
        <div className={styles.cardHeader}>
          <div className={styles.cardMain}>
            <div onClick={(e) => e.stopPropagation()}>
              <Checkbox checked={isDone} onChange={onCheckboxToggle} />
            </div>

            {/* Title Container with Category BELOW title */}
            <div className={styles.titleContainer}>
              <span className={`${styles.cardTitle} ${isDone ? styles.cardTitleDone : ''}`}>
                {task.title}
              </span>
              <span className={styles.categoryBadgeBelow}>🏷 {task.category}</span>
            </div>
          </div>

          {/* Drag Handle ⋮⋮⋮ raised to top header line at far right */}
          <div
            className={styles.dragHandle}
            draggable
            onDragStart={(e) => onDragStart(e, task.id)}
            onClick={(e) => e.stopPropagation()}
            title="Зажмите ⋮⋮⋮ для перетаскивания"
          >
            ⋮⋮⋮
          </div>
        </div>

        {/* Topic & Short Link if present */}
        {(linkedTopic || task.link) && (
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap', fontSize: '11px' }}>
            {linkedTopic && (
              <Link
                href={`/topics/${linkedTopic.id}`}
                onClick={(e) => e.stopPropagation()}
                style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}
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
                  color: '#60a5fa',
                  textDecoration: 'none',
                  backgroundColor: 'rgba(96, 165, 250, 0.1)',
                  padding: '1px 5px',
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
          </div>
        )}

        {/* Meta Row: Active Duration & Fractional Pomodoro Options */}
        <div className={styles.metaRow}>
          <div className={styles.timeInfo}>
            {activeDurationStr && <span>⏱ ({activeDurationStr})</span>}
          </div>

          {/* Fractional & Whole Pomodoro Selector Row */}
          <div
            className={styles.pomodoroRow}
            onClick={(e) => e.stopPropagation()}
            title="Выбор количества помидоров"
          >
            <span style={{ fontSize: '15px', marginRight: '1px' }}>🍅</span>
            <div className={styles.pomodoroPillRow}>
              {pomodoroOptions.map((opt) => {
                const isSelected = Math.abs(currentPomo - opt.val) < 0.05;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    className={`${styles.pomoOptionBtn} ${isSelected ? styles.pomoOptionActive : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdatePomodoros(task.id, opt.val);
                    }}
                    title={`${opt.label} помидора`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Compact Quick Status Movement Buttons & Highlighted Rating Emoji Row */}
        <div className={styles.actionBtns} onClick={(e) => e.stopPropagation()}>
          {status !== 'Todo' && (
            <button
              className={styles.moveBtn}
              onClick={(e) => {
                e.stopPropagation();
                onUpdateStatus('Todo');
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
                onUpdateStatus('InProgress');
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
                onUpdateStatus('Done');
              }}
            >
              ✅ Выполнено
            </button>
          )}

          {/* Smart Rating Emoji Buttons with Highlighted Active State */}
          {isDone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
              <button
                type="button"
                className={`${styles.ratingEmojiBtn} ${activeRating === 'easy' ? styles.ratingEmojiSelected : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateStatus('Done', 'easy');
                }}
                title="Легко"
              >
                😄
              </button>
              <button
                type="button"
                className={`${styles.ratingEmojiBtn} ${activeRating === 'normal' ? styles.ratingEmojiSelected : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateStatus('Done', 'normal');
                }}
                title="Нормально"
              >
                🙂
              </button>
              <button
                type="button"
                className={`${styles.ratingEmojiBtn} ${activeRating === 'hard' ? styles.ratingEmojiSelected : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateStatus('Done', 'hard');
                }}
                title="Сложно"
              >
                😣
              </button>
              <button
                type="button"
                className={`${styles.ratingEmojiBtn} ${activeRating === 'again' ? styles.ratingEmojiSelected : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateStatus('Done', 'again');
                }}
                title="Не помню"
              >
                ❌
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
