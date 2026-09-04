'use client';

import React, { useEffect, useState } from 'react';
import { Card, Typography, Button } from '@/shared/ui';
import { useInboxStore, InboxItem } from '@/entities/inbox';
import { Task } from '@/entities/task/model/types';
import { EditTaskModal } from '@/features/edit-task/ui/EditTaskModal';
import { InboxHeaderWidget } from '@/widgets/inbox-header/ui/InboxHeaderWidget';
import { getTodayStr } from '@/shared/lib/dateUtils';
import { Lightbulb, Pencil, Check, X } from 'lucide-react';
import styles from './InboxPage.module.css';

type FilterType = 'all' | 'today' | 'pinned';

export const InboxPage: React.FC = () => {
  const { items, isLoading, fetchItems, addItem, updateItem, togglePin, deleteItem } = useInboxStore();

  const [quickInput, setQuickInput] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Triage state: keep track of item and draft task
  const [triagingItem, setTriagingItem] = useState<InboxItem | null>(null);
  const [triagingTask, setTriagingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Quick Capture (Enter -> Save)
  const handleQuickCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;

    await addItem(quickInput.trim());
    setQuickInput('');
  };

  // Prepare triage draft without deleting inbox item yet
  const handleTriage = (item: InboxItem) => {
    setTriagingItem(item);
    setTriagingTask({
      id: 'draft-' + item.id,
      title: item.text,
      status: 'Todo',
      priority: 'P3',
      category: 'Без категории',
      scheduledDate: getTodayStr(),
      createdAt: new Date().toISOString(),
      isRepeating: false,
      hasSubtasks: false,
      targetRepetitions: 8,
      repetitionsCount: 0,
      repetitionHistory: [],
      pomodorosCount: 1,
    });
  };

  const handleSaveSuccess = async () => {
    if (triagingItem) {
      await deleteItem(triagingItem.id);
    }
    setTriagingItem(null);
    setTriagingTask(null);
  };

  const todayStr = getTodayStr();

  const filteredItems = items.filter((item) => {
    if (activeFilter === 'pinned' && !item.isPinned) return false;
    if (activeFilter === 'today' && !item.createdAt.startsWith(todayStr)) return false;
    return true;
  });

  return (
    <div className={styles.container}>
      {/* Header & Quick Capture Form Widget */}
      <InboxHeaderWidget
        itemCount={items.length}
        quickInput={quickInput}
        setQuickInput={setQuickInput}
        onSubmit={handleQuickCapture}
      />

      {/* Gesture Guide Banner */}
      <div className={styles.swipeHintBar}>
        <Lightbulb size={13} style={{ flexShrink: 0, opacity: 0.8 }} />
        <span>👉 свайп вправо — разобрать  •  👈 свайп влево — удалить</span>
      </div>

      {/* Controls Bar (Filter Tabs) */}
      <div className={styles.controlsBar}>
        <div className={styles.filterTabs}>
          <button
            className={`${styles.tabBtn} ${activeFilter === 'all' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            Все ({items.length})
          </button>
          <button
            className={`${styles.tabBtn} ${activeFilter === 'today' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveFilter('today')}
          >
            Сегодня
          </button>
          <button
            className={`${styles.tabBtn} ${activeFilter === 'pinned' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveFilter('pinned')}
          >
            📌 Закрепленные ({items.filter((i) => i.isPinned).length})
          </button>
        </div>
      </div>

      {/* Item List */}
      <div className={styles.itemList}>
        {isLoading ? (
          <Card style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
            <Typography variant="body" style={{ color: 'var(--color-text-muted)' }}>
              Загрузка входящих...
            </Typography>
          </Card>
        ) : filteredItems.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <Typography variant="body" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
              🌱 Разум чист! Заметок в этой категории нет.
            </Typography>
            <Typography variant="caption" style={{ color: 'var(--color-text-muted)', display: 'block', marginBottom: '14px' }}>
              Введите мысль в поле выше или нажмите кнопку создания.
            </Typography>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                if (input) input.focus();
              }}
            >
              + Добавить первую идею
            </Button>
          </Card>
        ) : (
          filteredItems.map((item) => (
            <InboxItemCard
              key={item.id}
              item={item}
              handleTriage={handleTriage}
              updateItem={updateItem}
              togglePin={togglePin}
              deleteItem={deleteItem}
            />
          ))
        )}
      </div>

      {/* Standard Edit Task Modal for Triage */}
      <EditTaskModal
        task={triagingTask}
        isOpen={!!triagingTask}
        onClose={() => {
          setTriagingTask(null);
          setTriagingItem(null);
        }}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
};

interface InboxItemCardProps {
  item: InboxItem;
  handleTriage: (item: InboxItem) => void;
  updateItem: (id: string, text: string) => Promise<void>;
  togglePin: (id: string) => void;
  deleteItem: (id: string) => void;
}

const InboxItemCard: React.FC<InboxItemCardProps> = ({
  item,
  handleTriage,
  updateItem,
  togglePin,
  deleteItem,
}) => {
  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>(item.text);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const hasDraggedRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    setEditText(item.text);
  }, [item.text]);

  React.useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  const handleSave = async () => {
    const trimmed = editText.trim();
    if (!trimmed) {
      setEditText(item.text);
      setIsEditing(false);
      return;
    }
    if (trimmed !== item.text) {
      await updateItem(item.id, trimmed);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(item.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isEditing) return;
    hasDraggedRef.current = false;
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isEditing || touchStartX === null) return;
    const currentX = e.targetTouches[0].clientX;
    const diff = currentX - touchStartX; // positive = swipe right, negative = swipe left

    if (Math.abs(diff) > 8) {
      hasDraggedRef.current = true;
    }

    const clamped = Math.max(-100, Math.min(100, diff));
    setSwipeOffset(clamped);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isEditing || touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX;

    if (diff > 45) {
      // Swiped right -> Triage
      handleTriage(item);
      setSwipeOffset(0);
    } else if (diff < -45) {
      // Swiped left -> Delete
      deleteItem(item.id);
      setSwipeOffset(0);
    } else {
      setSwipeOffset(0);
    }
    setTouchStartX(null);
  };

  return (
    <div className={styles.itemCardWrapper}>
      {/* Background Swipe Triage Action (Left side) - Only rendered when swiping right */}
      {!isEditing && swipeOffset > 0 && (
        <div
          className={styles.triageSwipeAction}
          onClick={(e) => {
            e.stopPropagation();
            handleTriage(item);
            setSwipeOffset(0);
          }}
        >
          Разобрать
        </div>
      )}

      {/* Background Swipe Delete Action (Right side) - Only rendered when swiping left */}
      {!isEditing && swipeOffset < 0 && (
        <div
          className={styles.deleteSwipeAction}
          onClick={(e) => {
            e.stopPropagation();
            deleteItem(item.id);
            setSwipeOffset(0);
          }}
        >
          Удалить
        </div>
      )}

      {/* Main Ultra-Slim Item Card */}
      <div
        className={`${styles.itemCard} ${item.isPinned ? styles.itemCardPinned : ''} ${isEditing ? styles.itemCardEditing : ''}`}
        style={{ transform: isEditing ? 'none' : `translateX(${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {isEditing ? (
          <div
            className={styles.editContainer}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <textarea
              ref={textareaRef}
              value={editText}
              onChange={(e) => {
                setEditText(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onKeyDown={handleKeyDown}
              className={styles.editTextarea}
              rows={1}
              placeholder="Введите мысль..."
            />
            <div className={styles.editFooter}>
              <span className={styles.editHint}>
                Enter ↵ сохранить • Shift+Enter перенос • Esc отмена
              </span>
              <div className={styles.editActions}>
                <button
                  type="button"
                  className={styles.saveBtn}
                  onClick={handleSave}
                  title="Сохранить (Enter)"
                >
                  <Check size={13} />
                  <span>Готово</span>
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={handleCancel}
                  title="Отмена (Esc)"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                className={styles.itemText}
                onClick={() => {
                  if (!hasDraggedRef.current && swipeOffset === 0) {
                    setIsEditing(true);
                  }
                }}
                title="Нажмите для редактирования"
              >
                {item.text}
              </div>
              <div className={styles.itemMeta}>
                {new Date(item.createdAt).toLocaleString('ru-RU', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.itemActions}>
              <button
                type="button"
                className={styles.triageBtn}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTriage(item);
                }}
                title="Разобрать запись в Задачу"
              >
                ✔ Разобрать
              </button>
              <Button
                variant="ghost"
                size="sm"
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setSwipeOffset(0);
                  setIsEditing(true);
                }}
                title="Редактировать мысль"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <Pencil size={13} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setSwipeOffset(0);
                  togglePin(item.id);
                }}
                title={item.isPinned ? 'Открепить' : 'Закрепить'}
                style={{ color: item.isPinned ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
              >
                📌
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
