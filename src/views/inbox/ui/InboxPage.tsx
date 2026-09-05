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

  // Single active opened swipe item ID (for reveal delete action)
  const [swipedOpenItemId, setSwipedOpenItemId] = useState<string | null>(null);

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
    setSwipedOpenItemId(null);
    await addItem(quickInput.trim());
    setQuickInput('');
  };

  // Prepare triage draft without deleting inbox item yet
  const handleTriage = (item: InboxItem) => {
    setEditingItemId(null);
    setSwipedOpenItemId(null);
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
              onStartEdit={() => {
                setEditingItemId(item.id);
                setSwipedOpenItemId(null);
              }}
              onCloseEdit={() => setEditingItemId(null)}
              isSwipedOpen={swipedOpenItemId === item.id}
              onOpenSwipe={() => {
                setSwipedOpenItemId(item.id);
                setEditingItemId(null);
              }}
              onCloseSwipe={() => {
                if (swipedOpenItemId === item.id) {
                  setSwipedOpenItemId(null);
                }
              }}
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
  isSwipedOpen: boolean;
  onOpenSwipe: () => void;
  onCloseSwipe: () => void;
  handleTriage: (item: InboxItem) => void;
  updateItem: (id: string, text: string) => Promise<void>;
  togglePin: (id: string) => void;
  deleteItem: (id: string) => void;
}

const DELETE_ACTION_WIDTH = 88;

