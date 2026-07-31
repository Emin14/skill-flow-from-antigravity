'use client';

import React, { useState, useEffect } from 'react';
import { Typography } from '@/shared/ui';
import { useTaskStore } from '@/entities/task';
import { useTopicStore } from '@/entities/topic';
import { TASK_CATEGORIES, TaskCategory } from '@/shared/config/categories';
import { RepetitionMode, ScheduleFrequency } from '@/shared/config/repetitionRules';
import { useQuickCreateModalStore } from '../model/quickCreateStore';
import styles from './QuickCreateModal.module.css';

export const QuickCreateModal: React.FC = () => {
  const { isOpen, closeModal } = useQuickCreateModalStore();
  const { addTask, tasks } = useTaskStore();
  const { topics, fetchTopics } = useTopicStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Задача');
  const [scheduledDate, setScheduledDate] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [parentTaskId, setParentTaskId] = useState<string | null>(null);
  const [topicId, setTopicId] = useState<string | null>(null);

  // Repetition Rules state
  const [repetitionMode, setRepetitionMode] = useState<RepetitionMode>('none');
  const [scheduleFrequency, setScheduleFrequency] = useState<ScheduleFrequency>('daily');
  const [afterCompletionDaysInput, setAfterCompletionDaysInput] = useState('3');
  const [hasSubtasks, setHasSubtasks] = useState(false);

  useEffect(() => {
    fetchTopics();
    const today = new Date().toISOString().split('T')[0];
    setScheduledDate(today);
  }, [fetchTopics]);

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    const parsedDays = parseInt(afterCompletionDaysInput, 10);
    const afterCompletionDays = isNaN(parsedDays) || parsedDays < 1 ? 1 : parsedDays;

    await addTask({
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

    setTitle('');
    setDescription('');
    setLink('');
    setParentTaskId(null);
    setTopicId(null);
    setRepetitionMode('none');
    setHasSubtasks(false);
    closeModal();
  };

  // Strictly filter possible parent tasks: ONLY tasks with hasSubtasks === true
  const possibleParents = tasks.filter(
    (t) => !t.parentTaskId && t.hasSubtasks === true
  );

  return (
    <div className={styles.overlay} onClick={closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h2">Быстрое создание задачи</Typography>
          <button className={styles.closeBtn} onClick={closeModal} aria-label="Закрыть">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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

          {/* Equal Height Category & Date Row */}
          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <select
                className={styles.selectInput}
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                style={{ height: '38px', padding: '6px 10px', boxSizing: 'border-box' }}
              >
                {TASK_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Input with Clear / Anytime support */}
            <div className={styles.formCol} style={{ position: 'relative' }}>
              <input
                type="date"
                className={styles.selectInput}
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                style={{ height: '38px', padding: '6px 10px', boxSizing: 'border-box' }}
              />
              {scheduledDate && (
                <button
                  type="button"
                  onClick={() => setScheduledDate('')}
                  style={{
                    position: 'absolute',
                    right: '26px',
                    top: '9px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                  title="Убрать дату (Любое время)"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Link Input */}
          <input
            type="url"
            className={styles.selectInput}
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="🔗 Ссылка (https://...)"
            style={{ height: '38px', padding: '6px 10px', boxSizing: 'border-box' }}
          />

          {/* Description Input */}
          <textarea
            className={styles.compactTextarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание задачи..."
          />

          {/* Single Line 1: Repetition Mode & Frequency Dropdowns (Without "Повторить" button!) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'nowrap', overflowX: 'auto', width: '100%' }}>
            <select
              className={styles.selectInputCompact}
              value={repetitionMode}
              onChange={(e) => setRepetitionMode(e.target.value as RepetitionMode)}
              style={{ width: '180px', flexShrink: 0 }}
            >
              <option value="none">Без повтора</option>
              <option value="spaced">○ Интервальное (1, 3, 7...)</option>
              <option value="schedule">○ По расписанию</option>
              <option value="after_completion">○ После выполнения</option>
              <option value="smart">○ Умное повторение</option>
            </select>

            {repetitionMode === 'smart' && (
              <span style={{ fontSize: '11px', color: '#38bdf8', whiteSpace: 'nowrap', flexShrink: 0 }}>
                💡 Чем легче тем меньше повторов
              </span>
            )}

            {repetitionMode === 'schedule' && (
              <select
                className={styles.selectInputCompact}
                value={scheduleFrequency}
                onChange={(e) => setScheduleFrequency(e.target.value as ScheduleFrequency)}
                style={{ width: '130px', flexShrink: 0 }}
              >
                <option value="daily">Каждый день</option>
                <option value="weekly">Каждую неделю</option>
                <option value="monthly">Каждый месяц</option>
                <option value="yearly">Каждый год</option>
              </select>
            )}

            {repetitionMode === 'after_completion' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>через</span>
                <input
                  type="text"
                  className={styles.selectInputCompact}
                  value={afterCompletionDaysInput}
                  onChange={(e) => setAfterCompletionDaysInput(e.target.value)}
                  style={{ width: '45px', textAlign: 'center' }}
                />
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>дн.</span>
              </div>
            )}
          </div>

          {/* Line 2: Subtask Checkbox, Parent Task Dropdown, Topic Dropdown & Send Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
              {/* Checkbox for "Может иметь подзадачи" */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--color-text-muted)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                <input
                  type="checkbox"
                  checked={hasSubtasks}
                  onChange={(e) => setHasSubtasks(e.target.checked)}
                />
                Может иметь подзадачи
              </label>

              {/* Parent Task Selector (ONLY shows tasks with hasSubtasks === true!) */}
              <select
                className={styles.selectInputCompact}
                value={parentTaskId || ''}
                onChange={(e) => setParentTaskId(e.target.value || null)}
                style={{ width: '150px' }}
              >
                <option value="">Без родительской задачи</option>
                {possibleParents.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>

              {topics.length > 0 && (
                <select
                  className={styles.selectInputCompact}
                  value={topicId || ''}
                  onChange={(e) => setTopicId(e.target.value || null)}
                  style={{ width: '120px' }}
                >
                  <option value="">Без темы</option>
                  {topics.map((tp) => (
                    <option key={tp.id} value={tp.id}>
                      🐘 {tp.title}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Cyan Send Button */}
            <button
              type="submit"
              className={styles.sendBtn}
              title="Создать задачу"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#0ea5e9',
                border: 'none',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(14, 165, 233, 0.4)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
