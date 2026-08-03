'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Typography } from '@/shared/ui';
import { useTaskStore, GlassmorphicTaskCard } from '@/entities/task';
import { Task, TaskStatus } from '@/entities/task/model/types';
import { SmartRating } from '@/shared/config/repetitionRules';
import { EditTaskModal } from '@/features/edit-task/ui/EditTaskModal';
import { RepeatingTaskDetailModal } from '@/features/edit-task/ui/RepeatingTaskDetailModal';
import { SmartRatingModal } from '@/features/smart-rating-modal/ui/SmartRatingModal';
import { getTodayStr } from '@/shared/lib/dateUtils';
import { STORAGE_KEYS } from '@/shared/config/storageKeys';
import { useTaskModals } from '@/shared/hooks/useTaskModals';
import { useMidnightRefresh } from '@/shared/hooks/useMidnightRefresh';
import { DaySwitcherShowcase } from '@/features/day-switcher-showcase/ui/DaySwitcherShowcase';
import {
  Sun,
  PartyPopper,
} from 'lucide-react';
import styles from './TodayTasks.module.css';
import { applyCategoryTextTheme, applyCardBgTheme } from '@/shared/config/categoryColors';

type StatusFilter = 'Todo' | 'InProgress' | 'Done';

interface TodayTasksProps {
  showDaySwitcher?: boolean;
}

