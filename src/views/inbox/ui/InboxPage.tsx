'use client';

import React, { useEffect, useState } from 'react';
import { Card, Typography, Button, Input } from '@/shared/ui';
import { useInboxStore, InboxItem } from '@/entities/inbox';
import { TriageModal } from '@/features/inbox-triage';
import styles from './InboxPage.module.css';

type FilterType = 'all' | 'today' | 'pinned';

export const InboxPage: React.FC = () => {
  const { items, isLoading, fetchItems, addItem, updateItem, togglePin, deleteItem } = useInboxStore();

  const [quickInput, setQuickInput] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [triageItem, setTriageItem] = useState<InboxItem | null>(null);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Stage 2: Quick Capture (Enter -> Save)
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

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredItems = items.filter((item) => {
    if (activeFilter === 'pinned' && !item.isPinned) return false;
    if (activeFilter === 'today' && !item.createdAt.startsWith(todayStr)) return false;
    return true;
  });

  return (
    <div className={styles.container}>
      {/* Header & Quick Capture Form */}
      <Card className={styles.quickCaptureCard}>
        <Typography variant="h1">📥 Входящие ({items.length})</Typography>
        <Typography variant="body" style={{ color: 'var(--color-text-muted)' }}>
          Быстрый захват мыслей, заметок и идей. Разберите их, когда будете готовы.
        </Typography>

        <form onSubmit={handleQuickCapture} style={{ marginTop: 'var(--space-2)' }}>
          <Input
            placeholder="Новая идея..."
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
          />
        </form>
      </Card>

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
            <Typography variant="body" style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
              🌱 Разум чист! Заметок в этой категории нет.
            </Typography>
            <Typography variant="caption">
              Введите мысль выше и нажмите Enter для сохранения.
            </Typography>
          </Card>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`${styles.itemCard} ${item.isPinned ? styles.itemCardPinned : ''}`}
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
                <div style={{ flex: 1 }}>
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

              {/* Quick Actions */}
              <div className={styles.itemActions}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setTriageItem(item)}
                  title="Разобрать запись в Цель, Тему или Задачу"
                >
                  ✔ Разобрать
                </Button>
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteItem(item.id)}
                  title="Удалить"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  🗑
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Triage Modal */}
      {triageItem && (
        <TriageModal item={triageItem} onClose={() => setTriageItem(null)} />
      )}
    </div>
  );
};
