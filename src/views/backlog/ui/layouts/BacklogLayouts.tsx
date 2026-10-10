'use client';

import React, { useState, useRef } from 'react';
import type { BacklogItem, BacklogTopic, BacklogPriority, BacklogStatus } from '@/entities/backlog/model/types';
import {
  ArrowRight,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Inbox,
  Plus,
  Edit2,
  Pin,
  PinOff,
  ExternalLink,
} from 'lucide-react';
import styles from './BacklogLayouts.module.css';
import { isNotePinned, sortBacklogItems, type BacklogSortMode } from '../backlogSorting';

export interface LayoutProps {
  items: BacklogItem[];
  topics: BacklogTopic[];
  searchQuery?: string;
  hideEmptyGroups?: boolean;
  onEditTopic?: (topic: BacklogTopic) => void;
  sortMode?: BacklogSortMode;
  onPin?: (item: BacklogItem) => Promise<void>;
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
  if (s === 'idea') return 'Новая заметка';
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
  topic: BacklogTopic;
  list: BacklogItem[];
  done: number;
  active: number;
}

function topicGroups(items: BacklogItem[], topics: BacklogTopic[], sortMode: BacklogSortMode): TopicGroup[] {
  return topics.map((t) => {
    const list = items.filter((i) => i.topicId === t.id);
    const sortedList = sortBacklogItems(list, sortMode);
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
    } else if (keys.length === 1 && (prev.length !== 1 || prev[0] !== keys[0])) {
      setOpen(keys);
    } else {
      const added = keys.filter(key => !prev.includes(key));
      if (added.length) setOpen(current => [...new Set([...current, ...added])]);
    }
    prevKeysRef.current = keys;
  }, [keys, defaultOpen]);

  const toggle = (k: string) => setOpen((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));
  return { open, toggle };
}

/* ───────── Темы · Классика ───────── */


