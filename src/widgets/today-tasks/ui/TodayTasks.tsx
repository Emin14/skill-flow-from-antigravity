'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Checkbox, Typography } from '@/shared/ui';
import { useTaskStore } from '@/entities/task';
import { Task, TaskStatus } from '@/entities/task/model/types';
import { EditTaskModal } from '@/features/edit-task/ui/EditTaskModal';
import { RepeatingTaskDetailModal } from '@/features/edit-task/ui/RepeatingTaskDetailModal';
import styles from './TodayTasks.module.css';

export const TodayTasks: React.FC = () => {
  const { tasks, isLoading, fetchTasks, updateTaskStatus } = useTaskStore();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Tasks scheduled for today or overdue
  const todayTasks = useMemo(() => {
    return tasks.filter((t) => !t.scheduledDate || t.scheduledDate <= todayStr);
  }, [tasks, todayStr]);

  // Group tasks by Kanban Stages: Todo, InProgress, Done
  const todoTasks = useMemo(() => todayTasks.filter((t) => t.status === 'Todo'), [todayTasks]);
  const inProgressTasks = useMemo(() => todayTasks.filter((t) => t.status === 'InProgress'), [todayTasks]);
  const doneTasks = useMemo(() => todayTasks.filter((t) => t.status === 'Done'), [todayTasks]);

  const handleCardClick = (task: Task) => {
    setDetailTask(task);
  };

  const handleDropToStage = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      updateTaskStatus(taskId, targetStatus);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader}>
        <Typography variant="h2">☀️ Сегодня</Typography>
        <Typography variant="caption" style={{ color: 'var(--color-text-muted)' }}>
          Всего: {todayTasks.length} задач
        </Typography>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--color-text-muted)' }}>
          Загрузка задач...
        </div>
      ) : todayTasks.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--space-8)',
            borderRadius: '16px',
            border: '1px dashed var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
        >
          🌱 Нет задач на сегодня. Создайте новую задачу!
        </div>
      ) : (
        <div className={styles.kanbanStagesGrid}>
          {/* Stage 1: 📋 К выполнению (Todo) */}
          <KanbanStageSection
            title="📋 К выполнению"
            sectionClass={styles.stageSectionTodo}
            headerClass={styles.stageHeaderTodo}
            tasksList={todoTasks}
            onDropStage={(e) => handleDropToStage(e, 'Todo')}
            onOpenCard={handleCardClick}
          />

          {/* Stage 2: ⏳ В процессе (InProgress) */}
          <KanbanStageSection
            title="⏳ В процессе"
            sectionClass={styles.stageSectionInProgress}
            headerClass={styles.stageHeaderInProgress}
            tasksList={inProgressTasks}
            onDropStage={(e) => handleDropToStage(e, 'InProgress')}
            onOpenCard={handleCardClick}
          />

          {/* Stage 3: ✅ Выполнено (Done) */}
          <KanbanStageSection
            title="✅ Выполнено"
            sectionClass={styles.stageSectionDone}
            headerClass={styles.stageHeaderDone}
            tasksList={doneTasks}
            onDropStage={(e) => handleDropToStage(e, 'Done')}
            onOpenCard={handleCardClick}
          />
        </div>
      )}

      {/* Edit Task Modal */}
      <EditTaskModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
      />

      {/* Habit / Task Detail Modal */}
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

interface KanbanStageSectionProps {
  title: string;
  sectionClass: string;
  headerClass: string;
  tasksList: Task[];
  onDropStage: (e: React.DragEvent) => void;
  onOpenCard: (task: Task) => void;
}

