import { TopicWorkspacePage } from '@/views/topic-workspace/ui/TopicWorkspacePage';

export default async function TopicWorkspaceRoute({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <TopicWorkspacePage topicId={resolvedParams.id} />;
}
