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

export const ProjectsPage: React.FC = () => {
  const { tasks, isLoading, fetchTasks, updateTaskStatus, updateTaskParent, updateTaskDetails, deleteTask, deleteTaskOccurrence } = useTaskStore();
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('all');
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
      {/* Header Card */}
      <div className={styles.headerCard}>
        <div className={styles.headerTitleRow}>
          <div className={styles.titleGroup}>
            <Folder size={26} color="#38bdf8" />
            <h1>Проекты ({filteredProjects.length})</h1>
          </div>
        </div>

        {/* Filter Tabs (Point 8) */}
        <div className={styles.filterTabs}>
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
              <div
                key={project.id}
                className={`${styles.projectCard} ${isDragOver ? styles.projectCardDragOver : ''}`}
                onDragOver={(e) => handleDragOver(e, project.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, project.id)}
              >
                {/* Project Header Row */}
                <div
                  className={styles.projectCardHeader}
                  onClick={() => toggleProjectOpen(project.id)}
                >
                  <div className={styles.projectTitleCol}>
                    <div className={styles.projectTitleRow}>
                      <span style={{ fontSize: '20px' }}>📁</span>
                      <h2 className={styles.projectTitle}>{project.title}</h2>

                      {overdueBadgeCount(overdueCount)}
                    </div>

                    {/* Progress Metrics & Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                        Прогресс: {doneCount}/{totalCount} ({progressPercent}%)
                      </span>
                      <div className={styles.progressBarTrack} style={{ flex: 1 }}>
                        <div
                          className={styles.progressBarFill}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTask(project);
                      }}
                      title="Редактировать проект"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '8px',
                        color: '#fff',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      ✏️
                    </button>
                    {isOpen ? <ChevronDown size={20} color="#94a3b8" /> : <ChevronRight size={20} color="#94a3b8" />}
                  </div>
                </div>

                {/* Date Mismatch Warning Banner (Point 12) */}
                {hasDateMismatch && project.scheduledDate && latestSubtaskDate && (
                  <div className={styles.dateWarningBanner}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertCircle size={18} color="#f59e0b" />
                      <div>
                        <strong>⚠️ Есть подзадачи позже даты проекта.</strong>
                        <div style={{ fontSize: '11.5px', opacity: 0.9 }}>
                          Дата проекта: {formatDateDisplay(project.scheduledDate)} | Последняя подзадача: {formatDateDisplay(latestSubtaskDate)}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={styles.dateFixBtn}
                      onClick={() => updateTaskDetails(project.id, { scheduledDate: latestSubtaskDate })}
                    >
                      [Изменить дату проекта]
                    </button>
                  </div>
                )}

                {/* Collapsible Subtasks List */}
                {isOpen && (
                  <div className={styles.subtaskList}>
                    {sortedSubtasks.length === 0 ? (
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', padding: '8px', fontStyle: 'italic' }}>
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
                          onToggleCheckbox={() => toggleTaskStatus(subtask.id, undefined, subtask.scheduledDate || todayStr)}
                          onDelete={() => deleteTaskOccurrence(subtask.id, subtask.scheduledDate || todayStr)}
                          onClick={() => setDetailTask(subtask)}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>
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

const overdueBadgeCount = (count: number) => {
  if (count <= 0) return null;
  return (
    <span className={styles.overdueBadge}>
      🚨 {count} просрочено
    </span>
  );
};
