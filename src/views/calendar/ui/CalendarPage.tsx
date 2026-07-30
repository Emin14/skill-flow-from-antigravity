'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Typography, Checkbox, Button } from '@/shared/ui';
import { useTaskStore } from '@/entities/task';
import { useTopicStore } from '@/entities/topic';
import { Task } from '@/entities/task/model/types';
import { EditTaskModal } from '@/features/edit-task/ui/EditTaskModal';
import styles from './CalendarPage.module.css';

export const CalendarPage: React.FC = () => {
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { tasks, isLoading, fetchTasks, toggleTaskStatus, deleteTask } = useTaskStore();
  const { topics, fetchTopics } = useTopicStore();

  useEffect(() => {
    fetchTasks();
    fetchTopics();
  }, [fetchTasks, fetchTopics]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleGoToToday = () => {
    const now = new Date();
    setCurrentMonthDate(now);
    setSelectedDate(now.toISOString().split('T')[0]);
  };

  // Generate full month matrix grid
  const monthDays = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Get JS day index (0 = Sun, 1 = Mon ... 6 = Sat), map to Mon=0 ... Sun=6
    const jsFirstDay = firstDayOfMonth.getDay();
    const startPadding = jsFirstDay === 0 ? 6 : jsFirstDay - 1;

    const totalCells = Math.ceil((startPadding + lastDayOfMonth.getDate()) / 7) * 7;
    const days = [];

    for (let i = 0; i < totalCells; i++) {
      const dayOffset = i - startPadding + 1;
      const cellDate = new Date(year, month, dayOffset);
      const dateStr = cellDate.toISOString().split('T')[0];
      const dayNum = cellDate.getDate();
      const isCurrentMonth = cellDate.getMonth() === month;

      const dateTasks = tasks.filter(
        (t) => t.scheduledDate === dateStr || t.completedAt?.startsWith(dateStr)
      );
      const doneCount = dateTasks.filter((t) => t.status === 'Done').length;

      days.push({
        dateStr,
        dayNum,
        isCurrentMonth,
        isToday: dateStr === todayStr,
        tasksCount: dateTasks.length,
        doneCount,
      });
    }
    return days;
  }, [currentMonthDate, todayStr, tasks]);

  // Tasks for selected date
  const selectedDayTasks = useMemo(() => {
    return tasks.filter(
      (t) => t.scheduledDate === selectedDate || t.completedAt?.startsWith(selectedDate)
    );
  }, [tasks, selectedDate]);

  const monthTitleStr = currentMonthDate.toLocaleDateString('ru-RU', {
    month: 'long',
    year: 'numeric',
  });

  const selectedDateObj = new Date(selectedDate);
  const formattedSelectedDate = selectedDateObj.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className={styles.container}>
      {/* 7-Column Calendar Grid with Full Month/Year Navigation */}
      <div className={styles.calendarCard}>
        {/* Month Navigation Header */}
        <div className={styles.monthNavHeader}>
          <div className={styles.monthTitle}>
            📅 {monthTitleStr}
          </div>
          <div className={styles.navControls}>
            <button
              className={styles.navBtn}
              onClick={handleGoToToday}
              title="Перейти к сегодняшней дате"
            >
              Сегодня
            </button>
            <button
              className={styles.navBtn}
              onClick={handlePrevMonth}
              title="Предыдущий месяц"
            >
              ◄
            </button>
            <button
              className={styles.navBtn}
              onClick={handleNextMonth}
              title="Следующий месяц"
            >
              ►
            </button>
          </div>
        </div>

        {/* Day of Week Headers */}
        <div className={styles.weekHeaderGrid}>
          <div className={styles.weekHeaderCell}>Пн</div>
          <div className={styles.weekHeaderCell}>Вт</div>
          <div className={styles.weekHeaderCell}>Ср</div>
          <div className={styles.weekHeaderCell}>Чт</div>
          <div className={styles.weekHeaderCell}>Пт</div>
          <div className={styles.weekHeaderCell} style={{ color: 'var(--color-warning)' }}>Сб</div>
          <div className={styles.weekHeaderCell} style={{ color: 'var(--color-danger)' }}>Вс</div>
        </div>

        {/* Full Month Days Matrix Grid */}
        <div className={styles.calendarMatrixGrid}>
          {monthDays.map((day) => {
            const isSelected = day.dateStr === selectedDate;
            const classNames = [
              styles.dateCell,
              !day.isCurrentMonth ? styles.dateCellOtherMonth : '',
              day.isToday ? styles.dateCellToday : '',
              isSelected ? styles.dateCellActive : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <div
                key={day.dateStr}
                className={classNames}
                onClick={() => setSelectedDate(day.dateStr)}
              >
                <span className={styles.dayNum}>{day.dayNum}</span>

                {/* Task Indicator Dot */}
                <div className={styles.taskDots}>
                  {day.tasksCount > 0 && (
                    <div
                      className={`${styles.dot} ${day.doneCount === day.tasksCount ? styles.dotDone : ''}`}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Tasks Panel */}
      <div className={styles.selectedDayCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h2">
            📅 {formattedSelectedDate}
          </Typography>
          <Typography variant="caption" style={{ color: 'var(--color-text-muted)' }}>
            Задач: {selectedDayTasks.length}
          </Typography>
        </div>

        {/* Task List for Selected Date */}
        {isLoading ? (
          <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Загрузка задач...
          </div>
        ) : selectedDayTasks.length === 0 ? (
          <div
            style={{
              padding: 'var(--space-6)',
              textAlign: 'center',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--color-border)',
              color: 'var(--color-text-muted)',
            }}
          >
            🌱 На эту дату задач нет.
          </div>
        ) : (
          <div className={styles.taskList}>
            {selectedDayTasks.map((task) => {
              const linkedTopic = task.topicId ? topics.find((t) => t.id === task.topicId) : null;
              const isDone = task.status === 'Done';
              const completedTimeStr = task.completedAt
                ? new Date(task.completedAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
                : null;

              return (
                <div
                  key={task.id}
                  className={styles.taskRow}
                  onClick={() => setEditingTask(task)}
                  style={{ cursor: 'pointer' }}
                  title="Нажмите на карточку для редактирования"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1, minWidth: 0 }}>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Checkbox checked={isDone} onChange={() => toggleTaskStatus(task.id)} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          fontSize: 'var(--font-size-md)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: isDone ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                          textDecoration: isDone ? 'line-through' : 'none',
                        }}
                      >
                        {task.title}
                      </span>
                      <div style={{ display: 'flex', gap: 'var(--space-3)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
                        <span style={{ color: 'var(--color-accent)' }}>🏷 {task.category}</span>
                        {isDone && completedTimeStr && (
                          <span style={{ color: 'var(--color-success)' }}>✓ Выполнено в {completedTimeStr}</span>
                        )}
                        {linkedTopic && (
                          <Link
                            href={`/topics/${linkedTopic.id}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{ color: 'var(--color-text-secondary)', textDecoration: 'none' }}
                          >
                            🐘 {linkedTopic.title}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTask(task.id);
                    }}
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    🗑
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Task Modal */}
      <EditTaskModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
      />
    </div>
  );
};
