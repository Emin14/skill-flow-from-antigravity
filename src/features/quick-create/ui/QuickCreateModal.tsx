'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/shared/ui';
import { lockBodyScroll, unlockBodyScroll } from '@/shared/lib/scrollLock';
import { useTaskStore } from '@/entities/task';
import { TASK_CATEGORIES, TaskCategory } from '@/shared/config/categories';
import { RepetitionMode, ScheduleFrequency } from '@/shared/config/repetitionRules';
import { useQuickCreateModalStore } from '../model/quickCreateStore';
import styles from './QuickCreateModal.module.css';

const getTodayStr = () => new Date().toISOString().split('T')[0];

const getTomorrowStr = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

const formatDateDisplay = (dateStr: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) return `${parts[2]}.${parts[1]}.${parts[0]}`;
  return dateStr;
};

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

const REPEAT_LABELS: Record<string, string> = {
  none: '🔕 Без повторений',
  smart: '🧠 Умное',
  spaced: '📐 Интервальное',
  schedule: '📅 По расписанию',
  after_completion: '✅ После выполнения',
};

const FREQ_LABELS: Record<string, string> = {
  daily: 'Каждый день',
  weekly: 'Каждую неделю',
  monthly: 'Каждый месяц',
  yearly: 'Каждый год',
};

// ─── Component ────────────────────────────────────────────────────────────────
export const QuickCreateModal: React.FC = () => {
  const { isOpen, closeModal } = useQuickCreateModalStore();
  const { addTask, tasks } = useTaskStore();

  type PopoverKey = 'date' | 'category' | 'parent' | 'repeat' | 'freq' | null;
  const [openPopover, setOpenPopover] = useState<PopoverKey>(null);
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
      setScheduledDate(getTodayStr());
      setDatePresetMode('today');
    } else {
      unlockBodyScroll();
    }
    return () => { unlockBodyScroll(); };
  }, [isOpen]);

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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;
    const parsedDays = parseInt(afterCompletionDaysInput, 10);
    const afterCompletionDays = isNaN(parsedDays) || parsedDays < 1 ? 1 : parsedDays;
    await addTask({
      title: title.trim(), category, scheduledDate: scheduledDate.trim(),
      description, link, parentTaskId,
      isRepeating: repetitionMode !== 'none', repetitionMode,
      scheduleFrequency, afterCompletionDays, hasSubtasks,
    });
    setTitle('');
    setDescription('');
    setLink('');
    setParentTaskId(null);
    setRepetitionMode('none');
    setHasSubtasks(false);
    closeModal();
  };

  return (
    <div className={styles.overlay} onClick={closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* Hidden date input for desktop showPicker() fallback */}
        <input type="date" ref={hiddenNativeInputRef} value={scheduledDate}
          onChange={(e) => { if (e.target.value) { setScheduledDate(e.target.value); setDatePresetMode('custom'); } }}
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0, colorScheme: 'dark' }}
        />

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          <div className={styles.modalBody}>

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
                <span style={hint}>Тип для фильтрации и статистики</span>
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

            {/* ── Link ─────────────────────────────────────────────── */}
            <Input type="url" name="task_link_field" className={styles.selectInput}
              value={link} onChange={(e) => setLink(e.target.value)}
              placeholder="🔗 Ссылка (https://...)"
            />

            {/* ── Description ──────────────────────────────────────── */}
            <textarea className={styles.compactTextarea} value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Заметки или описание..."
            />

            {/* ── Parent task + Repetition mode — одна строка ──────── */}
            <div className={styles.formRow}>

              {/* Parent task */}
              <div style={{ position: 'relative' }}>
                <button type="button" style={glassBtn} onClick={() => toggle('parent')}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {getParentLabel()}
                  </span>
                  <span style={{ opacity: 0.4, fontSize: '11px', flexShrink: 0 }}>▾</span>
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
                <span style={hint}>Вложить в составную задачу</span>
              </div>

              {/* Repetition mode — freq/days inline, no extra rows */}
              <div style={{ position: 'relative' }}>
                <button type="button"
                  style={{ ...glassBtn, opacity: hasSubtasks ? 0.4 : 1, cursor: hasSubtasks ? 'not-allowed' : 'pointer' }}
                  onClick={() => !hasSubtasks && toggle('repeat')}>

                  {repetitionMode === 'after_completion' ? (
                    // Inline days input — no card expansion
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', flex: 1, minWidth: 0 }}>
                      <span style={{ whiteSpace: 'nowrap', fontSize: '12px' }}>✅ Через</span>
                      <input
                        type="number" min="1"
                        value={afterCompletionDaysInput}
                        onChange={(e) => setAfterCompletionDaysInput(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: '32px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '5px', color: 'var(--color-text)', fontSize: '12px', textAlign: 'center', padding: '1px 0', outline: 'none' }}
                      />
                      <span style={{ fontSize: '11px', opacity: 0.6, whiteSpace: 'nowrap' }}>дн.</span>
                    </span>
                  ) : repetitionMode === 'schedule' ? (
                    // Inline frequency select — no card expansion
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, minWidth: 0, overflow: 'hidden' }}>
                      <span style={{ whiteSpace: 'nowrap', fontSize: '12px' }}>📅</span>
                      <select
                        value={scheduleFrequency}
                        onChange={(e) => setScheduleFrequency(e.target.value as ScheduleFrequency)}
                        onClick={(e) => e.stopPropagation()}
                        style={{ background: 'transparent', border: 'none', color: 'var(--color-text)', fontSize: '12px', cursor: 'pointer', outline: 'none', flex: 1, minWidth: 0, appearance: 'none', WebkitAppearance: 'none' }}
                      >
                        <option value="daily" style={{ background: '#0f172a' }}>Каждый день</option>
                        <option value="weekly" style={{ background: '#0f172a' }}>Каждую неделю</option>
                        <option value="monthly" style={{ background: '#0f172a' }}>Каждый месяц</option>
                        <option value="yearly" style={{ background: '#0f172a' }}>Каждый год</option>
                      </select>
                    </span>
                  ) : (
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {REPEAT_LABELS[repetitionMode] ?? '🔕 Без повторений'}
                    </span>
                  )}

                  <span style={{ opacity: 0.4, fontSize: '11px', flexShrink: 0 }}>▾</span>
                </button>
                {openPopover === 'repeat' && !hasSubtasks && (
                  <div style={{ ...glassMenu, left: 'auto', right: 0, minWidth: '185px' }}>
                    {Object.entries(REPEAT_LABELS).map(([val, label]) => (
                      <button key={val} type="button" style={glassItem(repetitionMode === val)}
                        onClick={() => { setRepetitionMode(val as RepetitionMode); closeAll(); }}>
                        {label}
                      </button>
                    ))}
                  </div>
                )}
                <span style={hint}>Как и когда повторять</span>
              </div>
            </div>

            {hasSubtasks && (
              <div style={{ fontSize: '11px', color: '#f59e0b' }}>
                ⚠️ Задачи с подзадачами не могут иметь режим повторения
              </div>
            )}
          </div>

          {/* ── Action Buttons ──────────────────────────────────────── */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', paddingTop: '8px' }}>
            <button type="button" className={styles.closeBtn} onClick={closeModal}
              style={{ width: 'auto', borderRadius: '10px', padding: '0 14px', fontSize: '13px' }}>
              Отмена
            </button>
            <button type="submit" className={styles.sendBtn}>
              Создать ✓
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
