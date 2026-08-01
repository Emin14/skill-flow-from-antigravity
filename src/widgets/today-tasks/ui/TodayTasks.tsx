'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Checkbox, Typography } from '@/shared/ui';
import { useTaskStore } from '@/entities/task';
import { Task, TaskStatus } from '@/entities/task/model/types';
import { EditTaskModal } from '@/features/edit-task/ui/EditTaskModal';
import { RepeatingTaskDetailModal } from '@/features/edit-task/ui/RepeatingTaskDetailModal';
import { SmartRatingModal } from '@/features/smart-rating-modal/ui/SmartRatingModal';
import { SmartRating } from '@/shared/config/repetitionRules';
import styles from './TodayTasks.module.css';

export const TodayTasks: React.FC = () => {
  const { tasks, isLoading, fetchTasks, updateTaskStatus, updateTaskParent, toggleTaskStatus } = useTaskStore();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [smartTask, setSmartTask] = useState<Task | null>(null);

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

  const handleDropOnTask = (draggedTaskId: string, targetParentTask: Task) => {
    if (draggedTaskId !== targetParentTask.id) {
      updateTaskParent(draggedTaskId, targetParentTask.id);
    }
  };

  // Checkbox Toggle: Todo -> Done DIRECTLY (or Done -> Todo)
  const handleToggleCheckbox = (task: Task) => {
    if (task.status !== 'Done') {
      if (task.isRepeating) {
        setSmartTask(task);
      } else {
        updateTaskStatus(task.id, 'Done');
      }
    } else {
      updateTaskStatus(task.id, 'Todo');
    }
  };

  // Right Swipe Status Progression: Todo -> InProgress -> Done -> Todo
  const handleNextStatus = (task: Task) => {
    let nextStatus: TaskStatus = 'Todo';
    if (task.status === 'Todo') {
      nextStatus = 'InProgress';
    } else if (task.status === 'InProgress') {
      nextStatus = 'Done';
    } else if (task.status === 'Done') {
      nextStatus = 'Todo';
    }

    if (nextStatus === 'Done' && task.isRepeating) {
      setSmartTask(task);
    } else {
      updateTaskStatus(task.id, nextStatus);
    }
  };

  const handleSelectSmartRating = (rating: SmartRating) => {
    if (smartTask) {
      updateTaskStatus(smartTask.id, 'Done', rating);
      setSmartTask(null);
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
            allTasks={todayTasks}
            onDropStage={(e) => handleDropToStage(e, 'Todo')}
            onDropOnTask={handleDropOnTask}
            onOpenCard={handleCardClick}
            onToggleCheckbox={handleToggleCheckbox}
            onNextStatus={handleNextStatus}
          />

          {/* Stage 2: ⏳ В процессе (InProgress) */}
          <KanbanStageSection
            title="⏳ В процессе"
            sectionClass={styles.stageSectionInProgress}
            headerClass={styles.stageHeaderInProgress}
            tasksList={inProgressTasks}
            allTasks={todayTasks}
            onDropStage={(e) => handleDropToStage(e, 'InProgress')}
            onDropOnTask={handleDropOnTask}
            onOpenCard={handleCardClick}
            onToggleCheckbox={handleToggleCheckbox}
            onNextStatus={handleNextStatus}
          />

          {/* Stage 3: ✅ Выполнено (Done) */}
          <KanbanStageSection
            title="✅ Выполнено"
            sectionClass={styles.stageSectionDone}
            headerClass={styles.stageHeaderDone}
            tasksList={doneTasks}
            allTasks={todayTasks}
            onDropStage={(e) => handleDropToStage(e, 'Done')}
            onDropOnTask={handleDropOnTask}
            onOpenCard={handleCardClick}
            onToggleCheckbox={handleToggleCheckbox}
            onNextStatus={handleNextStatus}
          />
        </div>
      )}

      {/* Edit Task Modal */}
      <EditTaskModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
      />

      {/* Task Detail Modal */}
      <RepeatingTaskDetailModal
        task={detailTask}
        isOpen={!!detailTask}
        onClose={() => setDetailTask(null)}
        onOpenEdit={() => {
          setEditingTask(detailTask);
          setDetailTask(null);
        }}
      />

      {/* Smart Completion Rating Modal */}
      <SmartRatingModal
        task={smartTask}
        isOpen={!!smartTask}
        onClose={() => setSmartTask(null)}
        onSelectRating={handleSelectSmartRating}
      />
    </div>
  );
};

interface KanbanStageSectionProps {
  title: string;
  sectionClass: string;
  headerClass: string;
  tasksList: Task[];
  allTasks: Task[];
  onDropStage: (e: React.DragEvent) => void;
  onDropOnTask: (draggedTaskId: string, targetParentTask: Task) => void;
  onOpenCard: (task: Task) => void;
  onToggleCheckbox: (task: Task) => void;
  onNextStatus: (task: Task) => void;
}

