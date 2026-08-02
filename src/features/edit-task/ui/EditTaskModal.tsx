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

const DATE_PATTERNS_DESCRIPTIONS: Record<number, { name: string; rationale: string }> = {
  1: {
    name: '1. Baseline Standard Select (Текущая реализация)',
    rationale: 'Выпадающий список. При выборе «Выбрать дату...» ниже появлялось второе поле выбора даты.',
  },
  2: {
    name: '2. Single Native Dropdown & Direct Hidden Picker (Одно поле)',
    rationale: 'Строго ЕДИНОЕ поле. При выборе «Выбрать дату...» сразу вызывается календарь, а значение меняется прямо внутри этого поля («📅 15.08.2026»). Без сдвига карточки!',
  },
  3: {
    name: '3. Things 3 Style Floating Popover Pill (Одно поле)',
    rationale: 'Единая кнопка-плашка `[ 📅 Сегодня ▾ ]`. Вызов всплывающего поверх оверлея с 4 действиями. Значение меняется на `📅 15.08.2026`. 0px сдвига!',
  },
  4: {
    name: '4. Apple Reminders Segmented Action Capsule (Одно поле)',
    rationale: 'Компактная капсула из 4 кнопок `[☀️Сегодня] [🌅Завтра] [📆Дата] [✕]`. Выбор даты не добавляет новых элементов.',
  },
  5: {
    name: '5. TickTick Split Button with Overlay Calendar (Одно поле)',
    rationale: 'Единая сплит-кнопка `[ ☀️ Сегодня | 📅 ]`. Клик по иконке вызывается всплывающий кастомный календарь поверх, обновляющий текст кнопки.',
  },
  6: {
    name: '6. Linear Command Hotkey Menu (Одно поле)',
    rationale: 'Единый клавиатурный бейдж `[ ⚡ Срок: Сегодня (T) ▾ ]`. Всплывающее меню обновляет заголовок бейджа напрямую.',
  },
  7: {
    name: '7. Todoist Floating Context Card (Одно поле)',
    rationale: 'Единая контекстная кнопка `[ 🗓 Сегодня ⋮ ]`. Выплывающее меню из 4 цветных строк меняет текст внутри этой же кнопки.',
  },
  8: {
    name: '8. Notion Calendar Property Badge (Одно поле)',
    rationale: 'Единая бейдж-плашка базы данных Notion `[ 📅 Сегодня ✕ ]`. Открывает всплывающую карточку, текст меняется прямо в плашке.',
  },
  9: {
    name: '9. Microsoft To Do Direct Action Ribbon (Одно поле)',
    rationale: 'Единая лента 4 быстрых чипов `[ ☀️Сегодня ] [ 🌅Завтра ] [ 📆Любая дата ] [ ✕ ]`. Выбор даты обновляет текст на чипе.',
  },
  10: {
    name: '10. Arc Browser Glassmorphic Capsule HUD (Одно поле)',
    rationale: 'Единая капсула `[ 💊 Срок: Сегодня ▾ ]`, выплывающий HUD поверх. Высота карточки никогда не изменяется.',
  },
};

