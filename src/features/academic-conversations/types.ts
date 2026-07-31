
export interface AcademicConversation {
  id: string;
  courseId: string;
  lessonId?: string;
  videoId?: string;
  studentId: string;
  teacherId: string;
  contextType: 'VIDEO' | 'PDF' | 'LESSON' | 'QUIZ' | 'ASSIGNMENT' | 'GENERAL';
  videoTimestamp?: number;
  pdfPage?: number;
  highlightedText?: string;
  courseSnapshot?: string;
  lessonSnapshot?: string;
  videoSnapshot?: string;
  status: 'OPEN' | 'WAITING_REPLY' | 'ANSWERED' | 'ARCHIVED' | 'LOCKED';
  unreadStudentCount: number;
  unreadTeacherCount: number;
  lastMessageId?: string;
  lastMessageAt?: string;
  lastSenderId?: string;
  isClosed: boolean;
  lesson?: {
    id: string;
    title: string;
    videos: Array<{
      id: string;
      videoUrl: string;
      provider: string;
    }>;
  };
  closedBy?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
  messages?: AcademicMessage[];
  student?: { id: string; name: string; avatar: string };
  teacher?: { id: string; name: string; avatar: string };
  course?: { id: string; title: string };
}

export interface AcademicMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  sentAt: string;
  deliveredAt?: string;
  seenAt?: string;
  editedAt?: string;
  deletedAt?: string;
  replyToMessageId?: string;
  metadata?: { videoTimestamp?: number; [key: string]: any };
  attachments?: AcademicAttachment[];
  sender?: { id: string; name: string; avatar: string };
}

export interface AcademicAttachment {
  id: string;
  messageId: string;
  type: 'IMAGE' | 'FILE' | 'AUDIO';
  url: string;
  name?: string;
  mimeType?: string;
  sizeBytes: number;
  createdAt: string;
}