function BacklogItemRow({ item, props }: { item: BacklogItem, props: LayoutProps }) {
  const [isPinning, setIsPinning] = useState(false);
  const suppressClickRef = useRef(false);
  const pinPendingRef = useRef(false);
  const pinned = isNotePinned(item);
  const trimmedLink = item.link?.trim();
  const formattedLink = trimmedLink ? (/^(https?:\/\/|mailto:)/i.test(trimmedLink) ? trimmedLink : `https://${trimmedLink}`) : null;
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isVerticalScroll, setIsVerticalScroll] = useState(false);
  const [isSwipedLeft, setIsSwipedLeft] = useState(false);
  const closeActions = () => { setSwipeOffset(0); setIsSwipedLeft(false); };
  const handlePin = async () => {
    if (pinPendingRef.current || !props.onPin) return;
    pinPendingRef.current = true;
    setIsPinning(true);
    try { await props.onPin(item); closeActions(); }
    finally { pinPendingRef.current = false; setIsPinning(false); }
  };
  
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
    if (Math.abs(diffX) > 10) suppressClickRef.current = true;

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
      setSwipeOffset(Math.max(-100, Math.min(80, -diffX)));
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX === null) return;
    setTouchStartX(null);
    setTouchStartY(null);

    if (suppressClickRef.current) window.setTimeout(() => { suppressClickRef.current = false; }, 350);
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
          <button type="button" onClick={event => { event.stopPropagation(); void handlePin(); }} disabled={isPinning}
            title={pinned ? 'Открепить заметку' : 'Закрепить заметку'} aria-label={pinned ? 'Открепить заметку' : 'Закрепить заметку'}
            className={styles.swipePinBtn}>{pinned ? <PinOff size={16} /> : <Pin size={16} />}</button>
          <button type="button" title="Удалить заметку" aria-label="Удалить заметку" onClick={(e) => { e.stopPropagation(); if(confirm('Удалить заметку?')) { props.onDelete(item.id); closeActions(); } }} className={styles.swipeDeleteBtn}><Trash2 size={16} /></button>
        </div>
      )}
      
      <div 
        className={`${styles.folderRow} ${item.status === 'done' ? styles.folderRowDone : ''}`} 
        onClick={() => {
          if (suppressClickRef.current) return;
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
        onTouchCancel={() => { closeActions(); setTouchStartX(null); setTouchStartY(null); suppressClickRef.current = false; }}
        style={{ transform: `translateX(${swipeOffset}px)`, transition: touchStartX ? 'none' : 'transform 0.2s ease' }}
      >
        <div className={styles.rowContent}>
          <div className={styles.rowTop}>
            <span className={styles.rowEmoji}>{statusEmoji}</span>
            <span className={styles.folderTitle}>{item.title}</span>
            {formattedLink && (
              <a
                href={formattedLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                onTouchStart={e => e.stopPropagation()}
                className={styles.externalLink}
                title={`Открыть ссылку: ${formattedLink}`}
                aria-label={`Открыть ссылку: ${item.title}`}
              >
                <ExternalLink size={12} />
              </a>
            )}
            {props.onPin && pinned && (
              <button
                type="button"
                className={`${styles.pinBtn} ${pinned ? styles.pinBtnActive : ''}`}
                title={pinned ? 'Открепить заметку' : 'Закрепить заметку'}
                aria-label={pinned ? 'Открепить заметку' : 'Закрепить заметку'}
                aria-pressed={pinned}
                disabled={isPinning}
                onTouchStart={e => e.stopPropagation()}
                onClick={e => {
                  e.stopPropagation();
                  void handlePin();
                }}
              >
                {pinned ? <PinOff size={14} /> : <Pin size={14} />}
              </button>
            )}
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
  const isOpen = open.includes(g.topic.id);
  return (
    <section className={styles.folder}>
      <div className={styles.folderHead} onClick={() => toggle(g.topic.id)}>
        <span className={styles.folderIcon}>{g.topic.archivedAt ? '🗃️' : '📁'}</span>
        <strong>{g.topic.name}</strong>
        {props.onEditTopic && <button type="button" className={styles.renameBtn}
          onClick={event => { event.stopPropagation(); props.onEditTopic?.(g.topic); }}
          title="Редактировать тему" aria-label={`Редактировать тему ${g.topic.name}`}>
          <Edit2 size={14} />
        </button>}
        <span className={styles.folderTotalCount}>{g.list.length}</span>
        <span className={styles.folderCaret}>{isOpen ? '▾' : '▸'}</span>
      </div>
      {isOpen && <div className={styles.folderBody}>
        {g.topic.description && <p className={styles.topicDescription}>{g.topic.description}</p>}
        {g.topic.archivedAt && <span className={styles.more}>Тема в архиве</span>}
        {g.list.map(item => <BacklogItemRow key={item.id} item={item} props={props} />)}
        {g.list.length === 0 && <span className={styles.more}>Нет заметок в теме</span>}
        {!g.topic.archivedAt && props.onOpenCreate && <button type="button" className={styles.inlineAddTrigger} onClick={() => props.onOpenCreate?.(g.topic.id)}>
          <Plus size={14} /><span>Новая заметка в эту тему...</span>
        </button>}
      </div>}
    </section>
  );
}

export function TopicsClassicView(props: LayoutProps) {
  const { items, topics } = props;
  const groups = topicGroups(items, topics, props.sortMode ?? 'updated-desc').filter(group => !props.hideEmptyGroups || group.list.length > 0);
  const { open, toggle } = useOpenSections(topics.map(topic => topic.id), 3);
  const [searchSections, setSearchSections] = useState<{ query: string; closed: string[] }>({ query: '', closed: [] });
  const query = props.searchQuery ?? '';
  // A new query reveals every matching group without changing normal browsing's open state.
  const visibleOpen = query
    ? topics.map(topic => topic.id).filter(id => searchSections.query !== query || !searchSections.closed.includes(id))
    : open;
  const toggleSection = (topic: string) => {
    if (!query) {
      toggle(topic);
      setSearchSections({ query: '', closed: [] });
      return;
    }
    setSearchSections(previous => ({
      query,
      closed: previous.query !== query ? [topic] : previous.closed.includes(topic)
        ? previous.closed.filter(key => key !== topic)
        : [...previous.closed, topic],
    }));
  };

  if (!topics.length) return <Empty />;

  return (
    <div className={styles.folders}>
      {groups.map((g) => (
        <TopicFolder key={g.topic.id} g={g} props={props} open={visibleOpen} toggle={toggleSection} />
      ))}
    </div>
  );
}
