'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useBacklogStore, BacklogItem, BacklogTopic, BacklogStatus, BacklogPriority } from '@/entities/backlog';
import { IdeaDetailModal } from './IdeaDetailModal';
import { useQuickCreateModalStore } from '@/features/quick-create/model/quickCreateStore';
import { clearNoteDraft, readNoteDraft, type NoteDraft } from './noteDraft';
import { getTodayStr } from '@/shared/lib/dateUtils';
import { Search, X, Plus } from 'lucide-react';
import styles from './BacklogPage.module.css';
import { TopicsClassicView } from './layouts/BacklogLayouts';
import { toggleNotePinOrder, type BacklogSortMode } from './backlogSorting';
import { TopicDetailModal } from './TopicDetailModal';

export const BacklogPage: React.FC = () => {
  const {
    items,
    topics: allTopics,
    error,
    isLoading,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
    convertToTask,
    saveTopic,
    deleteTopic,
  } = useBacklogStore();

  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BacklogStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | BacklogPriority>('all');
  const [hideDone, setHideDone] = useState(false);
  const [sortMode, setSortMode] = useState<BacklogSortMode>('updated-desc');
  const [showArchivedTopics, setShowArchivedTopics] = useState(false);
  const [topicModal, setTopicModal] = useState<{ topic: BacklogTopic | null } | null>(null);

  const [modalItem, setModalItem] = useState<BacklogItem | null>(null);
  const [modalTopic, setModalTopic] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const topics = useMemo(() => allTopics.filter(topic => showArchivedTopics || !topic.archivedAt), [allTopics, showArchivedTopics]);



  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return items.filter((item) => {
      if (!topics.some(topic => topic.id === item.topicId)) return false;
      if (hideDone && item.status === 'done') return false;
      if (selectedTopic !== 'all' && item.topicId !== selectedTopic) return false;
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
  }, [items, topics, selectedTopic, statusFilter, priorityFilter, searchQuery, hideDone]);

  const hasActiveFilters = Boolean(searchQuery) || selectedTopic !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all' || hideDone;
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTopic('all');
    setStatusFilter('all');
    setPriorityFilter('all');
    setHideDone(false);
  };


  const handleOpenCreate = (topicOverride?: string) => {
    setModalItem(null);
    const topicId = topicOverride || (selectedTopic !== 'all' ? selectedTopic : undefined);
    setModalTopic(allTopics.find(topic => topic.id === topicId)?.name);
    setIsModalOpen(true);
  };
  const handleOpenEdit = (item: BacklogItem) => {
    setModalItem(item);
    setIsModalOpen(true);
  };

  const handleConvert = (id: string, draft?: NoteDraft) => {
    const source = items.find(item => item.id === id);
    if (!source || useQuickCreateModalStore.getState().isOpen) return;
    const returnToEdit = Boolean(draft);
    const current = draft ?? readNoteDraft(`backlog:note-draft:v1:${id}`) ?? source;
    setIsModalOpen(false);
    useQuickCreateModalStore.getState().openModal('Task', {
      initialData: {
        title: current.title,
        description: current.description ?? '',
        category: (allTopics.find(topic => topic.id === current.topicId)?.name ?? current.topic) || 'Без категории',
        link: current.link ?? '',
        scheduledDate: getTodayStr(),
      },
      onCreate: async data => {
        await convertToTask(id, data);
        clearNoteDraft(`backlog:note-draft:v1:${id}`);
        setIsModalOpen(false);
        setModalItem(null);
      },
      onCancel: () => {
        if (returnToEdit) {
          setModalItem(source);
          setIsModalOpen(true);
        }
      },
    });
  };

    const handleStatus = (id: string, status: BacklogStatus) => updateItem(id, { status });
  const handleTopic = (id: string, topicId: string) => updateItem(id, { topicId });
  const handlePriority = (id: string, priority: BacklogPriority) => updateItem(id, { priority });
  const handlePin = async (item: BacklogItem) => {
    try {
      await updateItem(item.id, { sortOrder: toggleNotePinOrder(item) });
    } catch {
      // The store restores the previous value and reports the error.
    }
  };

  const handleSaveModal = async (data: {
    topic: string;
    topicId?: string;
    title: string;
    description: string;
    status: BacklogStatus;
    priority: BacklogPriority;
    tags: string[];
    link: string;
  }) => {
    const topic = allTopics.find(topic => data.topicId ? topic.id === data.topicId : topic.name === data.topic)
      ?? await saveTopic({ name: data.topic });
    const payload = { ...data, topicId: topic.id, topic: topic.name };
    if (modalItem) await updateItem(modalItem.id, payload);
    else await addItem(payload);
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
            <option key={t.id} value={t.id}>{t.name}{t.archivedAt ? ' (архив)' : ''}</option>
          ))}
        </select>

        <button
          type="button"
          className={styles.addTopicBtnMinimal}
          onClick={() => setTopicModal({ topic: null })}
          title="Создать тему"
          aria-label="Создать тему"
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
              placeholder="Поиск по заметкам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button type="button" className={styles.clearSearchBtn} aria-label="Очистить поиск" onClick={() => setSearchQuery('')}>
                <X size={12} />
              </button>
            )}
          </div>

          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => {
              const nextStatus = e.target.value as 'all' | BacklogStatus;
              setStatusFilter(nextStatus);
              if (nextStatus === 'done') setHideDone(false);
            }}
          >
            <option value="all">Все статусы</option>
            <option value="idea">💡 Новые заметки</option>
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
        <div className={styles.listPreferences}>
          <select
            className={styles.filterSelect}
            aria-label="Сортировка заметок"
            value={sortMode}
            onChange={e => setSortMode(e.target.value as BacklogSortMode)}
          >
            <option value="updated-desc">Сначала недавно изменённые</option>
            <option value="updated-asc">Сначала давно изменённые</option>
            <option value="created-desc">Сначала новые</option>
          </select>
          <label className={styles.hideDoneToggle}>
            <input type="checkbox" checked={hideDone} onChange={e => {
              setHideDone(e.target.checked);
              if (e.target.checked && statusFilter === 'done') setStatusFilter('all');
            }} />
            Скрыть сделанное
          </label>
          <label className={styles.hideDoneToggle}>
            <input type="checkbox" checked={showArchivedTopics} onChange={event => {
              setShowArchivedTopics(event.target.checked);
              if (!event.target.checked && allTopics.find(topic => topic.id === selectedTopic)?.archivedAt) setSelectedTopic('all');
            }} />
            Показать архив тем
          </label>
          {hasActiveFilters && (
            <button type="button" className={styles.resetFiltersBtn} onClick={resetFilters}>
              <X size={14} />
              Сбросить фильтры
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {error ? (
        <div className={styles.emptyState} role="alert"><p>{error}</p><button type="button" className={styles.resetFiltersBtn} onClick={() => fetchItems()}>Повторить загрузку</button></div>
      ) : isLoading ? (
        <div className={styles.emptyState}>
          <p className={styles.emptySubtitle}>Загрузка заметок...</p>
        </div>
      ) : topics.length === 0 || (filteredItems.length === 0 && hasActiveFilters && (Boolean(searchQuery.trim()) || statusFilter !== 'all' || priorityFilter !== 'all' || hideDone)) ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📭</div>
          <h3 className={styles.emptyTitle}>{hasActiveFilters ? 'Заметки не найдены' : 'Здесь пока пусто'}</h3>
          <p className={styles.emptySubtitle}>
            {hasActiveFilters
              ? 'Попробуйте сбросить поиск или фильтры.'
              : 'Самое время записать первую заметку!'}
          </p>
        </div>
      ) : (
        <TopicsClassicView
          items={filteredItems}
          topics={selectedTopic === 'all' ? topics : topics.filter(topic => topic.id === selectedTopic)}
          hideEmptyGroups={Boolean(searchQuery.trim()) || statusFilter !== 'all' || priorityFilter !== 'all' || hideDone}
          searchQuery={searchQuery.trim().toLowerCase()}
          sortMode={sortMode}
          onPin={handlePin}
          totalCount={items.length}
          onEdit={handleOpenEdit}
          onDelete={deleteItem}
          onConvert={handleConvert}
          onStatus={handleStatus}
          onTopic={handleTopic}
          onPriority={handlePriority}
          onOpenCreate={handleOpenCreate}
          onEditTopic={topic => setTopicModal({ topic })}
        />
      )}

      <IdeaDetailModal
        isOpen={isModalOpen}
        item={modalItem}
        existingTopics={allTopics}
        initialTopic={modalTopic}
        onClose={() => {
          setIsModalOpen(false);
          setModalItem(null);
        }}
        onSave={handleSaveModal}
        onDelete={deleteItem}
        onConvertToTask={handleConvert}
      />
      {topicModal && <TopicDetailModal
        topic={topicModal.topic}
        onClose={() => setTopicModal(null)}
        onSave={async (data, id) => {
          const saved = await saveTopic(data, id);
          if (saved.archivedAt && !showArchivedTopics && selectedTopic === saved.id) setSelectedTopic('all');
          if (!id) setSelectedTopic(saved.id);
          return saved;
        }}
        onDelete={async id => {
          await deleteTopic(id);
          if (selectedTopic === id) setSelectedTopic('all');
        }}
      />}
    </div>
  );
};
