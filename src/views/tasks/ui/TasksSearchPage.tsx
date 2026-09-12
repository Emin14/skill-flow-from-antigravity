'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Card, Typography } from '@/shared/ui';
import { useTaskStore, GlassmorphicTaskCard } from '@/entities/task';
import { Task, TaskPriority, TaskStatus } from '@/entities/task/model/types';
import { SmartRating } from '@/shared/config/repetitionRules';
import { useCategoryStore } from '@/entities/category/model/useCategoryStore';
import { EditTaskModal } from '@/features/edit-task/ui/EditTaskModal';
import { RepeatingTaskDetailModal } from '@/features/edit-task/ui/RepeatingTaskDetailModal';
import { SmartRatingModal } from '@/features/smart-rating-modal/ui/SmartRatingModal';
import { getTodayStr, isSmartRepeatTask } from '@/shared/lib/dateUtils';
import { Search, X, RotateCcw } from 'lucide-react';
import styles from './TasksSearchPage.module.css';

type StatusFilterType = 'all' | 'todo' | 'done';
type DateFilterType = 'all' | 'today' | 'overdue' | 'upcoming' | 'nodate';

interface TaskInstanceItem {
  key: string;
  task: Task;
  occurrenceDate?: string;
  status: TaskStatus;
  smartRating?: SmartRating | null;
  note?: string | null;
  completedAt?: string | null;
  isRepeatingInstance: boolean;
}

