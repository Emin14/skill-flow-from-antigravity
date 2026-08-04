'use client';

export interface PointerDragTarget {
  type: 'status_tab' | 'project_card' | 'task_card';
  status?: 'Todo' | 'InProgress' | 'Done';
  projectId?: string;
  taskId?: string;
}

export type PointerDropCallback = (draggedTaskId: string, target: PointerDragTarget) => void;

let activeDropCallback: PointerDropCallback | null = null;
let currentDraggedTaskId: string | null = null;
let ghostEl: HTMLElement | null = null;
let highlightedEl: HTMLElement | null = null;

export const registerPointerDropHandler = (callback: PointerDropCallback) => {
  activeDropCallback = callback;
};

export const cleanupPointerDrag = () => {
  if (typeof document !== 'undefined') {
    const existingGhosts = document.querySelectorAll('#pointer-drag-ghost');
    existingGhosts.forEach((el) => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  }
  if (ghostEl && ghostEl.parentNode) {
    ghostEl.parentNode.removeChild(ghostEl);
  }
  ghostEl = null;

  if (highlightedEl) {
    highlightedEl.style.outline = '';
    highlightedEl.style.boxShadow = '';
    highlightedEl = null;
  }
  currentDraggedTaskId = null;
};

// Global event listeners to guarantee ghost element removal on any mouse/drag release
if (typeof window !== 'undefined') {
  window.addEventListener('mouseup', cleanupPointerDrag);
  window.addEventListener('pointerup', cleanupPointerDrag);
  window.addEventListener('dragend', cleanupPointerDrag);
  window.addEventListener('touchend', cleanupPointerDrag);
  window.addEventListener('touchcancel', cleanupPointerDrag);
  window.addEventListener('blur', cleanupPointerDrag);
}

export const startPointerDrag = (
  e: React.MouseEvent | MouseEvent,
  taskId: string,
  taskTitle: string
) => {
  if (e.button !== 0) return; // Only left mouse button

  cleanupPointerDrag();

  currentDraggedTaskId = taskId;

  // Create ghost element
  ghostEl = document.createElement('div');
  ghostEl.id = 'pointer-drag-ghost';
  ghostEl.style.position = 'fixed';
  ghostEl.style.left = `${e.clientX + 14}px`;
  ghostEl.style.top = `${e.clientY + 14}px`;
  ghostEl.style.pointerEvents = 'none';
  ghostEl.style.zIndex = '99999';
  ghostEl.style.padding = '8px 14px';
  ghostEl.style.borderRadius = '12px';
  ghostEl.style.background = 'rgba(15, 23, 42, 0.95)';
  ghostEl.style.border = '2px solid #0ea5e9';
  ghostEl.style.color = '#ffffff';
  ghostEl.style.fontSize = '13px';
  ghostEl.style.fontWeight = '700';
  ghostEl.style.boxShadow = '0 10px 30px rgba(14, 165, 233, 0.4)';
  ghostEl.style.display = 'flex';
  ghostEl.style.alignItems = 'center';
  ghostEl.style.gap = '8px';
  ghostEl.innerHTML = `<span>📦</span><span>${taskTitle.length > 25 ? taskTitle.slice(0, 25) + '...' : taskTitle}</span>`;
  document.body.appendChild(ghostEl);

  const handleMouseMove = (moveEvent: MouseEvent) => {
    if (ghostEl) {
      ghostEl.style.left = `${moveEvent.clientX + 14}px`;
      ghostEl.style.top = `${moveEvent.clientY + 14}px`;
    }

    // Find drop target under cursor
    const element = document.elementFromPoint(moveEvent.clientX, moveEvent.clientY);
    const dropTarget = element?.closest('[data-drop-status], [data-project-id], [data-task-id]') as HTMLElement | null;

    if (highlightedEl && highlightedEl !== dropTarget) {
      highlightedEl.style.outline = '';
      highlightedEl.style.boxShadow = '';
      highlightedEl = null;
    }

    if (dropTarget) {
      const targetTaskId = dropTarget.getAttribute('data-task-id');
      if (targetTaskId !== taskId) {
        highlightedEl = dropTarget;
        dropTarget.style.outline = '2px solid #0ea5e9';
        dropTarget.style.boxShadow = '0 0 16px rgba(14, 165, 233, 0.4)';
      }
    }
  };

  const handleMouseUp = (upEvent: MouseEvent) => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);

    const element = document.elementFromPoint(upEvent.clientX, upEvent.clientY);
    const dropTarget = element?.closest('[data-drop-status], [data-project-id], [data-task-id]') as HTMLElement | null;

    if (dropTarget && activeDropCallback && currentDraggedTaskId) {
      const dropStatus = dropTarget.getAttribute('data-drop-status') as 'Todo' | 'InProgress' | 'Done' | null;
      const projectId = dropTarget.getAttribute('data-project-id');
      const targetTaskId = dropTarget.getAttribute('data-task-id');

      if (dropStatus) {
        activeDropCallback(currentDraggedTaskId, { type: 'status_tab', status: dropStatus });
      } else if (projectId && projectId !== currentDraggedTaskId) {
        activeDropCallback(currentDraggedTaskId, { type: 'project_card', projectId });
      } else if (targetTaskId && targetTaskId !== currentDraggedTaskId) {
        activeDropCallback(currentDraggedTaskId, { type: 'task_card', taskId: targetTaskId });
      }
    }

    cleanupPointerDrag();
  };

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp, { once: true });
  window.addEventListener('dragstart', cleanupPointerDrag, { once: true });
};
