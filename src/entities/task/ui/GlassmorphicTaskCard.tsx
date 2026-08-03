'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Checkbox } from '@/shared/ui';
import { Task, TaskStatus } from '@/entities/task/model/types';
import { getAllDescendantTasks, getTaskParentPath } from '@/entities/task/model/store';
import { getTodayStr } from '@/shared/lib/dateUtils';
import { GripVertical, Check, ExternalLink, Calendar } from 'lucide-react';
import styles from './GlassmorphicTaskCard.module.css';

interface GlassmorphicTaskCardProps {
  task: Task;
  occurrenceDate?: string;
  allTasks?: Task[];
  showDragHandle?: boolean;
  parentPathVariant?: number; // 1 to 10 concept variants
  onToggleCheckbox?: () => void;
  onStatusChange?: (newStatus: TaskStatus) => void;
  onDelete?: () => void;
  onClick?: () => void;
  onDropOnTask?: (draggedTaskId: string, targetParentTask: Task) => void;
  onCompleteParent?: () => void;
  onRescheduleToToday?: () => void;
}

const renderParentPath = (path: Task[], variant: number = 1, catColor: string) => {
  if (!path || path.length === 0) return null;
  const pathStr = path.map((t) => t.title).join(' › ');

  switch (variant) {
    case 1: // Classic Breadcrumb Trail
      return (
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
          <span>📂</span>
          {path.map((p, idx) => (
            <React.Fragment key={p.id}>
              {idx > 0 && <span style={{ opacity: 0.4 }}>/</span>}
              <span style={{ fontWeight: idx === path.length - 1 ? 600 : 400, color: idx === path.length - 1 ? '#38bdf8' : 'inherit' }}>
                {p.title}
              </span>
            </React.Fragment>
          ))}
        </div>
      );

    case 2: // Pill Chip Badge
      return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '2px 8px', borderRadius: '12px', background: `${catColor}20`, border: `1px solid ${catColor}40`, fontSize: '10.5px', color: catColor, fontWeight: 600, marginBottom: '4px' }}>
          <span>🏷️</span>
          <span>{pathStr}</span>
        </div>
      );

    case 3: // Left Accent Line & Tree Path
      return (
        <div style={{ borderLeft: `2.5px solid ${catColor}`, paddingLeft: '8px', marginBottom: '3px', fontSize: '11px', color: '#94a3b8' }}>
          <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'rgba(255,255,255,0.4)', display: 'block' }}>Проект</span>
          <span style={{ fontWeight: 600, color: '#f1f5f9' }}>{pathStr}</span>
        </div>
      );

    case 4: // Compact Minimal Arrow Tag
      return (
        <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '2px' }}>
          <span>📁</span>
          <span>{path.map((t) => t.title).join(' ➔ ')}</span>
        </div>
      );

    case 5: // Nested Folder Hierarchy Stack Badge
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(15, 23, 42, 0.6)', padding: '3px 8px', borderRadius: '6px', fontSize: '10.5px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '4px' }}>
          {path.map((p, idx) => (
            <React.Fragment key={p.id}>
              {idx > 0 && <span style={{ opacity: 0.3, fontSize: '10px' }}>▼</span>}
              <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: idx === path.length - 1 ? '#60a5fa' : 'rgba(255,255,255,0.7)' }}>
                <span>📁</span> {p.title}
              </span>
            </React.Fragment>
          ))}
        </div>
      );

    case 6: // Notion-style Parent Label (Subtitle)
      return (
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', fontStyle: 'italic', marginBottom: '2px' }}>
          из {pathStr}
        </div>
      );

    case 7: // Glassmorphic Floating Ribbon
      return (
        <div style={{ margin: '-10px -12px 6px -12px', padding: '4px 12px', background: 'linear-gradient(90deg, rgba(14,165,233,0.15) 0%, rgba(37,99,235,0.05) 100%)', borderBottom: '1px solid rgba(14,165,233,0.2)', borderRadius: '12px 12px 0 0', fontSize: '10.5px', color: '#38bdf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span>🔷</span>
          <span>{pathStr}</span>
        </div>
      );

    case 8: // Sub-level Tag Stack
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '4px' }}>
          {path.map((p) => (
            <span key={p.id} style={{ padding: '1px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', fontSize: '10px', color: '#e2e8f0' }}>
              📁 {p.title}
            </span>
          ))}
        </div>
      );

    case 9: // Outline Border Badge
      return (
        <div style={{ display: 'inline-block', padding: '1px 7px', borderRadius: '4px', border: `1px dashed ${catColor}`, fontSize: '10.5px', color: catColor, fontWeight: 500, marginBottom: '4px' }}>
          ✦ {pathStr}
        </div>
      );

    case 10: // Interactive Tree Link
    default:
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#0ea5e9', fontWeight: 600, cursor: 'pointer', marginBottom: '3px' }}>
          <span>🌿</span>
          <span style={{ textDecoration: 'underline', textUnderlineOffset: '2px' }}>{pathStr}</span>
        </div>
      );
  }
};

