'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Typography, Input } from '@/shared/ui';
import { lockBodyScroll, unlockBodyScroll } from '@/shared/lib/scrollLock';
import { useTaskStore } from '@/entities/task';
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

const getTodayStr = () => new Date().toISOString().split('T')[0];

const getTomorrowStr = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

const formatDateDisplay = (dateStr: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  }
  return dateStr;
};


export const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, isOpen, onClose, onSaveSuccess }) => {
  const { updateTaskDetails, tasks } = useTaskStore();

  const [activePopover, setActivePopover] = useState<boolean>(false);
  const hiddenNativeInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Без категории');
  const [scheduledDate, setScheduledDate] = useState('');
  const [datePresetMode, setDatePresetMode] = useState<'today' | 'tomorrow' | 'custom' | 'none'>('today');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [parentTaskId, setParentTaskId] = useState<string | null>(null);

  const [repetitionMode, setRepetitionMode] = useState<RepetitionMode>('none');
  const [scheduleFrequency, setScheduleFrequency] = useState<ScheduleFrequency>('daily');
  const [afterCompletionDaysInput, setAfterCompletionDaysInput] = useState('3');
  const [hasSubtasks, setHasSubtasks] = useState(false);

  useEffect(() => {
    if (isOpen) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }
    return () => {
      unlockBodyScroll();
    };
  }, [isOpen]);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setCategory(task.category || 'Без категории');
      const dateVal = task.scheduledDate || '';
      setScheduledDate(dateVal);

      if (!dateVal) {
        setDatePresetMode('none');
      } else if (dateVal === getTodayStr()) {
        setDatePresetMode('today');
      } else if (dateVal === getTomorrowStr()) {
        setDatePresetMode('tomorrow');
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
      setHasSubtasks(!!task.hasSubtasks || tasks.some((t) => t.parentTaskId === task.id));
    }
  }, [task, tasks]);

  if (!isOpen || !task) return null;

  const selectToday = () => {
    setDatePresetMode('today');
    setScheduledDate(getTodayStr());
    setActivePopover(false);
  };

  const selectTomorrow = () => {
    setDatePresetMode('tomorrow');
    setScheduledDate(getTomorrowStr());
    setActivePopover(false);
  };

  const selectNone = () => {
    setDatePresetMode('none');
    setScheduledDate('');
    setActivePopover(false);
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

  const possibleParents = tasks.filter(
    (t) => t.id !== task.id && !t.parentTaskId && t.hasSubtasks === true
  );

  const getDateStatusLabel = () => {
    if (datePresetMode === 'today') return '☀️ Сегодня';
    if (datePresetMode === 'tomorrow') return '🌅 Завтра';
    if (datePresetMode === 'none') return '✕ Без даты';
    return scheduledDate ? `📆 ${formatDateDisplay(scheduledDate)}` : '📆 Выбрать дату';
  };

  // Single Field Renderers for Variants 2-10
  const renderSingleDateControl = () => {

      const handlePickCustomDate = () => {
        setActivePopover(false);
        setDatePresetMode('custom');
        // Desktop: try to open immediately (synchronous, inside user-gesture context)
        const el = hiddenNativeInputRef.current as HTMLInputElement | null;
        if (el) {
          try {
            if (typeof (el as any).showPicker === 'function') (el as any).showPicker();
            else el.click();
          } catch { try { el.click(); } catch {} }
        }
      };

      return (
        <div style={{ position: 'relative' }}>
          {/* Glassmorphic trigger button */}
          <button
            type="button"
            onClick={() => {
              // If we're in custom mode and popover is closed, tapping should reopen menu
              if (datePresetMode === 'custom' && !activePopover) {
                setActivePopover(true);
              } else {
                setActivePopover(!activePopover);
              }
            }}
            style={{
              width: '100%', height: '40px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: 'var(--color-text)', fontWeight: 500, fontSize: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 14px', cursor: 'pointer',
              boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
            }}
          >
            <span>{getDateStatusLabel()}</span>
            <span style={{ opacity: 0.5, fontSize: '12px' }}>▾</span>
          </button>

          {/*
            iOS transparent date input overlay.
            Visible (interactable) only when datePresetMode === 'custom' and popover is closed.
            Covers the left 80% of the button (leaves the ▾ arrow accessible).
            On iOS: direct finger tap → native date picker opens.
            On desktop: showPicker() above already handled it; this is a fallback.
          */}
          {datePresetMode === 'custom' && !activePopover && (
            <input
              ref={hiddenNativeInputRef}
              type="date"
              value={scheduledDate || ''}
              onChange={(e) => {
                if (e.target.value) {
                  setScheduledDate(e.target.value);
                  setDatePresetMode('custom');
                }
              }}
              style={{
                position: 'absolute', top: 0, left: 0,
                width: 'calc(100% - 36px)', height: '100%',
                opacity: 0, cursor: 'pointer',
                border: 'none', background: 'transparent',
                pointerEvents: 'auto', zIndex: 2,
                colorScheme: 'dark',
              }}
            />
          )}

          {activePopover && (
            <div style={{
              position: 'absolute', top: '46px', left: 0, right: 0, zIndex: 100,
              background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: '14px',
              padding: '6px', boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
              display: 'flex', flexDirection: 'column', gap: '2px',
            }}>
              {[{ label: '☀️  Сегодня', action: selectToday },
                { label: '🌅  Завтра', action: selectTomorrow },
                { label: '📆  Выбрать дату...', action: handlePickCustomDate },
                { label: '✕   Без даты', action: selectNone, red: true },
              ].map(({ label, action, red }) => (
                <button key={label} type="button" onClick={action} style={{
                  background: 'transparent', border: 'none', borderRadius: '8px',
                  color: red ? '#f87171' : 'rgba(255,255,255,0.85)',
                  fontSize: '14px', padding: '8px 12px', cursor: 'pointer',
                  textAlign: 'left', transition: 'background 0.15s',
                }} onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')
                } onMouseOut={e => (e.currentTarget.style.background = 'transparent')}>{label}</button>
              ))}
            </div>
          )}
        </div>
      );
    
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Hidden Native Calendar Picker Trigger */}

        {/* Modal Form Container with ZERO HEIGHT JUMPING & SINGLE DATE CONTROL */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className={styles.modalBody}>
            {/* Title Input */}
            <Input
              type="text"
              name="task_title_field"
              className={styles.selectInput}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Название задачи..."
              required
              autoFocus
            />

            {/* Category & Date Row */}
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

              {/* SINGLE DATE PICKER CONTROL COLUMN (No 2nd field for Variants 2-10!) */}
              <div className={styles.formCol}>
                {renderSingleDateControl()}
              </div>
            </div>

            {/* Link Input */}
            <Input
              type="url"
              name="task_link_field"
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

            {/* Repetition Rules Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
                    <Input
                      type="number"
                      name="task_interval_days"
                      inputMode="numeric"
                      className={styles.selectInput}
                      value={afterCompletionDaysInput}
                      onChange={(e) => setAfterCompletionDaysInput(e.target.value)}
                      min="1"
                      placeholder="Дней (напр. 3)"
                    />
                  )}
                </div>
              </div>
              {hasSubtasks && (
                <div style={{ fontSize: '11px', color: '#f59e0b' }}>
                  ⚠️ Задачи с подзадачами не могут иметь режим повторения
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 'auto', paddingTop: '8px' }}>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              style={{ width: 'auto', borderRadius: '10px', padding: '0 14px', fontSize: '13px' }}
            >
              Отмена
            </button>
            <button type="submit" className={styles.sendBtn} title="Сохранить">
              Сохранить ✓
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
