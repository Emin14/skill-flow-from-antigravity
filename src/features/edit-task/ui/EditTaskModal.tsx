'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Task } from '@/entities/task/model/types';
import { useTaskStore } from '@/entities/task';
import { Typography, Input } from '@/shared/ui';
import { TASK_CATEGORIES, TaskCategory } from '@/shared/config/categories';
import {
  RepetitionMode,
  ScheduleFrequency,
  REPETITION_MODE_OPTIONS,
  SCHEDULE_FREQUENCY_OPTIONS,
} from '@/shared/config/repetitionRules';
import styles from './EditTaskModal.module.css';

interface EditTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess?: (taskData: Partial<Task>) => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onSaveSuccess,
}) => {
  const { tasks, addTask, updateTaskDetails, deleteTask } = useTaskStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Задача');
  const [scheduledDate, setScheduledDate] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [parentTaskId, setParentTaskId] = useState('');

  // Repetition State
  const [isRepeating, setIsRepeating] = useState(false);
  const [repetitionMode, setRepetitionMode] = useState<RepetitionMode>('none');
  const [scheduleFrequency, setScheduleFrequency] = useState<ScheduleFrequency>('daily');
  const [afterCompletionDaysInput, setAfterCompletionDaysInput] = useState('3');

  const [hasSubtasks, setHasSubtasks] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task && isOpen) {
      setTitle(task.title || '');
      setCategory(task.category || 'Задача');
      setScheduledDate(task.scheduledDate || new Date().toISOString().split('T')[0]);
      setDescription(task.description || '');
      setLink(task.link || '');
      setParentTaskId(task.parentTaskId || '');

      const initialMode = task.repetitionMode || (task.isRepeating ? 'spaced' : 'none');
      setRepetitionMode(initialMode);
      setIsRepeating(initialMode !== 'none');
      setScheduleFrequency(task.scheduleFrequency || 'daily');
      setAfterCompletionDaysInput(String(task.afterCompletionDays || 3));

      setHasSubtasks(!!task.hasSubtasks);
    }
  }, [task, isOpen]);

  // Filter tasks eligible to be "Основная задача" (only those with hasSubtasks === true)
  const mainTaskOptions = useMemo(() => {
    return tasks.filter((t) => t.hasSubtasks && t.id !== task?.id);
  }, [tasks, task]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen || !task) return null;

  // Task is created or updated ONLY when submitting via Send button or Enter
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const effectiveMode: RepetitionMode = repetitionMode;
      const effectiveIsRepeating = effectiveMode !== 'none';
      const parsedAfterDays = parseInt(afterCompletionDaysInput) || 3;

      const taskData: Partial<Task> = {
        title: title.trim(),
        category,
        scheduledDate,
        description: description.trim(),
        link: link.trim(),
        parentTaskId: parentTaskId || null,
        isRepeating: effectiveIsRepeating,
        repetitionMode: effectiveMode,
        scheduleFrequency,
        afterCompletionDays: parsedAfterDays,
        hasSubtasks,
        targetRepetitions: 8,
      };

      if (task.id.startsWith('draft-')) {
        await addTask({
          title: title.trim(),
          category,
          scheduledDate,
          description: description.trim(),
          link: link.trim(),
          parentTaskId: parentTaskId || null,
          isRepeating: effectiveIsRepeating,
          repetitionMode: effectiveMode,
          scheduleFrequency,
          afterCompletionDays: parsedAfterDays,
          hasSubtasks,
          targetRepetitions: 8,
        });
      } else {
        await updateTaskDetails(task.id, taskData);
      }

      onSaveSuccess?.(taskData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (task.id.startsWith('draft-')) {
      onClose();
      return;
    }
    if (confirm(`Удалить задачу "${task.title}"?`)) {
      await deleteTask(task.id);
      onClose();
    }
  };

  const currentCount = task.repetitionsCount || 0;
  const targetCount = task.targetRepetitions || 8;
  const progressPercent = Math.min(100, Math.round((currentCount / targetCount) * 100));

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h2">✏️ {task.id.startsWith('draft-') ? 'Разобрать в задачу' : 'Редактировать задачу'}</Typography>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {!task.id.startsWith('draft-') && (
              <button
                type="button"
                onClick={handleDelete}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-error)',
                  fontSize: '18px',
                  cursor: 'pointer',
                  padding: '8px',
                }}
                title="Удалить задачу"
              >
                🗑
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className={styles.closeBtn}
              aria-label="Закрыть"
              title="Закрыть без сохранения"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Visual Repetition Progress Box with Filled Sticks */}
        {isRepeating && !task.id.startsWith('draft-') && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
              padding: '12px 14px',
              borderRadius: '14px',
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'bold', color: 'var(--color-success)' }}>
                🔄 Повторения: {currentCount} из {targetCount}
              </span>
              <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'bold', color: 'var(--color-success)' }}>
                {progressPercent}%
              </span>
            </div>

            {/* Filled Segment Sticks / Bars */}
            <div style={{ display: 'flex', gap: '4px', width: '100%', marginTop: '2px' }}>
              {Array.from({ length: Math.max(8, targetCount) }).map((_, index) => {
                const isFilled = index < currentCount;
                return (
                  <div
                    key={index}
                    style={{
                      flex: 1,
                      height: '12px',
                      borderRadius: '3px',
                      backgroundColor: isFilled ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                      border: isFilled ? '1px solid #059669' : '1px solid var(--color-border)',
                      boxShadow: isFilled ? '0 0 6px rgba(16, 185, 129, 0.4)' : 'none',
                    }}
                    title={isFilled ? `Повторение #${index + 1} выполнено` : `Повторение #${index + 1}`}
                  />
                );
              })}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {/* Title */}
          <Input
            label="Название задачи *"
            placeholder="Введите название..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Category & Date Row (Strictly 1 Row on Mobile) */}
          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <label style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '3px' }}>
                Категория:
              </label>
              <select
                className={styles.selectInput}
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
              >
                {TASK_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formCol}>
              <label style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '3px' }}>
                Дата выполнения:
              </label>
              <input
                type="date"
                className={styles.selectInput}
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>
          </div>

          {/* Compact Description */}
          <div>
            <label style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block', marginBottom: '3px' }}>
              Описание (необязательно):
            </label>
            <textarea
              className={styles.compactTextarea}
              placeholder="Подробности задачи..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Optional Link */}
          <Input
            label="Ссылка (необязательно)"
            placeholder="https://..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />

          {/* Repetition Rules Selector: Select & Sub-option / Smart Hint strictly on 1 SINGLE LINE */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '1px' }}>
              Режим повторения:
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'nowrap', width: '100%' }}>
              <div style={{ width: '175px', minWidth: '175px', flexShrink: 0 }}>
                <select
                  className={styles.selectInput}
                  value={repetitionMode}
                  onChange={(e) => {
                    const mode = e.target.value as RepetitionMode;
                    setRepetitionMode(mode);
                    setIsRepeating(mode !== 'none');
                  }}
                >
                  {REPETITION_MODE_OPTIONS.filter((opt) => opt.enabled !== false).map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Smart Hint placed ON THE EXACT SAME LINE right next to select */}
              {repetitionMode === 'smart' && (
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    fontSize: '11px',
                    color: '#60a5fa',
                    fontWeight: 500,
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.25)',
                    padding: '7px 10px',
                    borderRadius: '8px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title="💡 Чем легче тем меньше повторов"
                >
                  💡 Чем легче тем меньше повторов
                </div>
              )}

              {repetitionMode === 'schedule' && (
                <div style={{ flex: 1, minWidth: 0 }}>
                  <select
                    className={styles.selectInput}
                    value={scheduleFrequency}
                    onChange={(e) => setScheduleFrequency(e.target.value as ScheduleFrequency)}
                  >
                    {SCHEDULE_FREQUENCY_OPTIONS.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {repetitionMode === 'after_completion' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>через</span>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    className={styles.selectInput}
                    style={{ width: '54px', textAlign: 'center', padding: '4px' }}
                    value={afterCompletionDaysInput}
                    onChange={(e) => setAfterCompletionDaysInput(e.target.value)}
                    onBlur={() => {
                      if (!afterCompletionDaysInput.trim() || parseInt(afterCompletionDaysInput) < 1) {
                        setAfterCompletionDaysInput('3');
                      }
                    }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>дн.</span>
                </div>
              )}
            </div>
          </div>

          {/* Single Line Controls: Subtasks Toggle, Main Task Dropdown & Cyan Circular Send Button ↑ */}
          <div className={styles.singleLineControls}>
            {/* Subtasks Toggle Icon */}
            <button
              type="button"
              onClick={() => setHasSubtasks(!hasSubtasks)}
              className={`${styles.pillToggleBtn} ${hasSubtasks ? styles.subtaskToggleActive : styles.pillToggleInactive}`}
              title={hasSubtasks ? 'Может содержать подзадачи (Включено)' : 'Нажмите, чтобы включить подзадачи'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              <span>{hasSubtasks ? 'Подзадачи' : '+Подзадачи'}</span>
            </button>

            {/* Main Task Select Dropdown */}
            <div style={{ flex: 1, minWidth: '110px' }}>
              <select
                className={styles.selectInputCompact}
                value={parentTaskId}
                onChange={(e) => setParentTaskId(e.target.value)}
                title="Основная задача"
              >
                <option value="">-- Основная задача --</option>
                {mainTaskOptions.length === 0 ? (
                  <option value="" disabled>
                    (Нет основных задач)
                  </option>
                ) : (
                  mainTaskOptions.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Cyan Circular Send Button ↑ matching screenshots (Requirement 2) */}
            <button
              type="submit"
              disabled={!title.trim() || isSubmitting}
              style={{
                width: '34px',
                height: '34px',
                minWidth: '34px',
                minHeight: '34px',
                borderRadius: '50%',
                backgroundColor: '#0ea5e9',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: title.trim() ? 'pointer' : 'not-allowed',
                padding: 0,
                boxShadow: '0 2px 8px rgba(14, 165, 233, 0.4)',
                opacity: title.trim() ? 1 : 0.5,
                transition: 'all 0.2s ease',
              }}
              title={task.id.startsWith('draft-') ? 'Создать задачу' : 'Сохранить изменения'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
