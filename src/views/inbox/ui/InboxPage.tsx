'use client';

import React, { useEffect, useState } from 'react';
import { Card, Typography, Button, Input } from '@/shared/ui';
import { useInboxStore, InboxItem } from '@/entities/inbox';
import { Task } from '@/entities/task/model/types';
import { EditTaskModal } from '@/features/edit-task/ui/EditTaskModal';
import { InboxHeaderWidget } from '@/widgets/inbox-header/ui/InboxHeaderWidget';
import { getTodayStr } from '@/shared/lib/dateUtils';
import styles from './InboxPage.module.css';

type FilterType = 'all' | 'today' | 'pinned';

export const InboxPage: React.FC = () => {
  const { items, isLoading, fetchItems, addItem, updateItem, togglePin, deleteItem } = useInboxStore();

  const [quickInput, setQuickInput] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

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

  const startEdit = (item: InboxItem) => {
    setEditingId(item.id);
    setEditText(item.text);
  };

  const saveEdit = async (id: string) => {
    if (editText.trim()) {
      await updateItem(id, editText.trim());
    }
    setEditingId(null);
  };

  // Prepare triage draft without deleting inbox item yet
  const handleTriage = (item: InboxItem) => {
    setTriagingItem(item);
    setTriagingTask({
      id: 'draft-' + item.id,
      title: item.text,
      status: 'Todo',
      priority: 'P3',
      category: 'Задача',
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
      {/* Header & Quick Capture Form Widget (Final Variant #6) */}
      <InboxHeaderWidget
        itemCount={items.length}
        quickInput={quickInput}
        setQuickInput={setQuickInput}
        onSubmit={handleQuickCapture}
      />

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
              editingId={editingId}
              editText={editText}
              setEditText={setEditText}
              saveEdit={saveEdit}
              startEdit={startEdit}
              handleTriage={handleTriage}
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
  editingId: string | null;
  editText: string;
  setEditText: (txt: string) => void;
  saveEdit: (id: string) => void;
  startEdit: (item: InboxItem) => void;
  handleTriage: (item: InboxItem) => void;
  togglePin: (id: string) => void;
  deleteItem: (id: string) => void;
}

const InboxItemCard: React.FC<InboxItemCardProps> = ({
  item,
  editingId,
  editText,
  setEditText,
  saveEdit,
  startEdit,
  handleTriage,
  togglePin,
  deleteItem,
}) => {
  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isSwipedLeft, setIsSwipedLeft] = useState<boolean>(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.targetTouches[0].clientX;
    const diff = touchStartX - currentX;

    if (diff > 0 && diff <= 80) {
      setSwipeOffset(-diff);
    } else if (diff < 0 && isSwipedLeft) {
      const remaining = -80 - diff;
      setSwipeOffset(Math.min(0, remaining));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 45) {
      setIsSwipedLeft(true);
      setSwipeOffset(-80);
    } else {
      setIsSwipedLeft(false);
      setSwipeOffset(0);
    }
    setTouchStartX(null);
  };

  return (
    <div className={styles.itemCardWrapper}>
      {/* Background Swipe Delete Action (No trash icon!) */}
      <div className={styles.deleteSwipeAction} onClick={() => deleteItem(item.id)}>
        Удалить
      </div>

      {/* Main Ultra-Slim Item Card */}
      <div
        className={`${styles.itemCard} ${item.isPinned ? styles.itemCardPinned : ''}`}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {editingId === item.id ? (
          <div style={{ flex: 1, display: 'flex', gap: 'var(--space-2)' }}>
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              autoFocus
            />
            <Button variant="primary" size="sm" onClick={() => saveEdit(item.id)}>
              Сохранить
            </Button>
          </div>
        ) : (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className={styles.itemText}>{item.text}</div>
            <div className={styles.itemMeta}>
              {new Date(item.createdAt).toLocaleString('ru-RU', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        )}

        {/* Quick Actions (Without Trash Icon Button) */}
        <div className={styles.itemActions}>
          <button
            className={styles.triageBtn}
            onClick={() => handleTriage(item)}
            title="Разобрать запись в Задачу"
          >
            ✔ Разобрать
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => (editingId === item.id ? saveEdit(item.id) : startEdit(item))}
            title="Редактировать"
          >
            ✎
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => togglePin(item.id)}
            title={item.isPinned ? 'Открепить' : 'Закрепить'}
            style={{ color: item.isPinned ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
          >
            📌
          </Button>
        </div>
      </div>
    </div>
  );
};