const KanbanStageSection: React.FC<KanbanStageSectionProps> = ({
  title,
  sectionClass,
  headerClass,
  tasksList,
  allTasks,
  onDropStage,
  onDropOnTask,
  onOpenCard,
  onToggleCheckbox,
  onNextStatus,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  // Top-level root tasks in this stage
  const rootTasksInStage = useMemo(() => {
    return tasksList.filter((t) => !t.parentTaskId);
  }, [tasksList]);

  // REQUIREMENT 1: Recursive Subtask Rendering for Unlimited Nesting Levels!
  const renderSubtasksRecursive = (parentId: string, depthLevel = 1): React.ReactNode => {
    const children = allTasks.filter((t) => t.parentTaskId === parentId);
    if (children.length === 0) return null;

    return children.map((subtask) => (
      <React.Fragment key={subtask.id}>
        <div className={styles.subtaskIndent} style={{ marginLeft: `${depthLevel * 16}px` }}>
          <div className={styles.subtaskConnector} />
          <TaskCardItem
            task={subtask}
            onOpenCard={() => onOpenCard(subtask)}
            onDropOnTask={onDropOnTask}
            onToggleCheckbox={() => onToggleCheckbox(subtask)}
            onNextStatus={() => onNextStatus(subtask)}
          />
        </div>
        {/* Recursive call for nested sub-subtasks */}
        {renderSubtasksRecursive(subtask.id, depthLevel + 1)}
      </React.Fragment>
    ));
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
      {/* Collapsible Accordion Header */}
      <div
        className={`${styles.stageHeader} ${headerClass}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Нажмите чтобы развернуть/свернуть список"
      >
        <div className={styles.headerTitleGroup}>
          <span>{title}</span>
          <span className={`${styles.accordionArrow} ${isOpen ? styles.accordionArrowOpen : ''}`}>
            ▼
          </span>
        </div>
        <span className={styles.stageBadge}>{tasksList.length}</span>
      </div>

      {/* Accordion Content */}
      {isOpen && (
        <>
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
                  <TaskCardItem
                    task={task}
                    onOpenCard={() => onOpenCard(task)}
                    onDropOnTask={onDropOnTask}
                    onToggleCheckbox={() => onToggleCheckbox(task)}
                    onNextStatus={() => onNextStatus(task)}
                  />

                  {/* Recursive Multi-Level Subtasks */}
                  {renderSubtasksRecursive(task.id, 1)}
                </React.Fragment>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

interface TaskCardItemProps {
  task: Task;
  onOpenCard: () => void;
  onDropOnTask: (draggedTaskId: string, targetParentTask: Task) => void;
  onToggleCheckbox: () => void;
  onNextStatus: () => void;
}

const TaskCardItem: React.FC<TaskCardItemProps> = ({
  task,
  onOpenCard,
  onDropOnTask,
  onToggleCheckbox,
  onNextStatus,
}) => {
  const { deleteTask } = useTaskStore();

  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isSwipedLeft, setIsSwipedLeft] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isOverTarget, setIsOverTarget] = useState<boolean>(false);

  const isDone = task.status === 'Done';

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
      } else if (diff < 0 && diff >= -80) {
        setSwipeOffset(-diff / 2);
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
      } else if (diff < -45) {
        onNextStatus();
        setSwipeOffset(0);
      } else {
        setSwipeOffset(0);
      }
    }
    setTouchStartX(null);
  };

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleTaskDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOverTarget(true);
  };

  const handleTaskDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOverTarget(false);
  };

  const handleTaskDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOverTarget(false);
    const draggedTaskId = e.dataTransfer.getData('text/plain');
    if (draggedTaskId && draggedTaskId !== task.id) {
      onDropOnTask(draggedTaskId, task);
    }
  };

  return (
    <div
      className={`${styles.taskCardWrapper} ${isOverTarget ? styles.taskCardDropTarget : ''}`}
      onDragOver={handleTaskDragOver}
      onDragLeave={handleTaskDragLeave}
      onDrop={handleTaskDrop}
    >
      {/* Swipe Delete Action: Centered text WITHOUT trash icon */}
      <div className={styles.deleteSwipeAction} onClick={() => deleteTask(task.id)}>
        Удалить
      </div>

      {/* Main Ultra-Slim Unified Card */}
      <div
        className={`${styles.taskCard} ${isDragging ? styles.taskCardDragging : ''}`}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={onOpenCard}
      >
        {/* Line 1: Checkbox, Title & Drag handle */}
        <div className={styles.cardHeaderRow}>
          <div className={styles.titleArea}>
            <div onClick={(e) => { e.stopPropagation(); onToggleCheckbox(); }}>
              <Checkbox checked={isDone} onChange={() => {}} />
            </div>
            <span className={`${styles.taskTitle} ${isDone ? styles.taskTitleDone : ''}`}>
              {task.title}
            </span>
          </div>

          <div
            className={styles.dragHandleTop}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            title="Перетащите, чтобы переместить или сделать подзадачей"
            onClick={(e) => e.stopPropagation()}
          >
            ⋮⋮⋮
          </div>
        </div>

        {/* Line 2: Category Badge ONLY without border outline & NO date display */}
        <div className={styles.metaInlineRow}>
          <span className={styles.categoryBadgeNoBorder}>🏷 {task.category}</span>
        </div>
      </div>
    </div>
  );
};
