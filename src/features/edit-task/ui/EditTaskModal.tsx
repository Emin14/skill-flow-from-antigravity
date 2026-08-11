'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input, CustomCategorySelect, useToastStore } from '@/shared/ui';
import { lockBodyScroll, unlockBodyScroll } from '@/shared/lib/scrollLock';
import { useTaskStore } from '@/entities/task';
import { useCategoryStore } from '@/entities/category/model/useCategoryStore';
import { NO_DATE_VARIANTS, RenderNoDateButton } from '@/shared/config/noDateVariants';
import { Task, TaskPriority, TaskStatus, RepeatStatus } from '@/entities/task/model/types';
import { TASK_CATEGORIES, TaskCategory } from '@/shared/config/categories';
import { getCategoryColor, getCategoryEmojiDot } from '@/shared/config/categoryColors';
import { RepetitionMode, ScheduleFrequency, REPEAT_LABELS, FREQ_LABELS, WEEKDAY_OPTIONS, formatWeeklyDays } from '@/shared/config/repetitionRules';
import { getTodayStr, getTomorrowStr, formatDateDisplay } from '@/shared/lib/dateUtils';
import { STORAGE_KEYS } from '@/shared/config/storageKeys';
import styles from './EditTaskModal.module.css';

interface EditTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess?: () => void;
}


// ─── Shared glassmorphic styles ───────────────────────────────────────────────
const glassBtn: React.CSSProperties = {
  width: '100%', height: '38px', borderRadius: '10px',
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.15)',
  color: 'var(--color-text)', fontWeight: 500, fontSize: '13px',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '0 12px', cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
};

const glassMenu: React.CSSProperties = {
  position: 'absolute', top: '44px', left: 0, right: 0, zIndex: 200,
  background: 'rgba(12,20,40,0.95)', backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.13)', borderRadius: '12px',
  padding: '4px', boxShadow: '0 16px 40px rgba(0,0,0,0.65)',
  display: 'flex', flexDirection: 'column', gap: '1px',
};

const glassItem = (active = false): React.CSSProperties => ({
  background: active ? 'rgba(99,102,241,0.2)' : 'transparent',
  border: 'none', borderRadius: '8px',
  color: active ? '#a5b4fc' : 'rgba(255,255,255,0.82)',
  fontSize: '13px', padding: '7px 11px', cursor: 'pointer',
  textAlign: 'left', fontWeight: active ? 600 : 400,
  width: '100%',
});

// Subtle field hint text - 100% legible on light & dark themes
const hint: React.CSSProperties = {
  display: 'block', fontSize: '10.5px', color: 'var(--color-text-muted)',
  paddingLeft: '2px', marginTop: '1px', letterSpacing: '0.01em',
  userSelect: 'none',
};


