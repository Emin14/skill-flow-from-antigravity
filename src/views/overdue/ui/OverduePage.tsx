'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Card, Typography } from '@/shared/ui';
import { useTaskStore, GlassmorphicTaskCard } from '@/entities/task';
import { Task } from '@/entities/task/model/types';
import { EditTaskModal } from '@/features/edit-task/ui/EditTaskModal';
import { RepeatingTaskDetailModal } from '@/features/edit-task/ui/RepeatingTaskDetailModal';
import { SmartRatingModal } from '@/features/smart-rating-modal/ui/SmartRatingModal';
import { getTodayStr, isSmartRepeatTask } from '@/shared/lib/dateUtils';
import { SmartRating } from '@/shared/config/repetitionRules';
import { CheckCircle2, Lightbulb } from 'lucide-react';
import { OverdueHeaderWidget } from '@/widgets/overdue-header/ui/OverdueHeaderWidget';
import { OverdueFilterSortWidget, OverdueSortKey, OverdueSortDirection } from '@/widgets/overdue-filter-sort/ui/OverdueFilterSortWidget';
import styles from './OverduePage.module.css';

export const OverduePage: React.FC = () => {
  const { tasks, isLoading, fetchTasks, toggleTaskStatus, updateTaskStatus, deleteTaskOccurrence, rescheduleTaskToToday } = useTaskStore();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [smartTask, setSmartTask] = useState<Task | null>(null);

  // Category filter & Sorting state
  const [categoryFilter, setCategoryFilter] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('overdue-category-filter');
      if (saved) return saved;
    }
    return 'all';
  });
  const [sortKey, setSortKey] = useState<OverdueSortKey>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('overdue-sort-key') as OverdueSortKey;
      if (saved && ['date', 'alphabetical', 'count'].includes(saved)) return saved;
    }
    return 'date';
  });
  const [sortDirection, setSortDirection] = useState<OverdueSortDirection>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('overdue-sort-direction') as OverdueSortDirection;
      if (saved && ['asc', 'desc'].includes(saved)) return saved;
    }
    return 'asc';
  });

  const handleSelectCategoryFilter = (cat: string) => {
    setCategoryFilter(cat);
    if (typeof window !== 'undefined') {
      localStorage.setItem('overdue-category-filter', cat);
    }
  };

  const handleSelectSortKey = (key: OverdueSortKey) => {
    setSortKey(key);
    if (typeof window !== 'undefined') {
      localStorage.setItem('overdue-sort-key', key);
    }
  };

  const handleToggleDirection = () => {
    setSortDirection((prev) => {
      const next = prev === 'asc' ? 'desc' : 'asc';
      if (typeof window !== 'undefined') {
        localStorage.setItem('overdue-sort-direction', next);
      }
      return next;
    });
  };

  const todayStr = useMemo(() => getTodayStr(), []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Base list of all overdue tasks (EXCLUDING parent container tasks)
  const rawOverdueTasks = useMemo(() => {
    return tasks.filter((t) => {
      const hasChildren = tasks.some((sub) => sub.parentTaskId === t.id);
      if (t.hasSubtasks || hasChildren) return false;

      // Under Unified Task Schema: Check if any occurrence is scheduled before todayStr and not completed
      if (t.occurrences && t.occurrences.length > 0) {
        return t.occurrences.some((o) => o.date < todayStr && o.status !== 'Done');
      }

      if (!t.scheduledDate || t.scheduledDate === '' || t.scheduledDate === 'anytime') return false;
      return t.scheduledDate < todayStr && t.status !== 'Done';
    });
  }, [tasks, todayStr]);

  // Unique categories present in tasks
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
      if (t.category && t.category.trim() !== '') {
        set.add(t.category);
      }
    });
    return Array.from(set);
  }, [tasks]);

  // Category Filtered + Sorted Overdue Tasks
  const overdueTasks = useMemo(() => {
    let list = [...rawOverdueTasks];

    // Category Filter
    if (categoryFilter !== 'all') {
      list = list.filter((t) => t.category === categoryFilter);
    }

    // Sorting
    list.sort((a, b) => {
      let res = 0;
      if (sortKey === 'date') {
        const dateA = a.scheduledDate || '9999-99-99';
        const dateB = b.scheduledDate || '9999-99-99';
        res = dateA.localeCompare(dateB);
      } else if (sortKey === 'alphabetical') {
        res = a.title.localeCompare(b.title, 'ru');
      } else if (sortKey === 'count') {
        const countA = a.occurrences?.filter((o) => o.status === 'Done').length || a.repetitionsCount || 0;
        const countB = b.occurrences?.filter((o) => o.status === 'Done').length || b.repetitionsCount || 0;
        res = countA - countB;
      }

      return sortDirection === 'desc' ? -res : res;
    });

    return list;
  }, [rawOverdueTasks, categoryFilter, sortKey, sortDirection]);

  const handleRescheduleAllToToday = async () => {
    for (const t of overdueTasks) {
      await rescheduleTaskToToday(t.id);
    }
  };

  const handleTaskClick = (task: Task) => {
    setDetailTask(task);
  };

  return (
    <div className={styles.container}>
      {/* Overdue Header Widget ("Просрочено / Срок выполнения прошел") */}
      <OverdueHeaderWidget
        overdueCount={rawOverdueTasks.length}
        onRescheduleAll={handleRescheduleAllToToday}
      />

      {/* Filter and Sorting Widget (Placed directly ABOVE "Свайп вправо...") */}
      <OverdueFilterSortWidget
        categoryFilter={categoryFilter}
        onSelectCategoryFilter={handleSelectCategoryFilter}
        availableCategories={availableCategories}
        sortKey={sortKey}
        onSelectSortKey={handleSelectSortKey}
        sortDirection={sortDirection}
        onToggleDirection={handleToggleDirection}
      />

      {/* Locked Ultra-Minimalist Gesture Guide (Variant #1) */}
      <div className={styles.v1ThingsHairline}>
        <Lightbulb size={13} style={{ flexShrink: 0, opacity: 0.8 }} />
        <span>👉 свайп вправо — "на сегодня"  •  👈 свайп влево — удалить</span>
      </div>

      {/* Task List */}
      {isLoading ? (
        <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <Typography variant="body" style={{ color: 'var(--color-text-muted)' }}>
            Загрузка просроченных задач...
          </Typography>
        </Card>
      ) : overdueTasks.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 'var(--space-8)', borderRadius: '20px' }}>
          <CheckCircle2 size={40} color="#10b981" style={{ margin: '0 auto 12px auto' }} />
          <Typography variant="h2" style={{ color: '#10b981', marginBottom: 'var(--space-2)' }}>
            {categoryFilter !== 'all' ? 'Нет просроченных задач в этой категории!' : 'Всё чисто! Просроченных задач нет 🎉'}
          </Typography>
          <Typography variant="caption" style={{ color: 'var(--color-text-muted)' }}>
            {categoryFilter !== 'all' ? 'Попробуйте выбрать другую категорию или переключить на «Все категории».' : 'Отличная работа с тайм-менеджментом. Все запланированные задачи выполняются вовремя.'}
          </Typography>
        </Card>
      ) : (
        <div className={styles.taskList}>
          {overdueTasks.map((task) => (
            <GlassmorphicTaskCard
              key={task.id}
              task={task}
              allTasks={tasks}
              showDragHandle={false}
              onToggleCheckbox={() => {
                if (isSmartRepeatTask(task)) {
                  const occ = task.occurrences?.find((o) => o.date === task.scheduledDate);
                  if (occ?.smartRating) {
                    updateTaskStatus(task.id, 'Done', occ.smartRating, task.scheduledDate);
                  } else {
                    setSmartTask(task);
                  }
                } else {
                  toggleTaskStatus(task.id, undefined, task.scheduledDate);
                }
              }}
              onDelete={() => deleteTaskOccurrence(task.id, task.scheduledDate || '')}
              onClick={() => handleTaskClick(task)}
              onRescheduleToToday={() => rescheduleTaskToToday(task.id)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <EditTaskModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
      />

      <RepeatingTaskDetailModal
        task={detailTask}
        isOpen={!!detailTask}
        onClose={() => setDetailTask(null)}
        onOpenEdit={() => {
          setEditingTask(detailTask);
          setDetailTask(null);
        }}
      />

      <SmartRatingModal
        task={smartTask}
        isOpen={!!smartTask}
        onClose={() => setSmartTask(null)}
        onSelectRating={(rating, pomodoros) => {
          if (smartTask) {
            updateTaskStatus(smartTask.id, 'Done', rating, smartTask.scheduledDate, pomodoros);
            setSmartTask(null);
          }
        }}
      />
    </div>
  );
};
