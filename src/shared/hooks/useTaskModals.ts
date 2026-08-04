'use client';

import { useState, useCallback } from 'react';
import { Task } from '@/entities/task/model/types';
import { SmartRating } from '@/shared/config/repetitionRules';

interface UseTaskModalsReturn {
  editingTask: Task | null;
  detailTask: Task | null;
  detailOccurrenceDate?: string;
  smartTask: Task | null;
  openEditModal: (task: Task) => void;
  openDetailModal: (task: Task, occurrenceDate?: string) => void;
  openSmartModal: (task: Task) => void;
  closeEditModal: () => void;
  closeDetailModal: () => void;
  closeSmartModal: () => void;
  closeAll: () => void;
}

/**
 * shared/hooks/useTaskModals.ts
 *
 * Управляет модальными окнами задач:
 * - EditTaskModal (редактирование задачи)
 * - RepeatingTaskDetailModal (детали повторяющейся задачи с привязкой даты экземпляра)
 * - SmartRatingModal (оценка выполнения)
 */
export const useTaskModals = (): UseTaskModalsReturn => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [detailOccurrenceDate, setDetailOccurrenceDate] = useState<string | undefined>(undefined);
  const [smartTask, setSmartTask] = useState<Task | null>(null);

  const openEditModal = useCallback((task: Task) => {
    setEditingTask(task);
    setDetailTask(null);
    setDetailOccurrenceDate(undefined);
    setSmartTask(null);
  }, []);

  const openDetailModal = useCallback((task: Task, occurrenceDate?: string) => {
    setDetailTask(task);
    setDetailOccurrenceDate(occurrenceDate);
    setEditingTask(null);
    setSmartTask(null);
  }, []);

  const openSmartModal = useCallback((task: Task) => {
    setSmartTask(task);
    setEditingTask(null);
    setDetailTask(null);
    setDetailOccurrenceDate(undefined);
  }, []);

  const closeEditModal = useCallback(() => setEditingTask(null), []);
  const closeDetailModal = useCallback(() => {
    setDetailTask(null);
    setDetailOccurrenceDate(undefined);
  }, []);
  const closeSmartModal = useCallback(() => setSmartTask(null), []);

  const closeAll = useCallback(() => {
    setEditingTask(null);
    setDetailTask(null);
    setDetailOccurrenceDate(undefined);
    setSmartTask(null);
  }, []);

  return {
    editingTask,
    detailTask,
    detailOccurrenceDate,
    smartTask,
    openEditModal,
    openDetailModal,
    openSmartModal,
    closeEditModal,
    closeDetailModal,
    closeSmartModal,
    closeAll,
  };
};
