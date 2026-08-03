import { OverduePage } from '@/views/overdue';

export const metadata = {
  title: 'Просроченные — SkillFlow',
  description: 'Задачи с истёкшим сроком выполнения',
};

export default function Overdue() {
  return <OverduePage />;
}
