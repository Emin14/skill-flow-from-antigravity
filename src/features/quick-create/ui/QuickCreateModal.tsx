'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/shared/ui';
import { lockBodyScroll, unlockBodyScroll } from '@/shared/lib/scrollLock';
import { useTaskStore } from '@/entities/task';
import { TASK_CATEGORIES, TaskCategory } from '@/shared/config/categories';
import { RepetitionMode, ScheduleFrequency, REPEAT_LABELS, FREQ_LABELS } from '@/shared/config/repetitionRules';
import { getTodayStr, getTomorrowStr, formatDateDisplay } from '@/shared/lib/dateUtils';
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

// Subtle field hint text
const hint: React.CSSProperties = {
  display: 'block', fontSize: '10px', color: 'rgba(255,255,255,0.25)',
  paddingLeft: '3px', marginTop: '3px', letterSpacing: '0.01em',
  userSelect: 'none',
};

export const QuickCreateModal: React.FC = () => {
  const { isOpen, closeModal } = useQuickCreateModalStore();
  const { addTask, tasks } = useTaskStore();

  type PopoverKey = 'date' | 'category' | 'parent' | 'repeat' | 'freq' | null;
  const [openPopover, setOpenPopover] = useState<PopoverKey>(null);
  const hiddenNativeInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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
      setScheduledDate(getTodayStr());
      setDatePresetMode('today');
    } else {
      unlockBodyScroll();
    }
    return () => { unlockBodyScroll(); };
  }, [isOpen]);

  useEffect(() => {
    if (openPopover === null) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setOpenPopover(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  return (
    <div className={styles.overlay} onClick={() => { closeAll(); closeModal(); }}>
      <div className={styles.modal} ref={modalRef} onClick={(e) => e.stopPropagation()}>

        {/* Hidden date input for desktop showPicker() fallback */}
        <input type="date" ref={hiddenNativeInputRef} value={scheduledDate}
          onChange={(e) => { if (e.target.value) { setScheduledDate(e.target.value); setDatePresetMode('custom'); } }}
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0, colorScheme: 'dark' }}
        />

        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column' }}>
          <div className={styles.modalBody} onClick={(e) => { if (e.target === e.currentTarget) closeAll(); }}>

            {/* ── Title ────────────────────────────────────────────── */}
            <Input
              type="text" name="task_title_field" className={styles.selectInput}
              value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Название задачи..." required autoFocus
            />

            {/* ── Category + Date ───────────────────────────────────── */}
            <div className={styles.formRow}>

              {/* Category */}
              <div style={{ position: 'relative' }}>
                <button type="button" style={glassBtn} onClick={() => toggle('category')}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    🏷 {category}
                  </span>
                  <span style={{ opacity: 0.4, fontSize: '11px', flexShrink: 0 }}>▾</span>
                </button>
                {openPopover === 'category' && (
                  <div style={glassMenu}>
                    {TASK_CATEGORIES.map((cat) => (
                      <button key={cat} type="button" style={glassItem(category === cat)}
                        onClick={() => { setCategory(cat); closeAll(); }}>
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
                <span style={hint}>Категория</span>
              </div>

              {/* Date */}
              <div style={{ position: 'relative' }}>
                <button type="button" style={glassBtn} onClick={() => toggle('date')}>
                  <span>{getDateLabel()}</span>
                  <span style={{ opacity: 0.4, fontSize: '11px', flexShrink: 0 }}>▾</span>
                </button>
                {/* iOS transparent overlay — appears when custom date selected */}
                {datePresetMode === 'custom' && openPopover !== 'date' && (
                  <input ref={hiddenNativeInputRef} type="date" value={scheduledDate || ''}
                    onChange={(e) => { if (e.target.value) { setScheduledDate(e.target.value); setDatePresetMode('custom'); } }}
                    style={{ position: 'absolute', top: 0, left: 0, width: 'calc(100% - 36px)', height: '38px', opacity: 0, cursor: 'pointer', border: 'none', background: 'transparent', pointerEvents: 'auto', zIndex: 2, colorScheme: 'dark' }} />
                )}
                {openPopover === 'date' && (
                  <div style={glassMenu}>
                    {([
                      { label: '☀️  Сегодня', action: selectToday },
                      { label: '🌅  Завтра', action: selectTomorrow },
                      { label: '📆  Выбрать дату...', action: handlePickCustomDate },
                      { label: '—   Без даты', action: selectNone },
                    ] as const).map(({ label, action }) => (
                      <button key={label} type="button" style={glassItem()} onClick={action}>{label}</button>
                    ))}
                  </div>
                )}
                <span style={hint}>Срок выполнения</span>
              </div>
            </div>

            {/* ── Parent task + Link ──────────────────────────────────── */}
            <div className={styles.formRow}>
              {/* Parent task */}
              <div style={{ position: 'relative' }}>
                <button type="button" style={glassBtn} onClick={() => toggle('parent')}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, flex: 1, textAlign: 'left' }}>
                    {getParentLabel()}
                  </span>
                  <span style={{ opacity: 0.4, fontSize: '11px', flexShrink: 0, marginLeft: '4px' }}>▾</span>
                </button>
                {openPopover === 'parent' && (
                  <div style={glassMenu}>
                    <button type="button" style={glassItem(!parentTaskId)}
                      onClick={() => { setParentTaskId(null); closeAll(); }}>
                      📂 Основная задача
                    </button>
                    {possibleParents.map((pt) => (
                      <button key={pt.id} type="button" style={glassItem(parentTaskId === pt.id)}
                        onClick={() => { setParentTaskId(pt.id); closeAll(); }}>
                        📁 {pt.title}
                      </button>
                    ))}
                    {possibleParents.length === 0 && (
                      <div style={{ padding: '7px 11px', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                        Нет доступных задач
                      </div>
                    )}
                  </div>
                )}
                <span style={hint}>Вложить в составную</span>
              </div>

              {/* Link */}
              <div style={{ position: 'relative' }}>
                <Input type="url" name="task_link_field" className={styles.selectInput}
                  value={link} onChange={(e) => setLink(e.target.value)}
                  placeholder="🔗 Ссылка..."
                  style={{ height: '38px' }}
                />
                <span style={hint}>Ссылка (https://...)</span>
              </div>
            </div>

            {/* ── Description ──────────────────────────────────────── */}
            <textarea className={styles.compactTextarea} value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Заметки или описание..."
            />

            {/* ── Repetition Controls (Side-by-Side 2 Properties) ──── */}
            <div className={styles.formRow}>

              {/* Property 1: Main Repetition Mode Select */}
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  style={{ ...glassBtn, opacity: hasSubtasks ? 0.4 : 1, cursor: hasSubtasks ? 'not-allowed' : 'pointer' }}
                  onClick={() => !hasSubtasks && toggle('repeat')}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {REPEAT_LABELS[repetitionMode] ?? '🔕 Без повторов'}
                  </span>
                  <span style={{ opacity: 0.4, fontSize: '11px', flexShrink: 0 }}>▾</span>
                </button>

                {openPopover === 'repeat' && !hasSubtasks && (
                  <div style={{ ...glassMenu, bottom: '44px', top: 'auto', left: 0, right: 0 }}>
                    {Object.entries(REPEAT_LABELS).map(([val, label]) => (
                      <button
                        key={val}
                        type="button"
                        style={glassItem(repetitionMode === val)}
                        onClick={() => { setRepetitionMode(val as RepetitionMode); closeAll(); }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
                <span style={hint}>Режим повторения</span>
              </div>

              {/* Property 2: Mode Sub-option Select (Fixed 50% width, zero layout shift) */}
              <div style={{ position: 'relative' }}>
                {repetitionMode === 'schedule' ? (
                  <button
                    type="button"
                    style={glassBtn}
                    onClick={() => toggle('freq')}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      📅 {FREQ_LABELS[scheduleFrequency] ?? 'Каждый день'}
                    </span>
                    <span style={{ opacity: 0.4, fontSize: '11px', flexShrink: 0 }}>▾</span>
                  </button>
                ) : repetitionMode === 'after_completion' ? (
                  <div style={{ ...glassBtn, padding: '0 8px', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', whiteSpace: 'nowrap', opacity: 0.8 }}>✅ Через</span>
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={afterCompletionDaysInput}
                      onChange={(e) => setAfterCompletionDaysInput(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        width: '42px',
                        background: 'rgba(255,255,255,0.12)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '6px',
                        color: 'var(--color-text)',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        textAlign: 'center',
                        padding: '2px 0',
                        outline: 'none',
                      }}
                    />
                    <span style={{ fontSize: '11.5px', opacity: 0.7 }}>дн.</span>
                  </div>
                ) : (
                  <div style={{ ...glassBtn, opacity: 0.5, cursor: 'default', justifyContent: 'center' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>
                      {repetitionMode === 'spaced' ? '1,3,7,14,30,90 дн.' : repetitionMode === 'smart' ? 'Адаптивный' : '—'}
                    </span>
                  </div>
                )}

                {openPopover === 'freq' && repetitionMode === 'schedule' && (
                  <div style={{ ...glassMenu, bottom: '44px', top: 'auto', left: 0, right: 0 }}>
                    {Object.entries(FREQ_LABELS).map(([val, label]) => (
                      <button
                        key={val}
                        type="button"
                        style={glassItem(scheduleFrequency === val)}
                        onClick={() => { setScheduleFrequency(val as ScheduleFrequency); closeAll(); }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
                <span style={hint}>Опция режима</span>
              </div>
            </div>

            {/* ── Mode Explanation Hint Box (Fixed height, zero layout shift) ── */}
            <div
              style={{
                minHeight: '30px',
                padding: '6px 10px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                align-items: 'center',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.65)',
                lineHeight: '1.3',
                boxSizing: 'border-box',
                marginTop: '2px',
              }}
            >
              {hasSubtasks ? (
                <span style={{ color: '#f59e0b' }}>⚠️ Задачи с подзадачами не могут иметь режим повторения</span>
              ) : (
                <>
                  {repetitionMode === 'none' && '💡 Задача выполняется 1 раз и не будет автоматически повторяться.'}
                  {repetitionMode === 'spaced' && '💡 Интервальное повторение: 1, 3, 7, 14, 30, 90 дней для прочной памяти.'}
                  {repetitionMode === 'schedule' && `💡 Автоматическое повторение строго по графику (${FREQ_LABELS[scheduleFrequency] || 'Каждый день'}).`}
                  {repetitionMode === 'after_completion' && `💡 Новое повторение создастся через ${afterCompletionDaysInput || 3} дн. после клика «Выполнено».`}
                  {repetitionMode === 'smart' && '💡 Умные адаптивные интервалы: график меняется от вашей оценки сложности.'}
                </>
              )}
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
