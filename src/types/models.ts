export type ID = string | number;

export interface User {
  id: ID;
  name: string;
  email: string;
  avatar?: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN' | 'SUPER_ADMIN';
  joinedAt: string;
}

export interface Teacher extends User {
  bio: string;
  specialization: string;
  rating: number;
  studentsCount: number;
  coursesCount: number;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface Level {
  id: ID;
  name: string;
  slug: string;
}

export interface Subject {
  id: ID;
  name: string;
  slug: string;
  icon?: string;
}

export interface Category {
  id: ID;
  name: string;
  slug: string;
  icon?: string;
  courseCount: number;
}

export interface Course {
  id: ID;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  videoPreviewUrl?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  durationHours: number;
  lessonsCount: number;
  teacherId: ID;
  categoryId: ID;
  subjectId: ID;
  levelId: ID;
  tags: string[];
  createdAt: string;
  isPublished: boolean;
}

export interface Chapter {
  id: ID;
  courseId: ID;
  title: string;
  order: number;
  lessonsCount: number;
  durationMinutes: number;
}

export interface Lesson {
  id: ID;
  chapterId: ID;
  courseId: ID;
  title: string;
  description: string;
  order: number;
  isPreview: boolean;
  estimatedDurationMinutes: number;
  isLocked: boolean; // For frontend display logic
}

export type MediaType = 'VIDEO' | 'PDF' | 'IMAGE' | 'DOCUMENT' | 'ZIP' | 'LINK';

export interface LessonMedia {
  id: ID;
  lessonId: ID;
  title: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  sizeBytes?: number;
  durationSeconds?: number;
  resolution?: string; // e.g. 1080p
  isRequired: boolean;
  order: number;
}

export interface StudentProgress {
  id: ID;
  studentId: ID;
  lessonId: ID;
  courseId: ID;
  isCompleted: boolean;
  progressPercentage: number;
  lastViewedPositionSeconds: number;
  lastViewedAt: string;
}

export interface UploadJob {
  id: ID;
  fileName: string;
  fileSize: number;
  type: MediaType;
  status: 'PENDING' | 'UPLOADING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number;
  url?: string;
  error?: string;
  uploadedBy: ID;
  createdAt: string;
}

export interface Testimonial {
  id: ID;
  studentName: string;
  avatar?: string;
  courseId?: ID;
  rating: number;
  content: string;
  date: string;
}

export interface FAQ {
  id: ID;
  question: string;
  answer: string;
  category: 'GENERAL' | 'PAYMENT' | 'COURSES' | 'TECHNICAL';
}

export interface Feature {
  id: ID;
  title: string;
  description: string;
  icon: string;
}

export interface PricingPlan {
  id: ID;
  name: string;
  price: number;
  period: 'MONTHLY' | 'YEARLY' | 'LIFETIME';
  features: string[];
  isPopular?: boolean;
}

export interface Notification {
  id: ID;
  userId: ID;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  isRead: boolean;
  createdAt: string;
}

export interface CommunityPost {
  id: ID;
  authorId: ID;
  content: string;
  likesCount: number;
  commentsCount: number;
  tags: string[];
  createdAt: string;
}

export interface PlatformStatistics {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalHoursWatched: number;
}
