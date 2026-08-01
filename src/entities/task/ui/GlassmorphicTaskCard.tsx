'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Checkbox } from '@/shared/ui';
import { Task } from '@/entities/task/model/types';
import { GripVertical, Check } from 'lucide-react';
import styles from './GlassmorphicTaskCard.module.css';

interface GlassmorphicTaskCardProps {
  task: Task;
  allTasks?: Task[];
  showDragHandle?: boolean;
  onToggleCheckbox?: () => void;
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
    default: return '#38bdf8';
  }
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
  allTasks = [],
  showDragHandle = true,
  onToggleCheckbox,
  onDelete,
  onClick,
  onDropOnTask,
  onCompleteParent,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isSwipedLeft, setIsSwipedLeft] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isOverTarget, setIsOverTarget] = useState<boolean>(false);

  const isDone = task.status === 'Done';
  const catColor = getCategoryColor(task.category);

  // Subtasks calculation
  const childSubtasks = useMemo(() => allTasks.filter((t) => t.parentTaskId === task.id), [allTasks, task.id]);
  const isContainer = task.hasSubtasks || childSubtasks.length > 0;
  const doneSubtasksCount = useMemo(() => childSubtasks.filter((t) => t.status === 'Done').length, [childSubtasks]);
  const areAllSubtasksDone = isContainer && childSubtasks.length > 0 && doneSubtasksCount === childSubtasks.length;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;
    const diffX = touchStartX - currentX;
    const diffY = touchStartY - currentY;

    if (Math.abs(diffY) > Math.abs(diffX) && !isSwipedLeft) {
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
        setSwipeOffset(-diffX / 2);
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (isSwipedLeft) {
      setIsSwipedLeft(false);
      setSwipeOffset(0);
    } else {
      if (diff > 45) {
        setIsSwipedLeft(true);
        setSwipeOffset(-80);
      } else {
        setIsSwipedLeft(false);
        setSwipeOffset(0);
      }
    }
    setTouchStartX(null);
    setTouchStartY(null);
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
              <SubtaskProgressRing total={childSubtasks.length} done={doneSubtasksCount} />
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
                <span>{task.category}</span>
                {task.isRepeating && <span className={styles.repeatTag}>• ↻ Повтор</span>}
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

        {/* Prompt Button when all subtasks of container are done */}
        {areAllSubtasksDone && !isDone && onCompleteParent && (
          <div
            className={styles.completeParentPromptBtn}
            onClick={(e) => {
              e.stopPropagation();
              onCompleteParent();
            }}
          >
            <span>✨ Все подзадачи готовы. Завершить "{task.title}"?</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Check size={13} /> Завершить
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
