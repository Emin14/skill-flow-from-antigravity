import type { BacklogItem } from '@/entities/backlog/model/types';

export type BacklogSortMode = 'manual' | 'updated-desc' | 'updated-asc' | 'created-desc';

// Negative positions encode a pin in the existing persisted ordering field.
export const isNotePinned = (item: BacklogItem) => (item.sortOrder ?? 0) < 0;
export const toggleNotePinOrder = (item: BacklogItem) => -(item.sortOrder ?? 0) - 1;

export function sortBacklogItems(items: BacklogItem[], mode: BacklogSortMode): BacklogItem[] {
  const dateValue = (item: BacklogItem) => {
    const value = mode === 'created-desc' ? item.createdAt : item.updatedAt || item.createdAt;
    const timestamp = Date.parse(value);
    return Number.isFinite(timestamp) ? timestamp : 0;
  };

  // Notes the user never dragged have no manualOrder. In manual mode they follow
  // the hand-placed ones in date order, so switching the mode on never scatters
  // an untouched board.
  const hasManual = (item: BacklogItem) => typeof item.manualOrder === 'number';

  return [...items].sort((a, b) => {
    const pinDifference = Number(isNotePinned(b)) - Number(isNotePinned(a));
    if (pinDifference) return pinDifference;

    if (mode === 'manual') {
      const aManual = hasManual(a);
      const bManual = hasManual(b);
      if (aManual !== bManual) return aManual ? -1 : 1;
      if (aManual && bManual && a.manualOrder !== b.manualOrder) {
        return (a.manualOrder as number) - (b.manualOrder as number);
      }
      const recency = dateValue(b) - dateValue(a);
      return recency || a.id.localeCompare(b.id);
    }

    const dateDifference = dateValue(a) - dateValue(b);
    return (mode === 'updated-asc' ? dateDifference : -dateDifference) || a.id.localeCompare(b.id);
  });
}
