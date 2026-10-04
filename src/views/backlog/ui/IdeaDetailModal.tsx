'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BacklogItem, BacklogTopic, BacklogStatus, BacklogPriority } from '@/entities/backlog/model/types';
import { extractLinkTitle } from '@/shared/lib/urlUtils';
import { useToastStore, LinksPreview } from '@/shared/ui';
import { lockBodyScroll, unlockBodyScroll } from '@/shared/lib/scrollLock';
import { X, Trash2, ArrowRight, Check, Wand2 } from 'lucide-react';
import styles from './IdeaDetailModal.module.css';
import { clearNoteDraft, readNoteDraft, writeNoteDraft, type NoteDraft } from './noteDraft';

interface IdeaDetailModalProps {
  isOpen: boolean;
  item: BacklogItem | null;
  existingTopics: BacklogTopic[];
  initialTopic?: string;
  onClose: () => void;
  onSave: (data: {
    topic: string;
    topicId?: string;
    title: string;
    description: string;
    status: BacklogStatus;
    priority: BacklogPriority;
    tags: string[];
    link: string;
  }) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onConvertToTask?: (id: string, draft: NoteDraft) => void;
}


function TopicCombobox({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = options.filter(o => o.toLowerCase().includes(value.toLowerCase()));
  const exactMatch = options.some(o => o.toLowerCase() === value.toLowerCase());

  return (
    <div ref={wrapperRef} className={styles.comboboxWrapper}>
      <input 
         type="text" 
         className={styles.input} 
         value={value} 
         onChange={e => onChange(e.target.value)}
         onFocus={() => setIsOpen(true)}
         placeholder="Выберите или введите новое..."
      />
      {isOpen && (filtered.length > 0 || !exactMatch) && (
         <div className={styles.dropdown}>
            {filtered.map(o => (
               <div key={o} className={styles.dropdownItem} onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(o);
                  setIsOpen(false);
               }}>
                 {o}
               </div>
            ))}
            {!exactMatch && value.trim() && (
               <div className={styles.dropdownItem} style={{ fontStyle: 'italic', color: 'var(--color-accent-text)' }} onMouseDown={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
               }}>
                 Новое: &quot;{value}&quot;
               </div>
            )}
         </div>
      )}
    </div>
  )
}

