'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Button } from '@/shared/ui';
import { useTaskStore, GlassmorphicTaskCard, getAllDescendantTasks, isSubtaskDoneForProject } from '@/entities/task';
import { Task } from '@/entities/task/model/types';
import { EditTaskModal } from '@/features/edit-task/ui/EditTaskModal';
import { RepeatingTaskDetailModal } from '@/features/edit-task/ui/RepeatingTaskDetailModal';
import { getTodayStr } from '@/shared/lib/dateUtils';
import { Archive, ArchiveRestore, ChevronDown, ChevronRight, Pin, PinOff, Plus, Sparkles, Trash2, X } from 'lucide-react';
import { ProjectFilterTabsWidget, ProjectFilterType, ProjectProgressMode } from '@/widgets/project-filter-tabs/ui/ProjectFilterTabsWidget';
import { ProjectSectionBannerWidget } from '@/widgets/project-section-banner/ui/ProjectSectionBannerWidget';
import { registerPointerDropHandler } from '@/shared/lib/pointerDrag';
import { useToastStore } from '@/shared/ui/toast/toastStore';
import { SUBTASK_VARIANTS_LIST, SubtaskVariantId, RepeatingSubtaskRenderer } from './RepeatingSubtaskVariants';
import styles from './ProjectsPage.module.css';

import { getCategoryColor } from '@/shared/config/categoryColors';