export const TodayTasks: React.FC<TodayTasksProps> = ({ showDaySwitcher = true }) => {
  const { tasks, isLoading, fetchTasks, updateTaskStatus, toggleTaskStatus, updateTaskParent, deleteTask, deleteTaskOccurrence } = useTaskStore();
  const {
    editingTask, detailTask, smartTask,
    openEditModal, openDetailModal, openSmartModal,
    closeEditModal, closeDetailModal, closeSmartModal,
  } = useTaskModals();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Todo');
  const [todayStr, setTodayStr] = useState<string>(getTodayStr());
  const [daySwitcherVariant, setDaySwitcherVariant] = useState<'12' | '19'>('12');

  useEffect(() => {
    const savedCatId = localStorage.getItem(STORAGE_KEYS.CATEGORY_THEME_ID) || 'amber';
    const savedBgId = localStorage.getItem(STORAGE_KEYS.CARD_BG_THEME_ID) || 'classic';
    const savedVariant = (localStorage.getItem(STORAGE_KEYS.DAY_SWITCHER_VARIANT) || '12') as '12' | '19';
    applyCategoryTextTheme(savedCatId);
    applyCardBgTheme(savedBgId);
    setDaySwitcherVariant(savedVariant);

    const handleStorageChange = () => {
      const updatedVariant = (localStorage.getItem(STORAGE_KEYS.DAY_SWITCHER_VARIANT) || '12') as '12' | '19';
      setDaySwitcherVariant(updatedVariant);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // Midnight auto-update: обновляет todayStr при смене суток
  useMidnightRefresh(() => setTodayStr(getTodayStr()));

  // Tasks scheduled strictly for today (EXCLUDING parent tasks with subtasks)
  const rawTodayTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Exclude main tasks with subtasks (they belong strictly in Projects section)
      const hasChildren = tasks.some((sub) => sub.parentTaskId === t.id);
      if (t.hasSubtasks || hasChildren) return false;

      // Handle repeating task occurrences scheduled for today
      if (t.isRepeating) {
        const hasTodayOcc = t.occurrences?.some((o) => o.date === todayStr);
        return hasTodayOcc || t.scheduledDate === todayStr;
      }
      return t.scheduledDate === todayStr;
    });
  }, [tasks, todayStr]);

  // Helper to determine status of task for today
  const getTaskStatusForToday = (t: Task): TaskStatus => {
    if (t.isRepeating) {
      const occ = t.occurrences?.find((o) => o.date === todayStr);
      if (occ) return occ.status;
      const legacyOcc = t.repetitionHistory?.find((h) => h.date === todayStr);
      if (legacyOcc) return legacyOcc.completed ? 'Done' : 'Todo';
      return 'Todo';
    }
    return t.status;
  };

  const todoTasks = useMemo(() => rawTodayTasks.filter((t) => getTaskStatusForToday(t) === 'Todo'), [rawTodayTasks, todayStr]);
  const inProgressTasks = useMemo(() => rawTodayTasks.filter((t) => getTaskStatusForToday(t) === 'InProgress'), [rawTodayTasks, todayStr]);
  const doneTasks = useMemo(() => rawTodayTasks.filter((t) => getTaskStatusForToday(t) === 'Done'), [rawTodayTasks, todayStr]);

  // Exact math for progress bar widget
  const totalCount = rawTodayTasks.length;
  const doneCount = doneTasks.length;
  const is100PercentDone = totalCount > 0 && doneCount === totalCount;

  const handleCardClick = (task: Task) => {
    openDetailModal(task);
  };

  const handleDropOnTask = (draggedTaskId: string, targetParentTask: Task) => {
    if (draggedTaskId === targetParentTask.id) return;
    updateTaskParent(draggedTaskId, targetParentTask.id);
  };

  const handleToggleCheckbox = (task: Task) => {
    const targetDate = todayStr;
    const isDoneNow = getTaskStatusForToday(task) === 'Done';
    if (isDoneNow) {
      toggleTaskStatus(task.id, undefined, targetDate);
    } else if (task.isRepeating || task.repetitionMode === 'smart' || task.repetitionMode === 'spaced') {
      openSmartModal(task);
    } else {
      toggleTaskStatus(task.id, undefined, targetDate);
    }
  };

  const handleSelectSmartRating = (rating: SmartRating) => {
    if (smartTask) {
      const targetDate = todayStr;
      updateTaskStatus(smartTask.id, 'Done', rating, targetDate);
      closeSmartModal();
    }
  };

  return (
    <div className={styles.container}>
      {/* 1. Day Switcher Ribbon Widget at top in place of static header */}
      {showDaySwitcher && (
        <DaySwitcherShowcase
          selectedDate={todayStr}
          onDateChange={setTodayStr}
          variant={daySwitcherVariant}
        />
      )}

      {/* 2. Full-Width Compact Process Status Tab Switcher Bar */}
      <div className={styles.viewTabBtnBar}>
        <button
          type="button"
          className={`${styles.viewTabBtn} ${statusFilter === 'Todo' ? styles.viewTabBtnActive : ''}`}
          onClick={() => setStatusFilter('Todo')}
        >
          <span className={styles.tabLabelText}>🕒 План</span>
          <span className={styles.tabCountBadge} style={{ color: '#60a5fa' }}>{todoTasks.length}</span>
        </button>
        <button
          type="button"
          className={`${styles.viewTabBtn} ${statusFilter === 'InProgress' ? styles.viewTabBtnActive : ''}`}
          onClick={() => setStatusFilter('InProgress')}
        >
          <span className={styles.tabLabelText}>⚡ В работе</span>
          <span className={styles.tabCountBadge} style={{ color: '#f59e0b' }}>{inProgressTasks.length}</span>
        </button>
        <button
          type="button"
          className={`${styles.viewTabBtn} ${statusFilter === 'Done' ? styles.viewTabBtnActive : ''}`}
          onClick={() => setStatusFilter('Done')}
        >
          <span className={styles.tabLabelText}>✅ Выполнено</span>
          <span className={styles.tabCountBadge} style={{ color: '#10b981' }}>{doneTasks.length}</span>
        </button>
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
                100% ({doneCount}/{totalCount})
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
      ) : rawTodayTasks.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--space-8)',
            borderRadius: '16px',
            border: '1px dashed var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
        >
          🌱 На сегодня задач нет.
        </div>
      ) : (
        <div className={styles.singleBoardContainer}>
          {/* Stage 1: План (Todo) */}
          {statusFilter === 'Todo' && todoTasks.length > 0 && (
            <SingleBoardSection
              tasksList={todoTasks}
              allTasks={tasks}
              todayStr={todayStr}
              parentPathVariant={4}
              onDropOnTask={handleDropOnTask}
              onOpenCard={handleCardClick}
              onToggleCheckbox={(t) => handleToggleCheckbox(t)}
              onStatusChange={(taskId, nextStatus) => {
                const t = tasks.find((x) => x.id === taskId);
                updateTaskStatus(taskId, nextStatus, undefined, t?.scheduledDate || todayStr);
              }}
              onDelete={(id) => {
                const t = tasks.find((x) => x.id === id);
                deleteTaskOccurrence(id, t?.scheduledDate || todayStr);
              }}
              onCompleteParent={(id) => {
                const t = tasks.find((x) => x.id === id);
                updateTaskStatus(id, 'Done', undefined, t?.scheduledDate || todayStr);
              }}
            />
          )}

          {/* Stage 2: В работе (InProgress) */}
          {statusFilter === 'InProgress' && inProgressTasks.length > 0 && (
            <SingleBoardSection
              tasksList={inProgressTasks}
              allTasks={tasks}
              todayStr={todayStr}
              parentPathVariant={4}
              onDropOnTask={handleDropOnTask}
              onOpenCard={handleCardClick}
              onToggleCheckbox={(t) => handleToggleCheckbox(t)}
              onStatusChange={(taskId, nextStatus) => {
                const t = tasks.find((x) => x.id === taskId);
                updateTaskStatus(taskId, nextStatus, undefined, t?.scheduledDate || todayStr);
              }}
              onDelete={(id) => {
                const t = tasks.find((x) => x.id === id);
                deleteTaskOccurrence(id, t?.scheduledDate || todayStr);
              }}
              onCompleteParent={(id) => {
                const t = tasks.find((x) => x.id === id);
                updateTaskStatus(id, 'Done', undefined, t?.scheduledDate || todayStr);
              }}
            />
          )}

          {/* Stage 3: Выполнено (Done) */}
          {statusFilter === 'Done' && doneTasks.length > 0 && (
            <SingleBoardSection
              tasksList={doneTasks}
              allTasks={tasks}
              todayStr={todayStr}
              parentPathVariant={4}
              onDropOnTask={handleDropOnTask}
              onOpenCard={handleCardClick}
              onToggleCheckbox={(t) => handleToggleCheckbox(t)}
              onStatusChange={(taskId, nextStatus) => {
                const t = tasks.find((x) => x.id === taskId);
                updateTaskStatus(taskId, nextStatus, undefined, t?.scheduledDate || todayStr);
              }}
              onDelete={(id) => {
                const t = tasks.find((x) => x.id === id);
                deleteTaskOccurrence(id, t?.scheduledDate || todayStr);
              }}
              onCompleteParent={(id) => {
                const t = tasks.find((x) => x.id === id);
                updateTaskStatus(id, 'Done', undefined, t?.scheduledDate || todayStr);
              }}
            />
          )}
        </div>
      )}

      {/* Edit Task Modal */}
      <EditTaskModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={closeEditModal}
      />

      {/* Task Detail Modal */}
      <RepeatingTaskDetailModal
        task={detailTask}
        isOpen={!!detailTask}
        onClose={closeDetailModal}
        onOpenEdit={() => {
          if (detailTask) openEditModal(detailTask);
          closeDetailModal();
        }}
      />

      {/* Smart Completion Rating Modal */}
      <SmartRatingModal
        task={smartTask}
        isOpen={!!smartTask}
        onClose={closeSmartModal}
        onSelectRating={handleSelectSmartRating}
      />
    </div>
  );
};

