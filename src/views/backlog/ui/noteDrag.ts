'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface NoteDropTarget {
  /** Topic the pointer is over. */
  topicId: string;
  /** Insert position among that topic's notes; null means "append". */
  index: number | null;
}

interface DragSession {
  id: string;
  fromTopicId: string;
  startX: number;
  startY: number;
  active: boolean;
}

/**
 * Pointer-based drag for backlog notes. Pointer events (not HTML5 DnD) because
 * the rows already own touch gestures for swipe actions, and because a custom
 * ghost behaves the same on desktop and touch.
 */
export function useNoteDrag(onDrop: (id: string, fromTopicId: string, target: NoteDropTarget) => void) {
  const sessionRef = useRef<DragSession | null>(null);
  const ghostRef = useRef<HTMLElement | null>(null);
  const highlightedRef = useRef<HTMLElement | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overTopicId, setOverTopicId] = useState<string | null>(null);

  const clearHighlight = useCallback(() => {
    const el = highlightedRef.current;
    if (el) {
      el.style.outline = '';
      el.style.boxShadow = '';
      el.style.borderRadius = '';
      highlightedRef.current = null;
    }
  }, []);

  const cleanup = useCallback(() => {
    ghostRef.current?.remove();
    ghostRef.current = null;
    clearHighlight();
    sessionRef.current = null;
    setDraggingId(null);
    setOverTopicId(null);
  }, [clearHighlight]);

  useEffect(() => cleanup, [cleanup]);

  const start = useCallback((event: React.PointerEvent, id: string, fromTopicId: string, title: string) => {
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    event.preventDefault();
    event.stopPropagation();

    sessionRef.current = { id, fromTopicId, startX: event.clientX, startY: event.clientY, active: false };

    const move = (moveEvent: PointerEvent) => {
      const session = sessionRef.current;
      if (!session) return;

      if (!session.active) {
        // A few pixels of slack so a tap on the grip still opens nothing and a
        // scroll gesture is not mistaken for a drag.
        const distance = Math.hypot(moveEvent.clientX - session.startX, moveEvent.clientY - session.startY);
        if (distance < 8) return;
        session.active = true;
        setDraggingId(session.id);
        const ghost = document.createElement('div');
        ghost.style.cssText = [
          'position:fixed', 'z-index:99999', 'pointer-events:none',
          'padding:6px 12px', 'border-radius:10px', 'font-size:12.5px', 'font-weight:600',
          'background:rgba(30,41,59,0.96)', 'border:1px solid rgba(99,102,241,0.8)',
          'color:#f8fafc', 'box-shadow:0 10px 28px rgba(0,0,0,0.5)',
          'max-width:260px', 'overflow:hidden', 'text-overflow:ellipsis', 'white-space:nowrap',
        ].join(';');
        ghost.textContent = title.length > 40 ? `${title.slice(0, 40)}…` : title;
        document.body.appendChild(ghost);
        ghostRef.current = ghost;
      }

      if (ghostRef.current) {
        ghostRef.current.style.left = `${moveEvent.clientX + 12}px`;
        ghostRef.current.style.top = `${moveEvent.clientY + 12}px`;
      }

      const under = document.elementFromPoint(moveEvent.clientX, moveEvent.clientY) as HTMLElement | null;
      const noteEl = under?.closest('[data-note-id]') as HTMLElement | null;
      const topicEl = under?.closest('[data-topic-drop]') as HTMLElement | null;
      const targetEl = noteEl ?? topicEl;

      if (highlightedRef.current && highlightedRef.current !== targetEl) clearHighlight();
      if (targetEl && targetEl !== highlightedRef.current) {
        highlightedRef.current = targetEl;
        targetEl.style.outline = '2px solid var(--color-accent)';
        targetEl.style.boxShadow = '0 0 0 3px var(--color-accent-light)';
        targetEl.style.borderRadius = '8px';
      }
      setOverTopicId(topicEl?.getAttribute('data-topic-drop') ?? noteEl?.getAttribute('data-note-topic') ?? null);
    };

    const finish = (upEvent: PointerEvent, commit: boolean) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel);
      const session = sessionRef.current;
      if (!session) return;

      if (commit && session.active) {
        const under = document.elementFromPoint(upEvent.clientX, upEvent.clientY) as HTMLElement | null;
        const noteEl = under?.closest('[data-note-id]') as HTMLElement | null;
        const topicEl = under?.closest('[data-topic-drop]') as HTMLElement | null;

        if (noteEl) {
          const targetTopicId = noteEl.getAttribute('data-note-topic');
          const targetId = noteEl.getAttribute('data-note-id');
          if (targetTopicId && targetId && targetId !== session.id) {
            // Drop above or below depending on which half of the row was hit.
            const rect = noteEl.getBoundingClientRect();
            const after = upEvent.clientY > rect.top + rect.height / 2;
            const ids = noteIdsIn(noteEl.parentElement);
            const baseIndex = ids.indexOf(targetId);
            onDrop(session.id, session.fromTopicId, {
              topicId: targetTopicId,
              index: baseIndex === -1 ? null : baseIndex + (after ? 1 : 0),
            });
          }
        } else if (topicEl) {
          const targetTopicId = topicEl.getAttribute('data-topic-drop');
          if (targetTopicId) onDrop(session.id, session.fromTopicId, { topicId: targetTopicId, index: null });
        }
      }

      cleanup();
    };

    const up = (upEvent: PointerEvent) => finish(upEvent, true);
    const cancel = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel);
      cleanup();
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancel);
  }, [cleanup, clearHighlight, onDrop]);

  return { start, draggingId, overTopicId };
}

/** Reads the rendered order of notes inside one container. */
function noteIdsIn(container: Element | null): string[] {
  if (!container) return [];
  return [...container.querySelectorAll('[data-note-id]')]
    .map(el => el.getAttribute('data-note-id'))
    .filter((id): id is string => Boolean(id));
}
