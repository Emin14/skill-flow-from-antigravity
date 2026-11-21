'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import type { BacklogTopic, SaveBacklogTopicDto } from '@/entities/backlog';
import { ConfirmDialog } from '@/shared/ui';
import { lockBodyScroll, unlockBodyScroll } from '@/shared/lib/scrollLock';
import styles from './IdeaDetailModal.module.css';

export function TopicDetailModal({ topic, onClose, onSave, onDelete, topicItemCount = 0, onArchive }: {
  topic: BacklogTopic | null;
  onClose: () => void;
  onSave: (data: SaveBacklogTopicDto, id?: string) => Promise<BacklogTopic>;
  onDelete?: (id: string) => Promise<void>;
  /** Notes currently in the topic — the API refuses to delete a topic that has any. */
  topicItemCount?: number;
  /** "Archive instead" escape hatch in the delete dialog. */
  onArchive?: () => void;
}) {
  const [name, setName] = useState(topic?.name ?? '');
  const [description, setDescription] = useState(topic?.description ?? '');
  const [sortOrder, setSortOrder] = useState(String(topic?.sortOrder ?? 0));
  const [archived, setArchived] = useState(Boolean(topic?.archivedAt));
  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);
  const [error, setError] = useState('');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const backdropRef = useRef(false);
  const close = () => { if (!savingRef.current) onClose(); };
  const isDeleteBlocked = topicItemCount > 0;

  useEffect(() => {
    lockBodyScroll();
    const keyDown = (event: KeyboardEvent) => { if (event.key === 'Escape' && !savingRef.current) onClose(); };
    window.addEventListener('keydown', keyDown);
    return () => { unlockBodyScroll(); window.removeEventListener('keydown', keyDown); };
  }, [onClose]);

  return (
    <div className={styles.overlay} onMouseDown={event => { backdropRef.current = event.target === event.currentTarget; }} onClick={event => {
      if (backdropRef.current && event.target === event.currentTarget) close();
      backdropRef.current = false;
    }}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="topic-modal-title">
        <div className={styles.header}>
          <h3 id="topic-modal-title" className={styles.title}>{topic ? 'Редактирование темы' : 'Новая тема'}</h3>
          <button type="button" className={styles.closeBtn} onClick={close} disabled={isSaving} aria-label="Закрыть"><X size={18} /></button>
        </div>
        <form className={styles.form} onSubmit={async event => {
          event.preventDefault();
          if (savingRef.current || !name.trim()) return;
          const order = Number(sortOrder);
          if (!sortOrder.trim() || !Number.isInteger(order) || order < -2147483648 || order > 2147483647) { setError('Порядок должен быть целым числом'); return; }
          savingRef.current = true; setIsSaving(true); setError('');
          try { await onSave({ name: name.trim(), description, sortOrder: order, archived }, topic?.id); onClose(); }
          catch (error) { setError(error instanceof Error ? error.message : 'Не удалось сохранить тему'); }
          finally { savingRef.current = false; setIsSaving(false); }
        }}>
          <label className={styles.formGroup}><span className={styles.label}>Название *</span><input className={styles.input} value={name} onChange={event => setName(event.target.value)} autoFocus required /></label>
          <label className={styles.formGroup}><span className={styles.label}>Описание</span><textarea className={styles.textarea} value={description} onChange={event => setDescription(event.target.value)} /></label>
          <label className={styles.formGroup}><span className={styles.label}>Позиция в списке (чем меньше число, тем выше тема)</span><input type="number" step="1" className={styles.input} value={sortOrder} onChange={event => setSortOrder(event.target.value)} required /></label>
          {topic && <label><input type="checkbox" checked={archived} onChange={event => setArchived(event.target.checked)} /> В архиве</label>}
          {error && <p role="alert">{error}</p>}
          <div className={styles.footer}>
            {topic && onDelete && <button type="button" className={`${styles.btn} ${styles.btnDanger}`} disabled={isSaving} onClick={() => setIsDeleteOpen(true)}><Trash2 size={14} /><span>Удалить тему</span></button>}
            <div className={styles.footerRight}>
            <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={close} disabled={isSaving}>Отмена</button>
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={isSaving || !name.trim()}>{isSaving ? 'Сохранение...' : topic ? 'Сохранить' : 'Создать тему'}</button>
            </div>
          </div>
        </form>
      </div>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title={`Удалить тему «${topic?.name ?? ''}»?`}
        description={isDeleteBlocked
          ? `В теме ${topicItemCount} ${topicItemCount === 1 ? 'заметка' : topicItemCount < 5 ? 'заметки' : 'заметок'}. Сначала перенесите ${topicItemCount === 1 ? 'её' : 'их'} в другую тему или отправьте тему в архив — так ничего не потеряется.`
          : 'Тема пуста, удаление не затронет заметки. Отменить это действие нельзя.'}
        confirmLabel="Удалить тему"
        pendingLabel="Удаление…"
        isPending={isSaving}
        confirmDisabled={isDeleteBlocked}
        alternativeAction={isDeleteBlocked && onArchive ? { label: 'В архив', onClick: onArchive } : undefined}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={async () => {
          if (!topic) return;
          savingRef.current = true;
          setIsSaving(true);
          setError('');
          try {
            await onDelete?.(topic.id);
            setIsDeleteOpen(false);
            onClose();
          } catch (error) {
            setIsDeleteOpen(false);
            setError(error instanceof Error ? error.message : 'Не удалось удалить тему');
          } finally {
            savingRef.current = false;
            setIsSaving(false);
          }
        }}
      />
    </div>
  );
}
