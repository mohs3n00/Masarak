/** Types mirroring the backend community entities and DTOs */

export type SpaceType = 'global' | 'course' | 'lesson' | 'teacher';
export type PostStatus = 'published' | 'draft' | 'archived' | 'moderated';
export type ReactionType = 'like' | 'love' | 'celebrate' | 'insightful';
export type AttachmentType = 'image' | 'pdf' | 'document';
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

export interface CommunitySpace {
  id: string;
  type: SpaceType;
  referenceId: string | null;
  name: string;
  description: string | null;
  slug: string;
  isArchived: boolean;
  createdAt: string;
  metadata: string | null;
}

export interface CommunityPost {
  id: string;
  spaceId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string | null;
  content: string;
  status: PostStatus;
  isPinned: boolean;
  isQuestion: boolean;
  isAnswered: boolean;
  isAnnouncement: boolean;
  reactionsCount: number;
  commentsCount: number;
  tags: string[];
  deletedAt: string | null;
  editHistory: string | null;
  aiMetadata: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityComment {
  id: string;
  postId: string;
  parentId: string | null;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string | null;
  content: string;
  reactionsCount: number;
  repliesCount: number;
  deletedAt: string | null;
  editHistory: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityReaction {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'post' | 'comment';
  type: ReactionType;
  createdAt: string;
}

export interface CommunityAttachment {
  id: string;
  postId: string;
  fileId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  type: AttachmentType;
  createdAt: string;
}

export interface CommunityNotification {
  id: string;
  userId: string;
  type: 'reply' | 'reaction' | 'mention' | 'pin' | 'answer';
  actorId: string;
  actorName: string;
  targetId: string;
  targetType: 'post' | 'comment';
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  cursor: string | null;
}
