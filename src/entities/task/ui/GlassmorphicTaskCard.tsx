'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Checkbox } from '@/shared/ui';
import { Task } from '@/entities/task/model/types';
import { getAllDescendantTasks } from '@/entities/task/model/store';
import { GripVertical, Check, ExternalLink } from 'lucide-react';
import styles from './GlassmorphicTaskCard.module.css';

interface GlassmorphicTaskCardProps {
  task: Task;
  occurrenceDate?: string;
  allTasks?: Task[];
  showDragHandle?: boolean;
  onToggleCheckbox?: () => void;
  onStatusChange?: (newStatus: TaskStatus) => void;
  onDelete?: () => void;
  onClick?: () => void;
  onDropOnTask?: (draggedTaskId: string, targetParentTask: Task) => void;
  onCompleteParent?: () => void;
}

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
  onToggleCheckbox,
  onStatusChange,
  onDelete,
  onClick,
  onDropOnTask,
  onCompleteParent,
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

  // BUG-HIGH-01: Multi-level subtasks progress calculation using getAllDescendantTasks
  const descendantSubtasks = useMemo(() => getAllDescendantTasks(task.id, allTasks), [allTasks, task.id]);
  const isContainer = task.hasSubtasks || descendantSubtasks.length > 0;
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
              <span className={`${styles.taskTitle} ${isDone ? styles.taskTitleDone : ''}`}>
                {task.title}
              </span>
              <div className={styles.metaRow}>
                <span className={styles.catDot} style={{ backgroundColor: catColor }} />
                <span>{task.category || 'Без категории'}</span>
                {task.isRepeating && <span className={styles.repeatTag}>• ↻ Повтор</span>}
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
