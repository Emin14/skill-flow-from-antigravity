'use client';

import React, { useEffect, useState } from 'react';
import { Card, Typography, Button } from '@/shared/ui';
import { useInboxStore, InboxItem } from '@/entities/inbox';
import { Task } from '@/entities/task/model/types';
import { EditTaskModal } from '@/features/edit-task/ui/EditTaskModal';
import { InboxHeaderWidget } from '@/widgets/inbox-header/ui/InboxHeaderWidget';
import { getTodayStr } from '@/shared/lib/dateUtils';
import { Lightbulb, Pencil, Check, X, Trash2 } from 'lucide-react';
import styles from './InboxPage.module.css';

type FilterType = 'all' | 'today' | 'pinned';

export const InboxPage: React.FC = () => {
  const { items, isLoading, fetchItems, addItem, updateItem, togglePin, deleteItem } = useInboxStore();

  const [quickInput, setQuickInput] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Single active editing item ID: only 1 thought can be edited at a time
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

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

    setEditingItemId(null);
    await addItem(quickInput.trim());
    setQuickInput('');
  };

  // Prepare triage draft without deleting inbox item yet
  const handleTriage = (item: InboxItem) => {
    setEditingItemId(null);
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
              isEditing={editingItemId === item.id}
              onStartEdit={() => setEditingItemId(item.id)}
              onCloseEdit={() => setEditingItemId(null)}
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
  isEditing: boolean;
  onStartEdit: () => void;
  onCloseEdit: () => void;
  handleTriage: (item: InboxItem) => void;
  updateItem: (id: string, text: string) => Promise<void>;
  togglePin: (id: string) => void;
  deleteItem: (id: string) => void;
}

const InboxItemCard: React.FC<InboxItemCardProps> = ({
  item,
  isEditing,
  onStartEdit,
  onCloseEdit,
  handleTriage,
  updateItem,
  togglePin,
  deleteItem,
}) => {
  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const [isSwipingActive, setIsSwipingActive] = useState<boolean>(false);
  const touchStartPos = React.useRef<{ x: number; y: number } | null>(null);
  const gestureLockRef = React.useRef<'none' | 'vertical' | 'horizontal'>('none');
  const [editText, setEditText] = useState<string>(item.text);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const hasDraggedRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    setEditText(item.text);
  }, [item.text, isEditing]);

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
      onCloseEdit();
      return;
    }
    if (trimmed !== item.text) {
      await updateItem(item.id, trimmed);
    }
    onCloseEdit();
  };

  const handleCancel = () => {
    setEditText(item.text);
    onCloseEdit();
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

  // Close and auto-save on click outside the active card
  React.useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        handleSave();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isEditing, editText, item.text]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isEditing || e.targetTouches.length !== 1) return;
    hasDraggedRef.current = false;
    gestureLockRef.current = 'none';
    setIsSwipingActive(false);
    const touch = e.targetTouches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isEditing || !touchStartPos.current || e.targetTouches.length !== 1) return;
    const touch = e.targetTouches[0];
    const diffX = touch.clientX - touchStartPos.current.x;
    const diffY = touch.clientY - touchStartPos.current.y;
    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);

    // Initial phase: determine user intention
    if (gestureLockRef.current === 'none') {
      // Don't lock until user has moved finger at least 7px
      if (absX < 7 && absY < 7) {
        return;
      }

      // If vertical movement is dominant or comparable to horizontal:
      // It is a vertical page scroll! Lock to vertical and ignore horizontal swipe completely.
      if (absY >= absX || absX < 14) {
        gestureLockRef.current = 'vertical';
        setSwipeOffset(0);
        setIsSwipingActive(false);
        return;
      } else {
        // Horizontal movement is distinctly greater than vertical (absX > absY * 1.5)
        if (absX > absY * 1.5) {
          gestureLockRef.current = 'horizontal';
          hasDraggedRef.current = true;
          setIsSwipingActive(true);
        } else {
          // Ambiguous / diagonal: prioritize smooth page scrolling
          gestureLockRef.current = 'vertical';
          setSwipeOffset(0);
          setIsSwipingActive(false);
          return;
        }
      }
    }

    // If locked to vertical, do nothing and let page scroll naturally
    if (gestureLockRef.current === 'vertical') {
      return;
    }

    // If locked to horizontal swipe, track finger with soft resistance
    if (gestureLockRef.current === 'horizontal') {
      hasDraggedRef.current = true;
      let offset = diffX;
      const MAX_OFFSET = 105;
      if (offset > MAX_OFFSET) {
        offset = MAX_OFFSET + (offset - MAX_OFFSET) * 0.25;
      } else if (offset < -MAX_OFFSET) {
        offset = -MAX_OFFSET + (offset + MAX_OFFSET) * 0.25;
      }
      setSwipeOffset(offset);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isEditing || !touchStartPos.current) {
      touchStartPos.current = null;
      gestureLockRef.current = 'none';
      setIsSwipingActive(false);
      setSwipeOffset(0);
      return;
    }

    if (gestureLockRef.current === 'horizontal') {
      const touch = e.changedTouches[0];
      const diffX = touch.clientX - touchStartPos.current.x;

      // Deliberate swipe threshold: 75px
      const SWIPE_THRESHOLD = 75;
      if (diffX > SWIPE_THRESHOLD) {
        // Swiped right -> Triage
        handleTriage(item);
      } else if (diffX < -SWIPE_THRESHOLD) {
        // Swiped left -> Delete
        deleteItem(item.id);
      }
    }

    setSwipeOffset(0);
    setIsSwipingActive(false);
    touchStartPos.current = null;
    gestureLockRef.current = 'none';

    // Prevent click on text from firing after ending a drag
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 120);
  };

  const handleTouchCancel = () => {
    setSwipeOffset(0);
    setIsSwipingActive(false);
    touchStartPos.current = null;
    gestureLockRef.current = 'none';
    hasDraggedRef.current = false;
  };

  return (
    <div ref={cardRef} className={styles.itemCardWrapper}>
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
          <Check size={16} />
          <span>Разобрать</span>
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
          <Trash2 size={16} />
          <span>Удалить</span>
        </div>
      )}

      {/* Main Ultra-Slim Item Card */}
      <div
        className={`${styles.itemCard} ${item.isPinned ? styles.itemCardPinned : ''} ${isEditing ? styles.itemCardEditing : ''}`}
        style={{
          transform: isEditing ? 'none' : swipeOffset !== 0 ? `translateX(${swipeOffset}px)` : undefined,
          transition: isSwipingActive ? 'none' : undefined,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
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
                    onStartEdit();
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
                <Check size={13} />
                <span className={styles.triageLabel}>Разобрать</span>
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
                  onStartEdit();
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
              <Button
                variant="ghost"
                size="sm"
                className={styles.deleteBtn}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setSwipeOffset(0);
                  deleteItem(item.id);
                }}
                title="Удалить мысль"
              >
                <Trash2 size={13} />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
