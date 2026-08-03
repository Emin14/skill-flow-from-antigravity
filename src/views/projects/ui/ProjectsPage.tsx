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
  const [bannerVariant, setBannerVariant] = useState<number>(1);
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

      {/* 🎨 Interactive Warning Banner Design Switcher (10 Variants) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', margin: '0 0 16px 0', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid var(--color-border)' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          🎨 Вариант предупреждения:
        </span>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <button
            key={num}
            type="button"
            style={{
              background: bannerVariant === num ? '#f59e0b' : 'rgba(255,255,255,0.08)',
              border: bannerVariant === num ? 'none' : '1px solid rgba(255,255,255,0.12)',
              color: bannerVariant === num ? '#0f172a' : '#94a3b8',
              borderRadius: '8px',
              padding: '4px 10px',
              fontSize: '12px',
              fontWeight: bannerVariant === num ? 800 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: bannerVariant === num ? '0 2px 8px rgba(245,158,11,0.35)' : 'none',
            }}
            onClick={() => setBannerVariant(num)}
          >
            {num}
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
                bannerVariant={bannerVariant}
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
  bannerVariant: number;
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
  bannerVariant,
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

      {/* Date Mismatch Warning Banner (10 Design Variants Switcher) */}
      {hasDateMismatch && project.scheduledDate && latestSubtaskDate && (
        <DateWarningBanner
          variant={bannerVariant}
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
              toggleProjectOpen={onToggleOpen}
              onEdit={onEdit}
              onToggleSubtask={onToggleSubtask}
              onDeleteSubtask={onDeleteSubtask}
              onSelectSubtask={onSelectSubtask}
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
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  gap: '8px',
                }}
                onClick={() => toggleProjectOpen(child.id)}
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
  variant: number;
  projectDate: string;
  subtaskDate: string;
  onFixDate: () => void;
}> = ({ variant, projectDate, subtaskDate, onFixDate }) => {
  const pDateStr = formatDateDisplay(projectDate);
  const sDateStr = formatDateDisplay(subtaskDate);

  // Common mobile-friendly container styles for all Glassmorphic variants
  const baseMobileGlassStyle: React.CSSProperties = {
    margin: '8px 12px 0 12px',
    padding: '10px 14px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    flexWrap: 'wrap', // Ensures perfect mobile wrapping on narrow screens!
  };

  switch (variant) {
    case 1:
      // Variant 1: Original Modern Glass Card (Golden Glow)
      return (
        <div
          style={{
            ...baseMobileGlassStyle,
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

    case 2:
      // Variant 2: Frosted Cyan-Gold Glass Pill with Date Chips
      return (
        <div
          style={{
            ...baseMobileGlassStyle,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            boxShadow: '0 4px 18px rgba(14, 165, 233, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', minWidth: '180px', flex: 1, flexWrap: 'wrap' }}>
            <span style={{ color: '#f59e0b', fontSize: '15px' }}>⚡</span>
            <span style={{ color: '#e2e8f0', fontWeight: 500 }}>Срок подзадачи превышен:</span>
            <span style={{ background: 'rgba(245, 158, 11, 0.18)', color: '#fde047', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
              📂 {pDateStr}
            </span>
            <span style={{ color: '#94a3b8' }}>➔</span>
            <span style={{ background: 'rgba(56, 189, 248, 0.18)', color: '#38bdf8', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
              📌 {sDateStr}
            </span>
          </div>
          <button
            type="button"
            onClick={onFixDate}
            style={{
              background: 'linear-gradient(135deg, #38bdf8, #0284c7)',
              border: 'none',
              color: '#0f172a',
              borderRadius: '10px',
              padding: '6px 14px',
              fontSize: '11.5px',
              fontWeight: 800,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Подтянуть дату
          </button>
        </div>
      );

    case 3:
      // Variant 3: Glass Strip with Left Amber Accent Bar
      return (
        <div
          style={{
            ...baseMobileGlassStyle,
            background: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(8px)',
            borderLeft: '4px solid #f59e0b',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#f1f5f9', minWidth: '180px', flex: 1 }}>
            <AlertCircle size={16} color="#f59e0b" style={{ flexShrink: 0 }} />
            <span>
              Дата проекта <strong style={{ color: '#fbbf24' }}>{pDateStr}</strong> отстаёт от подзадачи <strong style={{ color: '#38bdf8' }}>{sDateStr}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={onFixDate}
            style={{
              background: 'rgba(245, 158, 11, 0.18)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#fde68a',
              borderRadius: '8px',
              padding: '5px 12px',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Выровнять до {sDateStr}
          </button>
        </div>
      );

    case 4:
      // Variant 4: Soft Neumorphic Glass Card with Warm Amber Glow
      return (
        <div
          style={{
            ...baseMobileGlassStyle,
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8))',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            boxShadow: '0 4px 20px rgba(245, 158, 11, 0.12)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '180px', flex: 1 }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'rgba(245, 158, 11, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fbbf24',
                fontSize: '14px',
                flexShrink: 0,
              }}
            >
              ⚠️
            </div>
            <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
              Крайняя подзадача <strong style={{ color: '#38bdf8' }}>({sDateStr})</strong> выходит за границы проекта <strong style={{ color: '#fbbf24' }}>({pDateStr})</strong>
            </div>
          </div>
          <button
            type="button"
            onClick={onFixDate}
            style={{
              background: '#f59e0b',
              border: 'none',
              color: '#0f172a',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '11.5px',
              fontWeight: 800,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)',
            }}
          >
            Продлить до {sDateStr}
          </button>
        </div>
      );

    case 5:
      // Variant 5: Apple Dynamic Island Glass Bar
      return (
        <div
          style={{
            ...baseMobileGlassStyle,
            borderRadius: '22px',
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(251, 191, 36, 0.35)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', minWidth: '180px', flex: 1 }}>
            <span
              style={{
                background: 'rgba(245, 158, 11, 0.2)',
                color: '#fbbf24',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              ⚠️ Срок
            </span>
            <span style={{ color: '#f1f5f9' }}>
              Проект: <strong>{pDateStr}</strong> ➔ Подзадача: <strong style={{ color: '#38bdf8' }}>{sDateStr}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={onFixDate}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '16px',
              padding: '5px 14px',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Синхронизировать
          </button>
        </div>
      );

    case 6:
      // Variant 6: Deep Slate Glass Ribbon with Gold Border
      return (
        <div
          style={{
            ...baseMobileGlassStyle,
            background: 'rgba(30, 41, 59, 0.4)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#e2e8f0', minWidth: '180px', flex: 1 }}>
            <span>📂</span>
            <span>
              Срок проекта <strong>{pDateStr}</strong> меньше даты подзадачи <strong>{sDateStr}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={onFixDate}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              color: '#fff',
              borderRadius: '8px',
              padding: '5px 12px',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Обновить дату
          </button>
        </div>
      );

    case 7:
      // Variant 7: Things 3 Translucent Pill Card
      return (
        <div
          style={{
            ...baseMobileGlassStyle,
            background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(10px)',
            border: '1px dashed rgba(245, 158, 11, 0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#fcd34d', minWidth: '180px', flex: 1 }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b', flexShrink: 0 }} />
            <span>
              Крайняя подзадача (<strong>{sDateStr}</strong>) выходит за срок проекта (<strong>{pDateStr}</strong>)
            </span>
          </div>
          <button
            type="button"
            onClick={onFixDate}
            style={{
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#fbbf24',
              borderRadius: '8px',
              padding: '4px 12px',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Установить {sDateStr}
          </button>
        </div>
      );

    case 8:
      // Variant 8: Linear Dark Glass Card with Monospace Date Badges
      return (
        <div
          style={{
            ...baseMobileGlassStyle,
            background: '#090d16',
            border: '1px solid #334155',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', minWidth: '180px', flex: 1 }}>
            <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, fontFamily: 'monospace' }}>
              MISMATCH
            </span>
            <span style={{ color: '#cbd5e1' }}>
              <code style={{ color: '#fbbf24' }}>{pDateStr}</code> ➔ <code style={{ color: '#38bdf8' }}>{sDateStr}</code>
            </span>
          </div>
          <button
            type="button"
            onClick={onFixDate}
            style={{
              background: '#f59e0b',
              border: 'none',
              color: '#0f172a',
              borderRadius: '6px',
              padding: '5px 12px',
              fontSize: '11.5px',
              fontWeight: 800,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Сдвинуть проект
          </button>
        </div>
      );

    case 9:
      // Variant 9: Vercel Frosted Border Gradient Card
      return (
        <div
          style={{
            ...baseMobileGlassStyle,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(12px)',
            border: '1px solid transparent',
            backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), linear-gradient(90deg, #f59e0b, #0ea5e9)',
            backgroundOrigin: 'border-box',
            backgroundClip: 'padding-box, border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#e2e8f0', minWidth: '180px', flex: 1 }}>
            <span style={{ color: '#f59e0b' }}>🔔</span>
            <span>
              Срок проекта <strong>{pDateStr}</strong> меньше даты подзадачи <strong>{sDateStr}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={onFixDate}
            style={{
              background: 'linear-gradient(90deg, #f59e0b, #0ea5e9)',
              border: 'none',
              color: '#0f172a',
              borderRadius: '8px',
              padding: '5px 14px',
              fontSize: '11.5px',
              fontWeight: 800,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Авто-продление
          </button>
        </div>
      );

    case 10:
    default:
      // Variant 10: Compact Mobile Glass Chip
      return (
        <div
          style={{
            ...baseMobileGlassStyle,
            background: 'rgba(239, 68, 68, 0.08)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(239, 68, 68, 0.28)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#fca5a5', minWidth: '180px', flex: 1 }}>
            <span>⚠️</span>
            <span>
              Подзадача на <strong>{sDateStr}</strong> выходит за дату проекта (<strong>{pDateStr}</strong>)
            </span>
          </div>
          <button
            type="button"
            onClick={onFixDate}
            style={{
              background: '#ef4444',
              border: 'none',
              color: '#fff',
              borderRadius: '8px',
              padding: '5px 12px',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            ⚡ Сдвинуть на {sDateStr}
          </button>
        </div>
      );
  }
};
