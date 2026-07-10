import { Lesson } from '@/types/models';

export interface WorkspaceChapter {
  id: string;
  title: string;
  order: number;
  lessons: WorkspaceLesson[];
}

export interface WorkspaceLesson extends Omit<Lesson, 'description' | 'estimatedDurationMinutes' | 'isLocked' | 'isPreview'> {
  type: 'video' | 'pdf' | 'exam' | 'quiz' | 'homework';
  duration?: string;
  completed?: boolean;
  isCurrent?: boolean;
  description?: string;
  estimatedDurationMinutes?: number;
  isLocked?: boolean;
  isPreview?: boolean;
}