export const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, isOpen, onClose, onSaveSuccess }) => {
  const { updateTaskDetails, tasks } = useTaskStore();

  const [dateVariant, setDateVariant] = useState<number>(1);
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

  const triggerHiddenPicker = () => {
    setActivePopover(false);
    const inputEl = hiddenNativeInputRef.current as HTMLInputElement | null;
    if (inputEl) {
      try {
        if ('showPicker' in inputEl && typeof (inputEl as any).showPicker === 'function') {
          (inputEl as any).showPicker();
        } else {
          inputEl.click();
        }
      } catch (e) {
        inputEl.click();
      }
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
    // Variant 1: Baseline Dropdown Select (Legacy with 2nd input)
    if (dateVariant === 1) {
      return (
        <select
          className={styles.selectInput}
          value={datePresetMode}
          onChange={(e) => {
            const v = e.target.value;
            if (v === 'today') selectToday();
            else if (v === 'tomorrow') selectTomorrow();
            else if (v === 'none') selectNone();
            else setDatePresetMode('custom');
          }}
        >
          <option value="today">☀️ Сегодня</option>
          <option value="tomorrow">🌅 Завтра</option>
          <option value="custom">📆 Выбрать дату...</option>
          <option value="none">✕ Без даты</option>
        </select>
      );
    }

    // Variant 2: Single Native Dropdown & Direct Hidden Picker
    if (dateVariant === 2) {
      return (
        <select
          className={styles.selectInput}
          value={datePresetMode === 'custom' ? 'custom' : datePresetMode}
          onChange={(e) => {
            const v = e.target.value;
            if (v === 'today') selectToday();
            else if (v === 'tomorrow') selectTomorrow();
            else if (v === 'none') selectNone();
            else triggerHiddenPicker();
          }}
        >
          <option value="today">☀️ Сегодня</option>
          <option value="tomorrow">🌅 Завтра</option>
          <option value="custom">
            {datePresetMode === 'custom' && scheduledDate ? `📆 ${formatDateDisplay(scheduledDate)}` : '📆 Выбрать дату...'}
          </option>
          <option value="none">✕ Без даты</option>
        </select>
      );
    }

    // Variant 3: Things 3 Style Floating Popover Pill (Single Button)
    if (dateVariant === 3) {
      return (
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className={styles.selectInput}
            onClick={() => setActivePopover(!activePopover)}
            style={{ textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <span>{getDateStatusLabel()}</span>
            <span>▾</span>
          </button>
          {activePopover && (
            <div style={{ position: 'absolute', top: '44px', left: 0, right: 0, zIndex: 100, background: '#1e293b', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '6px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button type="button" className={styles.chipBtn} onClick={selectToday}>☀️ Сегодня</button>
              <button type="button" className={styles.chipBtn} onClick={selectTomorrow}>🌅 Завтра</button>
              <button type="button" className={styles.chipBtn} onClick={triggerHiddenPicker}>📆 Выбрать любую дату...</button>
              <button type="button" className={styles.chipBtn} onClick={selectNone} style={{ color: '#ef4444' }}>✕ Без даты</button>
            </div>
          )}
        </div>
      );
    }

    // Variant 4: Apple Reminders Segmented Action Capsule
    if (dateVariant === 4) {
      return (
        <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
          <button type="button" className={`${styles.chipBtn} ${datePresetMode === 'today' ? styles.chipBtnActive : ''}`} onClick={selectToday}>☀️Сегодня</button>
          <button type="button" className={`${styles.chipBtn} ${datePresetMode === 'tomorrow' ? styles.chipBtnActive : ''}`} onClick={selectTomorrow}>🌅Завтра</button>
          <button type="button" className={`${styles.chipBtn} ${datePresetMode === 'custom' ? styles.chipBtnActive : ''}`} onClick={triggerHiddenPicker}>
            {datePresetMode === 'custom' && scheduledDate ? `📆${formatDateDisplay(scheduledDate)}` : '📆Дата'}
          </button>
          <button type="button" className={styles.chipBtn} onClick={selectNone}>✕</button>
        </div>
      );
    }

    // Variant 5: TickTick Split Button with Overlay Calendar
    if (dateVariant === 5) {
      return (
        <div style={{ display: 'flex', gap: '4px', position: 'relative' }}>
          <button
            type="button"
            className={`${styles.selectInput} ${datePresetMode === 'today' ? styles.chipBtnActive : ''}`}
            style={{ flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
            onClick={selectToday}
          >
            {getDateStatusLabel()}
          </button>
          <button
            type="button"
            className={styles.selectInput}
            style={{ width: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onClick={() => setActivePopover(!activePopover)}
            title="Открыть календарик"
          >
            📅
          </button>
          {activePopover && (
            <div style={{ position: 'absolute', top: '44px', right: 0, width: '210px', zIndex: 100, background: '#1e293b', border: '1px solid var(--color-border)', borderRadius: '12px', padding: '6px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button type="button" className={styles.chipBtn} onClick={selectToday}>☀️ Сегодня</button>
              <button type="button" className={styles.chipBtn} onClick={selectTomorrow}>🌅 Завтра</button>
              <button type="button" className={styles.chipBtn} onClick={triggerHiddenPicker}>📆 Выбрать дату...</button>
              <button type="button" className={styles.chipBtn} onClick={selectNone} style={{ color: '#ef4444' }}>✕ Без даты</button>
            </div>
          )}
        </div>
      );
    }

    // Variant 6: Linear Command Hotkey Menu
    if (dateVariant === 6) {
      return (
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className={styles.selectInput}
            onClick={() => setActivePopover(!activePopover)}
            style={{ background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.4)', color: '#818cf8', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <span>⚡ {getDateStatusLabel()}</span>
            <span style={{ fontSize: '11px', opacity: 0.7 }}>(T) ▾</span>
          </button>
          {activePopover && (
            <div style={{ position: 'absolute', top: '44px', left: 0, right: 0, zIndex: 100, background: '#0f172a', border: '1px solid #818cf8', borderRadius: '12px', padding: '6px', boxShadow: '0 8px 24px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button type="button" className={styles.chipBtn} onClick={selectToday}>☀️ Сегодня (T)</button>
              <button type="button" className={styles.chipBtn} onClick={selectTomorrow}>🌅 Завтра (TM)</button>
              <button type="button" className={styles.chipBtn} onClick={triggerHiddenPicker}>📆 Выбрать дату... (C)</button>
              <button type="button" className={styles.chipBtn} onClick={selectNone} style={{ color: '#ef4444' }}>✕ Без даты (X)</button>
            </div>
          )}
        </div>
      );
    }

    // Variant 7: Todoist Style Floating Context Card
    if (dateVariant === 7) {
      return (
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className={styles.selectInput}
            onClick={() => setActivePopover(!activePopover)}
            style={{ borderColor: '#f97316', color: '#f97316', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <span>🗓 {getDateStatusLabel()}</span>
            <span>⋮</span>
          </button>
          {activePopover && (
            <div style={{ position: 'absolute', top: '44px', left: 0, right: 0, zIndex: 100, background: '#18181b', border: '1px solid #f97316', borderRadius: '12px', padding: '6px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button type="button" className={styles.chipBtn} onClick={selectToday}>☀️ Сегодня</button>
              <button type="button" className={styles.chipBtn} onClick={selectTomorrow}>🌅 Завтра</button>
              <button type="button" className={styles.chipBtn} onClick={triggerHiddenPicker}>📆 Выбрать дату...</button>
              <button type="button" className={styles.chipBtn} onClick={selectNone} style={{ color: '#ef4444' }}>✕ Без даты</button>
            </div>
          )}
        </div>
      );
    }

    // Variant 8: Notion Calendar Property Badge
    if (dateVariant === 8) {
      return (
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className={styles.selectInput}
            onClick={() => setActivePopover(!activePopover)}
            style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <span>📅 {getDateStatusLabel()}</span>
            <span>⚙️</span>
          </button>
          {activePopover && (
            <div style={{ position: 'absolute', top: '44px', left: 0, right: 0, zIndex: 100, background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: '#888' }}>Notion Calendar:</span>
              <button type="button" className={styles.chipBtn} onClick={selectToday}>☀️ Сегодня</button>
              <button type="button" className={styles.chipBtn} onClick={selectTomorrow}>🌅 Завтра</button>
              <button type="button" className={styles.chipBtn} onClick={triggerHiddenPicker}>📆 Выбрать дату...</button>
              <button type="button" className={styles.chipBtn} onClick={selectNone} style={{ color: '#ef4444' }}>✕ Без даты</button>
            </div>
          )}
        </div>
      );
    }

    // Variant 9: Microsoft To Do Direct Action Ribbon
    if (dateVariant === 9) {
      return (
        <div style={{ display: 'flex', gap: '3px', flexWrap: 'nowrap', overflowX: 'auto' }}>
          <button type="button" className={`${styles.chipBtn} ${datePresetMode === 'today' ? styles.chipBtnActive : ''}`} onClick={selectToday}>☀️Сегодня</button>
          <button type="button" className={`${styles.chipBtn} ${datePresetMode === 'tomorrow' ? styles.chipBtnActive : ''}`} onClick={selectTomorrow}>🌅Завтра</button>
          <button type="button" className={`${styles.chipBtn} ${datePresetMode === 'custom' ? styles.chipBtnActive : ''}`} onClick={triggerHiddenPicker}>
            {datePresetMode === 'custom' && scheduledDate ? `📆${formatDateDisplay(scheduledDate)}` : '📆Дата'}
          </button>
          <button type="button" className={styles.chipBtn} onClick={selectNone}>✕</button>
        </div>
      );
    }

    // Variant 10: Arc Browser Glassmorphic Capsule HUD
    return (
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          className={styles.selectInput}
          onClick={() => setActivePopover(!activePopover)}
          style={{ borderRadius: '20px', background: 'linear-gradient(135deg, rgba(56,189,248,0.15) 0%, rgba(99,102,241,0.15) 100%)', border: '1px solid rgba(56,189,248,0.4)', color: '#38bdf8', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <span>💊 {getDateStatusLabel()}</span>
          <span>▾</span>
        </button>
        {activePopover && (
          <div style={{ position: 'absolute', top: '44px', left: 0, right: 0, zIndex: 100, background: '#090d16', border: '1px solid #38bdf8', borderRadius: '16px', padding: '8px', boxShadow: '0 8px 24px rgba(56,189,248,0.3)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button type="button" className={styles.chipBtn} onClick={selectToday}>☀️ Сегодня</button>
            <button type="button" className={styles.chipBtn} onClick={selectTomorrow}>🌅 Завтра</button>
            <button type="button" className={styles.chipBtn} onClick={triggerHiddenPicker}>📆 Выбрать любую дату...</button>
            <button type="button" className={styles.chipBtn} onClick={selectNone} style={{ color: '#ef4444' }}>✕ Без даты</button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Hidden Native Calendar Picker Trigger */}
        <input
          type="date"
          ref={hiddenNativeInputRef}
          value={scheduledDate}
          onChange={(e) => {
            const val = e.target.value;
            if (val) {
              setScheduledDate(val);
              setDatePresetMode('custom');
            }
          }}
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
        />

        {/* 10 Date Picker Single-Control UX Selector Header Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
              Выберите UX-вариант поля даты (1–10):
            </span>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
              ×
            </button>
          </div>

          <div className={styles.variantBar}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
              <button
                key={v}
                className={`${styles.variantBtn} ${dateVariant === v ? styles.variantBtnActive : ''}`}
                onClick={() => {
                  setDateVariant(v);
                  setActivePopover(false);
                }}
              >
                [{v}]
              </button>
            ))}
          </div>

          {/* UX Rationale Explanation Box */}
          <div className={styles.uxBanner}>
            <strong>{DATE_PATTERNS_DESCRIPTIONS[dateVariant]?.name}:</strong>{' '}
            {DATE_PATTERNS_DESCRIPTIONS[dateVariant]?.rationale}
          </div>
        </div>

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

            {/* Legacy 2nd Input rendered ONLY for Variant 1 */}
            {dateVariant === 1 && datePresetMode === 'custom' && (
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
                    onClick={selectNone}
                    title="Убрать дату"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}

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
