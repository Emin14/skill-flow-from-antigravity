'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BacklogItem, BacklogStatus, BacklogPriority } from '@/entities/backlog/model/types';
import { extractLinkTitle } from '@/shared/lib/urlUtils';
import { useToastStore, LinksPreview } from '@/shared/ui';
import { lockBodyScroll, unlockBodyScroll } from '@/shared/lib/scrollLock';
import { X, Trash2, ArrowRight, Check, Wand2 } from 'lucide-react';
import styles from './IdeaDetailModal.module.css';

interface IdeaDetailModalProps {
  isOpen: boolean;
  item: BacklogItem | null;
  existingTopics: string[];
  initialTopic?: string;
  onClose: () => void;
  onSave: (data: {
    topic: string;
    title: string;
    description: string;
    status: BacklogStatus;
    priority: BacklogPriority;
    tags: string[];
    link: string;
  }) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onConvertToTask?: (id: string) => Promise<void>;
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
                 Новое: "{value}"
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
      const [description, setDescription] = useState('');
  const [status, setStatus] = useState<BacklogStatus>('idea');
  const [priority, setPriority] = useState<BacklogPriority>('medium');
  const [tagsInput, setTagsInput] = useState('');
  const [link, setLink] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingTitle, setIsFetchingTitle] = useState(false);
  const isBackdropClickRef = useRef(false);

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
    if (!isOpen) return;

    if (item) {
      setTitle(item.title);
      setTopic(item.topic);
      setDescription(item.description || '');
      setStatus(item.status);
      setPriority(item.priority || 'medium');
      setTagsInput(item.tags ? item.tags.join(', ') : '');
      setLink(item.link || '');
    } else {
      const defaultTopic = initialTopic || (existingTopics.length > 0 ? existingTopics[0] : 'Общее');
      setTitle('');
      setTopic(defaultTopic);
      setDescription('');
      setStatus('idea');
      setPriority('medium');
      setTagsInput('');
      setLink('');
    }
  }, [isOpen, item, existingTopics, initialTopic]);

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
        description: description.trim(),
        status,
        priority,
        tags: parsedTags,
        link: link.trim(),
      });
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
            <span>{item ? '✏️ Редактирование идеи' : '💡 Новая заметка'}</span>
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

          {/* Category & Status Row */}
          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Направление</label>
              <TopicCombobox 
                value={topic} 
                onChange={setTopic} 
                options={existingTopics} 
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Статус</label>
              <select
                className={styles.select}
                value={status}
                onChange={(e) => setStatus(e.target.value as BacklogStatus)}
              >
                <option value="idea">💡 Свежая мысль</option>
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
                style={{ padding: '0 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={handleFetchTitle}
                disabled={isFetchingTitle || !link}
                title="Автоматически получить название по ссылке"
              >
                <Wand2 size={16} />
                <span>Загрузить название</span>
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className={styles.footer}>
            {item && onDelete && (
              <button
                type="button"
                className={`${styles.btn} ${styles.btnDanger}`}
                onClick={async () => {
                  if (confirm('Удалить эту идею из бэклога?')) {
                    await onDelete(item.id);
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
                  onClick={async () => {
                    await onConvertToTask(item.id);
                    onClose();
                  }}
                  title="Создать задачу на сегодня в основном трекере"
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
                Отмена
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
        </form>
      </div>
    </div>
  );
};
