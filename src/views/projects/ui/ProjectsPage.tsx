'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Button } from '@/shared/ui';
import { useTaskStore, GlassmorphicTaskCard, getAllDescendantTasks } from '@/entities/task';
import { Task } from '@/entities/task/model/types';
import { EditTaskModal } from '@/features/edit-task/ui/EditTaskModal';
import { RepeatingTaskDetailModal } from '@/features/edit-task/ui/RepeatingTaskDetailModal';
import { getTodayStr, formatDateDisplay } from '@/shared/lib/dateUtils';
import { ChevronDown, ChevronRight, Sparkles } from 'lucide-react';
import { ProjectFilterTabsWidget, ProjectFilterType } from '@/widgets/project-filter-tabs/ui/ProjectFilterTabsWidget';
import { registerPointerDropHandler } from '@/shared/lib/pointerDrag';
import { useToastStore } from '@/shared/ui/toast/toastStore';
import styles from './ProjectsPage.module.css';

import { getCategoryColor } from '@/shared/config/categoryColors';

export const ProjectsPage: React.FC = () => {
  const { tasks, isLoading, fetchTasks, toggleTaskStatus, updateTaskStatus, updateTaskParent, updateTaskDetails, deleteTask, deleteTaskOccurrence } = useTaskStore();
  const [activeFilter, setActiveFilter] = useState<ProjectFilterType>('all');
  const [openProjectIds, setOpenProjectIds] = useState<Set<string>>(new Set());
  const [dragOverProjectId, setDragOverProjectId] = useState<string | null>(null);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);

  const todayStr = useMemo(() => getTodayStr(), []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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

  // All parent tasks (both top-level projects and nested sub-projects)
  const allParentTasks = useMemo(() => {
    return tasks.filter((t) => t.hasSubtasks || tasks.some((sub) => sub.parentTaskId === t.id));
  }, [tasks]);

  // Main / Parent tasks (hasSubtasks: true or has children)
  const projectTasks = useMemo(() => {
    return tasks.filter((t) => !t.parentTaskId && (t.hasSubtasks || tasks.some((sub) => sub.parentTaskId === t.id)));
  }, [tasks]);

  // Expand all projects and sub-projects by default when loaded without wiping user toggles
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

  const handleDragOver = (e: React.DragEvent, projectId: string) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setDragOverProjectId(projectId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverProjectId(null);
  };

  const handleDrop = async (e: React.DragEvent, targetProjectId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverProjectId(null);
    const draggedTaskId =
      e.dataTransfer.getData('text/plain') ||
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
      />

      {/* Projects List */}
      {isLoading ? (
        <div className={styles.emptyState}>Загрузка проектов...</div>
      ) : filteredProjects.length === 0 ? (
        <div className={styles.emptyState}>
          <div style={{ color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
            📁 Проектов с подзадачами не найдено.
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setEditingTask({
              id: '',
              title: '',
              status: 'Todo',
              priority: 'P3',
              category: 'Проект',
              scheduledDate: todayStr,
              createdAt: new Date().toISOString(),
              isRepeating: false,
              hasSubtasks: true,
              targetRepetitions: 8,
              repetitionsCount: 0,
              repetitionHistory: [],
              pomodorosCount: 1,
            })}
          >
            + Создать первый проект
          </Button>
        </div>
      ) : (
        <div className={styles.projectsList}>
          {filteredProjects.map((project) => {
            const isOpen = openProjectIds.has(project.id);
            const isDragOver = dragOverProjectId === project.id;
            const catColor = getCategoryColor(project.category);

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
            const overdueCount = descendants.filter((t) => !t.isRepeating && t.scheduledDate && t.scheduledDate < todayStr && t.status !== 'Done').length;

            // Subtask Date > Project Date Warning Detection
            const subtaskDates = descendants
              .map((t) => t.scheduledDate)
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
                overdueCount={overdueCount}
                hasDateMismatch={hasDateMismatch}
                latestSubtaskDate={latestSubtaskDate}
                sortedSubtasks={sortedSubtasks}
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
  overdueCount: number;
  hasDateMismatch: boolean;
  latestSubtaskDate: string | null;
  sortedSubtasks: Task[];
  tasks: Task[];
  openProjectIds: Set<string>;
  todayStr: string;
  toggleProjectOpen: (id: string) => void;
  onEdit: (task: Task) => void;
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
  overdueCount,
  hasDateMismatch,
  latestSubtaskDate,
  sortedSubtasks,
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
  return (
    <div
      data-project-id={project.id}
      className={`${styles.projectCardBase} ${isDragOver ? styles.projectCardDragOver : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', cursor: 'pointer' }} onClick={() => toggleProjectOpen(project.id)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', color: catColor, fontWeight: 700 }}>● {project.category || 'Проект'}</span>
            {overdueBadge(overdueCount)}
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {project.title}
          </h2>
          {totalCount > 0 && (
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Выполнено {doneCount} из {totalCount} подзадач
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          {totalCount > 0 && (
            <span style={{
              fontSize: '36px',
              fontWeight: 900,
              background: 'linear-gradient(135deg, var(--color-accent-text), var(--color-success))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
            }}>
              {progressPercent}%
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project);
            }}
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
            }}
          >
            ✏️
          </button>
          {isOpen ? (
            <ChevronDown size={20} color="var(--color-accent-text)" />
          ) : (
            <ChevronRight size={20} color="var(--color-accent-text)" />
          )}
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

      {/* Collapsible Subtasks & Sub-Projects List */}
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

const RecursiveSubtaskList: React.FC<{
  parentId: string;
  tasks: Task[];
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
          const subOverdue = subDescendants.filter((t) => !t.isRepeating && t.scheduledDate && t.scheduledDate < todayStr && t.status !== 'Done').length;
          const subCatColor = getCategoryColor(child.category);

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
              onDrop={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const draggedId =
                  e.dataTransfer.getData('text/plain') ||
                  e.dataTransfer.getData('taskId') ||
                  (typeof window !== 'undefined' ? window.__draggedTaskId : null);
                if (draggedId && draggedId !== child.id) {
                  await onDropOnTask(draggedId, child);
                }
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  gap: '8px',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleProjectOpen(child.id);
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', color: subCatColor, fontWeight: 700 }}>● {child.category || 'Подпроект'}</span>
                    {subOverdue > 0 && (
                      <span className={styles.overdueBadge} style={{ fontSize: '10px', padding: '1px 6px' }}>
                        🚨 {subOverdue}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    📁 {child.title}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {subTotal > 0 && (
                    <span style={{ fontSize: '24px', fontWeight: 900, color: '#10b981', lineHeight: 1 }}>
                      {subPercent}%
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(child);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-text-muted)',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                  >
                    ✏️
                  </button>
                  {isSubProjectOpen ? <ChevronDown size={16} color="#38bdf8" /> : <ChevronRight size={16} color="#38bdf8" />}
                </div>
              </div>

              {isSubProjectOpen && (
                <div style={{ marginTop: '10px' }}>
                  <RecursiveSubtaskList
                    parentId={child.id}
                    tasks={tasks}
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

        return (
          <GlassmorphicTaskCard
            key={child.id}
            task={child}
            occurrenceDate={child.scheduledDate || todayStr}
            allTasks={tasks}
            showDragHandle={true}
            parentPathVariant={0}
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

const overdueBadge = (count: number) => {
  if (count <= 0) return null;
  return (
    <span className={styles.overdueBadge}>
      🚨 {count} просрочено
    </span>
  );
};

const DateWarningBanner: React.FC<{
  projectDate: string;
  subtaskDate: string;
  onFixDate: () => void;
}> = ({ projectDate, subtaskDate, onFixDate }) => {
  const pDateStr = formatDateDisplay(projectDate);
  const sDateStr = formatDateDisplay(subtaskDate);

  return (
    <div
      style={{
        margin: '8px 12px 0 12px',
        padding: '10px 14px',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        flexWrap: 'wrap',
        background: 'rgba(30, 41, 59, 0.55)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(251, 191, 36, 0.35)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
      }}
    >
      <div style={{ fontSize: '12.5px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px', minWidth: '180px', flex: 1 }}>
        <span style={{ fontSize: '16px', flexShrink: 0 }}>💡</span>
        <span>
          Проект: <strong style={{ color: '#fbbf24' }}>{pDateStr}</strong> • Крайняя задача: <strong style={{ color: '#38bdf8' }}>{sDateStr}</strong>
        </span>
      </div>
      <button
        type="button"
        onClick={onFixDate}
        style={{
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          border: 'none',
          color: '#fff',
          borderRadius: '8px',
          padding: '6px 14px',
          fontSize: '11.5px',
          fontWeight: 700,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
        }}
      >
        Продлить проект
      </button>
    </div>
  );
};
