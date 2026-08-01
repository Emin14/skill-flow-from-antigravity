'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Typography } from '@/shared/ui';
import { useTaskStore, GlassmorphicTaskCard } from '@/entities/task';
import { Task, TaskStatus } from '@/entities/task/model/types';
import { SmartRating } from '@/shared/config/repetitionRules';
import { EditTaskModal } from '@/features/edit-task/ui/EditTaskModal';
import { RepeatingTaskDetailModal } from '@/features/edit-task/ui/RepeatingTaskDetailModal';
import { SmartRatingModal } from '@/features/smart-rating-modal/ui/SmartRatingModal';
import {
  Sun,
  Clock,
  CheckCircle2,
  Brain,
  Zap,
  PartyPopper,
  ChevronDown,
} from 'lucide-react';
import styles from './TodayTasks.module.css';

type ViewMode = 'all' | 'actions' | 'repeats';

const getTodayStr = () => new Date().toISOString().split('T')[0];

export const TodayTasks: React.FC = () => {
  const { tasks, isLoading, fetchTasks, updateTaskStatus, toggleTaskStatus, updateTaskParent, deleteTask } = useTaskStore();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [smartTask, setSmartTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [todayStr, setTodayStr] = useState<string>(getTodayStr());

  // BUG-HIGH-08: Midnight auto-update timer
  useEffect(() => {
    fetchTasks();
    const interval = setInterval(() => {
      const nowStr = getTodayStr();
      if (nowStr !== todayStr) {
        setTodayStr(nowStr);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchTasks, todayStr]);

  // Tasks scheduled for today or overdue
  const rawTodayTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (t.isRepeating) {
        return t.occurrences?.some((o) => o.date <= todayStr) || (t.scheduledDate && t.scheduledDate <= todayStr);
      }
      if (!t.scheduledDate || t.scheduledDate === '' || t.scheduledDate === 'anytime') return false;
      return t.scheduledDate <= todayStr;
    });
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

  // Helper to determine status of task for today
  const getTaskStatusForToday = (t: Task): TaskStatus => {
    if (t.isRepeating) {
      const occ = t.occurrences?.find((o) => o.date === todayStr) || t.occurrences?.find((o) => o.date <= todayStr);
      return occ ? occ.status : 'Todo';
    }
    return t.status;
  };

  // Group tasks by Kanban Stages: Todo, InProgress, Done
  const todoTasks = useMemo(() => todayTasks.filter((t) => getTaskStatusForToday(t) === 'Todo'), [todayTasks, todayStr]);
  const inProgressTasks = useMemo(() => todayTasks.filter((t) => getTaskStatusForToday(t) === 'InProgress'), [todayTasks, todayStr]);
  const doneTasks = useMemo(() => todayTasks.filter((t) => getTaskStatusForToday(t) === 'Done'), [todayTasks, todayStr]);

  // PM FEATURE: 100% Today Tasks Celebration Condition
  const is100PercentDone = useMemo(() => {
    return rawTodayTasks.length > 0 && rawTodayTasks.every((t) => getTaskStatusForToday(t) === 'Done');
  }, [rawTodayTasks, todayStr]);

  const handleCardClick = (task: Task) => {
    setDetailTask(task);
  };

  const handleDropToStage = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    const draggedTaskId = e.dataTransfer.getData('text/plain');
    if (draggedTaskId) {
      updateTaskStatus(draggedTaskId, targetStatus, undefined, todayStr);
    }
  };

  const handleDropOnTask = (draggedTaskId: string, targetParentTask: Task) => {
    if (draggedTaskId === targetParentTask.id) return;
    updateTaskParent(draggedTaskId, targetParentTask.id);
  };

  const handleToggleCheckbox = (task: Task, isCurrentlyDone?: boolean) => {
    const isDoneNow = isCurrentlyDone !== undefined ? isCurrentlyDone : getTaskStatusForToday(task) === 'Done';
    if (isDoneNow) {
      // Un-checking completed task: ALWAYS toggle directly to Todo, NEVER open rating modal!
      toggleTaskStatus(task.id, undefined, todayStr);
    } else if (task.repetitionMode === 'smart' || task.repetitionMode === 'spaced') {
      // Completing task: Open rating modal if smart or spaced repetition
      setSmartTask(task);
    } else {
      toggleTaskStatus(task.id, undefined, todayStr);
    }
  };

  const handleSelectSmartRating = (rating: SmartRating) => {
    if (smartTask) {
      updateTaskStatus(smartTask.id, 'Done', rating, todayStr);
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
                100% ({doneTasks.length}/{rawTodayTasks.length})
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
            todayStr={todayStr}
            onDropStage={(e) => handleDropToStage(e, 'Todo')}
            onDropOnTask={handleDropOnTask}
            onOpenCard={handleCardClick}
            onToggleCheckbox={(t) => handleToggleCheckbox(t, false)}
            onDelete={(id) => deleteTask(id)}
            onCompleteParent={(id) => updateTaskStatus(id, 'Done', undefined, todayStr)}
          />

          {/* Stage 2: В процессе (InProgress) */}
          <KanbanStageSection
            title="В процессе"
            icon={<Clock size={15} color="#f59e0b" />}
            sectionClass={styles.stageSectionInProgress}
            headerClass={styles.stageHeaderInProgress}
            tasksList={inProgressTasks}
            allTasks={todayTasks}
            todayStr={todayStr}
            onDropStage={(e) => handleDropToStage(e, 'InProgress')}
            onDropOnTask={handleDropOnTask}
            onOpenCard={handleCardClick}
            onToggleCheckbox={(t) => handleToggleCheckbox(t, false)}
            onDelete={(id) => deleteTask(id)}
            onCompleteParent={(id) => updateTaskStatus(id, 'Done', undefined, todayStr)}
          />

          {/* Stage 3: Выполнено (Done) */}
          <KanbanStageSection
            title="Выполнено"
            icon={<CheckCircle2 size={15} color="#10b981" />}
            sectionClass={styles.stageSectionDone}
            headerClass={styles.stageHeaderDone}
            tasksList={doneTasks}
            allTasks={todayTasks}
            todayStr={todayStr}
            onDropStage={(e) => handleDropToStage(e, 'Done')}
            onDropOnTask={handleDropOnTask}
            onOpenCard={handleCardClick}
            onToggleCheckbox={(t) => handleToggleCheckbox(t, true)}
            onDelete={(id) => deleteTask(id)}
            onCompleteParent={(id) => updateTaskStatus(id, 'Done', undefined, todayStr)}
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
  todayStr: string;
  onDropStage: (e: React.DragEvent) => void;
  onDropOnTask: (draggedTaskId: string, targetParentTask: Task) => void;
  onOpenCard: (task: Task) => void;
  onToggleCheckbox: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onCompleteParent: (taskId: string) => void;
}

const KanbanStageSection: React.FC<KanbanStageSectionProps> = ({
  title,
  icon,
  sectionClass,
  headerClass,
  tasksList,
  allTasks,
  todayStr,
  onDropStage,
  onDropOnTask,
  onOpenCard,
  onToggleCheckbox,
  onDelete,
  onCompleteParent,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const stageTaskIds = useMemo(() => new Set(tasksList.map((t) => t.id)), [tasksList]);

  const rootTasksInStage = useMemo(() => {
    return tasksList.filter((t) => !t.parentTaskId || !stageTaskIds.has(t.parentTaskId));
  }, [tasksList, stageTaskIds]);

  const renderSubtasksRecursive = (parentId: string, depthLevel = 1, visited = new Set<string>()): React.ReactNode => {
    if (depthLevel > 10 || visited.has(parentId)) return null;
    visited.add(parentId);

    const children = allTasks.filter((t) => t.parentTaskId === parentId);
    if (children.length === 0) return null;

    return children.map((subtask) => (
      <React.Fragment key={subtask.id}>
        <div className={styles.subtaskIndent} style={{ marginLeft: `${Math.min(depthLevel, 4) * 16}px` }}>
          <div className={styles.subtaskConnector} />
          <GlassmorphicTaskCard
            task={subtask}
            occurrenceDate={todayStr}
            allTasks={allTasks}
            showDragHandle={true}
            onToggleCheckbox={() => onToggleCheckbox(subtask)}
            onDelete={() => onDelete(subtask.id)}
            onClick={() => onOpenCard(subtask)}
            onDropOnTask={onDropOnTask}
            onCompleteParent={() => onCompleteParent(subtask.id)}
          />
        </div>
        {renderSubtasksRecursive(subtask.id, depthLevel + 1, new Set(visited))}
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
                  <GlassmorphicTaskCard
                    task={task}
                    occurrenceDate={todayStr}
                    allTasks={allTasks}
                    showDragHandle={true}
                    onToggleCheckbox={() => onToggleCheckbox(task)}
                    onDelete={() => onDelete(task.id)}
                    onClick={() => onOpenCard(task)}
                    onDropOnTask={onDropOnTask}
                    onCompleteParent={() => onCompleteParent(task.id)}
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
