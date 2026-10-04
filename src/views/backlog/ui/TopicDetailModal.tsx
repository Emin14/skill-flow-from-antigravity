'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import type { BacklogTopic, SaveBacklogTopicDto } from '@/entities/backlog';
import { lockBodyScroll, unlockBodyScroll } from '@/shared/lib/scrollLock';
import styles from './IdeaDetailModal.module.css';

export function TopicDetailModal({ topic, onClose, onSave }: {
  topic: BacklogTopic | null;
  onClose: () => void;
  onSave: (data: SaveBacklogTopicDto, id?: string) => Promise<BacklogTopic>;
}) {
  const [name, setName] = useState(topic?.name ?? '');
  const [description, setDescription] = useState(topic?.description ?? '');
  const [sortOrder, setSortOrder] = useState(String(topic?.sortOrder ?? 0));
  const [archived, setArchived] = useState(Boolean(topic?.archivedAt));
  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);
  const [error, setError] = useState('');
  const backdropRef = useRef(false);
  const close = () => { if (!savingRef.current) onClose(); };

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
          <label className={styles.formGroup}><span className={styles.label}>Порядок (меньшие числа — выше)</span><input type="number" step="1" className={styles.input} value={sortOrder} onChange={event => setSortOrder(event.target.value)} required /></label>
          {topic && <label><input type="checkbox" checked={archived} onChange={event => setArchived(event.target.checked)} /> В архиве — заметки сохраняются</label>}
          {error && <p role="alert">{error}</p>}
          <div className={styles.footerRight}>
            <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={close} disabled={isSaving}>Отмена</button>
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={isSaving || !name.trim()}>{isSaving ? 'Сохранение...' : topic ? 'Сохранить' : 'Создать тему'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
