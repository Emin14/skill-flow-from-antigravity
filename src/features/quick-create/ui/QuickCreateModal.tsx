'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/shared/ui';
import { lockBodyScroll, unlockBodyScroll } from '@/shared/lib/scrollLock';
import { useTaskStore } from '@/entities/task';
import { useCategoryStore } from '@/entities/category/model/useCategoryStore';
import { TASK_CATEGORIES, TaskCategory } from '@/shared/config/categories';
import { RepetitionMode, ScheduleFrequency, REPEAT_LABELS, FREQ_LABELS } from '@/shared/config/repetitionRules';
import { getTodayStr, getTomorrowStr, formatDateDisplay } from '@/shared/lib/dateUtils';
import { STORAGE_KEYS } from '@/shared/config/storageKeys';
import { useQuickCreateModalStore } from '../model/quickCreateStore';
import styles from './QuickCreateModal.module.css';

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
  paddingLeft: '3px', marginTop: '3px', letterSpacing: '0.01em',
  userSelect: 'none',
};

import { getCategoryColor } from '@/shared/config/categoryColors';

export const QuickCreateModal: React.FC = () => {
  const { isOpen, closeModal } = useQuickCreateModalStore();
  const { addTask, tasks } = useTaskStore();
  const storeCategories = useCategoryStore((s) => s.categories);
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

  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);

  useEffect(() => {
    if (isOpen) {
      lockBodyScroll();
      setScheduledDate(getTodayStr());
      setDatePresetMode('today');
    } else {
      unlockBodyScroll();
    }
    return () => { unlockBodyScroll(); };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeModal]);

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

  if (!isOpen) return null;

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

  const possibleParents = tasks.filter((t) => !t.parentTaskId && t.hasSubtasks === true);

  const getParentLabel = () => {
    if (!parentTaskId) return '📂 Основная';
    const p = possibleParents.find(t => t.id === parentTaskId);
    return p ? `📁 ${p.title}` : '📂 Основная';
  };

  const handleCreate = async (e?: React.FormEvent) => {
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
      hasSubtasks: false,
    });

    setTitle('');
    setDescription('');
    setLink('');
    setParentTaskId(null);
    setRepetitionMode('none');
    setAfterCompletionDaysInput('3');
    closeModal();
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
      closeModal();
    } else {
      setDragY(0);
    }
  };

  const catThemeColor = getCategoryColor(category);

  return (
    <div className={styles.overlay} onClick={closeModal}>
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

        {/* Top Category Theme Accent Line */}
        <div
          style={{
            height: '3px',
            width: '100%',
            borderRadius: '3px 3px 0 0',
            background: `linear-gradient(90deg, ${catThemeColor} 0%, transparent 85%)`,
            marginBottom: '4px',
            transition: 'background 0.3s ease',
          }}
        />

        {/* Hidden date input for desktop showPicker() fallback */}
        <input type="date" ref={hiddenNativeInputRef} value={scheduledDate}
          onChange={(e) => { if (e.target.value) { setScheduledDate(e.target.value); setDatePresetMode('custom'); } }}
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0, colorScheme: 'dark' }}
        />

        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column' }}>
          <div className={styles.modalBody}>

            {/* 1. Title Input */}
            <div>
              <Input
                type="text" name="task_title_field" className={styles.selectInput}
                value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="Название задачи..." required autoFocus
              />
            </div>

            {/* 2. Date Field with - / + Stepper */}
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
                  value={scheduledDate || getTodayStr()}
                  onChange={(e) => {
                    setScheduledDate(e.target.value || getTodayStr());
                    setDatePresetMode('custom');
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
                      {cat.name}
                    </option>
                  ))}
                </select>
                <span style={hint}>🏷 Категория</span>
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
                <span style={hint}>📁 Родительская задача</span>
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
              <span style={hint}>🔁 Режим и опция повторения</span>

              {/* Mode Explanation Hint Box DIRECTLY Below Repetition Selects */}
              <div
                style={{
                  minHeight: '28px',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  background: 'var(--color-surface-hover)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '10.5px',
                  color: 'var(--color-text-muted)',
                  lineHeight: '1.25',
                  boxSizing: 'border-box',
                  marginTop: '3px',
                }}
              >
                {hasSubtasks ? (
                  <span style={{ color: 'var(--color-warning)' }}>⚠️ Задачи с подзадачами не имеют повторов</span>
                ) : (
                  <>
                    {repetitionMode === 'none' && '💡 Задача выполняется 1 раз и не будет автоматически повторяться'}
                    {repetitionMode === 'spaced' && '💡 Интервальное повторение: 1, 3, 7, 14, 30, 90 дней для памяти'}
                    {repetitionMode === 'smart' && '💡 Умное повторение: интервалы адаптируются по оценке сложности (Легко/Нормально/Сложно)'}
                    {repetitionMode === 'schedule' && `💡 Повтор строго по графику (${FREQ_LABELS[scheduleFrequency] || 'Каждый день'})`}
                    {repetitionMode === 'after_completion' && `💡 Новое повторение создастся через ${afterCompletionDaysInput || 3} дн. после клика «Выполнено»`}
                  </>
                )}
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
                style={{ height: '38px' }}
              />
            </div>

          </div>

          {/* ── Symmetrical Action Buttons ───────────────────────── */}
          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={closeModal}>
              Отмена
            </button>
            <button type="submit" className={styles.submitBtn}>
              Создать ✓
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
