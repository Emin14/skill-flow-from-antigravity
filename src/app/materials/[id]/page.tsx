import { MaterialDetailPage } from '@/views/material-detail/ui/MaterialDetailPage';

export default async function MaterialDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <MaterialDetailPage materialId={resolvedParams.id} />;
}
