'use client';

import React, { useEffect, useState, useMemo } from 'react';
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

  // Main / Parent tasks (hasSubtasks: true or has children)
  const projectTasks = useMemo(() => {
    return tasks.filter((t) => !t.parentTaskId && (t.hasSubtasks || tasks.some((sub) => sub.parentTaskId === t.id)));
  }, [tasks]);

  // Expand all projects by default when loaded
  useEffect(() => {
    if (projectTasks.length > 0) {
      setOpenProjectIds(new Set(projectTasks.map((p) => p.id)));
    }
  }, [projectTasks]);

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
                todayStr={todayStr}
                onToggleOpen={() => toggleProjectOpen(project.id)}
                onEdit={() => setEditingTask(project)}
                onDragOver={(e) => handleDragOver(e, project.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, project.id)}
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
  todayStr: string;
  onToggleOpen: () => void;
  onEdit: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
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
  todayStr,
  onToggleOpen,
  onEdit,
  onDragOver,
  onDragLeave,
  onDrop,
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
          <button type="button" onClick={(e) => { e.stopPropagation(); onEdit(); }} style={{ background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: '6px', color: '#fff', padding: '4px 8px', cursor: 'pointer' }}>✏️</button>
        </div>
      )}

      {/* Main Header Row (Strict Title Truncation - Point 3) */}
      <div className={styles.projectCardHeader} onClick={onToggleOpen} style={variant === 6 ? { padding: '14px 18px 0 18px' } : undefined}>
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
                onEdit();
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

      {/* Date Mismatch Warning Banner (Point 12) */}
      {hasDateMismatch && project.scheduledDate && latestSubtaskDate && (
        <div className={styles.dateWarningBanner} style={variant === 6 ? { margin: '0 18px' } : undefined}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} color="#f59e0b" />
            <div>
              <strong>⚠️ Есть подзадачи позже даты проекта.</strong>
              <div style={{ fontSize: '11px', opacity: 0.9 }}>
                Дата проекта: {formatDateDisplay(project.scheduledDate)} | Последняя подзадача: {formatDateDisplay(latestSubtaskDate)}
              </div>
            </div>
          </div>
          <button type="button" className={styles.dateFixBtn} onClick={onFixDate}>
            [Изменить дату проекта]
          </button>
        </div>
      )}

      {/* Collapsible Subtasks List */}
      {isOpen && (
        <div className={styles.subtaskList} style={variant === 6 ? { padding: '10px 18px 18px 18px' } : undefined}>
          {sortedSubtasks.length === 0 ? (
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', padding: '6px 0', fontStyle: 'italic' }}>
              Нет подзадач в проекте (Перетащите сюда задачи).
            </div>
          ) : (
            sortedSubtasks.map((subtask) => (
              <GlassmorphicTaskCard
                key={subtask.id}
                task={subtask}
                occurrenceDate={subtask.scheduledDate || todayStr}
                allTasks={tasks}
                showDragHandle={true}
                parentPathVariant={0}
                onToggleCheckbox={() => onToggleSubtask(subtask)}
                onDelete={() => onDeleteSubtask(subtask)}
                onClick={() => onSelectSubtask(subtask)}
              />
            ))
          )}
        </div>
      )}
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
