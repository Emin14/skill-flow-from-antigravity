'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useTaskStore, GlassmorphicTaskCard, getAllDescendantTasks } from '@/entities/task';
import { Task } from '@/entities/task/model/types';
import { EditTaskModal } from '@/features/edit-task/ui/EditTaskModal';
import { RepeatingTaskDetailModal } from '@/features/edit-task/ui/RepeatingTaskDetailModal';
import { getTodayStr, formatDateDisplay } from '@/shared/lib/dateUtils';
import { Folder, AlertCircle, ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import styles from './ProjectsPage.module.css';

type ProjectFilter = 'all' | 'active' | 'completed' | 'has_overdue';

const getCategoryColor = (cat?: string): string => {
  switch (cat) {
    case 'Работа': return '#0ea5e9';
    case 'Здоровье': return '#10b981';
    case 'Обучение': return '#f59e0b';
    case 'Личное': return '#ec4899';
    case 'Финансы': return '#8b5cf6';
    case 'Практика Frontend': return '#06b6d4';
    case 'Опыт на камеру': return '#a855f7';
    case 'Теория': return '#3b82f6';
    case 'Без категории':
    default: return 'rgba(255, 255, 255, 0.3)';
  }
};

export const ProjectsPage: React.FC = () => {
  const { tasks, isLoading, fetchTasks, toggleTaskStatus, updateTaskStatus, updateTaskParent, updateTaskDetails, deleteTask, deleteTaskOccurrence } = useTaskStore();
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('all');
  const [cardVariant, setCardVariant] = useState<number>(8);
  const [openProjectIds, setOpenProjectIds] = useState<Set<string>>(new Set());
  const [dragOverProjectId, setDragOverProjectId] = useState<string | null>(null);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);

  const todayStr = useMemo(() => getTodayStr(), []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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

  // Filtered projects (Point 6: No project count title, no card wrapper around filters)
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
    e.dataTransfer.dropEffect = 'move';
    setDragOverProjectId(projectId);
  };

  const handleDragLeave = () => {
    setDragOverProjectId(null);
  };

  const handleDrop = async (e: React.DragEvent, targetProjectId: string) => {
    e.preventDefault();
    setDragOverProjectId(null);
    const draggedTaskId = e.dataTransfer.getData('text/plain');
    if (draggedTaskId && draggedTaskId !== targetProjectId) {
      await updateTaskParent(draggedTaskId, targetProjectId);
    }
  };

  const handleDropOnTask = async (draggedTaskId: string, targetTask: Task) => {
    if (draggedTaskId === targetTask.id) return;
    await updateTaskParent(draggedTaskId, targetTask.id);
  };

  return (
    <div className={styles.container}>
      {/* Floating Filter Tabs (Point 6: Clean tabs without card box or title count) */}
      <div className={styles.filterTabsRow}>
        {[
          { id: 'all', label: 'Все' },
          { id: 'active', label: 'Активные' },
          { id: 'completed', label: 'Завершенные' },
          { id: 'has_overdue', label: '⚠️ Есть просроченные' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.filterBtn} ${activeFilter === tab.id ? styles.filterBtnActive : ''}`}
            onClick={() => setActiveFilter(tab.id as ProjectFilter)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Projects List */}
      {isLoading ? (
        <div className={styles.emptyState}>Загрузка проектов...</div>
      ) : filteredProjects.length === 0 ? (
        <div className={styles.emptyState}>
          📁 Проектов с подзадачами не найдено.
        </div>
      ) : (
        <div className={styles.projectsList}>
          {filteredProjects.map((project) => {
            const isOpen = openProjectIds.has(project.id);
            const isDragOver = dragOverProjectId === project.id;
            const catColor = getCategoryColor(project.category);

            // Subtasks sorted by nearest scheduled date ascending (Point 6)
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

            // Subtask Date > Project Date Warning Detection (Point 12)
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
                variant={cardVariant}
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
  variant: number;
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
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onDropOnTask: (draggedTaskId: string, targetTask: Task) => void;
  onFixDate: () => void;
  onToggleSubtask: (t: Task) => void;
  onDeleteSubtask: (t: Task) => void;
  onSelectSubtask: (t: Task) => void;
}

const ProjectCardRenderer: React.FC<ProjectCardRendererProps> = ({
  variant,
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
  // Dynamic styling per card variant
  const getCardStyle = (): React.CSSProperties => {
    switch (variant) {
      case 2: // Linear Monospace Dark
        return { fontFamily: 'monospace' };
      case 3: // Notion Document Block
        return { borderLeft: '4px solid #38bdf8' };
      case 7: // Neumorphic Soft Glow
        return { boxShadow: `0 0 20px ${catColor}35`, border: `1px solid ${catColor}50` };
      case 10: // ClickUp Vertical Accent Strip
        return { borderLeft: `6px solid ${catColor}` };
      case 8: // Compact Expandable Accordion Bar
      default:
        return {};
    }
  };

  return (
    <div
      className={`${styles.projectCardBase} ${isDragOver ? styles.projectCardDragOver : ''}`}
      style={{ ...getCardStyle(), position: 'relative' }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* Top Accent Bar for Variant 1 */}
      {variant === 1 && (
        <div style={{ height: '3px', margin: '-16px -18px 8px -18px', background: `linear-gradient(90deg, ${catColor} 0%, transparent 90%)` }} />
      )}

      {/* Full Banner Header for Variant 6 */}
      {variant === 6 && (
        <div style={{ padding: '14px 18px', background: `linear-gradient(135deg, ${catColor}50 0%, rgba(15,23,42,0.9) 100%)`, borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
            <span style={{ fontSize: '18px' }}>📂</span>
            <h2 className={styles.projectTitle} style={{ color: '#ffffff', fontWeight: 800 }}>{project.title}</h2>
          </div>
          <button type="button" onClick={(e) => { e.stopPropagation(); onEdit(project); }} style={{ background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: '6px', color: '#fff', padding: '4px 8px', cursor: 'pointer' }}>✏️</button>
        </div>
      )}

      {/* Main Header Row (Strict Title Truncation - Point 3) */}
      <div className={styles.projectCardHeader} onClick={() => toggleProjectOpen(project.id)} style={variant === 6 ? { padding: '14px 18px 0 18px' } : undefined}>
        <div className={styles.projectTitleCol}>
          <div className={styles.projectTitleRow}>
            {variant !== 6 && <span style={{ fontSize: '18px', flexShrink: 0 }}>📁</span>}
            {variant !== 6 && (
              <h2 className={styles.projectTitle} title={project.title}>
                {project.title}
              </h2>
            )}
            {overdueBadge(overdueCount)}
          </div>

          {/* Progress Metric: ONLY SHOWN IF totalCount > 0 (Point 4 Fix) */}
          {totalCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
              <span style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.65)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                Прогресс: {doneCount}/{totalCount} ({progressPercent}%)
              </span>
              <div className={styles.progressBarTrack} style={{ flex: 1 }}>
                <div className={styles.progressBarFill} style={{ width: `${progressPercent}%`, background: variant === 7 ? `linear-gradient(90deg, ${catColor}, #10b981)` : undefined }} />
              </div>
            </div>
          )}
        </div>

        {/* Right side widgets per variant */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {variant === 4 && totalCount > 0 && (
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.15)', padding: '3px 10px', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.3)' }}>
              {progressPercent}%
            </span>
          )}

          {variant === 9 && totalCount > 0 && (
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '20px', fontWeight: 900, background: 'linear-gradient(135deg, #38bdf8, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {progressPercent}%
              </span>
            </div>
          )}

          {variant !== 6 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
              title="Редактировать проект"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px',
                color: '#fff',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              ✏️
            </button>
          )}
          {isOpen ? <ChevronDown size={18} color="#94a3b8" /> : <ChevronRight size={18} color="#94a3b8" />}
        </div>
      </div>

      {/* Date Mismatch Warning Banner (Glassmorphic Card) */}
      {hasDateMismatch && project.scheduledDate && latestSubtaskDate && (
        <DateWarningBanner
          projectDate={project.scheduledDate}
          subtaskDate={latestSubtaskDate}
          onFixDate={onFixDate}
        />
      )}

      {/* Collapsible Subtasks & Sub-Projects List (Point 2) */}
      {isOpen && (
        <div className={styles.subtaskList} style={variant === 6 ? { padding: '10px 18px 18px 18px' } : undefined}>
          {sortedSubtasks.length === 0 ? (
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', padding: '6px 0', fontStyle: 'italic' }}>
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

          return (
            <div
              key={child.id}
              className={styles.projectCardBase}
              style={{
                borderRadius: '16px',
                border: '1px solid rgba(14, 165, 233, 0.25)',
                background: 'rgba(14, 165, 233, 0.04)',
                padding: '12px 14px',
                marginTop: '4px',
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
              }}
              onDrop={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const draggedId = e.dataTransfer.getData('text/plain');
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                  <span style={{ fontSize: '16px', flexShrink: 0 }}>📁</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {child.title}
                  </span>
                  {subOverdue > 0 && (
                    <span className={styles.overdueBadge} style={{ fontSize: '10px', padding: '1px 6px' }}>
                      🚨 {subOverdue}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {subTotal > 0 && (
                    <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>
                      {subDone}/{subTotal} ({subPercent}%)
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
                  {isSubProjectOpen ? <ChevronDown size={16} color="#94a3b8" /> : <ChevronRight size={16} color="#94a3b8" />}
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
