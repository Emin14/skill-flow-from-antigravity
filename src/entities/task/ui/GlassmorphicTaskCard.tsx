'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Checkbox } from '@/shared/ui';
import { Task, TaskStatus } from '@/entities/task/model/types';
import { getAllDescendantTasks, getTaskParentPath } from '@/entities/task/model/store';
import { getTodayStr } from '@/shared/lib/dateUtils';
import { GripVertical, Check, ExternalLink, Calendar } from 'lucide-react';
import { startPointerDrag } from '@/shared/lib/pointerDrag';
import styles from './GlassmorphicTaskCard.module.css';

declare global {
  interface Window {
    __draggedTaskId?: string | null;
  }
}

interface GlassmorphicTaskCardProps {
  task: Task;
  occurrenceDate?: string;
  allTasks?: Task[];
  showDragHandle?: boolean;
  parentPathVariant?: number;
  hideDateBadge?: boolean;
  onToggleCheckbox?: () => void;
  onStatusChange?: (newStatus: TaskStatus) => void;
  onDelete?: () => void;
  onClick?: (occurrenceDate?: string) => void;
  onDropOnTask?: (draggedTaskId: string, targetParentTask: Task) => void;
  onCompleteParent?: () => void;
  onRescheduleToToday?: () => void;
}

const renderParentPath = (path: Task[], variant: number = 4, catColor: string) => {
  if (!path || path.length === 0 || variant === 0) return null;
  const pathStr = path.map((t) => t.title).join(' › ');

  switch (variant) {
    case 1:
      return (
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '3px', width: 'fit-content', maxWidth: '100%' }}>
          <span>📂</span>
          {path.map((p, idx) => (
            <React.Fragment key={p.id}>
              {idx > 0 && <span style={{ opacity: 0.4 }}>/</span>}
              <span style={{ fontWeight: idx === path.length - 1 ? 600 : 400, color: idx === path.length - 1 ? '#38bdf8' : 'inherit', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {p.title}
              </span>
            </React.Fragment>
          ))}
        </div>
      );

    case 2:
      return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '2px 8px', borderRadius: '6px', background: 'rgba(15, 23, 42, 0.85)', border: `1px solid ${catColor}50`, fontSize: '10.5px', fontFamily: 'monospace', color: '#f1f5f9', fontWeight: 600, marginBottom: '4px', width: 'fit-content', maxWidth: '100%', boxShadow: `0 0 10px ${catColor}20` }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: catColor, flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pathStr}</span>
        </div>
      );

    case 3:
      return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '2px 8px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.07)', border: '1px solid rgba(255, 255, 255, 0.12)', fontSize: '10.5px', color: 'rgba(255,255,255,0.85)', fontWeight: 500, marginBottom: '4px', width: 'fit-content', maxWidth: '100%' }}>
          <span style={{ fontSize: '11px', flexShrink: 0 }}>📁</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pathStr}</span>
        </div>
      );

    case 4:
      return (
        <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px', marginBottom: '3px', width: 'fit-content', maxWidth: '100%' }}>
          <span style={{ flexShrink: 0 }}>📁</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{path.map((t) => t.title).join(' ➔ ')}</span>
        </div>
      );

    case 5:
      return (
        <div style={{ borderLeft: `3px solid ${catColor}`, paddingLeft: '8px', marginBottom: '4px', display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#cbd5e1', width: 'fit-content', maxWidth: '100%' }}>
          <span style={{ fontSize: '9px', opacity: 0.6, flexShrink: 0 }}>●</span>
          <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{path.map((t) => t.title).join('  ▸  ')}</span>
        </div>
      );

    case 6:
      return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.14)', borderRadius: '12px', fontSize: '10.5px', color: '#60a5fa', fontWeight: 600, marginBottom: '4px', width: 'fit-content', maxWidth: '100%' }}>
          <span style={{ flexShrink: 0 }}>⚡</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pathStr}</span>
        </div>
      );

    case 7:
      return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '2px 8px', borderRadius: '6px', background: 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.9))', border: '1px solid rgba(255,255,255,0.15)', fontSize: '10.5px', color: '#38bdf8', fontWeight: 600, marginBottom: '4px', width: 'fit-content', maxWidth: '100%' }}>
          <span style={{ opacity: 0.6, fontSize: '10px', flexShrink: 0 }}>⌘</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pathStr}</span>
        </div>
      );

    case 8:
      return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '2px 8px', borderRadius: '10px', background: `linear-gradient(90deg, ${catColor}30, transparent)`, borderLeft: `3px solid ${catColor}`, fontSize: '10.5px', color: '#f8fafc', fontWeight: 600, marginBottom: '4px', width: 'fit-content', maxWidth: '100%' }}>
          <span style={{ flexShrink: 0 }}>🏷️</span>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pathStr}</span>
        </div>
      );

    case 9:
      return (
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '3px', width: 'fit-content', maxWidth: '100%' }}>
          <span style={{ color: catColor, flexShrink: 0 }}>•</span>
          <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pathStr}</span>
        </div>
      );

    case 10:
    default:
      return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#0ea5e9', fontWeight: 600, cursor: 'pointer', marginBottom: '3px', width: 'fit-content', maxWidth: '100%' }}>
          <span style={{ flexShrink: 0 }}>🌿</span>
          <span style={{ textDecoration: 'underline', textUnderlineOffset: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pathStr}</span>
        </div>
      );
  }
};