export const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, isOpen, onClose, onSaveSuccess }) => {
  const { addTask, updateTaskDetails, deleteTaskSeries, tasks } = useTaskStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [cardVariant, setCardVariant] = useState<'1' | '2'>('1');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASK_MODAL_VARIANT) || '1';
    setCardVariant(saved as '1' | '2');
  }, []);

  const handleSetVariant = (v: '1' | '2') => {
    setCardVariant(v);
    localStorage.setItem(STORAGE_KEYS.TASK_MODAL_VARIANT, v);
  };

  const shiftScheduledDate = (deltaDays: number) => {
    const current = scheduledDate || getTodayStr();
    const parts = current.split('-').map(Number);
    const dateObj = parts.length === 3 ? new Date(parts[0], parts[1] - 1, parts[2]) : new Date();
    dateObj.setDate(dateObj.getDate() + deltaDays);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const newStr = `${year}-${month}-${day}`;
    setScheduledDate(newStr);
    setDatePresetMode('custom');
  };

  type PopoverKey = 'date' | 'category' | 'parent' | 'repeat' | 'freq' | null;
  const [openPopover, setOpenPopover] = useState<PopoverKey>(null);
  const hiddenNativeInputRef = useRef<HTMLInputElement>(null);
  const activePopoverRef = useRef<HTMLDivElement>(null);
  const storeCategories = useCategoryStore((s) => s.categories);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Без категории');
  const [scheduledDate, setScheduledDate] = useState('');
  const [datePresetMode, setDatePresetMode] = useState<'today' | 'tomorrow' | 'custom' | 'none'>('today');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [parentTaskId, setParentTaskId] = useState<string | null>(null);
  const [repetitionMode, setRepetitionMode] = useState<RepetitionMode>('none');
  const [repeatStatus, setRepeatStatus] = useState<RepeatStatus>('Active');
  const [scheduleFrequency, setScheduleFrequency] = useState<ScheduleFrequency>('daily');
  const [afterCompletionDaysInput, setAfterCompletionDaysInput] = useState('3');
  const [weeklyDays, setWeeklyDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [hasSubtasks, setHasSubtasks] = useState(false);

  const handleToggleWeekday = (dayId: number) => {
    if (weeklyDays.includes(dayId)) {
      if (weeklyDays.length <= 1) {
        useToastStore.getState().showToast('Должен быть выбран хотя бы один день недели', 'warning');
        return;
      }
      setWeeklyDays(weeklyDays.filter((id) => id !== dayId));
    } else {
      setWeeklyDays([...weeklyDays, dayId].sort((a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b)));
    }
  };

  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);

  useEffect(() => {
    if (isOpen) lockBodyScroll();
    else unlockBodyScroll();
    return () => { unlockBodyScroll(); };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (openPopover === null) return;
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (activePopoverRef.current && !activePopoverRef.current.contains(e.target as Node)) {
        setOpenPopover(null);
      }
    };
    const timer = setTimeout(() => {
      window.addEventListener('mousedown', handlePointerDown);
      window.addEventListener('touchstart', handlePointerDown);
    }, 0);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('touchstart', handlePointerDown);
    };
  }, [openPopover]);

  useEffect(() => {
    if (!task) return;
    setTitle(task.title || '');
    setCategory(task.category || 'Без категории');
    const dateVal = task.scheduledDate || '';
    setScheduledDate(dateVal);
    if (!dateVal) setDatePresetMode('none');
    else if (dateVal === getTodayStr()) setDatePresetMode('today');
    else if (dateVal === getTomorrowStr()) setDatePresetMode('tomorrow');
    else setDatePresetMode('custom');
    setDescription(task.description || '');
    setLink(task.link || '');
    setParentTaskId(task.parentTaskId || null);
    const mode = (task.repetitionMode as RepetitionMode) || (task.isRepeating ? 'spaced' : 'none');
    setRepetitionMode(mode);
    setRepeatStatus(task.repeatStatus || 'Active');
    setScheduleFrequency(task.scheduleFrequency || 'daily');
    setAfterCompletionDaysInput(String(task.afterCompletionDays || 3));
    if (task.weeklyDays && Array.isArray(task.weeklyDays) && task.weeklyDays.length > 0) {
      setWeeklyDays(task.weeklyDays);
    } else {
      setWeeklyDays([1, 2, 3, 4, 5]);
    }
    setHasSubtasks(!!task.hasSubtasks || tasks.some((t) => t.parentTaskId === task.id));
  }, [task, tasks]);

  if (!isOpen || !task) return null;

  const toggle = (pop: PopoverKey) => setOpenPopover(prev => prev === pop ? null : pop);
  const closeAll = () => setOpenPopover(null);

  // ── Date helpers ──────────────────────────────────────────────────────────
  const selectToday = () => { setDatePresetMode('today'); setScheduledDate(getTodayStr()); closeAll(); };
  const selectTomorrow = () => { setDatePresetMode('tomorrow'); setScheduledDate(getTomorrowStr()); closeAll(); };
  const selectNone = () => { setDatePresetMode('none'); setScheduledDate(''); closeAll(); };

  const handlePickCustomDate = () => {
    closeAll();
    setDatePresetMode('custom');
    const el = hiddenNativeInputRef.current as HTMLInputElement | null;
    if (el) {
      try {
        if (typeof (el as any).showPicker === 'function') (el as any).showPicker();
        else el.click();
      } catch { try { el.click(); } catch {} }
    }
  };

  const getDateLabel = () => {
    if (datePresetMode === 'today') return '☀️ Сегодня';
    if (datePresetMode === 'tomorrow') return '🌅 Завтра';
    if (datePresetMode === 'none') return '— Без даты';
    return scheduledDate ? `📆 ${formatDateDisplay(scheduledDate)}` : '📆 Выбрать дату';
  };

  const possibleParents = tasks.filter(
    (t) => t.id !== task.id && !t.parentTaskId && t.hasSubtasks === true
  );

  const getParentLabel = () => {
    if (!parentTaskId) return '📂 Основная';
    const p = possibleParents.find(t => t.id === parentTaskId);
    return p ? `📁 ${p.title}` : '📂 Основная';
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;
    const parsedDays = parseInt(afterCompletionDaysInput, 10);
    const afterCompletionDays = isNaN(parsedDays) || parsedDays < 1 ? 1 : parsedDays;

    const isDraft = task.id.startsWith('draft-');
    const effectiveIsRepeating = repetitionMode !== 'none';
    const effectiveMode = repetitionMode === 'none' ? undefined : repetitionMode;

    if (isDraft) {
      // Inbox triage: create a brand-new task instead of updating a non-existent one
      await addTask({
        title: title.trim(),
        category,
        scheduledDate: scheduledDate.trim(),
        description,
        link,
        parentTaskId,
        isRepeating: effectiveIsRepeating,
        repeatStatus: effectiveIsRepeating ? repeatStatus : undefined,
        repetitionMode: effectiveMode,
        scheduleFrequency,
        afterCompletionDays,
        weeklyDays: repetitionMode === 'specific_days' ? (weeklyDays.length > 0 ? weeklyDays : [1]) : null,
        hasSubtasks,
      });
    } else {
      const taskState = repeatStatus === 'Paused' ? 'paused' : (repeatStatus === 'Completed' ? 'completed' : 'active');
      await updateTaskDetails(task.id, {
        title: title.trim(),
        category,
        scheduledDate: scheduledDate.trim(),
        description,
        link,
        parentTaskId,
        isRepeating: effectiveIsRepeating,
        repetitionMode: effectiveMode,
        scheduleFrequency,
        afterCompletionDays,
        weeklyDays: repetitionMode === 'specific_days' ? (weeklyDays.length > 0 ? weeklyDays : [1]) : null,
        hasSubtasks,
        taskState: effectiveIsRepeating ? taskState : null,
      });
    }

    if (onSaveSuccess) onSaveSuccess();
    onClose();
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    startYRef.current = clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - startYRef.current;
    if (deltaY > 0) setDragY(deltaY);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragY > 90) {
      setDragY(0);
      onClose();
    } else {
      setDragY(0);
    }
  };

  const handleConfirmDeleteSeries = async () => {
    if (task) {
      await deleteTaskSeries(task.id, true);
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  const catThemeColor = getCategoryColor(category);

  return (
    <div className={styles.overlay} onClick={() => { closeAll(); onClose(); }}>
      <div
        className={styles.modal}
        style={{
          transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
          transition: isDragging ? 'none' : 'transform 0.22s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Swipe-Down Drag Handle */}
        <div
          className={styles.dragHandleArea}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
        >
          <div className={styles.dragHandleBar} />
        </div>

        {/* Hidden date input for desktop showPicker() fallback */}
        <input type="date" ref={hiddenNativeInputRef} value={scheduledDate}
          onChange={(e) => { if (e.target.value) { setScheduledDate(e.target.value); setDatePresetMode('custom'); } }}
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0, colorScheme: 'dark' }}
        />

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column' }}>
          <div className={styles.modalBody}>
            {/* Top-Right Dim Created Date */}
            {task.createdAt && (
              <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)', opacity: 0.55, textAlign: 'right', marginBottom: '2px' }}>
                Создано: {new Date(task.createdAt).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            )}

            {/* 1. Title Input */}
            <div>
              <Input
                type="text" name="task_title_field" className={styles.selectInput}
                value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="Название задачи..." required autoFocus
              />
            </div>

            {/* 2. Date Field with - / + Stepper & RenderNoDateButton */}
            <div>
              <div className={styles.v2DateRow}>
                <button
                  type="button"
                  className={styles.v2StepBtn}
                  onClick={() => shiftScheduledDate(-1)}
                  title="Уменьшить день на 1"
                >
                  -
                </button>
                <input
                  type="date"
                  className={styles.v2DateInput}
                  value={scheduledDate}
                  onChange={(e) => {
                    setScheduledDate(e.target.value);
                    setDatePresetMode(e.target.value ? 'custom' : 'none');
                  }}
                />
                <button
                  type="button"
                  className={styles.v2StepBtn}
                  onClick={() => shiftScheduledDate(1)}
                  title="Увеличить день на 1"
                >
                  +
                </button>
                <RenderNoDateButton
                  variantId={11}
                  scheduledDate={scheduledDate}
                  onClear={() => {
                    setScheduledDate('');
                    setDatePresetMode('none');
                  }}
                  onSetToday={() => {
                    setScheduledDate(getTodayStr());
                    setDatePresetMode('today');
                  }}
                />
              </div>
            </div>

            {/* 3. Category & Parent Task (Side-by-Side 50% / 50%) */}
            <div className={styles.formRow}>
              <div>
                <select
                  className={styles.v2Select}
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                >
                  {storeCategories.map((cat) => (
                    <option key={cat.id || cat.name} value={cat.name}>
                      {getCategoryEmojiDot(cat.name, cat.color)} {cat.name}
                    </option>
                  ))}
                </select>
                <span style={hint}>Категория</span>
              </div>

              <div>
                <select
                  className={styles.v2Select}
                  value={parentTaskId || ''}
                  onChange={(e) => setParentTaskId(e.target.value || null)}
                >
                  <option value="">Без родительской задачи</option>
                  {possibleParents.map((pt) => (
                    <option key={pt.id} value={pt.id}>
                      📁 {pt.title}
                    </option>
                  ))}
                </select>
                <span style={hint}>Родительская задача</span>
              </div>
            </div>

            {/* 4. Repetition Mode & Frequency / Days (Side-by-Side 50% / 50% Fixed Width) + Mode Explanation Box */}
            <div>
              <div className={styles.formRow}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <select
                    className={styles.v2Select}
                    value={repetitionMode}
                    disabled={hasSubtasks}
                    onChange={(e) => setRepetitionMode(e.target.value as RepetitionMode)}
                  >
                    <option value="none">🔕 Без повторов</option>
                    <option value="spaced">📐 Интервальный повтор</option>
                    <option value="smart">🧠 Умный повтор</option>
                    <option value="schedule">📅 По расписанию</option>
                    <option value="specific_days">🗓️ По определенным дням</option>
                    <option value="after_completion">⏱ Через N дней</option>
                  </select>
                </div>

                {repetitionMode === 'schedule' ? (
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <select
                      className={styles.v2Select}
                      value={scheduleFrequency}
                      onChange={(e) => setScheduleFrequency(e.target.value as ScheduleFrequency)}
                    >
                      <option value="daily">Каждый день</option>
                      <option value="weekly">Каждую неделю</option>
                      <option value="monthly">Каждый месяц</option>
                      <option value="yearly">Каждый год</option>
                    </select>
                  </div>
                ) : repetitionMode === 'specific_days' ? (
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', gap: '3px', alignItems: 'center' }}>
                    {WEEKDAY_OPTIONS.map((w) => {
                      const isSelected = weeklyDays.includes(w.id);
                      return (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => handleToggleWeekday(w.id)}
                          title={w.label}
                          style={{
                            flex: 1,
                            minWidth: 0,
                            height: '32px',
                            borderRadius: '6px',
                            background: isSelected ? 'rgba(99, 102, 241, 0.35)' : 'rgba(255, 255, 255, 0.05)',
                            border: isSelected ? '1px solid rgba(99, 102, 241, 0.7)' : '1px solid var(--color-border)',
                            color: isSelected ? '#ffffff' : 'var(--color-text-muted)',
                            fontSize: '11px',
                            fontWeight: isSelected ? 700 : 400,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {w.short}
                        </button>
                      );
                    })}
                  </div>
                ) : repetitionMode === 'after_completion' ? (
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <select
                      className={styles.v2Select}
                      value={afterCompletionDaysInput}
                      onChange={(e) => setAfterCompletionDaysInput(e.target.value)}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 10, 14, 30].map((d) => (
                        <option key={d} value={String(d)}>
                          Через {d} {d === 1 ? 'день' : d >= 2 && d <= 4 ? 'дня' : 'дней'}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : repetitionMode === 'spaced' ? (
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <select
                      className={styles.v2Select}
                      disabled
                      style={{ opacity: 0.55, cursor: 'not-allowed' }}
                    >
                      <option>1, 3, 7, 14, 30, 90д</option>
                    </select>
                  </div>
                ) : null}

              </div>
              <span style={hint}>Режим и опция повторения</span>

              {/* Repetition Hint Line (Variant 7 Apple Reminders Note Style) */}
              <div
                style={{
                  height: '30px',
                  minHeight: '30px',
                  maxHeight: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 2px',
                  background: 'transparent',
                  opacity: 0.8,
                  fontSize: '10.5px',
                  color: 'var(--color-text-muted)',
                  lineHeight: '1.25',
                  boxSizing: 'border-box',
                  marginTop: '4px',
                  overflow: 'hidden',
                }}
              >
                <span style={{ marginRight: '4px' }}>📌</span>
                <span>
                  {hasSubtasks
                    ? '⚠️ Задачи с подзадачами не имеют повторов'
                    : repetitionMode === 'none'
                    ? 'Задача выполняется 1 раз и не будет автоматически повторяться'
                    : repetitionMode === 'spaced'
                    ? 'Интервальное повторение: 1, 3, 7, 14, 30, 90 дней для памяти'
                    : repetitionMode === 'smart'
                    ? 'Умное повторение: интервалы адаптируются по оценке сложности'
                    : repetitionMode === 'schedule'
                    ? `Повтор строго по графику (${FREQ_LABELS[scheduleFrequency] || 'Каждый день'})`
                    : repetitionMode === 'specific_days'
                    ? `Повтор по выбранным дням: ${formatWeeklyDays(weeklyDays)}`
                    : `Новое повторение создастся через ${afterCompletionDaysInput || 3} дн. после клика «Выполнено»`}
                </span>
              </div>
            </div>

            {/* 5. Next Line: Description / Notes */}
            <div>
              <textarea
                className={styles.compactTextarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Описание задачи..."
              />
            </div>

            {/* 6. Next Line: Link */}
            <div>
              <Input
                type="url" name="task_link_field" className={styles.selectInput}
                value={link} onChange={(e) => setLink(e.target.value)}
                placeholder="🔗 Ссылка..."
                style={{ height: '26px' }}
              />
            </div>
          </div>

          {/* ── Action Buttons (Cancel + Save) ───── */}
          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className={styles.submitBtn}>
              Сохранить ✓
            </button>
          </div>

          {/* Bottom Centered Red Text Delete Button (Screenshot Style) */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ef4444',
                fontSize: '13px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                padding: '6px 12px',
                borderRadius: '8px',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: '13px' }}>❌</span>
              <span>{task?.isRepeating ? 'Удалить задачу со всеми повторениями' : 'Удалить задачу'}</span>
            </button>
          </div>
        </form>

        {/* Small Delete Confirmation Sub-Modal Dialog */}
        {showDeleteConfirm && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000,
              padding: '16px',
            }}
            onClick={() => setShowDeleteConfirm(false)}
          >
            <div
              style={{
                background: 'var(--color-surface, #1e293b)',
                border: '1px solid var(--color-border, rgba(255, 255, 255, 0.2))',
                borderRadius: '16px',
                padding: '20px',
                width: '100%',
                maxWidth: '360px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '22px' }}>⚠️</span>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--color-danger, #f87171)' }}>
                  Удаление задачи
                </h3>
              </div>

              <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--color-text-primary, rgba(255, 255, 255, 0.95))', lineHeight: 1.45 }}>
                Удалить текущую задачу со всеми её повторениями?
              </p>

              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{
                    flex: 1,
                    height: '38px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid var(--color-border, rgba(255, 255, 255, 0.25))',
                    color: 'var(--color-text-primary, #ffffff)',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Нет
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteSeries}
                  style={{
                    flex: 1,
                    height: '38px',
                    borderRadius: '10px',
                    background: '#ef4444',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Да, удалить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