export const ProjectsPage: React.FC = () => {
  const { tasks, isLoading, fetchTasks, toggleTaskStatus, updateTaskParent, updateTaskDetails, deleteTaskOccurrence, deleteTask } = useTaskStore();
  const [activeFilter, setActiveFilter] = useState<ProjectFilterType>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('projects-filter-key') as ProjectFilterType;
      if (saved && ['all', 'active', 'paused', 'completed', 'empty', 'archived'].includes(saved)) return saved;
    }
    return 'all';
  });
  const [progressMode, setProgressMode] = useState<ProjectProgressMode>('today');
  const [subtaskVariantId, setSubtaskVariantId] = useState<SubtaskVariantId>(18);
  const [openProjectIds, setOpenProjectIds] = useState<Set<string>>(new Set());
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [dragOverProjectId, setDragOverProjectId] = useState<string | null>(null);
  const [deleteProjectTarget, setDeleteProjectTarget] = useState<Task | null>(null);

  const todayStr = useMemo(() => getTodayStr(), []);

  useEffect(() => {
    fetchTasks();
    const savedMode = localStorage.getItem('project-progress-mode') as ProjectProgressMode;
    if (savedMode === 'today' || savedMode === 'all_time') {
      setProgressMode(savedMode);
    }
  }, [fetchTasks]);

  const handleSelectFilter = (filter: ProjectFilterType) => {
    setActiveFilter(filter);
    if (typeof window !== 'undefined') {
      localStorage.setItem('projects-filter-key', filter);
    }
  };

  const handleToggleProgressMode = (mode: ProjectProgressMode) => {
    setProgressMode(mode);
    localStorage.setItem('project-progress-mode', mode);
  };

  const handleSelectVariant = (id: SubtaskVariantId) => {
    setSubtaskVariantId(id);
    localStorage.setItem('subtaskVariantId', String(id));
  };

  const createProject = () => setEditingTask({
    id: `draft-project-${Date.now()}`, title: '', description: '', link: '', status: 'Todo', priority: 'P3',
    category: 'Без категории', scheduledDate: '', color: '#6366f1', isProject: true, projectStatus: 'planned', projectPinned: false, projectArchivedAt: null, createdAt: new Date().toISOString(),
    isRepeating: false, hasSubtasks: true, targetRepetitions: 8, repetitionsCount: 0,
    repetitionHistory: [], occurrences: [],
  });

  const createTaskInProject = (project: Task) => setEditingTask({
    id: `draft-task-${Date.now()}`,
    title: '',
    description: '',
    link: '',
    status: 'Todo',
    priority: 'P3',
    category: 'Без категории',
    scheduledDate: todayStr,
    parentTaskId: project.id,
    createdAt: new Date().toISOString(),
    isRepeating: false,
    hasSubtasks: false,
    targetRepetitions: 8,
    repetitionsCount: 0,
    repetitionHistory: [],
    occurrences: [],
  });

  const toggleProjectPin = async (project: Task) => {
    await updateTaskDetails(project.id, { projectPinned: !project.projectPinned });
  };

  const toggleProjectArchive = async (project: Task) => {
    await updateTaskDetails(project.id, { projectArchivedAt: project.projectArchivedAt ? null : new Date().toISOString() });
  };

  const deleteProject = async (project: Task, withTasks: boolean) => {
    setDeleteProjectTarget(null);
    await deleteTask(project.id, true, withTasks);
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
    return tasks.filter((t) => t.isProject || t.hasSubtasks || tasks.some((sub) => sub.parentTaskId === t.id));
  }, [tasks]);

  // Main / Parent tasks
  const projectTasks = useMemo(() => {
    return tasks.filter((t) => !t.parentTaskId && (t.isProject || t.hasSubtasks || tasks.some((sub) => sub.parentTaskId === t.id)));
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
      const leafSubtasks = descendants.filter((t) => !t.hasSubtasks && !tasks.some((sub) => sub.parentTaskId === t.id));

      const doneCount = leafSubtasks.filter((t) =>
        progressMode === 'all_time' ? (t.status === 'Done' || t.repeatStatus === 'Completed') : isSubtaskDoneForProject(t, todayStr)
      ).length;

      const isCompleted = leafSubtasks.length > 0 && doneCount === leafSubtasks.length;
      const overdueCount = leafSubtasks.filter((t) => !t.isRepeating && t.scheduledDate && t.scheduledDate < todayStr && t.status !== 'Done').length;

      const status = project.projectStatus || (isCompleted ? 'completed' : 'planned');
      const isArchived = Boolean(project.projectArchivedAt);
      if (activeFilter === 'archived') return isArchived;
      if (isArchived) return false;
      if (activeFilter === 'active') return status === 'planned' || status === 'active';
      if (activeFilter === 'paused') return status === 'paused';
      if (activeFilter === 'completed') return status === 'completed' || isCompleted;
      if (activeFilter === 'empty') return leafSubtasks.length === 0;
      return true;
    });
  }, [projectTasks, tasks, activeFilter, progressMode, todayStr]);

  const sortedFilteredProjects = useMemo(() => [...filteredProjects].sort((a, b) => Number(Boolean(b.projectPinned)) - Number(Boolean(a.projectPinned))), [filteredProjects]);

  const handleDrop = async (e: React.DragEvent, targetProjectId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverProjectId(null);
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
    setDragOverProjectId(targetProjectId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverProjectId(null);
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

  const bannerStats = useMemo(() => {
    const totalProjects = projectTasks.length;
    let activeProjects = 0;
    let completedProjects = 0;
    let overdueProjects = 0;

    projectTasks.forEach((project) => {
      const descendants = getAllDescendantTasks(project.id, tasks);
      const leafSubtasks = descendants.filter((t) => !t.hasSubtasks && !tasks.some((sub) => sub.parentTaskId === t.id));
      const doneCount = leafSubtasks.filter((t) =>
        progressMode === 'all_time' ? (t.status === 'Done' || t.repeatStatus === 'Completed') : isSubtaskDoneForProject(t, todayStr)
      ).length;

      const isCompleted = leafSubtasks.length > 0 && doneCount === leafSubtasks.length;
      const overdueCount = leafSubtasks.filter((t) => !t.isRepeating && t.scheduledDate && t.scheduledDate < todayStr && t.status !== 'Done').length;

      if (isCompleted) completedProjects++;
      else activeProjects++;

      if (overdueCount > 0) overdueProjects++;
    });

    return { totalProjects, activeProjects, completedProjects, overdueProjects };
  }, [projectTasks, tasks, progressMode, todayStr]);

  return (
    <div className={styles.container}>
      {/* 0. Section Info Banner Widget with 19 UI Variants */}
      <ProjectSectionBannerWidget />

      <div className={styles.projectToolbar}>
        <div>
          <h1 className={styles.projectPageTitle}>Проекты</h1>
          <p className={styles.projectPageHint}>Создавайте проекты отдельно и добавляйте в них задачи.</p>
        </div>
        <Button variant="primary" size="sm" onClick={createProject}>
          <Plus size={16} /> Новый проект
        </Button>
      </div>

      {/* 1. Original Filter Tabs Widget */}
      <ProjectFilterTabsWidget
        activeFilter={activeFilter}
        onSelectFilter={handleSelectFilter}
        progressMode={progressMode}
        onToggleProgressMode={handleToggleProgressMode}
      />

      {/* Projects List */}
      {isLoading ? (
        <div className={styles.emptyState}>Загрузка проектов...</div>
      ) : filteredProjects.length === 0 ? (
        <div className={styles.emptyState}>
          {activeFilter === 'all' ? (
            <>
              <div style={{ color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                📁 Проектов пока нет.
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={createProject}
              >
                + Создать проект
              </Button>
            </>
          ) : (
            <div>Нет проектов по выбранному фильтру.</div>
          )}
        </div>
      ) : (
        <div className={styles.projectList}>
          {sortedFilteredProjects.map((project) => {
            const catColor = getCategoryColor(project.category);
            const isOpen = openProjectIds.has(project.id);
            const isDragOver = dragOverProjectId === project.id;

            // Subtasks sorted by nearest scheduled date ascending
            const descendants = getAllDescendantTasks(project.id, tasks);
            const sortedSubtasks = [...descendants].sort((a, b) => {
              if (!a.scheduledDate && !b.scheduledDate) return 0;
              if (!a.scheduledDate) return 1;
              if (!b.scheduledDate) return -1;
              return a.scheduledDate.localeCompare(b.scheduledDate);
            });

            const doneCount = descendants.filter((t) =>
              progressMode === 'all_time' ? t.status === 'Done' : isSubtaskDoneForProject(t, todayStr)
            ).length;
            const totalCount = descendants.length;
            const progressPercent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

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
                sortedSubtasks={sortedSubtasks}
                subtaskVariantId={subtaskVariantId}
                tasks={tasks}
                openProjectIds={openProjectIds}
                todayStr={todayStr}
                progressMode={progressMode}
                toggleProjectOpen={toggleProjectOpen}
                onEdit={(taskToEdit) => setEditingTask(taskToEdit)}
                onDragOver={(e) => handleDragOver(e, project.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, project.id)}
                onDropOnTask={handleDropOnTask}
                onAddTask={() => createTaskInProject(project)}
                onTogglePin={() => toggleProjectPin(project)}
                onToggleArchive={() => toggleProjectArchive(project)}
                onDelete={() => setDeleteProjectTarget(project)}
                onToggleSubtask={(st) => toggleTaskStatus(st.id, undefined, st.scheduledDate || todayStr)}
                onDeleteSubtask={(st) => deleteTaskOccurrence(st.id, st.scheduledDate || todayStr)}
                onSelectSubtask={(st) => {
                  if (st.isRepeating) {
                    setEditingTask(st);
                  } else {
                    setDetailTask(st);
                  }
                }}
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
        isProject={Boolean(editingTask && (editingTask.id.startsWith('draft-project-') || editingTask.isProject || editingTask.hasSubtasks || tasks.some(t => t.parentTaskId === editingTask.id)))}
      />

      {deleteProjectTarget && (
        <div className={styles.dialogOverlay} role="dialog" aria-modal="true">
          <div className={styles.projectDialog}>
            <button type="button" className={styles.dialogClose} onClick={() => setDeleteProjectTarget(null)} aria-label="Закрыть"><X size={18} /></button>
            <h2>Удалить проект?</h2>
            <p>Что сделать с задачами внутри проекта «{deleteProjectTarget.title}»?</p>
            <div className={styles.dialogActions}>
              <Button variant="secondary" size="sm" onClick={() => deleteProject(deleteProjectTarget, false)}>Удалить только проект</Button>
              <Button variant="danger" size="sm" onClick={() => deleteProject(deleteProjectTarget, true)}>Удалить проект и задачи</Button>
            </div>
          </div>
        </div>
      )}

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
  sortedSubtasks: Task[];
  subtaskVariantId: SubtaskVariantId;
  tasks: Task[];
  openProjectIds: Set<string>;
  todayStr: string;
  progressMode?: ProjectProgressMode;
  toggleProjectOpen: (id: string) => void;
  onEdit: (t: Task) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onDropOnTask: (draggedTaskId: string, targetTask: Task) => void;
  onAddTask: () => void;
  onTogglePin: () => void;
  onToggleArchive: () => void;
  onDelete: () => void;
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
  sortedSubtasks,
  subtaskVariantId,
  tasks,
  openProjectIds,
  todayStr,
  progressMode = 'today',
  toggleProjectOpen,
  onEdit,
  onDragOver,
  onDragLeave,
  onDrop,
  onDropOnTask,
  onAddTask,
  onTogglePin,
  onToggleArchive,
  onDelete,
  onToggleSubtask,
  onDeleteSubtask,
  onSelectSubtask,
}) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isVerticalScroll, setIsVerticalScroll] = useState(false);
  const [isSwipedLeft, setIsSwipedLeft] = useState(false);
  const isJustSwipedRef = useRef(false);
  const swipeWidth = 246;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
    setIsVerticalScroll(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const diffX = touchStartX - e.targetTouches[0].clientX;
    const diffY = touchStartY - e.targetTouches[0].clientY;
    if (!isVerticalScroll && Math.abs(diffY) > 6 && Math.abs(diffY) > Math.abs(diffX) && !isSwipedLeft) {
      setIsVerticalScroll(true);
      setSwipeOffset(0);
      return;
    }
    if (isVerticalScroll) return;
    if (isSwipedLeft) {
      setSwipeOffset(Math.min(0, Math.max(-swipeWidth, -swipeWidth - diffX)));
    } else if (diffX > 0) {
      setSwipeOffset(-Math.min(swipeWidth, diffX));
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchStartY === null || isVerticalScroll) {
      setTouchStartX(null);
      setTouchStartY(null);
      return;
    }
    const diff = touchStartX - (touchStartX + swipeOffset);
    isJustSwipedRef.current = Math.abs(swipeOffset) > 20;
    setTimeout(() => { isJustSwipedRef.current = false; }, 300);
    if (isSwipedLeft) {
      setIsSwipedLeft(false);
      setSwipeOffset(0);
    } else if (diff > 45 || swipeOffset < -45) {
      setIsSwipedLeft(true);
      setSwipeOffset(-swipeWidth);
    } else {
      setSwipeOffset(0);
    }
    setTouchStartX(null);
    setTouchStartY(null);
    setIsVerticalScroll(false);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isJustSwipedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

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

  const chevronBtn = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', flexShrink: 0 }}>
      {isOpen ? <ChevronDown size={20} color="var(--color-text-muted)" /> : <ChevronRight size={20} color="var(--color-text-muted)" />}
    </div>
  );
  const projectColor = project.color || catColor;

  return (
    <div className={styles.projectSwipeWrapper}>
      <div className={styles.projectSwipeActions}>
        <button type="button" onClick={onAddTask} title="Добавить задачу"><Plus size={16} /><span>Задача</span></button>
        <button type="button" onClick={() => onEdit(project)} title="Редактировать проект"><span>✏️</span><span>Изменить</span></button>
        <button type="button" onClick={onTogglePin} title={project.projectPinned ? 'Открепить' : 'Закрепить'}>{project.projectPinned ? <Pin size={16} fill="currentColor" /> : <PinOff size={16} />}<span>{project.projectPinned ? 'Открепить' : 'Закрепить'}</span></button>
        <button type="button" onClick={onToggleArchive} title={project.projectArchivedAt ? 'Восстановить' : 'Архивировать'}>{project.projectArchivedAt ? <ArchiveRestore size={16} /> : <Archive size={16} />}<span>{project.projectArchivedAt ? 'Вернуть' : 'Архив'}</span></button>
        <button type="button" onClick={onDelete} title="Удалить" className={styles.swipeDeleteButton}><Trash2 size={16} /><span>Удалить</span></button>
      </div>
      <div
        data-project-id={project.id}
        className={`${styles.projectCardBase} ${isDragOver ? styles.dragOver : ''}`}
        style={{ transform: `translateX(${swipeOffset}px)`, position: 'relative', zIndex: 1 }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleCardClick}
      >
      {/* Project Card Header */}
      <div
        className={styles.headerRow}
        onClick={() => toggleProjectOpen(project.id)}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'nowrap', gap: '12px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
          <span
            aria-label="Цвет проекта"
            style={{ width: '10px', height: '10px', borderRadius: '50%', background: projectColor, boxShadow: `0 0 0 3px ${projectColor}33`, flexShrink: 0 }}
          />
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {project.title}
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, justifyContent: 'flex-end' }}>
          <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
            {project.projectStatus === 'active' ? '🚀 В работе' : project.projectStatus === 'paused' ? '⏸ Пауза' : project.projectStatus === 'completed' ? '✅ Завершён' : '📋 Планируется'}
          </span>
          {totalCount > 0 && (
            <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
              {doneCount}/{totalCount}
            </span>
          )}
          {totalCount > 0 && renderCircleRing(36, 3)}
          {chevronBtn}
        </div>
      </div>

      {(project.description || project.link) && (
        <div className={styles.projectMeta}>
          {project.description && <p>{project.description}</p>}
          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
              🔗 Открыть ссылку
            </a>
          )}
        </div>
      )}

      {isDragOver && (
        <div className={styles.dropZone}>Перетащите сюда, чтобы добавить задачу в проект</div>
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
              subtaskVariantId={subtaskVariantId}
              openProjectIds={openProjectIds}
              toggleProjectOpen={toggleProjectOpen}
              onEdit={onEdit}
              onToggleSubtask={onToggleSubtask}
              onDeleteSubtask={onDeleteSubtask}
              onSelectSubtask={onSelectSubtask}
              onDropOnTask={onDropOnTask}
              todayStr={todayStr}
              progressMode={progressMode}
            />
          )}
        </div>
      )}
      </div>
    </div>
  );
};