import { getCategoryColor } from '@/shared/config/categoryColors';

const formatExternalUrl = (url?: string): string | null => {
  if (!url || !url.trim()) return null;
  const trimmed = url.trim();
  if (/^(https?:\/\/|mailto:)/i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const SubtaskProgressRing: React.FC<{ total: number; done: number }> = ({ total, done }) => {
  const radius = 10;
  const strokeWidth = 2.5;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percent = total > 0 ? done / total : 0;
  const strokeDashoffset = circumference - percent * circumference;

  return (
    <div className={styles.progressRingContainer} title={`Прогресс подзадач: ${done}/${total}`}>
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="rgba(255, 255, 255, 0.12)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#0ea5e9"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.35s ease' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <span className={styles.progressRingText}>{done}/{total}</span>
    </div>
  );
};

export const GlassmorphicTaskCard: React.FC<GlassmorphicTaskCardProps> = ({
  task,
  occurrenceDate,
  allTasks = [],
  showDragHandle = true,
  parentPathVariant = 4,
  hideDateBadge = false,
  onToggleCheckbox,
  onStatusChange,
  onDelete,
  onClick,
  onDropOnTask,
  onCompleteParent,
  onRescheduleToToday,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isJustDraggedRef = useRef<boolean>(false);

  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isVerticalScroll, setIsVerticalScroll] = useState<boolean>(false);
  const [isSwipedLeft, setIsSwipedLeft] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isOverTarget, setIsOverTarget] = useState<boolean>(false);
  const [isPromptDismissed, setIsPromptDismissed] = useState<boolean>(false);
  const [isTouchDragging, setIsTouchDragging] = useState<boolean>(false);

  const currentOcc = useMemo(() => {
    if (!task.isRepeating) return null;
    const targetDate = occurrenceDate || task.scheduledDate;
    return task.occurrences?.find((o) => o.date === targetDate) || null;
  }, [task, occurrenceDate]);

  const isDone = currentOcc ? currentOcc.status === 'Done' : task.status === 'Done';
  const catColor = getCategoryColor(task.category);
  const formattedLink = formatExternalUrl(task.link);

  const todayStr = getTodayStr();
  const showDateBadge = !hideDateBadge && task.scheduledDate && task.scheduledDate !== '' && task.scheduledDate !== 'anytime' && !isDone;
  const isOverdue = Boolean(showDateBadge && task.scheduledDate && task.scheduledDate < todayStr);
  const isToday = Boolean(showDateBadge && task.scheduledDate === todayStr);
  const dateBadgeLabel = (() => {
    if (!task.scheduledDate) return null;
    const parts = task.scheduledDate.split('-');
    if (parts.length !== 3) return null;
    return `${parts[2]}.${parts[1]}`;
  })();

  const descendantSubtasks = useMemo(() => getAllDescendantTasks(task.id, allTasks), [allTasks, task.id]);
  const isContainer = descendantSubtasks.length > 0;
  const doneSubtasksCount = useMemo(() => descendantSubtasks.filter((t) => t.status === 'Done').length, [descendantSubtasks]);
  const areAllSubtasksDone = isContainer && descendantSubtasks.length > 0 && doneSubtasksCount === descendantSubtasks.length;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
    setIsVerticalScroll(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;
    const diffX = touchStartX - currentX;
    const diffY = touchStartY - currentY;

    if (!isVerticalScroll && Math.abs(diffY) > 6 && Math.abs(diffY) > Math.abs(diffX) && !isSwipedLeft) {
      setIsVerticalScroll(true);
      setSwipeOffset(0);
      return;
    }

    if (isVerticalScroll) {
      setSwipeOffset(0);
      return;
    }

    if (isSwipedLeft) {
      const newOffset = Math.min(0, Math.max(-80, -80 - diffX));
      setSwipeOffset(newOffset);
    } else {
      if (diffX > 0 && diffX <= 80) {
        setSwipeOffset(-diffX);
      } else if (diffX < 0 && diffX >= -80) {
        setSwipeOffset(-diffX);
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (!isVerticalScroll) {
      if (isSwipedLeft) {
        setIsSwipedLeft(false);
        setSwipeOffset(0);
      } else {
        if (diff > 45) {
          setIsSwipedLeft(true);
          setSwipeOffset(-80);
        } else if (diff < -45) {
          setSwipeOffset(0);
          if (onRescheduleToToday) {
            onRescheduleToToday();
          } else {
            const currentStatus = currentOcc ? currentOcc.status : task.status;
            let nextStatus: TaskStatus = 'Todo';
            if (currentStatus === 'Todo') nextStatus = 'InProgress';
            else if (currentStatus === 'InProgress') nextStatus = 'Done';
            else if (currentStatus === 'Done') nextStatus = 'Todo';

            if (onStatusChange) {
              onStatusChange(nextStatus);
            } else if (onToggleCheckbox) {
              onToggleCheckbox();
            }
          }
        } else {
          setIsSwipedLeft(false);
          setSwipeOffset(0);
        }
      }
    }
    setTouchStartX(null);
    setTouchStartY(null);
    setIsVerticalScroll(false);
  };

  // PC HTML5 Drag Handlers
  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    isJustDraggedRef.current = true;
    if (typeof window !== 'undefined') {
      window.__draggedTaskId = task.id;
    }
    try {
      e.dataTransfer.setData('text/plain', task.id);
      e.dataTransfer.setData('taskId', task.id);
    } catch (err) {
      // IE/Safari fallback
    }
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (typeof window !== 'undefined') {
      window.__draggedTaskId = null;
    }
    setTimeout(() => {
      isJustDraggedRef.current = false;
    }, 300);
  };

  const handleTaskDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setIsOverTarget(true);
  };

  const handleTaskDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOverTarget(false);
  };

  const handleTaskDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOverTarget(false);
    const draggedTaskId = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('taskId') || window.__draggedTaskId;
    if (draggedTaskId && draggedTaskId !== task.id && onDropOnTask) {
      onDropOnTask(draggedTaskId, task);
    }
  };

  // Mobile Touch Drag Handlers (Grip Handle)
  const handleGripTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsTouchDragging(true);
    if (typeof window !== 'undefined') {
      window.__draggedTaskId = task.id;
    }
  };

  const handleGripTouchMove = (e: React.TouchEvent) => {
    if (!isTouchDragging) return;
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const card = element?.closest('[data-task-id]');
    if (card) {
      const targetId = card.getAttribute('data-task-id');
      if (targetId && targetId !== task.id) {
        card.classList.add(styles.taskCardDropTarget);
      }
    }
  };

  const handleGripTouchEnd = (e: React.TouchEvent) => {
    if (!isTouchDragging) return;
    setIsTouchDragging(false);
    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const card = element?.closest('[data-task-id]');
    if (card) {
      const targetId = card.getAttribute('data-task-id');
      card.classList.remove(styles.taskCardDropTarget);
      if (targetId && targetId !== task.id && onDropOnTask && allTasks) {
        const targetTask = allTasks.find((t) => t.id === targetId);
        if (targetTask) {
          onDropOnTask(task.id, targetTask);
        }
      }
    }
    if (typeof window !== 'undefined') {
      window.__draggedTaskId = null;
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isDragging || isJustDraggedRef.current) {
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    if (onClick) onClick(occurrenceDate);
  };

  const parentPath = useMemo(() => {
    if (!task.parentTaskId || !allTasks || allTasks.length === 0) return [];
    const map = new Map(allTasks.map((t) => [t.id, t]));
    return getTaskParentPath(task, map);
  }, [task, allTasks]);

  return (
    <div
      ref={wrapperRef}
      data-task-id={task.id}
      draggable={showDragHandle}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleTaskDragOver}
      onDragLeave={handleTaskDragLeave}
      onDrop={handleTaskDrop}
      className={`${styles.taskCardWrapper} ${
        areAllSubtasksDone && !isDone ? styles.taskCardGlowContainer : ''
      } ${isOverTarget ? styles.taskCardDropTarget : ''}`}
    >
      {(swipeOffset < 0 || isSwipedLeft) && (
        <div
          className={styles.deleteSwipeAction}
          onClick={(e) => {
            e.stopPropagation();
            if (onDelete) onDelete();
          }}
        >
          Удалить
        </div>
      )}

      <div
        className={`${styles.taskCardSwipeable} ${isDragging ? styles.taskCardDragging : ''}`}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleCardClick}
      >
        <div className={`${styles.cardPill} ${isDone ? styles.taskDone : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
            {isContainer ? (
              <SubtaskProgressRing total={descendantSubtasks.length} done={doneSubtasksCount} />
            ) : (
              <div
                className={styles.checkboxWrapper}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onToggleCheckbox) onToggleCheckbox();
                }}
              >
                <Checkbox checked={isDone} onChange={() => {}} />
              </div>
            )}

            <div className={styles.titleColumn}>
              {parentPathVariant !== 0 && renderParentPath(parentPath, parentPathVariant ?? 4, catColor)}
              <span className={`${styles.taskTitle} ${isDone ? styles.taskTitleDone : ''}`}>
                {task.title}
              </span>
              <div className={styles.metaRow}>
                <span className={styles.catDot} style={{ backgroundColor: catColor }} />
                <span className={styles.categoryText}>{task.category || 'Без категории'}</span>
                {task.isRepeating && <span className={styles.repeatTag}>• ↻ Повтор</span>}
                {showDateBadge && dateBadgeLabel && (
                  <span
                    className={styles.dateBadge}
                    style={{
                      color: isOverdue ? '#ef4444' : isToday ? '#f59e0b' : 'var(--color-text-muted)',
                      borderColor: isOverdue ? 'rgba(239,68,68,0.4)' : isToday ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.12)',
                      backgroundColor: isOverdue ? 'rgba(239,68,68,0.1)' : isToday ? 'rgba(245,158,11,0.1)' : 'transparent',
                    }}
                  >
                    <Calendar size={9} />
                    {isOverdue ? `⚠ ${dateBadgeLabel}` : dateBadgeLabel}
                  </span>
                )}
                {formattedLink && (
                  <a
                    href={formattedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{ display: 'inline-flex', alignItems: 'center', color: '#0ea5e9', marginLeft: '4px' }}
                    title={`Открыть ссылку: ${formattedLink}`}
                  >
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {showDragHandle && (
            <div
              className={styles.dragHandle}
              draggable
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onMouseDown={(e) => startPointerDrag(e, task.id, task.title)}
              onTouchStart={handleGripTouchStart}
              onTouchMove={handleGripTouchMove}
              onTouchEnd={handleGripTouchEnd}
              title="Перетащите карточку мышкой на ПК или пальцем на смартфоне"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical size={16} />
            </div>
          )}
        </div>

        {/* Prompt Banner when all subtasks of container are done */}
        {areAllSubtasksDone && !isDone && !isPromptDismissed && onCompleteParent && (
          <div className={styles.completeParentPromptBtn} onClick={(e) => e.stopPropagation()}>
            <span>✨ Все подзадачи готовы. Завершить "{task.title}"?</span>
            <div className={styles.promptActions}>
              <button
                type="button"
                className={styles.promptConfirmBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onCompleteParent();
                }}
              >
                <Check size={12} /> Завершить
              </button>
              <button
                type="button"
                className={styles.promptDismissBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPromptDismissed(true);
                }}
              >
                ✕ Нет
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