interface SingleBoardSectionProps {
  tasksList: Task[];
  allTasks: Task[];
  todayStr: string;
  parentPathVariant?: number;
  onDropOnTask: (draggedTaskId: string, targetParentTask: Task) => void;
  onOpenCard: (task: Task) => void;
  onToggleCheckbox: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onCompleteParent: (taskId: string) => void;
}

const SingleBoardSection: React.FC<SingleBoardSectionProps> = ({
  tasksList,
  allTasks,
  todayStr,
  parentPathVariant = 4,
  onDropOnTask,
  onOpenCard,
  onToggleCheckbox,
  onStatusChange,
  onDelete,
  onCompleteParent,
}) => {
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
            parentPathVariant={parentPathVariant}
            hideDateBadge={true}
            onToggleCheckbox={() => onToggleCheckbox(subtask)}
            onStatusChange={(nextStatus) => onStatusChange(subtask.id, nextStatus)}
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {rootTasksInStage.map((task) => (
        <React.Fragment key={task.id}>
          <GlassmorphicTaskCard
            task={task}
            occurrenceDate={todayStr}
            allTasks={allTasks}
            showDragHandle={true}
            parentPathVariant={parentPathVariant}
            hideDateBadge={true}
            onToggleCheckbox={() => onToggleCheckbox(task)}
            onStatusChange={(nextStatus) => onStatusChange(task.id, nextStatus)}
            onDelete={() => onDelete(task.id)}
            onClick={() => onOpenCard(task)}
            onDropOnTask={onDropOnTask}
            onCompleteParent={() => onCompleteParent(task.id)}
          />
          {renderSubtasksRecursive(task.id, 1)}
        </React.Fragment>
      ))}
    </div>
  );
};
