'use client';

import React, { useState, useEffect } from 'react';
import { Typography } from '@/shared/ui';
import { useTaskStore } from '@/entities/task';
import { useTopicStore } from '@/entities/topic';
import { Task } from '@/entities/task/model/types';
import { TASK_CATEGORIES, TaskCategory } from '@/shared/config/categories';
import { RepetitionMode, ScheduleFrequency } from '@/shared/config/repetitionRules';
import styles from './EditTaskModal.module.css';

interface EditTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess?: () => void;
}

// Date Arithmetic Helpers for Quick Presets
const getTodayStr = () => new Date().toISOString().split('T')[0];

const getTomorrowStr = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

const getWeekendStr = () => {
  const d = new Date();
  const day = d.getDay();
  const daysUntilSaturday = day === 6 ? 7 : (6 - day);
  d.setDate(d.getDate() + daysUntilSaturday);
  return d.toISOString().split('T')[0];
};

const getNextWeekStr = () => {
  const d = new Date();
  const day = d.getDay();
  const daysUntilMonday = day === 1 ? 7 : ((8 - day) % 7 || 7);
  d.setDate(d.getDate() + daysUntilMonday);
  return d.toISOString().split('T')[0];
};

export const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, isOpen, onClose, onSaveSuccess }) => {
  const { updateTaskDetails, tasks } = useTaskStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Задача');
  const [scheduledDate, setScheduledDate] = useState('');
  const [datePresetMode, setDatePresetMode] = useState<'today' | 'tomorrow' | 'weekend' | 'nextWeek' | 'custom' | 'anytime'>('today');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [parentTaskId, setParentTaskId] = useState<string | null>(null);

  // Repetition Rules state
  const [repetitionMode, setRepetitionMode] = useState<RepetitionMode>('none');
  const [scheduleFrequency, setScheduleFrequency] = useState<ScheduleFrequency>('daily');
  const [afterCompletionDaysInput, setAfterCompletionDaysInput] = useState('3');
  const [hasSubtasks, setHasSubtasks] = useState(false);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setCategory(task.category || 'Задача');
      const dateVal = task.scheduledDate || '';
      setScheduledDate(dateVal);

      if (!dateVal) {
        setDatePresetMode('anytime');
      } else if (dateVal === getTodayStr()) {
        setDatePresetMode('today');
      } else if (dateVal === getTomorrowStr()) {
        setDatePresetMode('tomorrow');
      } else if (dateVal === getWeekendStr()) {
        setDatePresetMode('weekend');
      } else if (dateVal === getNextWeekStr()) {
        setDatePresetMode('nextWeek');
      } else {
        setDatePresetMode('custom');
      }

      setDescription(task.description || '');
      setLink(task.link || '');
      setParentTaskId(task.parentTaskId || null);

      const mode = task.repetitionMode || (task.isRepeating ? 'spaced' : 'none');
      setRepetitionMode(mode);
      setScheduleFrequency(task.scheduleFrequency || 'daily');
      setAfterCompletionDaysInput(String(task.afterCompletionDays || 3));
      setHasSubtasks(!!task.hasSubtasks);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleDatePresetChange = (val: string) => {
    if (val === 'today') {
      setDatePresetMode('today');
      setScheduledDate(getTodayStr());
    } else if (val === 'tomorrow') {
      setDatePresetMode('tomorrow');
      setScheduledDate(getTomorrowStr());
    } else if (val === 'weekend') {
      setDatePresetMode('weekend');
      setScheduledDate(getWeekendStr());
    } else if (val === 'nextWeek') {
      setDatePresetMode('nextWeek');
      setScheduledDate(getNextWeekStr());
    } else if (val === 'anytime') {
      setDatePresetMode('anytime');
      setScheduledDate('');
    } else {
      setDatePresetMode('custom');
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    const parsedDays = parseInt(afterCompletionDaysInput, 10);
    const afterCompletionDays = isNaN(parsedDays) || parsedDays < 1 ? 1 : parsedDays;

    await updateTaskDetails(task.id, {
      title: title.trim(),
      category,
      scheduledDate: scheduledDate.trim(),
      description,
      link,
      parentTaskId,
      isRepeating: repetitionMode !== 'none',
      repetitionMode,
      scheduleFrequency,
      afterCompletionDays,
      hasSubtasks,
    });

    if (onSaveSuccess) {
      onSaveSuccess();
    }

    onClose();
  };

  // Strictly filter possible parent tasks: ONLY tasks with hasSubtasks === true (and not self, and not subtask)
  const possibleParents = tasks.filter(
    (t) => t.id !== task.id && !t.parentTaskId && t.hasSubtasks === true
  );

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h2">Редактирование задачи</Typography>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Title Input */}
          <input
            type="text"
            className={styles.selectInput}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название задачи..."
            required
            autoFocus
          />

          {/* Category & Date Preset Dropdown Row */}
          <div className={styles.formRow}>
            <div className={styles.formCol}>
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

            {/* Smart Date Preset Select */}
            <div className={styles.formCol}>
              <select
                className={styles.selectInput}
                value={datePresetMode}
                onChange={(e) => handleDatePresetChange(e.target.value)}
              >
                <option value="today">☀️ Сегодня</option>
                <option value="tomorrow">🌅 Завтра</option>
                <option value="weekend">📅 На выходных</option>
                <option value="nextWeek">⏩ На следующей неделе</option>
                <option value="anytime">🌱 Любое время</option>
                <option value="custom">📆 Выбрать дату...</option>
              </select>
            </div>
          </div>

          {/* Custom Date Input */}
          {datePresetMode === 'custom' && (
            <div className={styles.dateInputContainer}>
              <input
                type="date"
                className={styles.selectInput}
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                style={{ paddingRight: scheduledDate ? '34px' : '12px' }}
              />
              {scheduledDate && (
                <button
                  type="button"
                  className={styles.dateClearBtn}
                  onClick={() => {
                    setScheduledDate('');
                    setDatePresetMode('anytime');
                  }}
                  title="Убрать дату (Любое время)"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* Link Input */}
          <input
            type="url"
            className={styles.selectInput}
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="🔗 Ссылка (https://...)"
          />

          {/* Description Input */}
          <textarea
            className={styles.compactTextarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Заметки или описание задачи..."
          />

          {/* Parent Task Selector */}
          <select
            className={styles.selectInput}
            value={parentTaskId || ''}
            onChange={(e) => setParentTaskId(e.target.value || null)}
          >
            <option value="">Без родительской задачи (Основная)</option>
            {possibleParents.map((pt) => (
              <option key={pt.id} value={pt.id}>
                📁 {pt.title}
              </option>
            ))}
          </select>

          {/* Repetition Rules Configuration - 2-Column Row Layout */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
            <Typography variant="caption" style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>
              💡 Режим повторения
            </Typography>

            <div className={styles.formRow}>
              <div className={styles.formCol}>
                <select
                  className={styles.selectInput}
                  value={repetitionMode}
                  disabled={hasSubtasks}
                  onChange={(e) => setRepetitionMode(e.target.value as RepetitionMode)}
                >
                  <option value="none">Без повторений</option>
                  <option value="smart">🧠 Умное повторение</option>
                  <option value="spaced">Интервальное повторение</option>
                  <option value="schedule">По расписанию</option>
                  <option value="after_completion">После выполнения</option>
                </select>
              </div>

              <div className={styles.formCol}>
                {repetitionMode === 'schedule' && (
                  <select
                    className={styles.selectInput}
                    value={scheduleFrequency}
                    onChange={(e) => setScheduleFrequency(e.target.value as ScheduleFrequency)}
                  >
                    <option value="daily">Каждый день</option>
                    <option value="weekly">Каждую неделю</option>
                    <option value="monthly">Каждый месяц</option>
                    <option value="yearly">Каждый год</option>
                  </select>
                )}

                {repetitionMode === 'after_completion' && (
                  <div className={styles.dateInputContainer}>
                    <input
                      type="number"
                      className={styles.selectInput}
                      value={afterCompletionDaysInput}
                      onChange={(e) => setAfterCompletionDaysInput(e.target.value)}
                      min="1"
                      placeholder="Дней (напр. 3)"
                    />
                  </div>
                )}
              </div>
            </div>

            {hasSubtasks && (
              <div style={{ fontSize: '11px', color: '#f59e0b' }}>
                ⚠️ Задачи с подзадачами не могут иметь режим повторения
              </div>
            )}
          </div>

          {/* Modal Action Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              style={{ width: 'auto', borderRadius: '10px', padding: '0 14px', fontSize: '13px' }}
            >
              Отмена
            </button>
            <button type="submit" className={styles.sendBtn} title="Сохранить">
              ✓
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

