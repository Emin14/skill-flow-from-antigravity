'use client';

import React, { useState, useEffect } from 'react';
import { BacklogItem, BacklogStatus, BacklogPriority } from '@/entities/backlog/model/types';
import { extractLinkTitle } from '@/shared/lib/urlUtils';
import { useToastStore, LinksPreview } from '@/shared/ui';
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
  const [isCustomTopic, setIsCustomTopic] = useState(false);
  const [customTopic, setCustomTopic] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<BacklogStatus>('idea');
  const [priority, setPriority] = useState<BacklogPriority>('medium');
  const [tagsInput, setTagsInput] = useState('');
  const [link, setLink] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isFetchingTitle, setIsFetchingTitle] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (item) {
      setTitle(item.title);
      setTopic(item.topic);
      setIsCustomTopic(!existingTopics.includes(item.topic));
      setCustomTopic(item.topic);
      setDescription(item.description || '');
      setStatus(item.status);
      setPriority(item.priority || 'medium');
      setTagsInput(item.tags ? item.tags.join(', ') : '');
      setLink(item.link || '');
    } else {
      const defaultTopic = initialTopic || (existingTopics.length > 0 ? existingTopics[0] : 'Общее');
      setTitle('');
      setTopic(defaultTopic);
      setIsCustomTopic(false);
      setCustomTopic('');
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

    const finalTopic = isCustomTopic ? (customTopic.trim() || 'Общее') : topic;
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

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h3 className={styles.title}>
            <span>{item ? '✏️ Редактирование идеи' : '💡 Новая идея'}</span>
          </h3>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Topic Selector */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Тема / Приложение</label>
            {!isCustomTopic ? (
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  className={styles.select}
                  style={{ flex: 1 }}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                >
                  {existingTopics.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => {
                    setIsCustomTopic(true);
                    setCustomTopic('');
                  }}
                  title="Создать новую тему"
                >
                  + Новая
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className={styles.input}
                  style={{ flex: 1 }}
                  placeholder="Например: Сайт заказа продуктов"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  autoFocus
                />
                {existingTopics.length > 0 && (
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() => setIsCustomTopic(false)}
                  >
                    Выбрать из списка
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Title */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Суть идеи / фичи *</label>
            <input
              type="text"
              className={styles.input}
              placeholder="Например: Сделать повтор заказа из истории в 1 клик"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Status & Priority Row */}
          <div className={styles.grid2}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Статус</label>
              <select
                className={styles.select}
                value={status}
                onChange={(e) => setStatus(e.target.value as BacklogStatus)}
              >
                <option value="idea">💡 Свежая мысль</option>
                <option value="backlog">📋 В бэклоге</option>
                <option value="planned">🚀 В планах</option>
                <option value="done">✅ Реализовано</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Приоритет / Польза</label>
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
          </div>

          {/* Description / Notes */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Заметки, логика и детали</label>
            <textarea
              className={styles.textarea}
              placeholder="Опишите, как фича должна работать, критерии готовности, полезные мысли..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <LinksPreview text={description} />
          </div>

          {/* Tags & Link Row */}
          <div className={styles.grid2}>
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

            <div className={styles.formGroup}>
              <label className={styles.label}>Ссылка на макет / референс</label>
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
                  style={{ padding: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={handleFetchTitle}
                  disabled={isFetchingTitle || !link}
                  title="Автоматически получить название по ссылке"
                >
                  <Wand2 size={16} />
                </button>
              </div>
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
                <span>{item ? 'Сохранить' : 'Добавить'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
