import type { BacklogItem } from '@/entities/backlog/model/types';

export type BacklogSortMode = 'updated-desc' | 'updated-asc' | 'created-desc';

// Negative positions encode a pin in the existing persisted ordering field.
export const isNotePinned = (item: BacklogItem) => (item.sortOrder ?? 0) < 0;
export const toggleNotePinOrder = (item: BacklogItem) => -(item.sortOrder ?? 0) - 1;

export function sortBacklogItems(items: BacklogItem[], mode: BacklogSortMode): BacklogItem[] {
  const dateValue = (item: BacklogItem) => {
    const value = mode === 'created-desc' ? item.createdAt : item.updatedAt || item.createdAt;
    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp) ? timestamp : 0;
  };
  return [...items].sort((a, b) => {
    const pinDifference = Number(isNotePinned(b)) - Number(isNotePinned(a));
    if (pinDifference) return pinDifference;
    const dateDifference = dateValue(a) - dateValue(b);
    return (mode === 'updated-asc' ? dateDifference : -dateDifference) || a.id.localeCompare(b.id);
  });
}
