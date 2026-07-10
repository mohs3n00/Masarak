import { ExamBuilderLayout } from '@/features/teacher/components/exam-builder';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'منشئ الاختبارات | مسارك',
};

async function getExamData(courseId: string, lessonId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    
    if (!token) return null;

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
    const res = await fetch(`${apiBase}/teacher/courses/${courseId}/lessons/${lessonId}/exam`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      next: { revalidate: 0 }
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.notFound ? null : data;
  } catch (error) {
    console.error('Failed to fetch exam data', error);
    return null;
  }
}

export default async function ExamBuilderPage({ params }: { params: { id: string, lessonId: string } }) {
  // Await the params object
  const resolvedParams = await params;
  const courseId = resolvedParams.id;
  const lessonId = resolvedParams.lessonId;
  
  const examData = await getExamData(courseId, lessonId);

  return (
    <ExamBuilderLayout 
      courseId={courseId} 
      lessonId={lessonId} 
      initialData={examData} 
    />
  );
}
