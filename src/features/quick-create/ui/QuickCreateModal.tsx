'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Typography, Input } from '@/shared/ui';
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

export const QuickCreateModal: React.FC = () => {
  const { isOpen, closeModal } = useQuickCreateModalStore();
  const { addTask, tasks } = useTaskStore();

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
      const today = getTodayStr();
      setScheduledDate(today);
      setDatePresetMode('today');
    } else {
      unlockBodyScroll();
    }
    return () => {
      unlockBodyScroll();
    };
  }, [isOpen]);

  if (!isOpen) return null;

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
    setRepetitionMode('none');
    setHasSubtasks(false);
    closeModal();
  };

  const possibleParents = tasks.filter(
    (t) => !t.parentTaskId && t.hasSubtasks === true
  );

  const getDateStatusLabel = () => {
    if (datePresetMode === 'today') return '☀️ Сегодня';
    if (datePresetMode === 'tomorrow') return '🌅 Завтра';
    if (datePresetMode === 'none') return '✕ Без даты';
    return scheduledDate ? `📆 ${formatDateDisplay(scheduledDate)}` : '📆 Выбрать дату';
  };

  const renderSingleDateControl = () => {
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

    if (dateVariant === 2) {
      const customLabel = (datePresetMode === 'custom' && scheduledDate)
        ? `📆 ${formatDateDisplay(scheduledDate)}`
        : '📆 Выбрать дату...';

      const openPicker = () => {
        const el = hiddenNativeInputRef.current as HTMLInputElement | null;
        if (!el) return;
        try {
          if (typeof (el as any).showPicker === 'function') {
            (el as any).showPicker();
          } else {
            el.click();
          }
        } catch {
          try { el.click(); } catch { /* iOS: silently fail, overlay handles it */ }
        }
      };

      return (
        <div style={{ position: 'relative' }}>
          <select
            className={styles.selectInput}
            value={datePresetMode}
            onChange={(e) => {
              const v = e.target.value;
              if (v === 'today') { selectToday(); return; }
              if (v === 'tomorrow') { selectTomorrow(); return; }
              if (v === 'none') { selectNone(); return; }
              setDatePresetMode('custom');
              openPicker();
            }}
          >
            <option value="today">☀️ Сегодня</option>
            <option value="tomorrow">🌅 Завтра</option>
            <option value="custom">{customLabel}</option>
            <option value="none">✕ Без даты</option>
          </select>

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
              position: 'absolute',
              top: 0,
              left: 0,
              width: 'calc(100% - 36px)',
              height: '100%',
              opacity: 0,
              border: 'none',
              background: 'transparent',
              pointerEvents: datePresetMode === 'custom' ? 'auto' : 'none',
              cursor: 'pointer',
              zIndex: datePresetMode === 'custom' ? 2 : -1,
            }}
          />
        </div>
      );
    }

    if (dateVariant === 3) {
      return (
        <div style={{ position: 'relative' }}>
          <button type="button" onClick={() => setActivePopover(!activePopover)} style={{ width: '100%', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.18)', color: 'var(--color-text)', fontWeight: 500, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
            <span>{getDateStatusLabel()}</span>
            <span style={{ opacity: 0.5, fontSize: '12px' }}>▾</span>
          </button>
          {activePopover && (
            <div style={{ position: 'absolute', top: '46px', left: 0, right: 0, zIndex: 100, background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '14px', padding: '6px', boxShadow: '0 16px 40px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {[{ label: '☀️  Сегодня', action: selectToday }, { label: '🌅  Завтра', action: selectTomorrow }, { label: '📆  Выбрать дату...', action: triggerHiddenPicker }, { label: '✕   Без даты', action: selectNone, red: true }].map(({ label, action, red }) => (
                <button key={label} type="button" onClick={action} style={{ background: 'transparent', border: 'none', borderRadius: '8px', color: red ? '#f87171' : 'rgba(255,255,255,0.85)', fontSize: '14px', padding: '8px 12px', cursor: 'pointer', textAlign: 'left' }}>{label}</button>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (dateVariant === 4) {
      const neonChips = [
        { label: '☀️', full: 'Сегодня', mode: 'today' as const, action: selectToday, color: '#facc15', glow: 'rgba(250,204,21,0.4)' },
        { label: '🌅', full: 'Завтра', mode: 'tomorrow' as const, action: selectTomorrow, color: '#fb923c', glow: 'rgba(251,146,60,0.4)' },
        { label: '📆', full: datePresetMode === 'custom' && scheduledDate ? formatDateDisplay(scheduledDate) : 'Дата', mode: 'custom' as const, action: triggerHiddenPicker, color: '#34d399', glow: 'rgba(52,211,153,0.4)' },
      ];
      return (
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {neonChips.map(({ label, full, mode, action, color, glow }) => {
            const isActive = datePresetMode === mode;
            return (
              <button key={mode} type="button" onClick={action} style={{ flex: mode === 'custom' ? 1 : 'none', height: '38px', borderRadius: '10px', padding: '0 10px', border: `1.5px solid ${isActive ? color : 'rgba(255,255,255,0.12)'}`, background: isActive ? `rgba(${color === '#facc15' ? '250,204,21' : color === '#fb923c' ? '251,146,60' : '52,211,153'},0.15)` : 'transparent', color: isActive ? color : 'rgba(255,255,255,0.55)', boxShadow: isActive ? `0 0 12px ${glow}` : 'none', fontWeight: isActive ? 700 : 400, fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>{label} {full}</button>
            );
          })}
          <button type="button" onClick={selectNone} style={{ height: '38px', width: '34px', borderRadius: '10px', border: '1.5px solid rgba(248,113,113,0.3)', background: datePresetMode === 'none' ? 'rgba(248,113,113,0.15)' : 'transparent', color: '#f87171', cursor: 'pointer', fontSize: '14px', flexShrink: 0 }}>✕</button>
        </div>
      );
    }

    if (dateVariant === 5) {
      return (
        <div style={{ position: 'relative' }}>
          <button type="button" onClick={() => setActivePopover(!activePopover)} style={{ width: '100%', height: '40px', background: 'transparent', border: 'none', borderBottom: '2px solid rgba(255,255,255,0.2)', color: 'var(--color-text)', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px', cursor: 'pointer' }}>
            <span>{getDateStatusLabel()}</span>
            <span style={{ fontSize: '10px', opacity: 0.4 }}>▾</span>
          </button>
          {activePopover && (
            <div style={{ position: 'absolute', top: '44px', left: 0, right: 0, zIndex: 100, background: '#1a1f2e', borderRadius: '10px', padding: '4px', boxShadow: '0 8px 32px rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column' }}>
              {[{ label: 'Сегодня', sub: 'сб', action: selectToday }, { label: 'Завтра', sub: 'вс', action: selectTomorrow }, { label: 'Выбрать дату', sub: '...', action: triggerHiddenPicker }, { label: 'Без даты', sub: '—', action: selectNone }].map(({ label, sub, action }) => (
                <button key={label} type="button" onClick={action} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', borderRadius: '6px', color: 'var(--color-text)', fontSize: '13px', padding: '7px 10px', cursor: 'pointer' }}>
                  <span>{label}</span><span style={{ opacity: 0.3, fontSize: '11px' }}>{sub}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (dateVariant === 6) {
      const icons = [
        { emoji: '☀️', label: 'Сегодня', mode: 'today' as const, action: selectToday },
        { emoji: '🌅', label: 'Завтра', mode: 'tomorrow' as const, action: selectTomorrow },
        { emoji: '📆', label: datePresetMode === 'custom' && scheduledDate ? formatDateDisplay(scheduledDate) : 'Дата', mode: 'custom' as const, action: triggerHiddenPicker },
        { emoji: '✕', label: 'Нет', mode: 'none' as const, action: selectNone },
      ];
      return (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {icons.map(({ emoji, label, mode, action }) => {
            const isActive = datePresetMode === mode;
            return (
              <button key={mode} type="button" onClick={action} title={label} style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '50%', background: isActive ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.05)', border: isActive ? '2px solid #818cf8' : '2px solid rgba(255,255,255,0.1)', fontSize: '18px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isActive ? '0 0 10px rgba(129,140,248,0.5)' : 'none' }}>{emoji}</button>
            );
          })}
          {datePresetMode === 'custom' && scheduledDate && (
            <span style={{ fontSize: '12px', color: '#818cf8', fontWeight: 600, flex: 1 }}>{formatDateDisplay(scheduledDate)}</span>
          )}
        </div>
      );
    }

    if (dateVariant === 7) {
      return (
        <div style={{ position: 'relative' }}>
          <button type="button" onClick={() => setActivePopover(!activePopover)} style={{ width: '100%', height: '40px', borderRadius: '12px', background: 'rgba(120,130,160,0.15)', border: '1px solid rgba(255,255,255,0.12)', color: 'var(--color-text)', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px', padding: '0 14px', cursor: 'pointer' }}>
            <span style={{ fontSize: '16px' }}>🗓</span>
            <span style={{ flex: 1, textAlign: 'left' }}>{getDateStatusLabel()}</span>
            <span style={{ fontSize: '18px', opacity: 0.3 }}>›</span>
          </button>
          {activePopover && (
            <div style={{ position: 'absolute', top: '46px', left: 0, right: 0, zIndex: 100, background: 'rgba(28,35,55,0.95)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 24px 48px rgba(0,0,0,0.7)' }}>
              {[{ label: 'Сегодня', icon: '☀️', action: selectToday }, { label: 'Завтра', icon: '🌅', action: selectTomorrow }, { label: 'Выбрать дату...', icon: '📆', action: triggerHiddenPicker }, { label: 'Без даты', icon: '✕', action: selectNone, destructive: true }].map(({ label, icon, action, destructive }, i) => (
                <button key={label} type="button" onClick={action} style={{ width: '100%', background: 'transparent', border: 'none', borderTop: i > 0 ? '1px solid rgba(255,255,255,0.06)' : 'none', color: destructive ? '#f87171' : 'var(--color-text)', fontSize: '15px', padding: '13px 16px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', textAlign: 'left' }}>
                  <span>{icon}</span><span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (dateVariant === 8) {
      return (
        <div style={{ position: 'relative' }}>
          <button type="button" onClick={() => setActivePopover(!activePopover)} style={{ width: '100%', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(59,130,246,0.25))', border: '1px solid rgba(139,92,246,0.5)', color: '#c4b5fd', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', cursor: 'pointer', boxShadow: '0 2px 16px rgba(139,92,246,0.2)' }}>
            <span>📅 {getDateStatusLabel()}</span>
            <span style={{ fontSize: '11px', background: 'rgba(139,92,246,0.3)', borderRadius: '6px', padding: '2px 6px' }}>срок</span>
          </button>
          {activePopover && (
            <div style={{ position: 'absolute', top: '46px', left: 0, right: 0, zIndex: 100, background: 'linear-gradient(160deg, #1e1b4b, #1e293b)', border: '1px solid rgba(139,92,246,0.4)', borderRadius: '12px', padding: '6px', boxShadow: '0 12px 40px rgba(139,92,246,0.3)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {[{ label: 'Сегодня', icon: '☀️', action: selectToday, color: '#a5b4fc' }, { label: 'Завтра', icon: '🌅', action: selectTomorrow, color: '#93c5fd' }, { label: 'Выбрать дату...', icon: '📆', action: triggerHiddenPicker, color: '#c4b5fd' }, { label: 'Без даты', icon: '✕', action: selectNone, color: '#f87171' }].map(({ label, icon, action, color }) => (
                <button key={label} type="button" onClick={action} style={{ background: 'rgba(255,255,255,0.04)', border: 'none', borderRadius: '8px', color, fontSize: '13px', padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left', fontWeight: 500 }}>
                  <span>{icon}</span><span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (dateVariant === 9) {
      const outlineChips = [
        { label: '☀️ Сегодня', mode: 'today' as const, action: selectToday },
        { label: '🌅 Завтра', mode: 'tomorrow' as const, action: selectTomorrow },
        { label: datePresetMode === 'custom' && scheduledDate ? `📆 ${formatDateDisplay(scheduledDate)}` : '📆 Дата', mode: 'custom' as const, action: triggerHiddenPicker },
        { label: '✕', mode: 'none' as const, action: selectNone },
      ];
      return (
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'nowrap' }}>
          {outlineChips.map(({ label, mode, action }) => {
            const isActive = datePresetMode === mode;
            return (
              <button key={mode} type="button" onClick={action} style={{ flex: mode === 'custom' ? 1 : 'none', height: '36px', borderRadius: '18px', padding: '0 12px', border: `1.5px solid ${isActive ? 'var(--color-text)' : 'rgba(255,255,255,0.2)'}`, background: isActive ? 'var(--color-text)' : 'transparent', color: isActive ? 'var(--color-bg)' : 'rgba(255,255,255,0.65)', fontSize: '12px', fontWeight: isActive ? 700 : 400, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.18s' }}>{label}</button>
            );
          })}
        </div>
      );
    }

    return (
      <div style={{ position: 'relative' }}>
        <button type="button" onClick={() => setActivePopover(!activePopover)} style={{ width: '100%', height: '40px', borderRadius: '8px', background: 'rgba(217,119,6,0.12)', border: '1px solid rgba(217,119,6,0.5)', color: '#fbbf24', fontSize: '13px', fontWeight: 700, fontFamily: 'monospace', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', cursor: 'pointer' }}>
          <span>▶ {getDateStatusLabel()}</span>
          <span style={{ fontSize: '10px', opacity: 0.6, letterSpacing: '0.05em' }}>CMD+D ▾</span>
        </button>
        {activePopover && (
          <div style={{ position: 'absolute', top: '46px', left: 0, right: 0, zIndex: 100, background: '#0c0a00', border: '1px solid rgba(217,119,6,0.6)', borderRadius: '8px', padding: '4px', boxShadow: '0 8px 32px rgba(217,119,6,0.2)', display: 'flex', flexDirection: 'column' }}>
            {[{ key: 'T', label: 'Сегодня', action: selectToday }, { key: 'TM', label: 'Завтра', action: selectTomorrow }, { key: 'D', label: 'Выбрать дату...', action: triggerHiddenPicker }, { key: 'X', label: 'Без даты', action: selectNone, dim: true }].map(({ key, label, action, dim }) => (
              <button key={key} type="button" onClick={action} style={{ background: 'transparent', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: dim ? 'rgba(251,191,36,0.4)' : '#fbbf24', fontFamily: 'monospace', fontSize: '13px', padding: '7px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                <span>{label}</span>
                <span style={{ opacity: 0.4, fontSize: '11px' }}>[{key}]</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.overlay} onClick={closeModal}>
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
          style={{
            position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0,
            colorScheme: 'dark',
          }}
        />

        {/* 10 Date Picker Single-Control UX Selector Header Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
              Выберите UX-вариант поля даты (1–10):
            </span>
            <button className={styles.closeBtn} onClick={closeModal} aria-label="Закрыть">
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
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
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
              onClick={closeModal}
              style={{ width: 'auto', borderRadius: '10px', padding: '0 14px', fontSize: '13px' }}
            >
              Отмена
            </button>
            <button type="submit" className={styles.sendBtn} title="Создать">
              Создать ✓
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
