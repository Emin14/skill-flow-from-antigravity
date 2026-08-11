'use client';

import React, { useMemo, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Task } from '@/entities/task/model/types';
import { SmartRating, formatWeeklyDays } from '@/shared/config/repetitionRules';
import { useTaskStore, normalizeOccurrences } from '@/entities/task';
import { lockBodyScroll, unlockBodyScroll } from '@/shared/lib/scrollLock';
import { getTodayStr, formatDateDisplay, formatLocalDateStr } from '@/shared/lib/dateUtils';
import { ChevronDown, ChevronUp, Calendar, Trash2, ExternalLink, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { useToastStore } from '@/shared/ui';
import styles from './EditTaskModal.module.css';

interface RepeatingTaskDetailModalProps {
  task: Task | null;
  occurrenceDate?: string;
  isOpen: boolean;
  onClose: () => void;
  onOpenEdit: () => void;
}

const formatRepetitionText = (count: number): string => {
  const mod10 = count % 10;
  const mod100 = count % 100;
  let word = 'повторений';
  if (mod100 >= 11 && mod100 <= 19) {
    word = 'повторений';
  } else if (mod10 === 1) {
    word = 'повторение';
  } else if (mod10 >= 2 && mod10 <= 4) {
    word = 'повторения';
  }
  return `Выполнено ${count} ${word}`;
};

const formatDateTitleRu = (dateStr?: string) => {
  if (!dateStr || !dateStr.includes('-')) return dateStr || 'Без даты';
  const parts = dateStr.split('-').map(Number);
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const RepeatingTaskDetailModal: React.FC<RepeatingTaskDetailModalProps> = ({
  task,
  occurrenceDate,
  isOpen,
  onClose,
  onOpenEdit,
}) => {
  const router = useRouter();
  const { tasks, updateTaskPomodoros, updateOccurrenceRating, updateOccurrenceNote, updateTaskStatus, deleteTaskSeries, deleteTaskOccurrence, updateOccurrenceDate, toggleTaskStatus, updateTaskDetails, updateRepeatStatus } = useTaskStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState<SmartRating | null>(null);
  const [sessionNote, setSessionNote] = useState<string>('');
  const [overrideDate, setOverrideDate] = useState<string | null>(null);

  useEffect(() => {
    setOverrideDate(null);
  }, [task?.id, occurrenceDate, isOpen]);

  const masterTask = useMemo(() => {
    if (!task) return null;
    const currentTaskFromStore = tasks.find((t) => t.id === task.id) || task;
    const occurrences = normalizeOccurrences(currentTaskFromStore.occurrences || [], currentTaskFromStore.id);
    const doneOccurrences = occurrences.filter((o) => o.status === 'Done');
    return {
      ...currentTaskFromStore,
      occurrences,
      repetitionsCount: doneOccurrences.length,
    };
  }, [task, tasks]);

  const activeOccDate = useMemo(() => {
    if (overrideDate) return overrideDate;
    if (!masterTask) return getTodayStr();
    return occurrenceDate || (masterTask.occurrences?.find((o) => o.status === 'Todo')?.date) || masterTask.scheduledDate || getTodayStr();
  }, [masterTask, occurrenceDate, overrideDate]);

  const currentSessionNote = useMemo(() => {
    if (!masterTask) return '';
    return masterTask.occurrences?.find((o) => o.date === activeOccDate)?.note || '';
  }, [masterTask?.id, masterTask?.occurrences, activeOccDate]);

  const currentSessionOcc = useMemo(() => {
    if (!masterTask) return null;
    return masterTask.occurrences?.find((o) => o.date === activeOccDate) || null;
  }, [masterTask, activeOccDate]);

  const latestNoteRef = useRef<string>('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSelectedRating(currentSessionOcc?.smartRating || null);
  }, [currentSessionOcc?.smartRating, activeOccDate]);

  useEffect(() => {
    setSessionNote(currentSessionNote);
    latestNoteRef.current = currentSessionNote;
  }, [masterTask?.id, activeOccDate, currentSessionNote]);

  const handleNoteChange = (val: string) => {
    setSessionNote(val);
    latestNoteRef.current = val;
    if (masterTask) {
      updateOccurrenceNote(masterTask.id, val, activeOccDate);
    }
  };

  const handleNoteBlur = () => {
    if (masterTask) {
      updateOccurrenceNote(masterTask.id, latestNoteRef.current, activeOccDate);
    }
  };

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

  const modalRef = useRef<HTMLDivElement>(null);
  const touchStartYRef = useRef<number>(0);
  const touchCurrentYRef = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    touchStartYRef.current = clientY;
    touchCurrentYRef.current = clientY;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    touchCurrentYRef.current = clientY;
    const deltaY = touchCurrentYRef.current - touchStartYRef.current;

    if (deltaY > 0 && modalRef.current) {
      modalRef.current.style.transform = `translateY(${deltaY}px)`;
      modalRef.current.style.transition = 'none';
    }
  };

  const handleTouchEnd = () => {
    const deltaY = touchCurrentYRef.current - touchStartYRef.current;
    if (deltaY > 100) {
      onClose();
    } else if (modalRef.current) {
      modalRef.current.style.transform = 'translateY(0)';
      modalRef.current.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
    }
    touchStartYRef.current = 0;
    touchCurrentYRef.current = 0;
  };

  if (!isOpen || !masterTask) return null;

  const handleConfirmDeleteSeries = async () => {
    if (masterTask) {
      await deleteTaskSeries(masterTask.id, true);
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  const handleDeleteLower = async () => {
    if (!masterTask) return;
    if (masterTask.isRepeating) {
      await deleteTaskOccurrence(masterTask.id, activeOccDate);
      onClose();
    } else {
      await deleteTaskSeries(masterTask.id, true);
      onClose();
    }
  };

  const currentCount = masterTask.repetitionsCount || 0;
  const targetCount = masterTask.targetRepetitions || 8;
  const activeRating = currentSessionOcc?.smartRating || null;
  const currentPomodoros = currentSessionOcc?.pomodorosCount ?? 1;

  const todayStr = getTodayStr();

  let streak = 0;
  const pastOrTodayOccs = [...(masterTask.occurrences || [])]
    .filter((o) => o.date <= todayStr)
    .sort((a, b) => b.date.localeCompare(a.date));

  for (const occ of pastOrTodayOccs) {
    if (occ.status === 'Done') {
      streak++;
    } else if (occ.date < todayStr && occ.status === 'Todo') {
      break;
    }
  }

  const formattedOccDate = formatDateTitleRu(activeOccDate);

  const seriesStartDate = masterTask.occurrences && masterTask.occurrences.length > 0
    ? masterTask.occurrences[0].date
    : masterTask.scheduledDate || todayStr;

  const pomoOptions = [
    { num: '⅓', hasTomato: false, val: 0.33 },
    { num: '½', hasTomato: false, val: 0.5 },
    { num: '1', hasTomato: true, val: 1 },
    { num: '2', hasTomato: true, val: 2 },
    { num: '3', hasTomato: true, val: 3 },
    { num: '4', hasTomato: true, val: 4 },
  ];

  const occurrencesList = [...(masterTask.occurrences || [])].sort((a, b) => b.date.localeCompare(a.date));

  const todayOccurrence = masterTask.occurrences?.find((o) => o.date === activeOccDate);
  const isTodayDone = masterTask.isRepeating ? todayOccurrence?.status === 'Done' : masterTask.status === 'Done';

  const handleRatingClick = (ratingKey: SmartRating) => {
    const newRating = selectedRating === ratingKey ? null : ratingKey;
    setSelectedRating(newRating);
    if (masterTask) {
      updateOccurrenceRating(masterTask.id, newRating, activeOccDate);
    }
  };

  const handleToggleTodayOccurrence = async () => {
    if (!masterTask) return;
    const ratingToUse = selectedRating || masterTask.lastSmartRating || 'normal';
    if (isTodayDone) {
      if (masterTask.isRepeating) {
        await toggleTaskStatus(masterTask.id, undefined, activeOccDate);
      } else {
        await toggleTaskStatus(masterTask.id);
      }
    } else {
      if (masterTask.isRepeating) {
        await updateTaskStatus(masterTask.id, 'Done', ratingToUse, activeOccDate);
      } else {
        await updateTaskStatus(masterTask.id, 'Done', ratingToUse);
      }
      onClose();
    }
  };

  const repeatConfigText = masterTask.isRepeating
    ? (masterTask.repetitionMode === 'smart' ? 'Повтор: умный (SM-2)'
      : masterTask.repetitionMode === 'spaced' ? 'Повтор: интервальный'
      : masterTask.repetitionMode === 'schedule' ? 'Повтор: по расписанию'
      : masterTask.repetitionMode === 'specific_days' ? `Повтор: по дням (${formatWeeklyDays(masterTask.weeklyDays)})`
      : 'Повтор: ежедневно')
    : 'Без повтора';

  // Reusable Date Picker Component (Modern iOS / Glassmorphic Style)
  const RenderDatePickerBadge = ({ styleOverride }: { styleOverride?: React.CSSProperties }) => (
    <div
      title="Нажмите, чтобы изменить дату этого экземпляра"
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '7px',
        height: '42px',
        padding: '0 14px',
        borderRadius: '12px',
        background: 'var(--color-surface-hover)',
        border: '1px solid var(--color-border)',
        color: 'var(--color-accent-text)',
        fontWeight: 600,
        fontSize: '13px',
        cursor: 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif',
        transition: 'all 0.15s ease',
        flexShrink: 0,
        ...styleOverride,
      }}
    >
      <Calendar size={16} style={{ color: 'var(--color-accent-text)', opacity: 0.9 }} />
      <span>{formattedOccDate}</span>
      <input
        type="date"
        className="ios-date-picker-overlay"
        value={activeOccDate}
        onChange={async (e) => {
          if (e.target.value && e.target.value !== activeOccDate && masterTask) {
            const newDate = e.target.value;
            const oldDate = activeOccDate;
            setOverrideDate(newDate);
            await updateOccurrenceDate(masterTask.id, oldDate, newDate);
          }
        }}
      />
    </div>
  );

  // Common Status Toggle / Repeat Status Badge Component
  const RenderStatusBadge = ({ styleOverride }: { styleOverride?: React.CSSProperties }) => {
    if (!masterTask.isRepeating) {
      return (
        <button
          type="button"
          onClick={handleToggleTodayOccurrence}
          title="Нажмите, чтобы изменить статус задачи"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '3px 10px',
            borderRadius: '7px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            border: isTodayDone ? '1px solid var(--color-success-border)' : '1px solid var(--color-accent-border)',
            background: isTodayDone ? 'var(--color-success-light)' : 'var(--color-accent-light)',
            color: isTodayDone ? 'var(--color-success)' : 'var(--color-accent-text)',
            transition: 'all 0.15s ease',
            ...styleOverride,
          }}
        >
          <CheckCircle2 size={13} />
          <span>{isTodayDone ? 'Выполнено' : 'В ожидании'}</span>
        </button>
      );
    }

    const currentStatus = masterTask.repeatStatus || 'Active';
    const statusInfo =
      currentStatus === 'Paused'
        ? { label: '⏸️ На паузе', bg: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.35)', color: '#f59e0b' }
        : currentStatus === 'Completed'
        ? { label: '✅ Завершено', bg: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.35)', color: '#818cf8' }
        : { label: '▶️ В работе', bg: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)', color: '#10b981' };

    return (
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
        <select
          value={currentStatus}
          onChange={(e) => updateRepeatStatus(masterTask.id, e.target.value as any)}
          title="Нажмите, чтобы изменить статус повторения задачи"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          <option value="Active">▶️ В работе (Активно)</option>
          <option value="Paused">⏸️ На паузе</option>
          <option value="Completed">✅ Завершено</option>
        </select>
        <button
          type="button"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '3px 10px',
            borderRadius: '7px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            border: statusInfo.border,
            background: statusInfo.bg,
            color: statusInfo.color,
            transition: 'all 0.15s ease',
            pointerEvents: 'none',
            ...styleOverride,
          }}
        >
          <span>{statusInfo.label}</span>
          <ChevronDown size={12} style={{ opacity: 0.8 }} />
        </button>
      </div>
    );
  };

  // Common Action Buttons Toolbar
  const RenderActionButtons = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {masterTask.isRepeating && (
        <>
          {(masterTask.repeatStatus || 'Active') === 'Paused' ? (
            <button onClick={() => updateRepeatStatus(masterTask.id, 'Active')} title="Возобновить повторение" style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>▶️</button>
          ) : (
            <button onClick={() => updateRepeatStatus(masterTask.id, 'Paused')} title="Приостановить повторение" style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#f59e0b', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>⏸️</button>
          )}

          {(masterTask.repeatStatus || 'Active') === 'Completed' ? (
            <button onClick={() => updateRepeatStatus(masterTask.id, 'Active')} title="Возобновить завершённое повторение" style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#6366f1', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>🔄</button>
          ) : (
            <button onClick={() => updateRepeatStatus(masterTask.id, 'Completed')} title="Завершить повторение" style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#6366f1', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>✅</button>
          )}
        </>
      )}

      <button onClick={onClose} title="Закрыть" style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#ffffff', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>✕</button>
    </div>
  );

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={modalRef}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        style={{
          gap: '10px',
          padding: '16px 20px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Top Drag Handle */}
        <div
          onMouseDown={handleTouchStart}
          onTouchStart={handleTouchStart}
          onMouseMove={handleTouchMove}
          onTouchMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onTouchEnd={handleTouchEnd}
          style={{ width: '100%', cursor: 'grab', paddingBottom: '2px', touchAction: 'none' }}
        >
          <div style={{ width: '36px', height: '4px', borderRadius: '2px', backgroundColor: 'var(--color-border)', margin: '0 auto' }} />
        </div>

        {/* ─── HEADER SECTION (WITH PROMINENT DISTINCT BOTTOM DIVIDER LINE) ─── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            width: '100%',
            paddingBottom: '14px',
            marginBottom: '6px',
            borderBottom: '2px solid var(--color-border-hover, rgba(255, 255, 255, 0.16))',
          }}
        >

          {/* Ряд 1: Заголовок (слева) и Стрик (справа) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', width: '100%' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0, lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>
              {masterTask.title}
            </h2>

            {masterTask.isRepeating && (
              <span
                title={`Текущий стрик: ${streak} дн.`}
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#f59e0b',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '7px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  userSelect: 'none',
                  flexShrink: 0,
                }}
              >
                🔥 {streak} дн.
              </span>
            )}
          </div>

          {/* Ряд 2: Категория (слева) и Повтор (иконка) + Создано (справа) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-accent-text)', fontWeight: 600 }}>
              <span>🏷</span>
              <span>{masterTask.category || 'Без категории'}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                title={masterTask.isRepeating ? 'Повторяющаяся задача' : 'Обычная задача'}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '22px',
                  height: '22px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  background: masterTask.isRepeating ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: masterTask.isRepeating ? '#38bdf8' : 'var(--color-text-muted)',
                  border: masterTask.isRepeating ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid var(--color-border)',
                  opacity: masterTask.isRepeating ? 1 : 0.4,
                  userSelect: 'none',
                }}
              >
                🔄
              </span>

              {masterTask.createdAt && (
                <span style={{ fontSize: '11.5px', opacity: 0.75 }}>
                  Создано {new Date(masterTask.createdAt).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>

          {/* Ряд 3: Статус задачи (ТОЛЬКО ДЛЯ ПОВТОРЯЮЩИХСЯ ЗАДАЧ) */}
          {masterTask.isRepeating && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', width: '100%', flexWrap: 'nowrap' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                Статус повторений:
              </span>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                {[
                  { key: 'Active', label: 'В работе', color: '#10b981' },
                  { key: 'Paused', label: 'На паузе', color: '#f59e0b' },
                  { key: 'Completed', label: 'Завершено', color: '#818cf8' },
                ].map((opt) => {
                  const isSelected = (masterTask.repeatStatus || 'Active') === opt.key;
                  return (
                    <button key={opt.key} type="button" onClick={() => updateRepeatStatus(masterTask.id, opt.key as any)} style={{ padding: '3px 7px', borderRadius: '6px', fontSize: '11.5px', fontWeight: isSelected ? 700 : 500, background: 'transparent', color: isSelected ? opt.color : 'var(--color-text-muted)', border: 'none', cursor: 'pointer' }}>
                      <span>{opt.label}</span>
                      {isSelected && <span style={{ marginLeft: '3px', fontWeight: 800 }}>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}


          {/* Ряд 4: Кнопки управления (Редактировать и Удалить) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', marginTop: '2px' }}>
            <button
              type="button"
              onClick={onOpenEdit}
              title="Редактировать параметры мастер-задачи"
              style={{
                flex: 1,
                height: '36px',
                borderRadius: '10px',
                background: 'var(--color-surface-hover)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              ✏️ Редактировать
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              title={masterTask.isRepeating ? 'Удалить все повторы этой задачи' : 'Удалить задачу'}
              style={{
                flex: 1,
                height: '36px',
                borderRadius: '10px',
                background: 'var(--color-surface-hover)',
                border: '1px solid var(--color-border)',
                color: '#ef4444',
                fontSize: masterTask.isRepeating ? '12px' : '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              ❌ {masterTask.isRepeating ? 'Удалить все повторы' : 'Удалить'}
            </button>
          </div>
        </div>

        {/* Описание / Ссылка (если есть) */}
        {(masterTask.description || masterTask.link) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '10px 12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)' }}>
            {masterTask.description && (
              <p style={{ fontSize: '13px', color: 'var(--color-text-primary)', margin: 0, whiteSpace: 'pre-wrap' }}>
                {masterTask.description}
              </p>
            )}
            {masterTask.link && (
              <a href={masterTask.link} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: 'var(--color-accent-text)', textDecoration: 'underline', wordBreak: 'break-all' }}>
                🔗 {masterTask.link}
              </a>
            )}
          </div>
        )}

        {/* 2. Заметка */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%' }}>
          <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            📝 Заметка:
          </label>
          <textarea
            value={sessionNote}
            onChange={(e) => handleNoteChange(e.target.value)}
            onBlur={handleNoteBlur}
            placeholder="Расскажите как прошла задача..."
            rows={2}
            style={{
              width: '100%',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              fontSize: '13px',
              padding: '8px 12px',
              resize: 'vertical',
              fontFamily: 'inherit',
              outline: 'none',
            }}
          />
        </div>



        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%' }}>
          <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🍅 Время (Помидоры):
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px', padding: '4px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--color-border)' }}>
            {pomoOptions.map((item) => {
              const isActive = currentPomodoros === item.val;
              return (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => updateTaskPomodoros(masterTask.id, isActive ? 0 : item.val, activeOccDate)}
                  style={{ height: '38px', borderRadius: '9px', border: 'none', background: isActive ? 'var(--color-accent)' : 'transparent', color: isActive ? '#ffffff' : 'var(--color-text-muted)', fontWeight: isActive ? 700 : 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1px', boxShadow: isActive ? '0 4px 14px var(--color-accent-border)' : 'none', cursor: 'pointer' }}
                >
                  <span style={{ fontSize: '11px', fontWeight: isActive ? 700 : 500 }}>{item.num}</span>
                  {item.hasTomato && <span style={{ fontSize: '18px', lineHeight: 1 }}>🍅</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '100%' }}>
          <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            💡 Оценка сложности:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', width: '100%' }}>
            {[
              { key: 'easy', emoji: '😄', title: 'Легко', color: 'var(--color-success)', bg: 'var(--color-success-light)', border: 'var(--color-success-border)' },
              { key: 'normal', emoji: '🙂', title: 'Нормально', color: 'var(--color-accent-text)', bg: 'var(--color-accent-light)', border: 'var(--color-accent-border)' },
              { key: 'hard', emoji: '😣', title: 'Сложно', color: 'var(--color-warning)', bg: 'var(--color-warning-light)', border: 'var(--color-warning-border)' },
              { key: 'again', emoji: '❌', title: 'Не помню', color: 'var(--color-danger)', bg: 'var(--color-danger-light)', border: 'var(--color-danger-border)' },
            ].map((rating) => {
              const currentActive = selectedRating || activeRating;
              const isActive = currentActive === rating.key;
              return (
                <button key={rating.key} type="button" onClick={() => handleRatingClick(rating.key as SmartRating)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '8px 4px', borderRadius: '12px', background: isActive ? rating.bg : 'rgba(255, 255, 255, 0.03)', border: isActive ? `1.5px solid ${rating.border}` : '1px solid var(--color-border)', cursor: 'pointer', transform: isActive ? 'scale(1.03)' : 'none', boxShadow: isActive ? `0 4px 14px ${rating.bg}` : 'none' }}>
                  <span style={{ fontSize: '18px', lineHeight: 1 }}>{rating.emoji}</span>
                  <span style={{ fontSize: '11px', fontWeight: isActive ? 700 : 500, color: isActive ? rating.color : 'var(--color-text-muted)' }}>{rating.title}</span>
                </button>
              );
            })}
          </div>
        </div>



        {/* РЯД: Дата (плашка) и Кнопка "Выполнить" на одной линии */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', marginTop: '4px' }}>
          <RenderDatePickerBadge />
          <button
            type="button"
            onClick={handleToggleTodayOccurrence}
            style={{
              flex: 1,
              height: '42px',
              padding: '0 14px',
              borderRadius: '12px',
              border: '1px solid var(--color-success-border)',
              backgroundColor: isTodayDone ? 'var(--color-success-light)' : 'var(--color-success)',
              color: isTodayDone ? 'var(--color-success)' : '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: !isTodayDone ? '0 2px 8px var(--color-success-border)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <CheckCircle2 size={17} />
            <span>{isTodayDone ? '✅ Выполнено' : '✨ Выполнить'}</span>
          </button>
        </div>

        {/* Маленькая текстовая кнопка "Удалить этот повтор" (ТОЛЬКО для повторяющихся задач) */}
        {masterTask.isRepeating && (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '2px' }}>
            <button
              type="button"
              onClick={handleDeleteLower}
              title="Удалить этот конкретный повтор"
              style={{
                background: 'none',
                border: 'none',
                color: '#ef4444',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: '6px',
                opacity: 0.85,
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = '0.85';
              }}
            >
              <span>❌</span>
              <span>Удалить этот повтор</span>
            </button>
          </div>
        )}

        {/* {masterTask.isRepeating && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px 14px', borderRadius: '16px', backgroundColor: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)' }}>📊 {formatRepetitionText(currentCount)}</span>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--color-accent-text)', background: 'var(--color-accent-light)', border: '1px solid var(--color-accent-border)', padding: '2px 8px', borderRadius: '10px' }}>
                {masterTask.targetRepetitions ? `${Math.min(100, Math.round((currentCount / masterTask.targetRepetitions) * 100))}%` : `${currentCount} повт.`}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '4px', width: '100%', marginTop: '2px' }}>
              {Array.from({ length: Math.max(targetCount, 6) }).map((_, index) => {
                const isFilled = index < currentCount;
                return <div key={index} title={`Повторение ${index + 1}`} style={{ flex: 1, height: '8px', borderRadius: '4px', backgroundColor: isFilled ? 'var(--color-success)' : 'var(--color-surface-hover)', border: isFilled ? 'none' : '1px solid var(--color-border)', boxShadow: isFilled ? '0 2px 6px var(--color-success-border)' : 'none' }} />;
              })}
            </div>
          </div>
        )}

        {masterTask.isRepeating && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderRadius: '16px', background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', padding: '12px 14px', width: '100%', boxSizing: 'border-box' }}>
            <button type="button" onClick={() => setIsHistoryOpen((prev) => !prev)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', fontSize: '13.5px', fontWeight: 700, padding: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📜 История повторений</span>
                <span style={{ fontSize: '11px', background: 'var(--color-accent-light)', border: '1px solid var(--color-accent-border)', color: 'var(--color-accent-text)', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                  {occurrencesList.length}
                </span>
              </div>
              {isHistoryOpen ? <ChevronUp size={18} color="var(--color-accent-text)" /> : <ChevronDown size={18} color="var(--color-accent-text)" />}
            </button>

            {isHistoryOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                {occurrencesList.length === 0 ? (
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontStyle: 'italic', padding: '6px 0' }}>
                    История повторений пока пуста.
                  </div>
                ) : (
                  occurrencesList.map((occ) => {
                    const isOccDone = occ.status === 'Done';
                    const ratingEmoji =
                      occ.smartRating === 'easy' ? '😄' :
                      occ.smartRating === 'normal' ? '🙂' :
                      occ.smartRating === 'hard' ? '😣' :
                      occ.smartRating === 'again' ? '❌' : null;

                    return (
                      <div key={occ.id || occ.date} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '8px 10px', borderRadius: '12px', background: isOccDone ? 'var(--color-success-light)' : 'var(--color-surface-hover)', border: isOccDone ? '1px solid var(--color-success-border)' : '1px solid var(--color-border)', color: 'var(--color-text-primary)', fontSize: '12.5px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }}>
                          <label title="Нажмите, чтобы изменить дату экземпляра" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', background: 'var(--color-accent-light)', border: '1px solid var(--color-accent-border)', borderRadius: '8px', padding: '4px 8px', color: 'var(--color-accent-text)', fontWeight: 700, fontSize: '12px' }}>
                            <Calendar size={13} color="var(--color-accent-text)" />
                            <span>{formatDateDisplay(occ.date)}</span>
                            <input type="date" value={occ.date} onChange={(e) => e.target.value && updateOccurrenceDate(masterTask.id, occ.date, e.target.value)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
                          </label>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button type="button" onClick={() => toggleTaskStatus(masterTask.id, undefined, occ.date)} style={{ borderRadius: '8px', padding: '4px 8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', background: isOccDone ? 'var(--color-success-light)' : 'var(--color-warning-light)', border: isOccDone ? '1px solid var(--color-success-border)' : '1px solid var(--color-warning-border)', color: isOccDone ? 'var(--color-success)' : 'var(--color-warning)' }}>
                            {isOccDone ? '✅ Выполнено' : '⏳ В ожидании'}
                          </button>

                          {ratingEmoji && (
                            <span style={{ fontSize: '14px' }} title={`Оценка: ${occ.smartRating}`}>
                              {ratingEmoji}
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <button type="button" onClick={() => { router.push(`/calendar?date=${occ.date}`); onClose(); }} title={`Перейти в календарь на ${formatDateDisplay(occ.date)}`} style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', color: 'var(--color-accent-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Calendar size={13} />
                          </button>
                          <button type="button" onClick={() => deleteTaskOccurrence(masterTask.id, occ.date)} title="Удалить этот экземпляр" style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )} */}



        {showDeleteConfirm && (
          <div
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 10000, padding: '16px',
            }}
            onClick={() => setShowDeleteConfirm(false)}
          >
            <div
              style={{
                background: 'var(--color-surface, #1e293b)',
                border: '1px solid var(--color-border, rgba(255, 255, 255, 0.2))',
                borderRadius: '16px', padding: '20px', width: '100%', maxWidth: '360px',
                display: 'flex', flexDirection: 'column', gap: '16px',
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
