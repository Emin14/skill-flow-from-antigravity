import { GoalDetailPage } from '@/views/goal-detail/ui/GoalDetailPage';

export default async function GoalDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <GoalDetailPage goalId={resolvedParams.id} />;
}