export const IdeaDetailModal: React.FC<IdeaDetailModalProps> = ({
  isOpen,
  item,
  existingTopics,
  initialTopic,
  onClose,
  onSave,
  onDelete,
  onConvertToTask,
}) => {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [topicId, setTopicId] = useState<string | undefined>();
      const [description, setDescription] = useState('');
  const [status, setStatus] = useState<BacklogStatus>('idea');
  const [priority, setPriority] = useState<BacklogPriority>('medium');
  const [tagsInput, setTagsInput] = useState('');
  const [link, setLink] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingTitle, setIsFetchingTitle] = useState(false);
  const isBackdropClickRef = useRef(false);
  const draftSessionRef = useRef<{ key: string; baseline: NoteDraft; skipWrite: boolean; completed: boolean } | null>(null);
  const [draftMessage, setDraftMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      lockBodyScroll();
    } else {
      unlockBodyScroll();
    }
    return () => {
      unlockBodyScroll();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      draftSessionRef.current = null;
      return;
    }
    const key = `backlog:note-draft:v1:${item?.id ?? 'new'}`;
    if (draftSessionRef.current?.key === key) return;
    const baseline: NoteDraft = {
      title: item?.title ?? '',
      topic: existingTopics.find(topic => topic.id === item?.topicId)?.name ?? item?.topic ?? initialTopic ?? 'Общее',
      topicId: item?.topicId ?? existingTopics.find(topic => topic.name === (initialTopic ?? 'Общее'))?.id,
      description: item?.description ?? '',
      status: item?.status ?? 'idea',
      priority: item?.priority ?? 'medium',
      tagsInput: item?.tags?.join(', ') ?? '',
      link: item?.link ?? '',
    };
    const restored = readNoteDraft(key);
    const draft = restored ?? baseline;
    draftSessionRef.current = { key, baseline, skipWrite: true, completed: false };
    setTitle(draft.title);
    setTopic(existingTopics.find(topic => topic.id === draft.topicId)?.name ?? draft.topic);
    setTopicId(draft.topicId ?? existingTopics.find(topic => topic.name === draft.topic)?.id);
    setDescription(draft.description);
    setStatus(draft.status);
    setPriority(draft.priority);
    setTagsInput(draft.tagsInput);
    setLink(draft.link);
    setDraftMessage(restored ? 'Черновик восстановлен' : '');
  }, [isOpen, item, existingTopics, initialTopic]);

  useEffect(() => {
    const session = draftSessionRef.current;
    if (!isOpen || !session || session.completed) return;
    // Initialization and persistence run in the same commit; skip the old form values.
    if (session.skipWrite) {
      session.skipWrite = false;
      return;
    }
    const draft: NoteDraft = { title, topic, topicId, description, status, priority, tagsInput, link };
    if (JSON.stringify(draft) === JSON.stringify(session.baseline)) {
      clearNoteDraft(session.key);
      setDraftMessage('');
      return;
    }
    const persisted = writeNoteDraft(session.key, draft);
    setDraftMessage(persisted
      ? 'Черновик сохранён на этом устройстве'
      : 'Черновик сохранён только до перезагрузки страницы');
  }, [isOpen, item?.id, title, topic, topicId, description, status, priority, tagsInput, link]);

  const clearCurrentDraft = () => {
    const session = draftSessionRef.current;
    if (session) {
      session.completed = true;
      clearNoteDraft(session.key);
    }
  };

  const handleFetchTitle = async () => {
    if (!link) return;
    setIsFetchingTitle(true);
    try {
      const fetchedTitle = await extractLinkTitle(link);
      if (fetchedTitle) {
        setTitle(fetchedTitle);
        useToastStore.getState().showToast('Заголовок успешно загружен', 'success');
      } else {
        useToastStore.getState().showToast('Не удалось получить заголовок', 'warning');
      }
    } finally {
      setIsFetchingTitle(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalTopic = topic.trim() || 'Общее';
    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    setIsSaving(true);
    try {
      await onSave({
        title: title.trim(),
        topic: finalTopic,
        topicId,
        description: description.trim(),
        status,
        priority,
        tags: parsedTags,
        link: link.trim(),
      });
      clearCurrentDraft();
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
        isBackdropClickRef.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (isBackdropClickRef.current && e.target === e.currentTarget) {
          onClose();
        }
        isBackdropClickRef.current = false;
      }}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h3 className={styles.title}>
            <span>{item ? '✏️ Редактирование заметки' : '💡 Новая заметка'}</span>
          </h3>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
                <form onSubmit={handleSubmit} className={styles.form}>
          {/* Title - FIRST FIELD */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Заголовок *</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Заголовок заметки..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Описание</label>
            <textarea
              className={styles.textarea}
              style={{ minHeight: '120px' }}
              placeholder="Детали, заметки, критерии готовности..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <LinksPreview text={description} />
          </div>

          {/* Category & Status Row */}
          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Направление</label>
              <TopicCombobox 
                value={topic} 
                onChange={value => {
                  setTopic(value);
                  setTopicId(existingTopics.find(topic => topic.name === value)?.id);
                }}
                options={existingTopics.filter(topic => !topic.archivedAt || topic.id === item?.topicId).map(topic => topic.name)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Статус</label>
              <select
                className={styles.select}
                value={status}
                onChange={(e) => setStatus(e.target.value as BacklogStatus)}
              >
                <option value="idea">💡 Новая заметка</option>
                <option value="planned">🚀 В планах</option>
                <option value="done">✅ Реализовано</option>
              </select>
            </div>
          </div>

          {/* Priority & Tags Row */}
          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Приоритет</label>
              <select
                className={styles.select}
                value={priority}
                onChange={(e) => setPriority(e.target.value as BacklogPriority)}
              >
                <option value="high">🔥 Высокий</option>
                <option value="medium">⚡ Средний</option>
                <option value="low">☕ Низкий</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Теги (через запятую)</label>
              <input
                type="text"
                className={styles.input}
                placeholder="UI, MVP, Backend"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>
          </div>

          {/* Link Row */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Полезная ссылка</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className={styles.input}
                style={{ flex: 1 }}
                placeholder="https://..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                style={{ padding: '0 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                onClick={handleFetchTitle}
                disabled={isFetchingTitle || !link}
                title="Автоматически получить название по ссылке"
                aria-label="Автоматически получить название по ссылке"
              >
                <Wand2 size={14} />
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className={`${styles.footer} ${!item ? styles.footerCentered : ''}`}>
            {item && onDelete && (
              <button
                type="button"
                className={`${styles.btn} ${styles.btnDanger}`}
                onClick={async () => {
                  if (confirm('Удалить эту заметку из бэклога?')) {
                    await onDelete(item.id);
                    clearCurrentDraft();
                    onClose();
                  }
                }}
              >
                <Trash2 size={14} />
                <span>Удалить</span>
              </button>
            )}

            <div className={styles.footerRight}>
              {item && onConvertToTask && item.status !== 'done' && (
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnConvert}`}
                  onClick={() => {
                    onConvertToTask(item.id, { title, topic, topicId, description, status, priority, tagsInput, link });
                  }}
                  disabled={isSaving || !title.trim()}
                  title="Открыть форму создания задачи"
                >
                  <ArrowRight size={14} />
                  <span>В задачу</span>
                </button>
              )}

              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={onClose}
              >
                Закрыть
              </button>

              <button
                type="submit"
                className={`${styles.btn} ${styles.btnPrimary}`}
                disabled={isSaving || !title.trim()}
              >
                <Check size={14} />
                <span>{item ? 'Сохранить' : 'Создать'}</span>
              </button>
            </div>
          </div>
          {draftMessage && <p role="status" style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-muted)' }}>{draftMessage}</p>}
        </form>
      </div>
    </div>
  );
};
