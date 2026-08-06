'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Button } from '@/shared/ui';
import { useTaskStore, GlassmorphicTaskCard, getAllDescendantTasks } from '@/entities/task';
import { Task } from '@/entities/task/model/types';
import { EditTaskModal } from '@/features/edit-task/ui/EditTaskModal';
import { RepeatingTaskDetailModal } from '@/features/edit-task/ui/RepeatingTaskDetailModal';
import { getTodayStr, formatDateDisplay } from '@/shared/lib/dateUtils';
import { ChevronDown, ChevronRight, AlertTriangle, Lightbulb } from 'lucide-react';
import { ProjectFilterTabsWidget, ProjectFilterType, SubtaskViewMode } from '@/widgets/project-filter-tabs/ui/ProjectFilterTabsWidget';
import { TimelineRepeatCard } from '@/views/repeats/ui/RepeatsPage';
import { registerPointerDropHandler } from '@/shared/lib/pointerDrag';
import { useToastStore } from '@/shared/ui/toast/toastStore';
import styles from './ProjectsPage.module.css';

import { getCategoryColor } from '@/shared/config/categoryColors';

const AccentRepeatingSubtaskCard: React.FC<{
  task: Task;
  onToggleCheckbox: () => void;
  onDelete: () => void;
  onClick: () => void;
}> = ({ task, onToggleCheckbox, onDelete, onClick }) => {
  const occurrences = task.occurrences || [];
  const completedCount = occurrences.filter((o) => o.status === 'Done').length;
  const isDone = task.status === 'Done';

  const modeLabels: Record<string, string> = {
    smart: '🧠 Умный адаптивный повтор',
    spaced: '🧠 Интервальный повтор',
    schedule: '📅 По расписанию',
    after_completion: '⏱ Через N дней',
  };
  const modeLabel = modeLabels[task.repetitionMode || 'spaced'] || '🔄 Повторение';

  return (
    <div
      onClick={onClick}
      style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '12px',
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.15s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleCheckbox();
          }}
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '6px',
            border: isDone ? 'none' : '2px solid var(--color-accent)',
            background: isDone ? 'var(--color-accent)' : 'transparent',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            fontSize: '12px',
          }}
        >
          {isDone && '✓'}
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', textDecoration: isDone ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {task.title}
            </span>
            <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '6px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', flexShrink: 0 }}>
              🔄 Повтор
            </span>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
            {modeLabel}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '8px', background: 'var(--color-surface-hover)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
          {completedCount} повторов
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '13px' }}
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export const ProjectsPage: React.FC = () => {
  const { tasks, isLoading, fetchTasks, toggleTaskStatus, updateTaskStatus, updateTaskParent, updateTaskDetails, deleteTask, deleteTaskOccurrence } = useTaskStore();
  const [activeFilter, setActiveFilter] = useState<ProjectFilterType>('all');
  const [subtaskViewMode, setSubtaskViewMode] = useState<SubtaskViewMode>('standard');
  const [openProjectIds, setOpenProjectIds] = useState<Set<string>>(new Set());
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);

  const todayStr = useMemo(() => getTodayStr(), []);

  useEffect(() => {
    fetchTasks();
    const savedMode = localStorage.getItem('subtaskViewMode') as SubtaskViewMode;
    if (savedMode && ['standard', 'accent_card', 'timeline'].includes(savedMode)) {
      setSubtaskViewMode(savedMode);
    }
  }, [fetchTasks]);

  const handleSelectSubtaskViewMode = (mode: SubtaskViewMode) => {
    setSubtaskViewMode(mode);
    localStorage.setItem('subtaskViewMode', mode);
  };

  useEffect(() => {
    registerPointerDropHandler((draggedTaskId, target) => {
      if (target.type === 'project_card' && target.projectId) {
        updateTaskParent(draggedTaskId, target.projectId);
        setOpenProjectIds((prev) => new Set(prev).add(target.projectId!));
        const targetProj = tasks.find((t) => t.id === target.projectId);
        useToastStore.getState().showToast(`Подзадача привязана к проекту "${targetProj?.title || 'Проект'}"`, 'info');
      } else if (target.type === 'task_card' && target.taskId) {
        updateTaskParent(draggedTaskId, target.taskId);
        setOpenProjectIds((prev) => new Set(prev).add(target.taskId!));
        const targetTask = tasks.find((t) => t.id === target.taskId);
        useToastStore.getState().showToast(`Подзадача привязана к "${targetTask?.title || 'Задача'}"`, 'info');
      }
    });
  }, [tasks, updateTaskParent]);

  const initialSetDoneRef = useRef(false);

  // All parent tasks
  const allParentTasks = useMemo(() => {
    return tasks.filter((t) => t.hasSubtasks || tasks.some((sub) => sub.parentTaskId === t.id));
  }, [tasks]);

  // Main / Parent tasks
  const projectTasks = useMemo(() => {
    return tasks.filter((t) => !t.parentTaskId && (t.hasSubtasks || tasks.some((sub) => sub.parentTaskId === t.id)));
  }, [tasks]);

  // Expand all projects and sub-projects by default
  useEffect(() => {
    if (allParentTasks.length > 0) {
      setOpenProjectIds((prev) => {
        const next = new Set(prev);
        allParentTasks.forEach((p) => {
          if (!initialSetDoneRef.current) {
            next.add(p.id);
          }
        });
        initialSetDoneRef.current = true;
        return next;
      });
    }
  }, [allParentTasks]);

  const toggleProjectOpen = (id: string) => {
    setOpenProjectIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projectTasks.filter((project) => {
      const descendants = getAllDescendantTasks(project.id, tasks);
      const doneCount = descendants.filter((t) => t.status === 'Done').length;
      const isCompleted = descendants.length > 0 && doneCount === descendants.length;
      const overdueCount = descendants.filter((t) => !t.isRepeating && t.scheduledDate && t.scheduledDate < todayStr && t.status !== 'Done').length;

      if (activeFilter === 'active') return !isCompleted;
      if (activeFilter === 'completed') return isCompleted;
      if (activeFilter === 'has_overdue') return overdueCount > 0;
      return true;
    });
  }, [projectTasks, tasks, activeFilter, todayStr]);

  const handleDrop = async (e: React.DragEvent, targetProjectId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const draggedTaskId =
      e.dataTransfer.getData('taskId') ||
      (typeof window !== 'undefined' ? window.__draggedTaskId : null);
    if (draggedTaskId && draggedTaskId !== targetProjectId) {
      await updateTaskParent(draggedTaskId, targetProjectId);
      setOpenProjectIds((prev) => {
        const next = new Set(prev);
        next.add(targetProjectId);
        return next;
      });
    }
  };

  const handleDragOver = (e: React.DragEvent, targetProjectId: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDropOnTask = async (draggedTaskId: string, targetTask: Task) => {
    const actualDraggedId =
      draggedTaskId || (typeof window !== 'undefined' ? window.__draggedTaskId : null);
    if (!actualDraggedId || actualDraggedId === targetTask.id) return;
    await updateTaskParent(actualDraggedId, targetTask.id);
    setOpenProjectIds((prev) => {
      const next = new Set(prev);
      next.add(targetTask.id);
      if (targetTask.parentTaskId) {
        next.add(targetTask.parentTaskId);
      }
      return next;
    });
  };

  return (
    <div className={styles.container}>
      {/* Filter Tabs Widget */}
      <ProjectFilterTabsWidget
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
        subtaskViewMode={subtaskViewMode}
        onSelectSubtaskViewMode={handleSelectSubtaskViewMode}
      />

      {/* Projects List */}
      {isLoading ? (
        <div className={styles.emptyState}>Загрузка крупных задач...</div>
      ) : filteredProjects.length === 0 ? (
        <div className={styles.emptyState}>
          {activeFilter === 'all' ? (
            <>
              <div style={{ color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                📁 Крупных задач с подзадачами пока не найдено.
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setEditingTask({
                  id: '',
                  title: '',
                  status: 'Todo',
                  priority: 'P3',
                  category: 'Крупная задача',
                  scheduledDate: todayStr,
                  createdAt: new Date().toISOString(),
                  isRepeating: false,
                  hasSubtasks: true,
                  targetRepetitions: 8,
                  repetitionsCount: 0,
                  repetitionHistory: [],
                  occurrences: [],
                })}
              >
                + Создать крупную задачу
              </Button>
            </>
          ) : (
            <div>Нет крупных задач по выбранному фильтру.</div>
          )}
        </div>
      ) : (
        <div className={styles.projectList}>
          {filteredProjects.map((project) => {
            const catColor = getCategoryColor(project.category);
            const isOpen = openProjectIds.has(project.id);
            const isDragOver = false;

            // Subtasks sorted by nearest scheduled date ascending
            const descendants = getAllDescendantTasks(project.id, tasks);
            const sortedSubtasks = [...descendants].sort((a, b) => {
              if (!a.scheduledDate && !b.scheduledDate) return 0;
              if (!a.scheduledDate) return 1;
              if (!b.scheduledDate) return -1;
              return a.scheduledDate.localeCompare(b.scheduledDate);
            });

            const doneCount = descendants.filter((t) => t.status === 'Done').length;
            const totalCount = descendants.length;
            const progressPercent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

            // Subtask Date > Project Date Warning Detection
            // FIX Issue 1: Exclude auto-advancing future repeating occurrences from pushing latestSubtaskDate infinitely into future!
            const subtaskDates = descendants
              .map((t) => {
                if (t.isRepeating) {
                  const occs = t.occurrences || [];
                  const activeOcc = occs.find((o) => o.status === 'Todo');
                  return activeOcc ? activeOcc.date : t.scheduledDate;
                }
                return t.scheduledDate;
              })
              .filter((d): d is string => !!d && d.includes('-'));
            subtaskDates.sort();
            const latestSubtaskDate = subtaskDates.length > 0 ? subtaskDates[subtaskDates.length - 1] : null;

            const hasDateMismatch = !!(
              project.scheduledDate &&
              latestSubtaskDate &&
              latestSubtaskDate > project.scheduledDate
            );

            return (
              <ProjectCardRenderer
                key={project.id}
                project={project}
                catColor={catColor}
                isOpen={isOpen}
                isDragOver={isDragOver}
                doneCount={doneCount}
                totalCount={totalCount}
                progressPercent={progressPercent}
                hasDateMismatch={hasDateMismatch}
                latestSubtaskDate={latestSubtaskDate}
                sortedSubtasks={sortedSubtasks}
                subtaskViewMode={subtaskViewMode}
                tasks={tasks}
                openProjectIds={openProjectIds}
                todayStr={todayStr}
                toggleProjectOpen={toggleProjectOpen}
                onEdit={(taskToEdit) => setEditingTask(taskToEdit)}
                onDragOver={(e) => handleDragOver(e, project.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, project.id)}
                onDropOnTask={handleDropOnTask}
                onFixDate={() => latestSubtaskDate && updateTaskDetails(project.id, { scheduledDate: latestSubtaskDate })}
                onToggleSubtask={(st) => toggleTaskStatus(st.id, undefined, st.scheduledDate || todayStr)}
                onDeleteSubtask={(st) => deleteTaskOccurrence(st.id, st.scheduledDate || todayStr)}
                onSelectSubtask={(st) => setDetailTask(st)}
              />
            );
          })}
        </div>
      )}

      {/* Edit Task Modal */}
      <EditTaskModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
      />

      {/* Detail Modal */}
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

interface ProjectCardRendererProps {
  project: Task;
  catColor: string;
  isOpen: boolean;
  isDragOver: boolean;
  doneCount: number;
  totalCount: number;
  progressPercent: number;
  hasDateMismatch: boolean;
  latestSubtaskDate: string | null;
  sortedSubtasks: Task[];
  subtaskViewMode: SubtaskViewMode;
  tasks: Task[];
  openProjectIds: Set<string>;
  todayStr: string;
  toggleProjectOpen: (id: string) => void;
  onEdit: (t: Task) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDropOnTask: (draggedTaskId: string, targetTask: Task) => void;
  onFixDate: () => void;
  onToggleSubtask: (t: Task) => void;
  onDeleteSubtask: (t: Task) => void;
  onSelectSubtask: (t: Task) => void;
}

const ProjectCardRenderer: React.FC<ProjectCardRendererProps> = ({
  project,
  catColor,
  isOpen,
  isDragOver,
  doneCount,
  totalCount,
  progressPercent,
  hasDateMismatch,
  latestSubtaskDate,
  sortedSubtasks,
  subtaskViewMode,
  tasks,
  openProjectIds,
  todayStr,
  toggleProjectOpen,
  onEdit,
  onDragOver,
  onDragLeave,
  onDrop,
  onDropOnTask,
  onFixDate,
  onToggleSubtask,
  onDeleteSubtask,
  onSelectSubtask,
}) => {
  const radius = (36 - 3) / 2;
  const circumference = 2 * Math.PI * radius;

  const renderCircleRing = (size: number = 36, strokeWidth: number = 3) => {
    const r = (size - strokeWidth) / 2;
    const c = 2 * Math.PI * r;
    return (
      <div style={{ position: 'relative', width: `${size}px`, height: `${size}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-border)" strokeWidth={strokeWidth} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#10b981"
            strokeWidth={strokeWidth}
            strokeDasharray={c}
            strokeDashoffset={c - (c * progressPercent) / 100}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <span style={{ position: 'absolute', fontSize: '10px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
          {progressPercent}%
        </span>
      </div>
    );
  };

  const editBtn = (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onEdit(project);
      }}
      title="Редактировать проект"
      style={{
        background: 'var(--color-surface-hover)',
        border: '1px solid var(--color-border)',
        borderRadius: '8px',
        color: 'var(--color-text-primary)',
        width: '28px',
        height: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '12px',
        flexShrink: 0,
      }}
    >
      ✏️
    </button>
  );

  const chevronBtn = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', flexShrink: 0 }}>
      {isOpen ? <ChevronDown size={20} color="var(--color-text-muted)" /> : <ChevronRight size={20} color="var(--color-text-muted)" />}
    </div>
  );

  return (
    <div
      data-project-id={project.id}
      className={`${styles.projectCardBase} ${isDragOver ? styles.dragOver : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* Project Card Header */}
      <div
        className={styles.headerRow}
        onClick={() => toggleProjectOpen(project.id)}
        style={{ cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '60%', minWidth: 0 }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: catColor, flexShrink: 0 }} />
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {project.title}
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '40%', justifyContent: 'flex-end' }}>
          {totalCount > 0 && (
            <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
              {doneCount}/{totalCount}
            </span>
          )}
          {totalCount > 0 && renderCircleRing(36, 3)}
          {editBtn}
          {chevronBtn}
        </div>
      </div>

      {/* Date Mismatch Warning Banner */}
      {hasDateMismatch && project.scheduledDate && latestSubtaskDate && (
        <DateWarningBanner
          projectDate={project.scheduledDate}
          subtaskDate={latestSubtaskDate}
          onFixDate={onFixDate}
        />
      )}

      {/* Collapsible Subtasks List */}
      {isOpen && (
        <div className={styles.subtaskList}>
          {sortedSubtasks.length === 0 ? (
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', padding: '6px 0', fontStyle: 'italic' }}>
              Нет подзадач в проекте (Перетащите сюда задачи).
            </div>
          ) : (
            <RecursiveSubtaskList
              parentId={project.id}
              tasks={tasks}
              subtaskViewMode={subtaskViewMode}
              openProjectIds={openProjectIds}
              toggleProjectOpen={toggleProjectOpen}
              onEdit={onEdit}
              onToggleSubtask={onToggleSubtask}
              onDeleteSubtask={onDeleteSubtask}
              onSelectSubtask={onSelectSubtask}
              onDropOnTask={onDropOnTask}
              todayStr={todayStr}
            />
          )}
        </div>
      )}
    </div>
  );
};

const DateWarningBanner: React.FC<{
  projectDate: string;
  subtaskDate: string;
  onFixDate: () => void;
}> = ({ projectDate, subtaskDate, onFixDate }) => {
  return (
    <div
      style={{
        margin: '8px 12px 4px 12px',
        padding: '10px 14px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(245, 158, 11, 0.08) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
        <Lightbulb size={16} color="#f59e0b" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '11.5px', color: 'var(--color-text-primary)', fontWeight: 600, lineHeight: 1.3 }}>
          Проект: <strong style={{ color: '#f59e0b' }}>{formatDateDisplay(projectDate)}</strong> • Крайняя задача: <strong style={{ color: '#38bdf8' }}>{formatDateDisplay(subtaskDate)}</strong>
        </span>
      </div>

      <button
        type="button"
        onClick={onFixDate}
        style={{
          background: 'linear-gradient(135deg, #d97706, #f59e0b)',
          border: 'none',
          borderRadius: '8px',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '11.5px',
          padding: '6px 12px',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 6px rgba(217, 119, 6, 0.3)',
          flexShrink: 0,
        }}
      >
        Продлить проект
      </button>
    </div>
  );
};

const RecursiveSubtaskList: React.FC<{
  parentId: string;
  tasks: Task[];
  subtaskViewMode: SubtaskViewMode;
  openProjectIds: Set<string>;
  toggleProjectOpen: (id: string) => void;
  onEdit: (t: Task) => void;
  onToggleSubtask: (t: Task) => void;
  onDeleteSubtask: (t: Task) => void;
  onSelectSubtask: (t: Task) => void;
  onDropOnTask: (draggedTaskId: string, targetTask: Task) => void;
  todayStr: string;
  depth?: number;
}> = ({
  parentId,
  tasks,
  subtaskViewMode,
  openProjectIds,
  toggleProjectOpen,
  onEdit,
  onToggleSubtask,
  onDeleteSubtask,
  onSelectSubtask,
  onDropOnTask,
  todayStr,
  depth = 0,
}) => {
  const children = tasks.filter((t) => t.parentTaskId === parentId);
  if (children.length === 0) return null;

  const sorted = [...children].sort((a, b) => {
    const aIsContainer = tasks.some((t) => t.parentTaskId === a.id) || a.hasSubtasks;
    const bIsContainer = tasks.some((t) => t.parentTaskId === b.id) || b.hasSubtasks;

    if (aIsContainer && !bIsContainer) return 1;
    if (!aIsContainer && bIsContainer) return -1;

    if (!a.scheduledDate && !b.scheduledDate) return 0;
    if (!a.scheduledDate) return 1;
    if (!b.scheduledDate) return -1;
    return a.scheduledDate.localeCompare(b.scheduledDate);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: depth > 0 ? '16px' : '0' }}>
      {sorted.map((child) => {
        const hasChildTasks = tasks.some((t) => t.parentTaskId === child.id) || child.hasSubtasks;

        if (hasChildTasks) {
          const isSubProjectOpen = openProjectIds.has(child.id);
          const subDescendants = getAllDescendantTasks(child.id, tasks);
          const subDone = subDescendants.filter((t) => t.status === 'Done').length;
          const subTotal = subDescendants.length;
          const subPercent = subTotal > 0 ? Math.round((subDone / subTotal) * 100) : 0;

          const radius = (32 - 5) / 2;
          const circumference = 2 * Math.PI * radius;

          return (
            <div
              key={child.id}
              data-project-id={child.id}
              className={styles.projectCardBase}
              style={{
                marginTop: '6px',
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'move';
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const draggedId = e.dataTransfer.getData('taskId') || (window as any).__draggedTaskId;
                if (draggedId && draggedId !== child.id) {
                  useTaskStore.getState().updateTaskParent(draggedId, child.id);
                  toggleProjectOpen(child.id);
                }
              }}
            >
              <div
                className={styles.headerRow}
                onClick={() => toggleProjectOpen(child.id)}
                style={{ cursor: 'pointer', padding: '10px 12px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '60%', minWidth: 0 }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-accent-text)', background: 'var(--color-accent-light)', padding: '1px 6px', borderRadius: '4px' }}>
                    📁 Проект
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {child.title}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '40%', justifyContent: 'flex-end' }}>
                  {subTotal > 0 && (
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                      {subDone}/{subTotal}
                    </span>
                  )}
                  {subTotal > 0 && (
                    <div style={{ position: 'relative', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width={32} height={32} viewBox="0 0 32 32">
                        <circle cx={16} cy={16} r={radius} fill="none" stroke="var(--color-border)" strokeWidth={2.5} />
                        <circle
                          cx={16}
                          cy={16}
                          r={radius}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth={2.5}
                          strokeDasharray={circumference}
                          strokeDashoffset={circumference - (circumference * subPercent) / 100}
                          strokeLinecap="round"
                          transform="rotate(-90 16 16)"
                        />
                      </svg>
                      <span style={{ position: 'absolute', fontSize: '9px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                        {subPercent}%
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(child);
                    }}
                    style={{
                      background: 'var(--color-surface-hover)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '6px',
                      color: 'var(--color-text-primary)',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '11px',
                      flexShrink: 0,
                    }}
                  >
                    ✏️
                  </button>
                  {isSubProjectOpen ? <ChevronDown size={16} color="var(--color-accent-text)" /> : <ChevronRight size={16} color="var(--color-accent-text)" />}
                </div>
              </div>

              {isSubProjectOpen && (
                <div style={{ marginTop: '10px' }}>
                  <RecursiveSubtaskList
                    parentId={child.id}
                    tasks={tasks}
                    subtaskViewMode={subtaskViewMode}
                    openProjectIds={openProjectIds}
                    toggleProjectOpen={toggleProjectOpen}
                    onEdit={onEdit}
                    onToggleSubtask={onToggleSubtask}
                    onDeleteSubtask={onDeleteSubtask}
                    onSelectSubtask={onSelectSubtask}
                    onDropOnTask={onDropOnTask}
                    todayStr={todayStr}
                    depth={depth + 1}
                  />
                </div>
              )}
            </div>
          );
        }

        // RENDER REPEATING SUBTASK ACCORDING TO USER SELECTED VIEW MODE
        if (child.isRepeating) {
          if (subtaskViewMode === 'timeline') {
            return (
              <TimelineRepeatCard
                key={child.id}
                task={child}
                allTasks={tasks}
                onClick={() => onSelectSubtask(child)}
              />
            );
          }

          if (subtaskViewMode === 'accent_card') {
            return (
              <AccentRepeatingSubtaskCard
                key={child.id}
                task={child}
                onToggleCheckbox={() => onToggleSubtask(child)}
                onDelete={() => onDeleteSubtask(child)}
                onClick={() => onSelectSubtask(child)}
              />
            );
          }
          // Default / 'standard': Standard compact task card (like standard subtask)
        }

        return (
          <GlassmorphicTaskCard
            key={child.id}
            task={child}
            occurrenceDate={child.scheduledDate || todayStr}
            allTasks={tasks}
            showDragHandle={true}
            parentPathVariant={0}
            hideCategory={true}
            onToggleCheckbox={() => onToggleSubtask(child)}
            onDelete={() => onDeleteSubtask(child)}
            onClick={() => onSelectSubtask(child)}
            onDropOnTask={(draggedTaskId, targetTask) => onDropOnTask(draggedTaskId, targetTask)}
          />
        );
      })}
    </div>
  );
};