const InboxItemCard: React.FC<InboxItemCardProps> = ({
  item,
  isEditing,
  onStartEdit,
  onCloseEdit,
  isSwipedOpen,
  onOpenSwipe,
  onCloseSwipe,
  handleTriage,
  updateItem,
  togglePin,
  deleteItem,
}) => {
  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const [isSwipingActive, setIsSwipingActive] = useState<boolean>(false);
  const touchStartPos = React.useRef<{ x: number; y: number } | null>(null);
  const initialOffsetRef = React.useRef<number>(0);
  const gestureLockRef = React.useRef<'none' | 'vertical' | 'horizontal'>('none');
  const [editText, setEditText] = useState<string>(item.text);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const deleteBtnRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const hasMovedRef = React.useRef<boolean>(false);

  // Sync swipeOffset with external isSwipedOpen state when not actively dragging
  React.useEffect(() => {
    if (!isSwipingActive) {
      if (isSwipedOpen) {
        setSwipeOffset(-DELETE_ACTION_WIDTH);
      } else {
        setSwipeOffset(0);
      }
    }
  }, [isSwipedOpen, isSwipingActive]);

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

  // Close and auto-save on tap/click outside the active editing card (without closing on scroll!)
  React.useEffect(() => {
    if (!isEditing) return;

    let touchStartPos: { x: number; y: number } | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartPos) return;
      const touch = e.changedTouches[0];
      const diffX = Math.abs(touch.clientX - touchStartPos.x);
      const diffY = Math.abs(touch.clientY - touchStartPos.y);
      touchStartPos = null;

      // If finger moved more than 8px, it was a scroll gesture, not a tap!
      if (diffX > 8 || diffY > 8) {
        return;
      }

      // If it was an intentional stationary tap outside the card:
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        handleSave();
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Ignore click on native browser scrollbar
      if (e.clientX >= document.documentElement.clientWidth) {
        return;
      }
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        handleSave();
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
      document.addEventListener('mousedown', handleMouseDown);
    }, 60);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isEditing, editText, item.text]);

  // Click outside / tap on card to close opened swipe action
  React.useEffect(() => {
    if (!isSwipedOpen) return;

    const handleSwipeOutside = (e: MouseEvent | TouchEvent) => {
      // If clicking inside the delete action button, let its onClick handle deletion
      if (deleteBtnRef.current && deleteBtnRef.current.contains(e.target as Node)) {
        return;
      }
      onCloseSwipe();
    };

    // Small timeout ensures touchend on the card doesn't immediately dismiss the open state
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleSwipeOutside);
      document.addEventListener('touchstart', handleSwipeOutside);
    }, 60);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleSwipeOutside);
      document.removeEventListener('touchstart', handleSwipeOutside);
    };
  }, [isSwipedOpen, onCloseSwipe]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isEditing || e.touches.length > 1) return;
    gestureLockRef.current = 'none';
    setIsSwipingActive(false);
    hasMovedRef.current = false;
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    initialOffsetRef.current = isSwipedOpen ? -DELETE_ACTION_WIDTH : 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isEditing || !touchStartPos.current || e.touches.length > 1) return;
    const touch = e.touches[0];
    const diffX = touch.clientX - touchStartPos.current.x;
    const diffY = touch.clientY - touchStartPos.current.y;
    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);

    if (absX > 6 || absY > 6) {
      hasMovedRef.current = true;
    }

    if (gestureLockRef.current === 'none') {
      if (absX < 6 && absY < 6) return;

      if (absY > absX * 1.15) {
        gestureLockRef.current = 'vertical';
        return;
      } else {
        gestureLockRef.current = 'horizontal';
        setIsSwipingActive(true);
      }
    }

    if (gestureLockRef.current === 'vertical') return;

    if (gestureLockRef.current === 'horizontal') {
      let offset = initialOffsetRef.current + diffX;
      // Soft limits
      if (offset > 105) {
        offset = 105 + (offset - 105) * 0.25;
      } else if (offset < -(DELETE_ACTION_WIDTH + 25)) {
        const minLimit = -(DELETE_ACTION_WIDTH + 25);
        offset = minLimit + (offset - minLimit) * 0.25;
      }
      setSwipeOffset(offset);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isEditing || !touchStartPos.current) {
      touchStartPos.current = null;
      gestureLockRef.current = 'none';
      setIsSwipingActive(false);
      return;
    }

    if (gestureLockRef.current === 'horizontal') {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartPos.current.x;
      const finalOffset = initialOffsetRef.current + deltaX;

      // 1. Swiping right from closed: Triage!
      if (initialOffsetRef.current === 0 && finalOffset > 55) {
        handleTriage(item);
        setSwipeOffset(0);
        onCloseSwipe();
      }
      // 2. Swiping left from closed: Reveal Delete Button!
      else if (initialOffsetRef.current === 0 && finalOffset < -28) {
        setSwipeOffset(-DELETE_ACTION_WIDTH);
        onOpenSwipe();
      }
      // 3. Card was already open:
      else if (initialOffsetRef.current === -DELETE_ACTION_WIDTH) {
        // If swiped right by at least 25px, close it back
        if (deltaX > 25) {
          setSwipeOffset(0);
          onCloseSwipe();
        } else {
          // Stay open
          setSwipeOffset(-DELETE_ACTION_WIDTH);
          onOpenSwipe();
        }
      }
      // 4. Fallback: snap back to closed
      else {
        setSwipeOffset(0);
        onCloseSwipe();
      }
    }

    setIsSwipingActive(false);
    touchStartPos.current = null;
    gestureLockRef.current = 'none';
    setTimeout(() => {
      hasMovedRef.current = false;
    }, 150);
  };

  const handleTouchCancel = () => {
    setSwipeOffset(isSwipedOpen ? -DELETE_ACTION_WIDTH : 0);
    setIsSwipingActive(false);
    touchStartPos.current = null;
    gestureLockRef.current = 'none';
    setTimeout(() => {
      hasMovedRef.current = false;
    }, 150);
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
            onCloseSwipe();
          }}
        >
          <Check size={16} />
          <span>Разобрать</span>
        </div>
      )}

      {/* Background Swipe Delete Action (Right side) - Rendered when swiping left or locked open */}
      {!isEditing && (swipeOffset < 0 || isSwipedOpen) && (
        <div
          ref={deleteBtnRef}
          className={styles.deleteSwipeAction}
          onClick={(e) => {
            e.stopPropagation();
            onCloseSwipe();
            deleteItem(item.id);
          }}
          title="Нажмите для удаления"
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
        onClick={() => {
          if (hasMovedRef.current) return;
          if (isSwipedOpen) {
            onCloseSwipe();
          }
        }}
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
              <div className={styles.itemText}>
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
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasMovedRef.current || isSwipingActive || swipeOffset !== 0) return;
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
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasMovedRef.current || isSwipingActive || swipeOffset !== 0) return;
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
