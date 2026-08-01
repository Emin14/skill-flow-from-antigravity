'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Checkbox, Typography } from '@/shared/ui';
import { useTaskStore } from '@/entities/task';
import { Task, TaskStatus } from '@/entities/task/model/types';
import { EditTaskModal } from '@/features/edit-task/ui/EditTaskModal';
import { RepeatingTaskDetailModal } from '@/features/edit-task/ui/RepeatingTaskDetailModal';
import { SmartRatingModal } from '@/features/smart-rating-modal/ui/SmartRatingModal';
import { SmartRating } from '@/shared/config/repetitionRules';
import { Sun, Clock, CheckCircle2, Tag, GripVertical, PartyPopper, ChevronDown, Zap, Brain, Check } from 'lucide-react';
import styles from './TodayTasks.module.css';

type ViewMode = 'all' | 'actions' | 'repeats';

export const TodayTasks: React.FC = () => {
  const { tasks, isLoading, fetchTasks, updateTaskStatus, updateTaskParent } = useTaskStore();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [smartTask, setSmartTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('all');

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Tasks scheduled for today or overdue
  const rawTodayTasks = useMemo(() => {
    return tasks.filter((t) => !t.scheduledDate || t.scheduledDate <= todayStr);
  }, [tasks, todayStr]);

  // Filter today's tasks based on active UI Tab (All / Actions / Flashcards)
  const todayTasks = useMemo(() => {
    if (viewMode === 'actions') {
      return rawTodayTasks.filter((t) => !t.isRepeating);
    }
    if (viewMode === 'repeats') {
      return rawTodayTasks.filter((t) => t.isRepeating);
    }
    return rawTodayTasks;
  }, [rawTodayTasks, viewMode]);

  // Group tasks by Kanban Stages: Todo, InProgress, Done
  const todoTasks = useMemo(() => todayTasks.filter((t) => t.status === 'Todo'), [todayTasks]);
  const inProgressTasks = useMemo(() => todayTasks.filter((t) => t.status === 'InProgress'), [todayTasks]);
  const doneTasks = useMemo(() => todayTasks.filter((t) => t.status === 'Done'), [todayTasks]);

  // PM FEATURE: 100% Today Tasks Celebration Condition
  const is100PercentDone = useMemo(() => {
    return todayTasks.length > 0 && doneTasks.length === todayTasks.length;
  }, [todayTasks.length, doneTasks.length]);

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sun size={22} color="#f59e0b" />
          <Typography variant="h2">Сегодня</Typography>
        </div>

        {/* Clear Tab Switcher: All / ⚡ Actions / 🧠 Flashcards */}
        <div className={styles.viewTabBtnBar}>
          <button
            className={`${styles.viewTabBtn} ${viewMode === 'all' ? styles.viewTabBtnActive : ''}`}
            onClick={() => setViewMode('all')}
          >
            Все ({rawTodayTasks.length})
          </button>
          <button
            className={`${styles.viewTabBtn} ${viewMode === 'actions' ? styles.viewTabBtnActive : ''}`}
            onClick={() => setViewMode('actions')}
          >
            <Zap size={13} color="#f59e0b" />
            ⚡ Действия
          </button>
          <button
            className={`${styles.viewTabBtn} ${viewMode === 'repeats' ? styles.viewTabBtnActive : ''}`}
            onClick={() => setViewMode('repeats')}
          >
            <Brain size={13} color="#38bdf8" />
            🧠 Повторения
          </button>
        </div>
      </div>

      {/* PM FEATURE: Celebratory 100% Completion Banner */}
      {is100PercentDone && (
        <div className={styles.celebrationBanner}>
          <div className={styles.celebrationContent}>
            <PartyPopper size={32} color="#10b981" />
            <div>
              <div className={styles.celebrationTitle}>
                Все задачи на сегодня выполнены!
              </div>
              <div className={styles.celebrationSubtitle}>
                Отличная работа! День прошёл максимально продуктивно.
              </div>
            </div>
          </div>

          <div className={styles.progressBarContainer}>
            <div className={styles.progressBarHeader}>
              <span>Прогресс дня</span>
              <span className={styles.progressPercent}>
                100% ({doneTasks.length}/{todayTasks.length})
              </span>
            </div>
            <div className={styles.progressBarTrack}>
              <div className={styles.progressBarFill100} />
            </div>
          </div>
        </div>
      )}

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
          🌱 В этой категории нет задач на сегодня.
        </div>
      ) : (
        <div className={styles.kanbanStagesGrid}>
          {/* Stage 1: К выполнению (Todo) */}
          <KanbanStageSection
            title="К выполнению"
            icon={<Clock size={15} color="#60a5fa" />}
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

          {/* Stage 2: В процессе (InProgress) */}
          <KanbanStageSection
            title="В процессе"
            icon={<Clock size={15} color="#f59e0b" />}
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

          {/* Stage 3: Выполнено (Done) */}
          <KanbanStageSection
            title="Выполнено"
            icon={<CheckCircle2 size={15} color="#10b981" />}
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
  icon: React.ReactNode;
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
  icon,
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

  const rootTasksInStage = useMemo(() => {
    return tasksList.filter((t) => !t.parentTaskId);
  }, [tasksList]);

  const renderSubtasksRecursive = (parentId: string, depthLevel = 1): React.ReactNode => {
    const children = allTasks.filter((t) => t.parentTaskId === parentId);
    if (children.length === 0) return null;

    return children.map((subtask) => (
      <React.Fragment key={subtask.id}>
        <div className={styles.subtaskIndent} style={{ marginLeft: `${depthLevel * 16}px` }}>
          <div className={styles.subtaskConnector} />
          <TaskCardItem
            task={subtask}
            allTasks={allTasks}
            onOpenCard={() => onOpenCard(subtask)}
            onDropOnTask={onDropOnTask}
            onToggleCheckbox={() => onToggleCheckbox(subtask)}
            onNextStatus={() => onNextStatus(subtask)}
          />
        </div>
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
      <div
        className={`${styles.stageHeader} ${headerClass}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Нажмите чтобы развернуть/свернуть список"
      >
        <div className={styles.headerTitleGroup}>
          {icon}
          <span>{title}</span>
          <ChevronDown
            size={14}
            className={`${styles.accordionArrow} ${isOpen ? styles.accordionArrowOpen : ''}`}
          />
        </div>
        <span className={styles.stageBadge}>{tasksList.length}</span>
      </div>

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
                  <TaskCardItem
                    task={task}
                    allTasks={allTasks}
                    onOpenCard={() => onOpenCard(task)}
                    onDropOnTask={onDropOnTask}
                    onToggleCheckbox={() => onToggleCheckbox(task)}
                    onNextStatus={() => onNextStatus(task)}
                  />
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

// SVG Progress Ring Component for Parent Container Tasks
const SubtaskProgressRing: React.FC<{ total: number; done: number }> = ({ total, done }) => {
  const radius = 10;
  const strokeWidth = 2.5;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percent = total > 0 ? done / total : 0;
  const strokeDashoffset = circumference - percent * circumference;

  return (
    <div className={styles.progressRingContainer} title={`Прогресс подзадач: ${done}/${total}`}>
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="rgba(255, 255, 255, 0.12)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#0ea5e9"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.35s ease' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <span className={styles.progressRingText}>{done}/{total}</span>
    </div>
  );
};

interface TaskCardItemProps {
  task: Task;
  allTasks: Task[];
  onOpenCard: () => void;
  onDropOnTask: (draggedTaskId: string, targetParentTask: Task) => void;
  onToggleCheckbox: () => void;
  onNextStatus: () => void;
}

const TaskCardItem: React.FC<TaskCardItemProps> = ({
  task,
  allTasks,
  onOpenCard,
  onDropOnTask,
  onToggleCheckbox,
  onNextStatus,
}) => {
  const { deleteTask, updateTaskStatus } = useTaskStore();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isSwipedLeft, setIsSwipedLeft] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isOverTarget, setIsOverTarget] = useState<boolean>(false);

  const isDone = task.status === 'Done';

  // Subtasks progress calculation for parent containers
  const childSubtasks = useMemo(() => allTasks.filter((t) => t.parentTaskId === task.id), [allTasks, task.id]);
  const isContainer = task.hasSubtasks || childSubtasks.length > 0;
  const doneSubtasksCount = useMemo(() => childSubtasks.filter((t) => t.status === 'Done').length, [childSubtasks]);
  const areAllSubtasksDone = isContainer && childSubtasks.length > 0 && doneSubtasksCount === childSubtasks.length;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;
    const diffX = touchStartX - currentX;
    const diffY = touchStartY - currentY;

    if (Math.abs(diffY) > Math.abs(diffX) && !isSwipedLeft) {
      setSwipeOffset(0);
      return;
    }

    if (isSwipedLeft) {
      const newOffset = Math.min(0, Math.max(-80, -80 - diffX));
      setSwipeOffset(newOffset);
    } else {
      if (diffX > 0 && diffX <= 80) {
        setSwipeOffset(-diffX);
      } else if (diffX < 0 && diffX >= -80) {
        setSwipeOffset(-diffX / 2);
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
    setTouchStartY(null);
  };

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

  const handleTouchHandleStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleTouchHandleMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.touches[0];
    const targetElem = document.elementFromPoint(touch.clientX, touch.clientY);
    const cardWrapper = targetElem?.closest(`.${styles.taskCardWrapper}`);

    document.querySelectorAll(`.${styles.taskCardWrapper}`).forEach((el) => {
      if (el === cardWrapper && el !== wrapperRef.current) {
        el.classList.add(styles.taskCardDropTarget);
      } else {
        el.classList.remove(styles.taskCardDropTarget);
      }
    });
  };

  const handleTouchHandleEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(false);
    const touch = e.changedTouches[0];
    const targetElem = document.elementFromPoint(touch.clientX, touch.clientY);
    const cardWrapper = targetElem?.closest(`.${styles.taskCardWrapper}`);

    document.querySelectorAll(`.${styles.taskCardWrapper}`).forEach((el) => {
      el.classList.remove(styles.taskCardDropTarget);
    });

    if (cardWrapper) {
      const targetTaskId = cardWrapper.getAttribute('data-task-id');
      if (targetTaskId && targetTaskId !== task.id) {
        const targetTask = allTasks.find((t) => t.id === targetTaskId);
        if (targetTask) {
          onDropOnTask(task.id, targetTask);
        }
      }
    }
  };

  return (
    <div
      ref={wrapperRef}
      data-task-id={task.id}
      className={`${styles.taskCardWrapper} ${
        areAllSubtasksDone && !isDone ? styles.taskCardGlowContainer : ''
      } ${isOverTarget ? styles.taskCardDropTarget : ''}`}
      onDragOver={handleTaskDragOver}
      onDragLeave={handleTaskDragLeave}
      onDrop={handleTaskDrop}
    >
      <div className={styles.deleteSwipeAction} onClick={() => deleteTask(task.id)}>
        Удалить
      </div>

      <div
        className={`${styles.taskCard} ${isDragging ? styles.taskCardDragging : ''}`}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={onOpenCard}
      >
        <div className={styles.cardHeaderRow}>
          <div className={styles.titleArea}>
            {isContainer ? (
              <SubtaskProgressRing total={childSubtasks.length} done={doneSubtasksCount} />
            ) : (
              <div onClick={(e) => { e.stopPropagation(); onToggleCheckbox(); }}>
                <Checkbox checked={isDone} onChange={() => {}} />
              </div>
            )}
            <span className={`${styles.taskTitle} ${isDone ? styles.taskTitleDone : ''}`}>
              {task.title}
            </span>
          </div>

          <div
            className={styles.dragHandleTop}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onTouchStart={handleTouchHandleStart}
            onTouchMove={handleTouchHandleMove}
            onTouchEnd={handleTouchHandleEnd}
            title="Перетащите, чтобы переместить или сделать подзадачей"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical size={14} />
          </div>
        </div>

        <div className={styles.metaInlineRow}>
          <Tag size={12} color="var(--color-text-muted)" style={{ flexShrink: 0 }} />
          <span className={styles.categoryBadgeNoBorder}>{task.category}</span>
        </div>

        {/* Prompt Button when all subtasks of container are done */}
        {areAllSubtasksDone && !isDone && (
          <div
            className={styles.completeParentPromptBtn}
            onClick={(e) => {
              e.stopPropagation();
              updateTaskStatus(task.id, 'Done');
            }}
          >
            <span>✨ Все подзадачи готовы. Завершить "{task.title}"?</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Check size={13} /> Завершить
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
