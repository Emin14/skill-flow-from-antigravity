'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Typography } from '@/shared/ui';
import { useTaskStore, GlassmorphicTaskCard } from '@/entities/task';
import { Task, TaskStatus } from '@/entities/task/model/types';
import { SmartRating } from '@/shared/config/repetitionRules';
import { EditTaskModal } from '@/features/edit-task/ui/EditTaskModal';
import { RepeatingTaskDetailModal } from '@/features/edit-task/ui/RepeatingTaskDetailModal';
import { SmartRatingModal } from '@/features/smart-rating-modal/ui/SmartRatingModal';
import { getTodayStr, isSmartRepeatTask } from '@/shared/lib/dateUtils';
import { STORAGE_KEYS } from '@/shared/config/storageKeys';
import { useTaskModals } from '@/shared/hooks/useTaskModals';
import { useMidnightRefresh } from '@/shared/hooks/useMidnightRefresh';
import { DaySwitcherShowcase } from '@/features/day-switcher-showcase/ui/DaySwitcherShowcase';
import { useToastStore } from '@/shared/ui/toast/toastStore';
import { registerPointerDropHandler } from '@/shared/lib/pointerDrag';
import {
  Sun,
  PartyPopper,
} from 'lucide-react';
import styles from './TodayTasks.module.css';
import { applyCategoryTextTheme, applyCardBgTheme } from '@/shared/config/categoryColors';

type StatusFilter = 'Todo' | 'InProgress' | 'Done';

interface TodayTasksProps {
  showDaySwitcher?: boolean;
  selectedDate?: string;
  onDateChange?: (date: string) => void;
}