const RecursiveSubtaskList: React.FC<{
  parentId: string;
  tasks: Task[];
  subtaskVariantId: SubtaskVariantId;
  openProjectIds: Set<string>;
  toggleProjectOpen: (id: string) => void;
  onEdit: (t: Task) => void;
  onToggleSubtask: (t: Task) => void;
  onDeleteSubtask: (t: Task) => void;
  onSelectSubtask: (t: Task) => void;
  onDropOnTask: (draggedTaskId: string, targetTask: Task) => void;
  todayStr: string;
  progressMode?: ProjectProgressMode;
  depth?: number;
}> = ({
  parentId,
  tasks,
  subtaskVariantId,
  openProjectIds,
  toggleProjectOpen,
  onEdit,
  onToggleSubtask,
  onDeleteSubtask,
  onSelectSubtask,
  onDropOnTask,
  todayStr,
  progressMode = 'today',
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
          const subDone = subDescendants.filter((t) =>
            progressMode === 'all_time' ? t.status === 'Done' : isSubtaskDoneForProject(t, todayStr)
          ).length;
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
                style={{ cursor: 'pointer', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'nowrap', gap: '10px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flex: 1 }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {child.title}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, justifyContent: 'flex-end' }}>
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
                    subtaskVariantId={subtaskVariantId}
                    openProjectIds={openProjectIds}
                    toggleProjectOpen={toggleProjectOpen}
                    onEdit={onEdit}
                    onToggleSubtask={onToggleSubtask}
                    onDeleteSubtask={onDeleteSubtask}
                    onSelectSubtask={onSelectSubtask}
                    onDropOnTask={onDropOnTask}
                    todayStr={todayStr}
                    progressMode={progressMode}
                    depth={depth + 1}
                  />
                </div>
              )}
            </div>
          );
        }

        // RENDER REPEATING SUBTASK ACCORDING TO SELECTED VARIANT (1 THROUGH 20)
        if (child.isRepeating) {
          return (
            <RepeatingSubtaskRenderer
              key={child.id}
              variantId={subtaskVariantId}
              task={child}
              allTasks={tasks}
              todayStr={todayStr}
              onToggleCheckbox={() => onToggleSubtask(child)}
              onDelete={() => onDeleteSubtask(child)}
              onClick={() => onSelectSubtask(child)}
            />
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
            hideCategory={true}
            progressMode={progressMode}
            onToggleCheckbox={() => onToggleSubtask(child)}
            onDelete={() => onDeleteSubtask(child)}
            onClick={() => onSelectSubtask(child)}
          />
        );
      })}
    </div>
  );
};
