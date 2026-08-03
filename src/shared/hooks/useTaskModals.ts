'use client';

import { useState, useCallback } from 'react';
import { Task } from '@/entities/task/model/types';
import { SmartRating } from '@/shared/config/repetitionRules';

interface UseTaskModalsReturn {
  editingTask: Task | null;
  detailTask: Task | null;
  smartTask: Task | null;
  openEditModal: (task: Task) => void;
  openDetailModal: (task: Task) => void;
  openSmartModal: (task: Task) => void;
  closeEditModal: () => void;
  closeDetailModal: () => void;
  closeSmartModal: () => void;
  closeAll: () => void;
}

/**
 * shared/hooks/useTaskModals.ts
 *
 * Управляет тремя модальными окнами, связанными с задачами:
 * - EditTaskModal (редактирование задачи)
 * - RepeatingTaskDetailModal (детали повторяющейся задачи)
 * - SmartRatingModal (оценка выполнения)
 *
 * Используется в TodayTasks, CalendarPage, AnytimePage.
 */
export const useTaskModals = (): UseTaskModalsReturn => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [smartTask, setSmartTask] = useState<Task | null>(null);

  const openEditModal = useCallback((task: Task) => {
    setEditingTask(task);
    setDetailTask(null);
    setSmartTask(null);
  }, []);

  const openDetailModal = useCallback((task: Task) => {
    setDetailTask(task);
    setEditingTask(null);
    setSmartTask(null);
  }, []);

  const openSmartModal = useCallback((task: Task) => {
    setSmartTask(task);
    setEditingTask(null);
    setDetailTask(null);
  }, []);

  const closeEditModal = useCallback(() => setEditingTask(null), []);
  const closeDetailModal = useCallback(() => setDetailTask(null), []);
  const closeSmartModal = useCallback(() => setSmartTask(null), []);

  const closeAll = useCallback(() => {
    setEditingTask(null);
    setDetailTask(null);
    setSmartTask(null);
  }, []);

  return {
    editingTask,
    detailTask,
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