export const TodayTasks: React.FC<TodayTasksProps> = ({ showDaySwitcher = true, selectedDate, onDateChange }) => {
  const { tasks, isLoading, fetchTasks, updateTaskStatus, toggleTaskStatus, updateTaskParent, deleteTask, deleteTaskOccurrence } = useTaskStore();
  const {
    editingTask, detailTask, detailOccurrenceDate, smartTask,
    openEditModal, openDetailModal, openSmartModal,
    closeEditModal, closeDetailModal, closeSmartModal,
  } = useTaskModals();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Todo');
  const [todayStr, setTodayStr] = useState<string>(getTodayStr());
  const [daySwitcherVariant, setDaySwitcherVariant] = useState<'12' | '19'>('12');
  const [dragOverTab, setDragOverTab] = useState<StatusFilter | null>(null);

  const activeDateStr = selectedDate || todayStr;

  const handleDateChange = (newDate: string) => {
    setTodayStr(newDate);
    if (onDateChange) onDateChange(newDate);
  };

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

  useEffect(() => {
    registerPointerDropHandler((draggedTaskId, target) => {
      if (target.type === 'status_tab' && target.status) {
        updateTaskStatus(draggedTaskId, target.status, undefined, activeDateStr);
        const statusLabel = target.status === 'Todo' ? 'План' : target.status === 'InProgress' ? 'В работе' : 'Выполнено';
        useToastStore.getState().showToast(`Задача перенесена в колонку "${statusLabel}"`, 'info');
      } else if (target.type === 'task_card' && target.taskId) {
        updateTaskParent(draggedTaskId, target.taskId);
      }
    });
  }, [activeDateStr, updateTaskStatus, updateTaskParent]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // Midnight auto-update: обновляет todayStr при смене суток
  useMidnightRefresh(() => {
    const fresh = getTodayStr();
    setTodayStr(fresh);
    if (onDateChange) onDateChange(fresh);
  });

  // Tasks scheduled strictly for activeDateStr (EXCLUDING parent tasks with subtasks)
  const rawTodayTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Exclude main tasks with subtasks (they belong strictly in Projects section)
      const hasChildren = tasks.some((sub) => sub.parentTaskId === t.id);
      if (t.hasSubtasks || hasChildren) return false;

      // Handle repeating task occurrences scheduled for activeDateStr
      if (t.isRepeating) {
        if (t.occurrences && t.occurrences.length > 0) {
          return t.occurrences.some((o) => o.date === activeDateStr);
        }
        return t.scheduledDate === activeDateStr;
      }
      return t.scheduledDate === activeDateStr;
    });
  }, [tasks, activeDateStr]);

  // Helper to determine status of task for activeDateStr
  const getTaskStatusForToday = (t: Task): TaskStatus => {
    if (t.isRepeating) {
      const occ = t.occurrences?.find((o) => o.date === activeDateStr);
      if (occ) return occ.status;
      const legacyOcc = t.repetitionHistory?.find((h) => h.date === activeDateStr);
      if (legacyOcc) return legacyOcc.completed ? 'Done' : 'Todo';
      return 'Todo';
    }
    return t.status;
  };

  const todoTasks = useMemo(() => rawTodayTasks.filter((t) => getTaskStatusForToday(t) === 'Todo'), [rawTodayTasks, activeDateStr]);
  const inProgressTasks = useMemo(() => rawTodayTasks.filter((t) => getTaskStatusForToday(t) === 'InProgress'), [rawTodayTasks, activeDateStr]);
  const doneTasks = useMemo(() => rawTodayTasks.filter((t) => getTaskStatusForToday(t) === 'Done'), [rawTodayTasks, activeDateStr]);

  // Exact math for progress bar widget
  const totalCount = rawTodayTasks.length;
  const doneCount = doneTasks.length;
  const is100PercentDone = totalCount > 0 && doneCount === totalCount;

  const handleCardClick = (task: Task) => {
    openDetailModal(task, activeDateStr);
  };

  const handleDropOnTask = (draggedTaskId: string, targetParentTask: Task) => {
    if (draggedTaskId === targetParentTask.id) return;
    updateTaskParent(draggedTaskId, targetParentTask.id);
  };

  const handleToggleCheckbox = (task: Task) => {
    const isDoneNow = getTaskStatusForToday(task) === 'Done';
    if (isDoneNow) {
      toggleTaskStatus(task.id, undefined, activeDateStr);
    } else if (isSmartRepeatTask(task)) {
      const currentOcc = task.occurrences?.find((o) => o.date === activeDateStr);
      const preRating = currentOcc?.smartRating || task.lastSmartRating;
      if (preRating) {
        updateTaskStatus(task.id, 'Done', preRating, activeDateStr);
      } else {
        openSmartModal(task);
      }
    } else {
      toggleTaskStatus(task.id, undefined, activeDateStr);
    }
  };

  const handleSelectSmartRating = (rating: SmartRating) => {
    if (smartTask) {
      updateTaskStatus(smartTask.id, 'Done', rating, todayStr);
      closeSmartModal();
    }
  };

  const getDraggedTaskId = (e: React.DragEvent): string | null => {
    const windowId = typeof window !== 'undefined' ? window.__draggedTaskId : null;
    if (windowId) return windowId;
    const raw = e.dataTransfer.getData('taskId') || e.dataTransfer.getData('text/plain');
    if (!raw) return null;
    const found = tasks.find((t) => t.id === raw || t.title === raw);
    return found ? found.id : raw;
  };

  // Drag and Drop Task onto Column Header / Tab Button handler
  const handleDropOnTabHeader = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverTab(null);
    const taskId = getDraggedTaskId(e);
    if (taskId) {
      updateTaskStatus(taskId, targetStatus, undefined, activeDateStr);
      const statusLabel = targetStatus === 'Todo' ? 'План' : targetStatus === 'InProgress' ? 'В работе' : 'Выполнено';
      useToastStore.getState().showToast(`Задача перенесена в колонку "${statusLabel}"`, 'info');
    }
  };

  return (
    <div className={styles.container}>
      {/* 1. Day Switcher Ribbon Widget at top in place of static header */}
      {showDaySwitcher && (
        <DaySwitcherShowcase
          selectedDate={activeDateStr}
          onDateChange={handleDateChange}
          variant={daySwitcherVariant}
        />
      )}

      {/* 2. Full-Width Compact Process Status Tab Switcher Bar with Drag-and-Drop Drop Targets */}
      <div className={styles.viewTabBtnBar}>
        <button
          type="button"
          data-drop-status="Todo"
          className={`${styles.viewTabBtn} ${statusFilter === 'Todo' ? styles.viewTabBtnActive : ''} ${dragOverTab === 'Todo' ? styles.viewTabBtnDragOver : ''}`}
          onClick={() => setStatusFilter('Todo')}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverTab('Todo'); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverTab(null); }}
          onDrop={(e) => handleDropOnTabHeader(e, 'Todo')}
          title="Перетащите задачу сюда, чтобы перевести в 'План'"
        >
          <span className={styles.tabLabelText}>🕒 План</span>
          <span className={styles.tabCountBadge} style={{ color: '#60a5fa' }}>{todoTasks.length}</span>
        </button>
        <button
          type="button"
          data-drop-status="InProgress"
          className={`${styles.viewTabBtn} ${statusFilter === 'InProgress' ? styles.viewTabBtnActive : ''} ${dragOverTab === 'InProgress' ? styles.viewTabBtnDragOver : ''}`}
          onClick={() => setStatusFilter('InProgress')}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverTab('InProgress'); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverTab(null); }}
          onDrop={(e) => handleDropOnTabHeader(e, 'InProgress')}
          title="Перетащите задачу сюда, чтобы перевести 'В работе'"
        >
          <span className={styles.tabLabelText}>⚡ В работе</span>
          <span className={styles.tabCountBadge} style={{ color: '#f59e0b' }}>{inProgressTasks.length}</span>
        </button>
        <button
          type="button"
          data-drop-status="Done"
          className={`${styles.viewTabBtn} ${statusFilter === 'Done' ? styles.viewTabBtnActive : ''} ${dragOverTab === 'Done' ? styles.viewTabBtnDragOver : ''}`}
          onClick={() => setStatusFilter('Done')}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverTab('Done'); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverTab(null); }}
          onDrop={(e) => handleDropOnTabHeader(e, 'Done')}
          title="Перетащите задачу сюда, чтобы перевести в 'Выполнено'"
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
          {statusFilter === 'Todo' && (
            <SingleBoardSection
              tasksList={todoTasks}
              allTasks={tasks}
              todayStr={activeDateStr}
              targetStatus="Todo"
              parentPathVariant={4}
              onDropOnTask={handleDropOnTask}
              onDropOnSection={(taskId, status) => updateTaskStatus(taskId, status, undefined, activeDateStr)}
              onOpenCard={handleCardClick}
              onToggleCheckbox={(t) => handleToggleCheckbox(t)}
              onStatusChange={(taskId, nextStatus) => updateTaskStatus(taskId, nextStatus, undefined, activeDateStr)}
              onDelete={(id) => deleteTaskOccurrence(id, activeDateStr)}
              onCompleteParent={(id) => updateTaskStatus(id, 'Done', undefined, activeDateStr)}
            />
          )}

          {/* Stage 2: В работе (InProgress) */}
          {statusFilter === 'InProgress' && (
            <SingleBoardSection
              tasksList={inProgressTasks}
              allTasks={tasks}
              todayStr={activeDateStr}
              targetStatus="InProgress"
              parentPathVariant={4}
              onDropOnTask={handleDropOnTask}
              onDropOnSection={(taskId, status) => updateTaskStatus(taskId, status, undefined, activeDateStr)}
              onOpenCard={handleCardClick}
              onToggleCheckbox={(t) => handleToggleCheckbox(t)}
              onStatusChange={(taskId, nextStatus) => updateTaskStatus(taskId, nextStatus, undefined, activeDateStr)}
              onDelete={(id) => deleteTaskOccurrence(id, activeDateStr)}
              onCompleteParent={(id) => updateTaskStatus(id, 'Done', undefined, activeDateStr)}
            />
          )}

          {/* Stage 3: Выполнено (Done) */}
          {statusFilter === 'Done' && (
            <SingleBoardSection
              tasksList={doneTasks}
              allTasks={tasks}
              todayStr={activeDateStr}
              targetStatus="Done"
              parentPathVariant={4}
              onDropOnTask={handleDropOnTask}
              onDropOnSection={(taskId, status) => updateTaskStatus(taskId, status, undefined, activeDateStr)}
              onOpenCard={handleCardClick}
              onToggleCheckbox={(t) => handleToggleCheckbox(t)}
              onStatusChange={(taskId, nextStatus) => updateTaskStatus(taskId, nextStatus, undefined, activeDateStr)}
              onDelete={(id) => deleteTaskOccurrence(id, activeDateStr)}
              onCompleteParent={(id) => updateTaskStatus(id, 'Done', undefined, activeDateStr)}
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
        occurrenceDate={detailOccurrenceDate || activeDateStr}
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
  targetStatus: TaskStatus;
  parentPathVariant?: number;
  onDropOnTask: (draggedTaskId: string, targetParentTask: Task) => void;
  onDropOnSection: (taskId: string, targetStatus: TaskStatus) => void;
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
  targetStatus,
  parentPathVariant = 4,
  onDropOnTask,
  onDropOnSection,
  onOpenCard,
  onToggleCheckbox,
  onStatusChange,
  onDelete,
  onCompleteParent,
}) => {
  const [isHeaderDragOver, setIsHeaderDragOver] = useState(false);

  const stageTaskIds = useMemo(() => new Set(tasksList.map((t) => t.id)), [tasksList]);

  const rootTasksInStage = useMemo(() => {
    return tasksList.filter((t) => !t.parentTaskId || !stageTaskIds.has(t.parentTaskId));
  }, [tasksList, stageTaskIds]);

  const statusTitleText = targetStatus === 'Todo' ? '🕒 План' : targetStatus === 'InProgress' ? '⚡ В работе' : '✅ Выполнено';

  const handleHeaderDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHeaderDragOver(false);
    const taskId =
      (typeof window !== 'undefined' && window.__draggedTaskId) ||
      e.dataTransfer.getData('taskId') ||
      e.dataTransfer.getData('text/plain');
    if (taskId) {
      const found = allTasks.find((t) => t.id === taskId || t.title === taskId);
      const realId = found ? found.id : taskId;
      onDropOnSection(realId, targetStatus);
    }
  };

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
      {tasksList.length === 0 ? (
        <div style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: 'var(--color-text-muted)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px' }}>
          В этой колонке нет задач. Перетащите задачу сюда.
        </div>
      ) : (
        rootTasksInStage.map((task) => (
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
        ))
      )}
    </div>
  );
};