export const TasksSearchPage: React.FC = () => {
  const {
    tasks,
    isLoading,
    fetchTasks,
    toggleTaskStatus,
    updateTaskStatus,
    deleteTask,
    deleteTaskOccurrence,
    rescheduleTaskToToday,
  } = useTaskStore();

  const storeCategories = useCategoryStore((s) => s.categories);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all');

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [detailOccurrenceDate, setDetailOccurrenceDate] = useState<string | undefined>(undefined);

  const [smartTask, setSmartTask] = useState<Task | null>(null);
  const [smartDate, setSmartDate] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const todayStr = useMemo(() => getTodayStr(), []);

  // 1. Flatten tasks into individual instances (occurrences for repeating tasks, leaf tasks for non-repeating).
  // Head/master tasks are NOT displayed: only their concrete instances/occurrences with dates.
  const allInstances = useMemo(() => {
    const list: TaskInstanceItem[] = [];

    for (const task of tasks) {
      // Exclude project containers (parent tasks with subtasks)
      const hasChildren = tasks.some((sub) => sub.parentTaskId === task.id);
      if (task.hasSubtasks || hasChildren) {
        continue;
      }

      if (task.isRepeating) {
        const occs = task.occurrences || [];
        if (occs.length > 0) {
          for (const occ of occs) {
            list.push({
              key: `${task.id}_${occ.date}`,
              task,
              occurrenceDate: occ.date,
              status: occ.status,
              smartRating: occ.smartRating,
              note: occ.note,
              completedAt: occ.completedAt,
              isRepeatingInstance: true,
            });
          }
        } else {
          const date = task.scheduledDate && task.scheduledDate !== 'anytime' ? task.scheduledDate : undefined;
          list.push({
            key: `${task.id}_fallback`,
            task,
            occurrenceDate: date,
            status: task.status || 'Todo',
            smartRating: task.lastSmartRating,
            note: null,
            completedAt: null,
            isRepeatingInstance: true,
          });
        }
      } else {
        const date = task.scheduledDate && task.scheduledDate !== 'anytime' ? task.scheduledDate : undefined;
        list.push({
          key: task.id,
          task,
          occurrenceDate: date,
          status: task.status || 'Todo',
          smartRating: undefined,
          note: null,
          completedAt: null,
          isRepeatingInstance: false,
        });
      }
    }

    return list;
  }, [tasks]);

  // Available unique categories from store and tasks
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    storeCategories.forEach((c) => {
      if (c.name) cats.add(c.name);
    });
    tasks.forEach((t) => {
      if (t.category) cats.add(t.category);
    });
    return Array.from(cats).sort();
  }, [storeCategories, tasks]);

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.trim() !== '' ||
      statusFilter !== 'all' ||
      categoryFilter !== 'all' ||
      dateFilter !== 'all' ||
      priorityFilter !== 'all'
    );
  }, [searchQuery, statusFilter, categoryFilter, dateFilter, priorityFilter]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setDateFilter('all');
    setPriorityFilter('all');
  };

  // Filtered & sorted task instances list
  const filteredInstances = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return allInstances
      .filter((item) => {
        // 1. Text Search Filter (title, description, occurrence note, link)
        if (query) {
          const titleMatch = item.task.title.toLowerCase().includes(query);
          const descMatch = item.task.description?.toLowerCase().includes(query) ?? false;
          const linkMatch = item.task.link?.toLowerCase().includes(query) ?? false;
          const noteMatch = item.note?.toLowerCase().includes(query) ?? false;

          if (!titleMatch && !descMatch && !linkMatch && !noteMatch) {
            return false;
          }
        }

        // 2. Status Filter
        if (statusFilter === 'todo' && item.status === 'Done') return false;
        if (statusFilter === 'done' && item.status !== 'Done') return false;

        // 3. Category Filter
        if (categoryFilter !== 'all') {
          const cat = item.task.category || 'Без категории';
          if (cat !== categoryFilter) return false;
        }

        // 4. Date Filter
        if (dateFilter !== 'all') {
          const itemDate = item.occurrenceDate?.trim();
          const hasDate = Boolean(itemDate && itemDate !== 'anytime');

          if (dateFilter === 'today') {
            if (itemDate !== todayStr) return false;
          } else if (dateFilter === 'overdue') {
            if (!hasDate || !itemDate || itemDate >= todayStr || item.status === 'Done') return false;
          } else if (dateFilter === 'upcoming') {
            if (!hasDate || !itemDate || itemDate <= todayStr) return false;
          } else if (dateFilter === 'nodate') {
            if (hasDate) return false;
          }
        }

        // 5. Priority Filter
        if (priorityFilter !== 'all') {
          if (item.task.priority !== priorityFilter) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // 1. Uncompleted tasks ('Todo'/'InProgress') first, completed ('Done') at bottom
        const aDone = a.status === 'Done' ? 1 : 0;
        const bDone = b.status === 'Done' ? 1 : 0;
        if (aDone !== bDone) return aDone - bDone;

        // 2. Query relevance by title
        if (query) {
          const aTitle = a.task.title.toLowerCase();
          const bTitle = b.task.title.toLowerCase();
          const aIdx = aTitle.indexOf(query);
          const bIdx = bTitle.indexOf(query);
          if (aIdx !== -1 && bIdx !== -1 && aIdx !== bIdx) return aIdx - bIdx;
        }

        // 3. For uncompleted: earliest due date first
        if (aDone === 0) {
          const aDate = a.occurrenceDate || '9999-99-99';
          const bDate = b.occurrenceDate || '9999-99-99';
          if (aDate !== bDate) return aDate.localeCompare(bDate);

          const priorityWeight: Record<TaskPriority, number> = { P1: 1, P2: 2, P3: 3, P4: 4 };
          const pA = priorityWeight[a.task.priority || 'P4'] ?? 4;
          const pB = priorityWeight[b.task.priority || 'P4'] ?? 4;
          if (pA !== pB) return pA - pB;
          return a.task.title.localeCompare(b.task.title);
        }

        // 4. For completed: most recently completed first (descending date)
        const aDate = a.occurrenceDate || a.completedAt?.split('T')[0] || '0000-00-00';
        const bDate = b.occurrenceDate || b.completedAt?.split('T')[0] || '0000-00-00';
        if (aDate !== bDate) return bDate.localeCompare(aDate);
        return a.task.title.localeCompare(b.task.title);
      });
  }, [allInstances, searchQuery, statusFilter, categoryFilter, dateFilter, priorityFilter, todayStr]);

  const handleToggleCheckbox = (item: TaskInstanceItem) => {
    if (item.isRepeatingInstance && item.occurrenceDate) {
      if (item.status === 'Done') {
        toggleTaskStatus(item.task.id, undefined, item.occurrenceDate);
      } else if (isSmartRepeatTask(item.task)) {
        if (item.smartRating) {
          updateTaskStatus(item.task.id, 'Done', item.smartRating, item.occurrenceDate);
        } else {
          setSmartTask(item.task);
          setSmartDate(item.occurrenceDate);
        }
      } else {
        toggleTaskStatus(item.task.id, undefined, item.occurrenceDate);
      }
    } else {
      toggleTaskStatus(item.task.id);
    }
  };

  const handleSelectSmartRating = (rating: SmartRating, pomodorosCount?: number) => {
    if (smartTask && smartDate) {
      updateTaskStatus(smartTask.id, 'Done', rating, smartDate, pomodorosCount);
      setSmartTask(null);
      setSmartDate(undefined);
    }
  };

  const handleItemClick = (item: TaskInstanceItem) => {
    if (item.isRepeatingInstance) {
      setDetailTask(item.task);
      setDetailOccurrenceDate(item.occurrenceDate);
    } else {
      setEditingTask(item.task);
    }
  };

  const handleDeleteItem = (item: TaskInstanceItem) => {
    if (item.isRepeatingInstance && item.occurrenceDate) {
      deleteTaskOccurrence(item.task.id, item.occurrenceDate);
    } else {
      deleteTask(item.task.id);
    }
  };

  const renderExtraMeta = (item: TaskInstanceItem) => {
    return (
      <>
        {item.smartRating && (
          <span
            style={{
              fontSize: '10px',
              padding: '1px 6px',
              borderRadius: '5px',
              background: 'rgba(139, 92, 246, 0.15)',
              color: 'var(--color-accent-text)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
            }}
            title={`Оценка сложности: ${item.smartRating}`}
          >
            {item.smartRating === 'again' && '🔁 Снова'}
            {item.smartRating === 'hard' && '⚡ Сложно'}
            {item.smartRating === 'normal' && '👍 Хорошо'}
            {item.smartRating === 'easy' && '🌟 Легко'}
          </span>
        )}
        {item.note && (
          <span
            style={{
              fontSize: '10px',
              padding: '1px 6px',
              borderRadius: '5px',
              background: 'var(--color-surface)',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              maxWidth: '180px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={`Заметка к повторению: ${item.note}`}
          >
            📝 {item.note}
          </span>
        )}
      </>
    );
  };

  return (
    <div className={styles.container}>
      {/* Search & Filter Header Banner */}
      <div className={styles.searchBanner}>
        <div className={styles.searchHeaderRow}>
          <h2 className={styles.searchTitle}>
            <span>🔍</span>
            <span>Все задачи</span>
          </h2>
          <span className={styles.counterBadge}>
            Найдено: {filteredInstances.length} {allInstances.length > 0 ? `из ${allInstances.length}` : ''}
          </span>
        </div>

        {/* Fulltext Search Input */}
        <div className={styles.searchInputWrapper}>
          <Search size={17} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Поиск по названию, описанию, заметкам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => setSearchQuery('')}
              title="Очистить поиск"
              aria-label="Очистить поиск"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Filters Grid */}
        <div className={styles.filtersGrid}>
          {/* 1. Status Filter */}
          <select
            className={`${styles.filterSelect} ${statusFilter !== 'all' ? styles.filterSelectActive : ''}`}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilterType)}
          >
            <option value="all">⚡ Все статусы</option>
            <option value="todo">⏳ В работе</option>
            <option value="done">✓ Завершённые</option>
          </select>

          {/* 2. Category Filter */}
          <select
            className={`${styles.filterSelect} ${categoryFilter !== 'all' ? styles.filterSelectActive : ''}`}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">📁 Все категории</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                🏷️ {cat}
              </option>
            ))}
          </select>

          {/* 3. Date / Period Filter */}
          <select
            className={`${styles.filterSelect} ${dateFilter !== 'all' ? styles.filterSelectActive : ''}`}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as DateFilterType)}
          >
            <option value="all">📅 Все сроки</option>
            <option value="today">☀️ Сегодня</option>
            <option value="overdue">🚨 Просроченные</option>
            <option value="upcoming">📆 Предстоящие</option>
            <option value="nodate">♾️ Без даты</option>
          </select>

          {/* 4. Priority Filter */}
          <select
            className={`${styles.filterSelect} ${priorityFilter !== 'all' ? styles.filterSelectActive : ''}`}
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as 'all' | TaskPriority)}
          >
            <option value="all">🎯 Все приоритеты</option>
            <option value="P1">🔴 P1 (Высокий)</option>
            <option value="P2">🟠 P2 (Средний)</option>
            <option value="P3">🔵 P3 (Низкий)</option>
            <option value="P4">⚪ P4 (Без приоритета)</option>
          </select>

          {/* Reset button if any filter or query active */}
          {hasActiveFilters && (
            <button
              type="button"
              className={styles.resetBtn}
              onClick={handleResetFilters}
              title="Сбросить все параметры поиска и фильтры"
            >
              <RotateCcw size={12} />
              <span>Сбросить</span>
            </button>
          )}
        </div>
      </div>

      {/* Results List */}
      {isLoading ? (
        <Card style={{ textAlign: 'center', padding: 'var(--space-8, 32px)' }}>
          <Typography variant="body" style={{ color: 'var(--color-text-muted)' }}>
            Загрузка задач...
          </Typography>
        </Card>
      ) : filteredInstances.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔍</div>
          <h3 className={styles.emptyTitle}>Ничего не найдено</h3>
          <p className={styles.emptySubtitle}>
            {hasActiveFilters
              ? 'Попробуйте изменить запрос или сбросьте установленные фильтры.'
              : 'В вашем списке пока нет задач.'}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              className={styles.resetBtn}
              style={{ marginTop: '8px' }}
              onClick={handleResetFilters}
            >
              <RotateCcw size={13} />
              <span>Сбросить фильтры</span>
            </button>
          )}
        </div>
      ) : (
        <div className={styles.taskList}>
          {filteredInstances.map((item) => (
            <GlassmorphicTaskCard
              key={item.key}
              task={item.task}
              occurrenceDate={item.occurrenceDate}
              allTasks={tasks}
              showDragHandle={false}
              extraMetaNode={renderExtraMeta(item)}
              onToggleCheckbox={() => handleToggleCheckbox(item)}
              onRescheduleToToday={
                item.occurrenceDate && item.occurrenceDate < todayStr && item.status !== 'Done'
                  ? () => rescheduleTaskToToday(item.task.id)
                  : undefined
              }
              onDelete={() => handleDeleteItem(item)}
              onClick={() => handleItemClick(item)}
            />
          ))}
        </div>
      )}

      {/* Repeating Task Detail Modal */}
      <RepeatingTaskDetailModal
        task={detailTask}
        occurrenceDate={detailOccurrenceDate}
        isOpen={!!detailTask}
        onClose={() => {
          setDetailTask(null);
          setDetailOccurrenceDate(undefined);
        }}
        onOpenEdit={() => {
          if (detailTask) {
            const t = detailTask;
            setDetailTask(null);
            setDetailOccurrenceDate(undefined);
            setEditingTask(t);
          }
        }}
      />

      {/* Edit Regular Task Modal */}
      <EditTaskModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
      />

      {/* Smart Rating Modal for Repeating Tasks */}
      <SmartRatingModal
        task={smartTask}
        isOpen={!!smartTask}
        onSelectRating={handleSelectSmartRating}
        onClose={() => {
          setSmartTask(null);
          setSmartDate(undefined);
        }}
      />
    </div>
  );
};
