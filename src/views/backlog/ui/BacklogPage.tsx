'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useBacklogStore, BacklogItem, BacklogStatus, BacklogPriority } from '@/entities/backlog';
import { IdeaDetailModal } from './IdeaDetailModal';
import { EditTaskModal } from '@/features/edit-task/ui/EditTaskModal';
import { Task, TaskPriority } from '@/entities/task/model/types';
import { Search, X, Plus } from 'lucide-react';
import styles from './BacklogPage.module.css';
import { TopicsClassicView } from './layouts/BacklogLayouts';

export const BacklogPage: React.FC = () => {
  const {
    items,
    isLoading,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
    convertToTask,
    renameTopic,
  } = useBacklogStore();

  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BacklogStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | BacklogPriority>('all');

  const [modalItem, setModalItem] = useState<BacklogItem | null>(null);
  const [modalTopic, setModalTopic] = useState<string | undefined>();
  const [convertingItem, setConvertingItem] = useState<BacklogItem | null>(null);
  const [draftTask, setDraftTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Topics derived purely from actual items — no hardcoded defaults
  const topics = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.topic) set.add(item.topic);
    });
    return Array.from(set).sort();
  }, [items]);



  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      if (selectedTopic !== 'all' && item.topic !== selectedTopic) return false;
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;
      if (query) {
        const titleMatch = item.title.toLowerCase().includes(query);
        const descMatch = item.description?.toLowerCase().includes(query) ?? false;
        const tagMatch = item.tags?.some((t) => t.toLowerCase().includes(query)) ?? false;
        if (!titleMatch && !descMatch && !tagMatch) return false;
      }
      return true;
    });
  }, [items, selectedTopic, statusFilter, priorityFilter, searchQuery]);



  const handleOpenCreate = (topicOverride?: string) => {
    setModalItem(null);
    setModalTopic(topicOverride || (selectedTopic !== 'all' ? selectedTopic : undefined));
    setIsModalOpen(true);
  };
  const handleOpenEdit = (item: BacklogItem) => {
    setModalItem(item);
    setIsModalOpen(true);
  };

    const handleStatus = (id: string, status: BacklogStatus) => updateItem(id, { status });
  const handleTopic = (id: string, topic: string) => updateItem(id, { topic });
  const handlePriority = (id: string, priority: BacklogPriority) => updateItem(id, { priority });

  const handleSaveModal = async (data: {
    topic: string;
    title: string;
    description: string;
    status: BacklogStatus;
    priority: BacklogPriority;
    tags: string[];
    link: string;
  }) => {
    if (modalItem) await updateItem(modalItem.id, data);
    else await addItem(data);
  };

  return (
    <div className={styles.container}>
      {/* Top Banner & Quick Capture */}
      <div className={styles.banner}>
        <div className={styles.headerRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 className={styles.title}>
              <span>💡</span>
              <span>Заметки и Бэклог</span>
            </h2>
            <span className={styles.counterBadge}>
              {filteredItems.length} {items.length > 0 && filteredItems.length !== items.length ? `из ${items.length}` : ''}
            </span>
          </div>
          <button type="button" className={styles.iconAddBtn} title="Новая заметка" onClick={() => handleOpenCreate()}>
            <Plus size={20} />
          </button>
        </div></div>

      {/* Topics Navigation Pills */}
            <div className={styles.topicsBar}>
        <select 
          className={styles.topicSelect}
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
        >
          <option value="all">Все темы</option>
          {topics.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <button
          type="button"
          className={styles.addTopicBtnMinimal}
          onClick={() => handleOpenCreate()}
          title="Создать новую заметку"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Controls Bar */}
      <div className={styles.controlsBar}>
        <div className={styles.controlsLeft}>
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
              <button type="button" className={styles.clearSearchBtn} onClick={() => setSearchQuery('')}>
                <X size={12} />
              </button>
            )}
          </div>

          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | BacklogStatus)}
          >
            <option value="all">Все статусы</option>
            <option value="idea">💡 Мысли</option>
            <option value="planned">🚀 В планах</option>
            <option value="done">✅ Сделано</option>
          </select>

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
      </div>

      {/* Content */}
      {isLoading ? (
        <div className={styles.emptyState}>
          <p className={styles.emptySubtitle}>Загрузка идей...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📭</div>
          <h3 className={styles.emptyTitle}>Здесь пока пусто</h3>
          <p className={styles.emptySubtitle}>
            {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Попробуйте сбросить поиск или фильтры.'
              : 'Самое время записать первую идею!'}
          </p>
        </div>
      ) : (
        <TopicsClassicView
          items={filteredItems}
          topics={selectedTopic === 'all' ? topics : [selectedTopic]}
          totalCount={items.length}
          onEdit={handleOpenEdit}
          onDelete={deleteItem}
          onConvert={convertToTask}
          onStatus={handleStatus}
          onTopic={handleTopic}
          onPriority={handlePriority}
          onOpenCreate={handleOpenCreate}
          onRenameTopic={renameTopic}
        />
      )}

      <IdeaDetailModal
        isOpen={isModalOpen}
        item={modalItem}
        existingTopics={topics}
        initialTopic={modalTopic}
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