const getCategoryColor = (cat?: string): string => {
  switch (cat) {
    case 'Работа': return '#0ea5e9';
    case 'Здоровье': return '#10b981';
    case 'Обучение': return '#f59e0b';
    case 'Личное': return '#ec4899';
    case 'Финансы': return '#8b5cf6';
    case 'Практика Frontend': return '#06b6d4';
    case 'Опыт на камеру': return '#a855f7';
    case 'Теория': return '#3b82f6';
    case 'Без категории':
    default: return 'rgba(255, 255, 255, 0.3)';
  }
};

// BUG-MED-02: Safe URL formatter
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
  parentPathVariant = 1,
  onToggleCheckbox,
  onStatusChange,
  onDelete,
  onClick,
  onDropOnTask,
  onCompleteParent,
  onRescheduleToToday,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isVerticalScroll, setIsVerticalScroll] = useState<boolean>(false);
  const [isSwipedLeft, setIsSwipedLeft] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isOverTarget, setIsOverTarget] = useState<boolean>(false);
  const [isPromptDismissed, setIsPromptDismissed] = useState<boolean>(false);

  const currentOcc = useMemo(() => {
    if (!task.isRepeating) return null;
    const targetDate = occurrenceDate || task.scheduledDate;
    return task.occurrences?.find((o) => o.date === targetDate) || null;
  }, [task, occurrenceDate]);

  const isDone = currentOcc ? currentOcc.status === 'Done' : task.status === 'Done';
  const catColor = getCategoryColor(task.category);
  const formattedLink = formatExternalUrl(task.link);

  // Date badge: show scheduledDate, highlight overdue in red
  const todayStr = getTodayStr();
  const showDateBadge = !task.isRepeating && task.scheduledDate && task.scheduledDate !== '' && task.scheduledDate !== 'anytime' && !isDone;
  const isOverdue = showDateBadge && task.scheduledDate! < todayStr;
  const isToday = showDateBadge && task.scheduledDate === todayStr;
  const dateBadgeLabel = (() => {
    if (!task.scheduledDate) return null;
    const parts = task.scheduledDate.split('-');
    if (parts.length !== 3) return null;
    return `${parts[2]}.${parts[1]}`;
  })();

  // BUG-HIGH-01: Multi-level subtasks progress calculation using getAllDescendantTasks
  const descendantSubtasks = useMemo(() => getAllDescendantTasks(task.id, allTasks), [allTasks, task.id]);
  const isContainer = descendantSubtasks.length > 0;
  const doneSubtasksCount = useMemo(() => descendantSubtasks.filter((t) => t.status === 'Done').length, [descendantSubtasks]);
  const areAllSubtasksDone = isContainer && descendantSubtasks.length > 0 && doneSubtasksCount === descendantSubtasks.length;

  // BUG-HIGH-05: Mobile touch gesture angle detection
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
          // Swipe Left -> Delete Action Button
          setIsSwipedLeft(true);
          setSwipeOffset(-80);
        } else if (diff < -45) {
          // Swipe Right -> Advance Process Stage
          setSwipeOffset(0);
          const currentStatus = currentOcc ? currentOcc.status : task.status;
          let nextStatus: TaskStatus = 'Done';
          if (currentStatus === 'Todo') nextStatus = 'InProgress';
          else if (currentStatus === 'InProgress') nextStatus = 'Done';
          else if (currentStatus === 'Done') nextStatus = 'Todo';

          if (onStatusChange) {
            onStatusChange(nextStatus);
          } else if (onToggleCheckbox) {
            onToggleCheckbox();
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

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleTaskDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    const draggedTaskId = e.dataTransfer.getData('text/plain');
    if (draggedTaskId && draggedTaskId !== task.id && onDropOnTask) {
      onDropOnTask(draggedTaskId, task);
    }
  };

  // BUG-MED-01: Cascade completion confirmation prompt for parent tasks
  const handleCompleteParentWithPrompt = () => {
    if (!onCompleteParent) return;
    const uncompletedSubtasks = descendantSubtasks.filter((t) => t.status !== 'Done');
    if (uncompletedSubtasks.length > 0) {
      const confirmed = window.confirm(
        `Завершить родительскую задачу "${task.title}" и ${uncompletedSubtasks.length} невыполненных подзадач?`
      );
      if (!confirmed) return;
    }
    onCompleteParent();
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
      className={`${styles.taskCardWrapper} ${
        areAllSubtasksDone && !isDone ? styles.taskCardGlowContainer : ''
      } ${isOverTarget ? styles.taskCardDropTarget : ''}`}
      onDragOver={handleTaskDragOver}
      onDragLeave={handleTaskDragLeave}
      onDrop={handleTaskDrop}
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
        onClick={onClick}
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
              {renderParentPath(parentPath, parentPathVariant || 1, catColor)}
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
                {onRescheduleToToday && (
                  <button
                    type="button"
                    className={styles.rescheduleTodayChip}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRescheduleToToday();
                    }}
                    title="Перенести задачу на сегодня"
                  >
                    ☀️ На сегодня
                  </button>
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
              title="Перетащите карточку"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical size={14} />
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
