'use client';

import React, { useState, useRef } from 'react';
import type { BacklogItem, BacklogPriority, BacklogStatus } from '@/entities/backlog/model/types';
import {
  ArrowRight,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Inbox,
  Plus,
  Edit2,
  Check,
  X,
} from 'lucide-react';
import styles from './BacklogLayouts.module.css';

export interface LayoutProps {
  items: BacklogItem[];
  topics: string[];
  totalCount: number;
  onEdit: (item: BacklogItem) => void;
  onDelete: (id: string) => void;
  onConvert: (id: string) => void;
  onStatus: (id: string, status: BacklogStatus) => void;
  onTopic: (id: string, topic: string) => void;
  onPriority: (id: string, priority: BacklogPriority) => void;
  onOpenCreate?: (topic: string) => void;
  onRenameTopic?: (oldTopic: string, newTopic: string) => Promise<void>;
}

const STATUS_ORDER: BacklogStatus[] = ['idea', 'planned', 'done'];

function nextStatus(s: BacklogStatus): BacklogStatus | null {
  const i = STATUS_ORDER.indexOf(s);
  return i < STATUS_ORDER.length - 1 ? STATUS_ORDER[i + 1] : null;
}
function prevStatus(s: BacklogStatus): BacklogStatus | null {
  const i = STATUS_ORDER.indexOf(s);
  return i > 0 ? STATUS_ORDER[i - 1] : null;
}

function prioClass(p?: string | null) {
  if (p === 'high') return styles.prioHigh;
  if (p === 'low') return styles.prioLow;
  return styles.prioMed;
}
function prioLabel(p?: string | null) {
  if (p === 'high') return 'Высокий';
  if (p === 'low') return 'Низкий';
  return 'Средний';
}
function statusLabel(s: BacklogStatus) {
  if (s === 'idea') return 'Мысль';
  if (s === 'planned') return 'В планах';
  return 'Готово';
}

const Stop = (e: React.MouseEvent) => e.stopPropagation();

function RowActions({ item, onConvert, onDelete, onStatus }: LayoutProps & { item: BacklogItem }) {
  const n = nextStatus(item.status);
  const p = prevStatus(item.status);
  return (
    <span className={styles.rowActions} onClick={Stop}>
      {p && (
        <button type="button" className={styles.miniBtn} title="Шаг назад" onClick={() => onStatus(item.id, p)}>
          <ChevronLeft size={13} />
        </button>
      )}
      {n && item.status !== 'done' && (
        <button type="button" className={styles.miniBtn} title={`Вперёд: ${statusLabel(n)}`} onClick={() => onStatus(item.id, n)}>
          <ChevronRight size={13} />
        </button>
      )}
      {item.status === 'idea' && (
        <button type="button" className={`${styles.miniBtn} ${styles.miniBtnAccent}`} title="В задачу" onClick={() => onConvert(item.id)}>
          <ArrowRight size={13} />
        </button>
      )}
      <button type="button" className={`${styles.miniBtn} ${styles.miniBtnDanger}`} title="Удалить" onClick={() => onDelete(item.id)}>
        <Trash2 size={13} />
      </button>
    </span>
  );
}

function Empty({ text = 'В этой проекции пока пусто' }: { text?: string }) {
  return (
    <div className={styles.empty}>
      <Inbox size={22} />
      <p>{text}</p>
    </div>
  );
}

export interface TopicGroup {
  topic: string;
  list: BacklogItem[];
  done: number;
  active: number;
}

function topicGroups(items: BacklogItem[], topics: string[]): TopicGroup[] {
  return topics.map((t) => {
    const list = items.filter((i) => i.topic === t);
    const sortedList = [...list].sort((a, b) => {
      if (a.status === 'done' && b.status !== 'done') return 1;
      if (a.status !== 'done' && b.status === 'done') return -1;
      return 0;
    });
    return {
      topic: t,
      list: sortedList,
      done: list.filter((i) => i.status === 'done').length,
      active: list.filter((i) => i.status !== 'done').length,
    };
  });
}

function useOpenSections(keys: string[], defaultOpen: number) {
  const initialKeys = keys.slice(0, defaultOpen);
  const [open, setOpen] = useState<string[]>(initialKeys);

  // Sync when keys first arrive (empty → populated)
  const prevKeysRef = React.useRef<string[]>([]);
  React.useEffect(() => {
    const prev = prevKeysRef.current;
    if (prev.length === 0 && keys.length > 0) {
      setOpen(keys.slice(0, defaultOpen));
    }
    prevKeysRef.current = keys;
  }, [keys, defaultOpen]);

  const toggle = (k: string) => setOpen((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));
  return { open, toggle };
}

/* ───────── Темы · Классика ───────── */


