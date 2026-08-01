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
  const { tasks, isLoading, fetchTasks, updateTaskStatus, updateTaskParent } = useTaskStore();
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

  // Convert Task A to subtask of Task B on drop
  const handleDropOnTask = (draggedTaskId: string, targetParentTask: Task) => {
    if (draggedTaskId !== targetParentTask.id) {
      updateTaskParent(draggedTaskId, targetParentTask.id);
    }
  };

  // Right Swipe Status Progression
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

  const handleSelectSmartRating = (rating: SmartRating, pomodorosCount?: number) => {
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
            onDropStage={(e) => handleDropToStage(e, 'Todo')}
            onDropOnTask={handleDropOnTask}
            onOpenCard={handleCardClick}
            onNextStatus={handleNextStatus}
          />

          {/* Stage 2: ⏳ В процессе (InProgress) */}
          <KanbanStageSection
            title="⏳ В процессе"
            sectionClass={styles.stageSectionInProgress}
            headerClass={styles.stageHeaderInProgress}
            tasksList={inProgressTasks}
            onDropStage={(e) => handleDropToStage(e, 'InProgress')}
            onDropOnTask={handleDropOnTask}
            onOpenCard={handleCardClick}
            onNextStatus={handleNextStatus}
          />

          {/* Stage 3: ✅ Выполнено (Done) */}
          <KanbanStageSection
            title="✅ Выполнено"
            sectionClass={styles.stageSectionDone}
            headerClass={styles.stageHeaderDone}
            tasksList={doneTasks}
            onDropStage={(e) => handleDropToStage(e, 'Done')}
            onDropOnTask={handleDropOnTask}
            onOpenCard={handleCardClick}
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
  onDropStage: (e: React.DragEvent) => void;
  onDropOnTask: (draggedTaskId: string, targetParentTask: Task) => void;
  onOpenCard: (task: Task) => void;
  onNextStatus: (task: Task) => void;
}

const KanbanStageSection: React.FC<KanbanStageSectionProps> = ({
  title,
  sectionClass,
  headerClass,
  tasksList,
  onDropStage,
  onDropOnTask,
  onOpenCard,
  onNextStatus,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

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
                    onNextStatus={() => onNextStatus(task)}
                  />

                  {/* Subtasks under this stage */}
                  {getSubtasksInStage(task.id).map((subtask) => (
                    <div key={subtask.id} className={styles.subtaskIndent}>
                      <div className={styles.subtaskConnector} />
                      <TaskCardItem
                        task={subtask}
                        onOpenCard={() => onOpenCard(subtask)}
                        onDropOnTask={onDropOnTask}
                        onNextStatus={() => onNextStatus(subtask)}
                      />
                    </div>
                  ))}
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
  onNextStatus: () => void;
}

const TaskCardItem: React.FC<TaskCardItemProps> = ({
  task,
  onOpenCard,
  onDropOnTask,
  onNextStatus,
}) => {
  const { deleteTask } = useTaskStore();

  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isSwipedLeft, setIsSwipedLeft] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isOverTarget, setIsOverTarget] = useState<boolean>(false);

  const isDone = task.status === 'Done';

  // FIX: Strict swipe logic separating delete panel dismissal from stage status progression
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.targetTouches[0].clientX;
    const diff = touchStartX - currentX;

    if (isSwipedLeft) {
      // Currently in swiped-left state (delete button open at -80px)
      // Dragging right (diff < 0) pulls the card back towards 0
      const newOffset = Math.min(0, Math.max(-80, -80 - diff));
      setSwipeOffset(newOffset);
    } else {
      // Currently in normal state (0px)
      if (diff > 0 && diff <= 80) {
        // Swiping Left -> preview delete action
        setSwipeOffset(-diff);
      } else if (diff < 0 && diff >= -80) {
        // Swiping Right -> preview status advance
        setSwipeOffset(-diff / 2);
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (isSwipedLeft) {
      // Card WAS swiped left (delete button was open)
      // Any gesture closes the delete panel WITHOUT advancing status stage!
      setIsSwipedLeft(false);
      setSwipeOffset(0);
    } else {
      // Card WAS in normal state
      if (diff > 45) {
        // Swiped left -> open delete button
        setIsSwipedLeft(true);
        setSwipeOffset(-80);
      } else if (diff < -45) {
        // Swiped right -> advance status stage!
        setIsSwipedLeft(false);
        setSwipeOffset(0);
        onNextStatus();
      } else {
        setIsSwipedLeft(false);
        setSwipeOffset(0);
      }
    }
    setTouchStartX(null);
  };

  // Full card drag motion & nesting drop target
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setIsOverTarget(false);
  };

  const handleDragOverCard = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOverTarget(true);
  };

  const handleDragLeaveCard = () => {
    setIsOverTarget(false);
  };

  const handleDropOnCard = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOverTarget(false);
    const draggedTaskId = e.dataTransfer.getData('text/plain');
    if (draggedTaskId && draggedTaskId !== task.id) {
      onDropOnTask(draggedTaskId, task);
    }
  };

  return (
    <div className={styles.taskCardWrapper}>
      {/* Background Swipe Delete Action: Centered text WITHOUT trash icon */}
      <div
        className={styles.deleteSwipeAction}
        onClick={() => deleteTask(task.id)}
      >
        Удалить
      </div>

      {/* Main Ultra-Slim Task Card */}
      <div
        className={`${styles.taskCard} ${isDragging ? styles.taskCardDragging : ''} ${isOverTarget ? styles.taskCardDropTarget : ''}`}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOverCard}
        onDragLeave={handleDragLeaveCard}
        onDrop={handleDropOnCard}
        onClick={onOpenCard}
      >
        {/* Line 1: Checkbox, Title & Drag Handle */}
        <div className={styles.cardHeaderRow}>
          <div className={styles.titleArea}>
            <div onClick={(e) => { e.stopPropagation(); onNextStatus(); }}>
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
          <span className={styles.categoryBadgeNoBorder}>🏷 {task.category}</span>
        </div>
      </div>
    </div>
  );
};
