import type { BacklogPriority, BacklogStatus } from '@/entities/backlog/model/types';

export interface NoteDraft {
  title: string;
  topic: string;
  topicId?: string;
  description: string;
  status: BacklogStatus;
  priority: BacklogPriority;
  tagsInput: string;
  link: string;
}

const memoryDrafts = new Map<string, NoteDraft>();

export function readNoteDraft(key: string): NoteDraft | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const draft = JSON.parse(raw);
      if (
        ['title', 'topic', 'description', 'tagsInput', 'link'].every(field => typeof draft?.[field] === 'string') &&
        ['idea', 'planned', 'done'].includes(draft.status) &&
        ['high', 'medium', 'low'].includes(draft.priority)
      ) return draft;
    }
  } catch {
    // Keep drafts usable during this session if browser storage is unavailable.
  }
  return memoryDrafts.get(key) ?? null;
}

export function writeNoteDraft(key: string, draft: NoteDraft): boolean {
  memoryDrafts.set(key, draft);
  try {
    localStorage.setItem(key, JSON.stringify(draft));
    return true;
  } catch {
    return false;
  }
}

export function clearNoteDraft(key: string): void {
  memoryDrafts.delete(key);
  try {
    localStorage.removeItem(key);
  } catch {
    // The in-memory copy is still cleared.
  }
}
