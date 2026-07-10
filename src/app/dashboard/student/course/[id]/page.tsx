import { LearningWorkspace } from '@/features/learning/components/LearningWorkspace';

export default async function CourseDetailsPreview({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <LearningWorkspace slug={resolvedParams.id} />;
}