function BacklogItemRow({ item, props }: { item: BacklogItem, props: LayoutProps }) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isVerticalScroll, setIsVerticalScroll] = useState(false);
  const [isSwipedLeft, setIsSwipedLeft] = useState(false);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
    setIsVerticalScroll(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = touchStartX - currentX;
    const diffY = touchStartY - currentY;

    if (!isVerticalScroll && Math.abs(diffY) > 10 && Math.abs(diffY) > Math.abs(diffX)) {
      setIsVerticalScroll(true);
      setSwipeOffset(0);
      return;
    }

    if (isVerticalScroll) return;

    if (isSwipedLeft) {
      const newOffset = Math.min(0, Math.max(-100, -100 - diffX));
      setSwipeOffset(newOffset);
    } else {
      if (diffX > 0 && diffX <= 100) {
        setSwipeOffset(-diffX); // swiping left
      } else if (diffX < 0 && diffX >= -80) {
        setSwipeOffset(-diffX); // swiping right
      }
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX === null) return;
    setTouchStartX(null);
    setTouchStartY(null);

    if (!isVerticalScroll) {
      if (isSwipedLeft) {
        if (swipeOffset > -50) {
          setIsSwipedLeft(false);
          setSwipeOffset(0);
        } else {
          setSwipeOffset(-100);
        }
      } else {
        if (swipeOffset < -50) { // swiped left enough
          setIsSwipedLeft(true);
          setSwipeOffset(-100);
        } else if (swipeOffset > 45) { // swiped right enough
          setSwipeOffset(0);
          props.onConvert(item.id);
        } else {
          setIsSwipedLeft(false);
          setSwipeOffset(0);
        }
      }
    }
  };

  const statusEmoji = item.status === 'idea' ? '💡' : item.status === 'planned' ? '🚀' : '✅';
  const prioEmoji = item.priority === 'high' ? '🔥' : item.priority === 'medium' ? '⚡' : '☕';

  return (
    <div className={styles.swipeContainer}>
      {swipeOffset > 0 && (
        <div className={styles.swipeRightAction}>
          <ArrowRight size={16} />
          <span>В задачу</span>
        </div>
      )}
      {(swipeOffset < 0 || isSwipedLeft) && (
        <div className={styles.swipeLeftActions}>
          <button onClick={(e) => { e.stopPropagation(); props.onEdit(item); setSwipeOffset(0); setIsSwipedLeft(false); }} className={styles.swipeEditBtn}>Редакт.</button>
          <button onClick={(e) => { e.stopPropagation(); if(confirm('Удалить?')) props.onDelete(item.id); }} className={styles.swipeDeleteBtn}><Trash2 size={16} /></button>
        </div>
      )}
      
      <div 
        className={`${styles.folderRow} ${item.status === 'done' ? styles.folderRowDone : ''}`} 
        onClick={() => {
          if (swipeOffset !== 0 || isSwipedLeft) {
             setSwipeOffset(0);
             setIsSwipedLeft(false);
             return;
          }
          props.onEdit(item);
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ transform: `translateX(${swipeOffset}px)`, transition: touchStartX ? 'none' : 'transform 0.2s ease' }}
      >
        <div className={styles.rowContent}>
          <div className={styles.rowTop}>
            <span className={styles.rowEmoji}>{statusEmoji}</span>
            <span className={styles.folderTitle}>{item.title}</span>
            <span className={styles.rowEmoji}>{prioEmoji}</span>
          </div>
          {(item.description || (item.tags && item.tags.length > 0)) && (
            <div className={styles.rowBottom}>
              {item.tags && item.tags.length > 0 && (
                <span className={styles.rowTags}>
                  {item.tags.map(t => '#' + t).join(' ')}
                </span>
              )}
              {item.description && (
                <span className={styles.rowDesc}>
                  {item.description}
                </span>
              )}
            </div>
          )}
        </div>
        
              </div>
    </div>
  );
}

function TopicFolder({ g, props, open, toggle }: { g: TopicGroup, props: LayoutProps, open: string[], toggle: (k: string) => void }) {
  const isOpen = open.includes(g.topic);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(g.topic);

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newName = editValue.trim();
    if (newName && newName !== g.topic && props.onRenameTopic) {
      await props.onRenameTopic(g.topic, newName);
    }
    setIsEditing(false);
  };

  return (
    <section className={styles.folder}>
      <div className={styles.folderHead} onClick={() => !isEditing && toggle(g.topic)}>
        <span className={styles.folderIcon}>📁</span>
        
        {isEditing ? (
          <form className={styles.renameForm} onSubmit={handleRenameSubmit} onClick={e => e.stopPropagation()}>
            <input 
              autoFocus 
              className={styles.renameInput} 
              value={editValue} 
              onChange={e => setEditValue(e.target.value)} 
              onKeyDown={e => { if (e.key === 'Escape') setIsEditing(false); }}
            />
            <button type="submit" className={styles.renameConfirmBtn} title="Сохранить"><Check size={14} /></button>
            <button type="button" className={styles.renameCancelBtn} onClick={() => setIsEditing(false)} title="Отмена"><X size={14} /></button>
          </form>
        ) : (
          <>
            <strong>{g.topic}</strong>
            {props.onRenameTopic && (
              <button 
                type="button" 
                className={styles.renameBtn} 
                onClick={(e) => { e.stopPropagation(); setIsEditing(true); setEditValue(g.topic); }}
                title="Переименовать направление"
              >
                <span style={{ fontSize: '14px' }}>✏️</span>
              </button>
            )}
          </>
        )}

        
        <span className={styles.folderCaret}>{isOpen ? '▾' : '▸'}</span>
      </div>
      
      {isOpen && (
        <div className={styles.folderBody}>
          {g.list.map((item) => (
            <BacklogItemRow key={item.id} item={item} props={props} />
          ))}
          {g.list.length === 0 && <span className={styles.more}>Нет заметок в теме</span>}
          
          {props.onOpenCreate && (
            <button type="button" className={styles.inlineAddTrigger} onClick={() => props.onOpenCreate && props.onOpenCreate(g.topic)}>
              <Plus size={14} />
              <span>Новая заметка в эту тему...</span>
            </button>
          )}
        </div>
      )}
    </section>
  );
}

export function TopicsClassicView(props: LayoutProps) {
  const { items, topics } = props;
  const groups = topicGroups(items, topics);
  const { open, toggle } = useOpenSections(topics, 3);

  if (!topics.length) return <Empty />;

  return (
    <div className={styles.folders}>
      {groups.map((g) => (
        <TopicFolder key={g.topic} g={g} props={props} open={open} toggle={toggle} />
      ))}
    </div>
  );
}
