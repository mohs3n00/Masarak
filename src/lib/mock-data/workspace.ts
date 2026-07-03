import { Lesson, LessonMedia } from '@/types/models';

export interface WorkspaceChapter {
  id: string;
  title: string;
  order: number;
  lessons: WorkspaceLesson[];
}

export interface WorkspaceLesson extends Omit<Lesson, 'description' | 'estimatedDurationMinutes' | 'isLocked' | 'isPreview'> {
  type: 'video' | 'pdf' | 'quiz' | 'homework';
  duration?: string;
  completed?: boolean;
  isCurrent?: boolean;
  description?: string;
  estimatedDurationMinutes?: number;
  isLocked?: boolean;
  isPreview?: boolean;
}

export const workspaceMockChapters: WorkspaceChapter[] = [
  {
    id: 'chap_0',
    title: 'مقدمة الكورس',
    order: 0,
    lessons: [
      {
        id: 'less_0_1',
        chapterId: 'chap_0',
        courseId: 'c1',
        title: 'ترحيب سريع 🚀',
        type: 'video',
        duration: '02:30',
        completed: true,
        order: 1,
        isPreview: true,
      },
      {
        id: 'less_0_2',
        chapterId: 'chap_0',
        courseId: 'c1',
        title: 'كيف تذاكر المنهج؟',
        type: 'video',
        duration: '05:15',
        completed: true,
        order: 2,
        isPreview: true,
      }
    ]
  },
  {
    id: 'chap_1',
    title: 'الوحدة الأولى: البناء الكيميائي',
    order: 1,
    lessons: [
      {
        id: 'less_1_1',
        chapterId: 'chap_1',
        courseId: 'c1',
        title: 'المحاضرة الأولى: الذرة ومكوناتها',
        type: 'video',
        duration: '45:20',
        completed: true,
        order: 1,
      },
      {
        id: 'less_1_2',
        chapterId: 'chap_1',
        courseId: 'c1',
        title: 'المحاضرة الثانية: الجدول الدوري',
        type: 'video',
        duration: '55:10',
        isCurrent: true,
        order: 2,
      },
      {
        id: 'less_1_3',
        chapterId: 'chap_1',
        courseId: 'c1',
        title: 'واجب المحاضرة الثانية',
        type: 'homework',
        isLocked: true,
        order: 3,
      },
      {
        id: 'less_1_4',
        chapterId: 'chap_1',
        courseId: 'c1',
        title: 'اختبار الوحدة الأولى شامل',
        type: 'quiz',
        isLocked: true,
        order: 4,
      }
    ]
  },
  {
    id: 'chap_2',
    title: 'الوحدة الثانية: التفاعلات الكيميائية',
    order: 2,
    lessons: [
      {
        id: 'less_2_1',
        chapterId: 'chap_2',
        courseId: 'c1',
        title: 'المحاضرة الأولى: أنواع التفاعلات',
        type: 'video',
        duration: '50:00',
        isLocked: true,
        order: 1,
      },
      {
        id: 'less_2_2',
        chapterId: 'chap_2',
        courseId: 'c1',
        title: 'المحاضرة الثانية: وزن المعادلات',
        type: 'video',
        duration: '48:30',
        isLocked: true,
        order: 2,
      }
    ]
  }
];

// Mock resources for less_1_2 (the current active lesson)
export const workspaceMockResources: Record<string, LessonMedia[]> = {
  'less_1_2': [
    {
      id: 'm1',
      lessonId: 'less_1_2',
      title: 'فيديو الشرح التفصيلي',
      type: 'VIDEO',
      url: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
      thumbnailUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=1200&auto=format&fit=crop',
      isRequired: true,
      order: 1,
    },
    {
      id: 'm2',
      lessonId: 'less_1_2',
      title: 'مذكرة المحاضرة الثانية (PDF)',
      type: 'PDF',
      url: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
      sizeBytes: 1500000,
      isRequired: true,
      order: 2,
    },
    {
      id: 'm3',
      lessonId: 'less_1_2',
      title: 'بنك أسئلة الجدول الدوري',
      type: 'PDF',
      url: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
      sizeBytes: 850000,
      isRequired: false,
      order: 3,
    },
    {
      id: 'm4',
      lessonId: 'less_1_2',
      title: 'مخطط العناصر (صورة)',
      type: 'IMAGE',
      url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b',
      sizeBytes: 500000,
      isRequired: false,
      order: 4,
    }
  ]
};
