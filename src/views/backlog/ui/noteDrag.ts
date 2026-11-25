'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface NoteDropTarget {
  /** Topic the pointer is over. */
  topicId: string;
  /** Note the position is anchored to; null means "append to the topic". */
  anchorId: string | null;
  /** Whether the dragged note lands above or below the anchor note. */
  place: 'before' | 'after';
}

interface DragSession {
  id: string;
  fromTopicId: string;
  startX: number;
  startY: number;
  active: boolean;
}

/** Pixels the pointer has to travel before a press turns into a drag. */
const DRAG_THRESHOLD = 8;
/** Longest we wait for the synthetic click that follows a drop. */
const CLICK_SUPPRESSION_MS = 200;

interface DropZone {
  noteEl: HTMLElement | null;
  topicEl: HTMLElement | null;
  /** True when the pointer sits in the lower half of the note row. */
  after: boolean;
}

function resolveDropZone(x: number, y: number): DropZone {
  const under = document.elementFromPoint(x, y) as HTMLElement | null;
  const noteEl = (under?.closest('[data-note-id]') as HTMLElement | null) ?? null;
  const topicEl = (under?.closest('[data-topic-drop]') as HTMLElement | null) ?? null;
  let after = false;
  if (noteEl) {
    const rect = noteEl.getBoundingClientRect();
    after = y > rect.top + rect.height / 2;
  }
  return { noteEl, topicEl, after };
}

/**
 * Swallows the `click` that the browser fires right after a drag's `pointerup` —
 * without it the drop also opens the note under the cursor. The listener is
 * removed by the click itself or by a short timeout, whichever comes first, so a
 * lost click cannot leave the UI deaf to clicks.
 */
function swallowNextClick() {
  const suppress = (event: Event) => {
    event.stopPropagation();
    event.preventDefault();
    detach();
  };
  const timer = window.setTimeout(detach, CLICK_SUPPRESSION_MS);
  function detach() {
    window.clearTimeout(timer);
    window.removeEventListener('click', suppress, true);
  }
  window.addEventListener('click', suppress, true);
}

/**
 * Pointer-based drag for backlog notes. Pointer events (not HTML5 DnD) because
 * the rows already own touch gestures for swipe actions, and because a custom
 * ghost behaves the same on desktop and touch.
 *
 * With a mouse the whole row is a drag source; a finger may only drag by the
 * grip, so horizontal swipes on the row keep working. Text selection is blocked
 * by `user-select: none` on the row (see BacklogLayouts.module.css) — never by
 * `preventDefault()` on pointerdown, which would also swallow the click that
 * opens the note.
 */
export function useNoteDrag(onDrop: (id: string, fromTopicId: string, target: NoteDropTarget) => void) {
  const sessionRef = useRef<DragSession | null>(null);
  const ghostRef = useRef<HTMLElement | null>(null);
  const markedRef = useRef<HTMLElement | null>(null);
  const justDraggedRef = useRef(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overTopicId, setOverTopicId] = useState<string | null>(null);

  /** Drops the topic outline / row insertion line drawn for the previous hover. */
  const clearMark = useCallback(() => {
    const el = markedRef.current;
    if (el) {
      el.style.outline = '';
      el.style.boxShadow = '';
      el.style.borderRadius = '';
      markedRef.current = null;
    }
  }, []);

  const cleanup = useCallback(() => {
    ghostRef.current?.remove();
    ghostRef.current = null;
    clearMark();
    sessionRef.current = null;
    setDraggingId(null);
    setOverTopicId(null);
  }, [clearMark]);

  useEffect(() => cleanup, [cleanup]);

  const start = useCallback((event: React.PointerEvent, id: string, fromTopicId: string, title: string) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    const target = event.target as HTMLElement | null;
    const fromGrip = Boolean(target?.closest('[data-note-grip]'));
    // Touch keeps the grip as the only drag handle: the row body owns swipes there.
    if (event.pointerType !== 'mouse' && !fromGrip) return;
    // Controls inside the row keep their own behaviour.
    if (!fromGrip && target?.closest('button, a, input, textarea, select, [role="button"]')) return;

    cleanup();
    sessionRef.current = { id, fromTopicId, startX: event.clientX, startY: event.clientY, active: false };

    const move = (moveEvent: PointerEvent) => {
      const session = sessionRef.current;
      if (!session) return;

      if (!session.active) {
        // Slack so a plain click still opens the note and a scroll gesture is
        // not mistaken for a drag.
        const distance = Math.hypot(moveEvent.clientX - session.startX, moveEvent.clientY - session.startY);
        if (distance < DRAG_THRESHOLD) return;
        session.active = true;
        // Anything selected by the press itself must not be dragged along.
        window.getSelection()?.removeAllRanges();
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

      const { noteEl, topicEl, after } = resolveDropZone(moveEvent.clientX, moveEvent.clientY);
      // Repainted every move on purpose: the insertion line flips between the two
      // halves of the hovered row, which is the only feedback for a reorder.
      clearMark();
      // The row's own background would hide an inset shadow on the outer
      // container (it has `overflow: hidden`), so the line is drawn on the row.
      const rowEl = noteEl?.firstElementChild as HTMLElement | null;
      if (rowEl) {
        markedRef.current = rowEl;
        rowEl.style.boxShadow = after
          ? 'inset 0 -3px 0 0 var(--color-accent)'
          : 'inset 0 3px 0 0 var(--color-accent)';
      } else if (topicEl) {
        markedRef.current = topicEl;
        topicEl.style.outline = '2px solid var(--color-accent)';
        topicEl.style.boxShadow = '0 0 0 3px var(--color-accent-light)';
        topicEl.style.borderRadius = '8px';
      }

      const topicId = noteEl?.getAttribute('data-note-topic') ?? topicEl?.getAttribute('data-topic-drop') ?? null;
      // Same-value setState bails out in React, so hovering one topic does not
      // re-render the list on every pointermove.
      setOverTopicId(previous => (previous === topicId ? previous : topicId));
    };

    const drop = (upEvent: PointerEvent, session: DragSession) => {
      const { noteEl, topicEl, after } = resolveDropZone(upEvent.clientX, upEvent.clientY);

      if (noteEl) {
        const topicId = noteEl.getAttribute('data-note-topic');
        const anchorId = noteEl.getAttribute('data-note-id');
        if (topicId && anchorId && anchorId !== session.id) {
          onDrop(session.id, session.fromTopicId, { topicId, anchorId, place: after ? 'after' : 'before' });
        }
        return;
      }

      const topicId = topicEl?.getAttribute('data-topic-drop');
      if (topicId) onDrop(session.id, session.fromTopicId, { topicId, anchorId: null, place: 'after' });
    };

    const finish = (upEvent: PointerEvent, commit: boolean) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel);

      const session = sessionRef.current;
      if (!session) return;

      if (commit && session.active) {
        // A finished drag is followed by a click on whichever row sits under the
        // cursor; without this the drop would also open that note.
        justDraggedRef.current = true;
        window.setTimeout(() => { justDraggedRef.current = false; }, CLICK_SUPPRESSION_MS);
        swallowNextClick();
        drop(upEvent, session);
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
  }, [cleanup, clearMark, onDrop]);

  /** True during the click that immediately follows a drop. */
  const wasJustDragged = useCallback(() => justDraggedRef.current, []);

  return { start, draggingId, overTopicId, wasJustDragged };
}
