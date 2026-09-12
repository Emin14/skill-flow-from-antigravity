'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useBacklogStore, BacklogItem, BacklogStatus, BacklogPriority } from '@/entities/backlog';
import { BacklogCard } from './BacklogCard';
import { IdeaDetailModal } from './IdeaDetailModal';
import { Search, X, Plus, LayoutGrid, List, RotateCcw, Lightbulb } from 'lucide-react';
import styles from './BacklogPage.module.css';

const DEFAULT_TOPICS = ['Todo List', 'Сайт заказа продуктов'];

export const BacklogPage: React.FC = () => {
  const {
    items,
    isLoading,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
    convertToTask,
  } = useBacklogStore();

  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [quickTitle, setQuickTitle] = useState('');
  const [quickTopic, setQuickTopic] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BacklogStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | BacklogPriority>('all');
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');

  // Modal State
  const [modalItem, setModalItem] = useState<BacklogItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Unique topics from actual items plus defaults
  const topics = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.topic) set.add(item.topic);
    });
    DEFAULT_TOPICS.forEach((t) => set.add(t));
    return Array.from(set).sort();
  }, [items]);

  useEffect(() => {
    if (!quickTopic && topics.length > 0) {
      setQuickTopic(selectedTopic !== 'all' ? selectedTopic : topics[0]);
    }
  }, [topics, quickTopic, selectedTopic]);

  // Filtered items
  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      // 1. Topic filter
      if (selectedTopic !== 'all' && item.topic !== selectedTopic) {
        return false;
      }

      // 2. Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }

      // 3. Priority filter
      if (priorityFilter !== 'all' && item.priority !== priorityFilter) {
        return false;
      }

      // 4. Text search
      if (query) {
        const titleMatch = item.title.toLowerCase().includes(query);
        const descMatch = item.description?.toLowerCase().includes(query) ?? false;
        const tagMatch = item.tags?.some((t) => t.toLowerCase().includes(query)) ?? false;
        if (!titleMatch && !descMatch && !tagMatch) return false;
      }

      return true;
    });
  }, [items, selectedTopic, statusFilter, priorityFilter, searchQuery]);

  // Grouped for Kanban board
  const boardColumns = useMemo(() => {
    return [
      {
        id: 'idea' as BacklogStatus,
        title: '💡 Свежие мысли',
        items: filteredItems.filter((i) => i.status === 'idea'),
      },
      {
        id: 'backlog' as BacklogStatus,
        title: '📋 В бэклоге',
        items: filteredItems.filter((i) => i.status === 'backlog'),
      },
      {
        id: 'planned' as BacklogStatus,
        title: '🚀 В планах',
        items: filteredItems.filter((i) => i.status === 'planned'),
      },
      {
        id: 'done' as BacklogStatus,
        title: '✅ Реализовано',
        items: filteredItems.filter((i) => i.status === 'done'),
      },
    ];
  }, [filteredItems]);

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    const topicToUse = quickTopic || (selectedTopic !== 'all' ? selectedTopic : 'Общее');
    await addItem({
      title: quickTitle.trim(),
      topic: topicToUse,
      status: 'idea',
      priority: 'medium',
    });
    setQuickTitle('');
  };

  const handleOpenCreate = () => {
    setModalItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: BacklogItem) => {
    setModalItem(item);
    setIsModalOpen(true);
  };

  const handleSaveModal = async (data: {
    topic: string;
    title: string;
    description: string;
    status: BacklogStatus;
    priority: BacklogPriority;
    tags: string[];
    link: string;
  }) => {
    if (modalItem) {
      await updateItem(modalItem.id, data);
    } else {
      await addItem(data);
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Banner & Quick Capture */}
      <div className={styles.banner}>
        <div className={styles.headerRow}>
          <h2 className={styles.title}>
            <span>💡</span>
            <span>Идеи и Бэклог</span>
          </h2>
          <span className={styles.counterBadge}>
            Идей: {filteredItems.length} {items.length > 0 ? `из ${items.length}` : ''}
          </span>
        </div>

        {/* Quick Capture Form */}
        <form onSubmit={handleQuickAdd} className={styles.quickCaptureForm}>
          <input
            type="text"
            className={styles.quickInput}
            placeholder="Какая новая мысль или фича пришла в голову?.."
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
          />
          <select
            className={styles.quickTopicSelect}
            value={quickTopic}
            onChange={(e) => setQuickTopic(e.target.value)}
          >
            {topics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button type="submit" className={styles.quickSubmitBtn} disabled={!quickTitle.trim()}>
            <Plus size={15} />
            <span>Добавить</span>
          </button>
        </form>
      </div>

      {/* Topics Navigation Pills */}
      <div className={styles.topicsBar}>
        <button
          type="button"
          className={`${styles.topicPill} ${selectedTopic === 'all' ? styles.topicPillActive : ''}`}
          onClick={() => setSelectedTopic('all')}
        >
          <span>Все темы</span>
          <span className={styles.topicCount}>({items.length})</span>
        </button>

        {topics.map((t) => {
          const count = items.filter((i) => i.topic === t).length;
          return (
            <button
              key={t}
              type="button"
              className={`${styles.topicPill} ${selectedTopic === t ? styles.topicPillActive : ''}`}
              onClick={() => setSelectedTopic(t)}
            >
              <span>{t}</span>
              <span className={styles.topicCount}>({count})</span>
            </button>
          );
        })}

        <button
          type="button"
          className={styles.addTopicBtn}
          onClick={handleOpenCreate}
          title="Создать идею в новой теме"
        >
          <Plus size={13} />
          <span>Новая тема / идея</span>
        </button>
      </div>

      {/* Controls Bar */}
      <div className={styles.controlsBar}>
        <div className={styles.controlsLeft}>
          {/* Search Input */}
          <div className={styles.searchInputWrapper}>
            <Search size={14} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Поиск по идеям..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.clearSearchBtn}
                onClick={() => setSearchQuery('')}
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | BacklogStatus)}
          >
            <option value="all">Все статусы</option>
            <option value="idea">💡 Мысли</option>
            <option value="backlog">📋 В бэклоге</option>
            <option value="planned">🚀 В планах</option>
            <option value="done">✅ Сделано</option>
          </select>

          {/* Priority Filter */}
          <select
            className={styles.filterSelect}
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as 'all' | BacklogPriority)}
          >
            <option value="all">Все приоритеты</option>
            <option value="high">🔥 Высокий</option>
            <option value="medium">⚡ Средний</option>
            <option value="low">☕ Низкий</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className={styles.controlsRight}>
          <button
            type="button"
            className={`${styles.viewToggleBtn} ${viewMode === 'board' ? styles.viewToggleBtnActive : ''}`}
            onClick={() => setViewMode('board')}
            title="Отображение доской (Канбан)"
          >
            <LayoutGrid size={15} />
          </button>
          <button
            type="button"
            className={`${styles.viewToggleBtn} ${viewMode === 'list' ? styles.viewToggleBtnActive : ''}`}
            onClick={() => setViewMode('list')}
            title="Отображение списком"
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* Content: Board or List */}
      {isLoading ? (
        <div className={styles.emptyState}>
          <p className={styles.emptySubtitle}>Загрузка идей...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>💡</div>
          <h3 className={styles.emptyTitle}>В бэклоге пока нет идей</h3>
          <p className={styles.emptySubtitle}>
            {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Попробуйте изменить параметры поиска или сбросить фильтры.'
              : 'Запишите первую мысль или фичу для приложения в поле выше!'}
          </p>
        </div>
      ) : viewMode === 'board' ? (
        /* Kanban Board View */
        <div className={styles.kanbanGrid}>
          {boardColumns.map((col) => (
            <div key={col.id} className={styles.kanbanColumn}>
              <div className={styles.columnHeader}>
                <h4 className={styles.columnTitle}>{col.title}</h4>
                <span className={styles.columnCount}>{col.items.length}</span>
              </div>
              <div className={styles.columnCards}>
                {col.items.length === 0 ? (
                  <div className={styles.columnEmpty}>Пусто</div>
                ) : (
                  col.items.map((item) => (
                    <BacklogCard
                      key={item.id}
                      item={item}
                      onClick={() => handleOpenEdit(item)}
                      onConvertToTask={() => convertToTask(item.id)}
                      onDelete={() => deleteItem(item.id)}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className={styles.listView}>
          {filteredItems.map((item) => (
            <BacklogCard
              key={item.id}
              item={item}
              onClick={() => handleOpenEdit(item)}
              onConvertToTask={() => convertToTask(item.id)}
              onDelete={() => deleteItem(item.id)}
            />
          ))}
        </div>
      )}

      {/* Idea Detail Modal */}
      <IdeaDetailModal
        isOpen={isModalOpen}
        item={modalItem}
        existingTopics={topics}
        initialTopic={selectedTopic !== 'all' ? selectedTopic : undefined}
        onClose={() => {
          setIsModalOpen(false);
          setModalItem(null);
        }}
        onSave={handleSaveModal}
        onDelete={deleteItem}
        onConvertToTask={convertToTask}
      />
    </div>
  );
};