const KanbanStageSection: React.FC<KanbanStageSectionProps> = ({
  title,
  sectionClass,
  headerClass,
  tasksList,
  onDropStage,
  onOpenCard,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const rootTasksInStage = useMemo(() => {
    return tasksList.filter((t) => !t.parentTaskId);
  }, [tasksList]);

  const getSubtasksInStage = (parentId: string) => {
    return tasksList.filter((t) => t.parentTaskId === parentId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    setIsDragOver(false);
    onDropStage(e);
  };

  return (
    <div
      className={`${styles.stageSection} ${sectionClass} ${isDragOver ? styles.stageSectionDragOver : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={`${styles.stageHeader} ${headerClass}`}>
        <span>{title}</span>
        <span className={styles.stageBadge}>{tasksList.length}</span>
      </div>

      {tasksList.length === 0 ? (
        <div
          style={{
            padding: '12px',
            textAlign: 'center',
            fontSize: '12px',
            color: 'var(--color-text-muted)',
            borderRadius: '12px',
            border: '1px dashed var(--color-border)',
          }}
        >
          Перетащите сюда задачи
        </div>
      ) : (
        <div className={styles.taskList}>
          {rootTasksInStage.map((task) => (
            <React.Fragment key={task.id}>
              {/* Parent Task Card */}
              <TaskCardItem task={task} onOpenCard={() => onOpenCard(task)} />

              {/* Subtasks under this stage */}
              {getSubtasksInStage(task.id).map((subtask) => (
                <div key={subtask.id} className={styles.subtaskIndent}>
                  <div className={styles.subtaskConnector} />
                  <TaskCardItem task={subtask} onOpenCard={() => onOpenCard(subtask)} />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

interface TaskCardItemProps {
  task: Task;
  onOpenCard: () => void;
}

const TaskCardItem: React.FC<TaskCardItemProps> = ({ task, onOpenCard }) => {
  const { updateTaskStatus, deleteTask } = useTaskStore();

  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isSwipedLeft, setIsSwipedLeft] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const isDone = task.status === 'Done';

  // Touch Swipe Handlers (Swipe left reveals delete, swipe right cancels!)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.targetTouches[0].clientX;
    const diff = touchStartX - currentX;

    if (diff > 0 && diff <= 80) {
      setSwipeOffset(-diff);
    } else if (diff < 0 && isSwipedLeft) {
      const remaining = -80 - diff;
      setSwipeOffset(Math.min(0, remaining));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 45) {
      setIsSwipedLeft(true);
      setSwipeOffset(-80);
    } else {
      setIsSwipedLeft(false);
      setSwipeOffset(0);
    }
    setTouchStartX(null);
  };

  // Drag and Drop
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className={styles.taskCardWrapper}>
      {/* Background Swipe Delete Action */}
      <div
        className={styles.deleteSwipeAction}
        onClick={() => deleteTask(task.id)}
      >
        🗑 Удалить
      </div>

      {/* Main Ultra-Slim Task Card */}
      <div
        className={`${styles.taskCard} ${isDragging ? styles.taskCardDragging : ''}`}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={onOpenCard}
      >
        {/* Line 1: Checkbox, Title & Drag Handle */}
        <div className={styles.cardHeaderRow}>
          <div className={styles.titleArea}>
            <div onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={isDone}
                onChange={() => updateTaskStatus(task.id, isDone ? 'Todo' : 'Done')}
              />
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

        {/* Line 2: Category, Scheduled Date, and Compact Status Select Badge */}
        <div className={styles.metaInlineRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className={styles.categoryBadge}>🏷 {task.category}</span>
            {task.scheduledDate && (
              <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                📅 {task.scheduledDate}
              </span>
            )}
          </div>

          {/* Elegant Status Select Badge */}
          <select
            className={`${styles.statusSelectBadge} ${
              task.status === 'Todo'
                ? styles.statusSelectBadgeTodo
                : task.status === 'InProgress'
                ? styles.statusSelectBadgeInProgress
                : styles.statusSelectBadgeDone
            }`}
            value={task.status}
            onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
            onClick={(e) => e.stopPropagation()}
          >
            <option value="Todo">📋 К вып.</option>
            <option value="InProgress">⏳ В процессе</option>
            <option value="Done">✅ Готово</option>
          </select>
        </div>
      </div>
    </div>
  );
};
