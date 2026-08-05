/** Types mirroring the backend community entities and DTOs for Community 3.0 */

export type SpaceType =
  | 'DEFAULT_ACADEMIC'
  | 'TEACHER'
  | 'STUDENT'
  | 'OFFICIAL'
  | 'PRIVATE'
  | 'global'
  | 'course'
  | 'lesson'
  | 'teacher';

export type SpaceCategory =
  | 'SECONDARY_GRADE_1'
  | 'SECONDARY_GRADE_2'
  | 'SECONDARY_GRADE_3'
  | 'EDUCATION'
  | 'UNIVERSITY'
  | 'PROGRAMMING'
  | 'LANGUAGES'
  | 'CAREER'
  | 'TECHNOLOGY'
  | 'GENERAL';

export type SpaceVisibility = 'PUBLIC' | 'PRIVATE' | 'APPROVAL_REQUIRED';

export type SpaceStatus =
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'CHANGES_REQUESTED'
  | 'SUSPENDED'
  | 'ARCHIVED';

export type PostType = 'QUESTION' | 'DISCUSSION' | 'RESOURCE' | 'NOTE' | 'ANNOUNCEMENT';
export type PostStatus = 'published' | 'draft' | 'archived' | 'moderated';
export type ReactionType = 'like' | 'love' | 'celebrate' | 'insightful';
export type AttachmentType = 'image' | 'pdf' | 'document' | 'video' | 'archive';
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

export interface CommunitySpace {
  id: string;
  communityId: string; // e.g., MSC-28AF4
  type: SpaceType;
  category: SpaceCategory;
  parentSlug?: string | null;
  gradeLevel?: number | null;
  subject?: string | null;
  language?: string | null;
  school?: string | null;
  university?: string | null;
  courseId?: string | null;
  referenceId: string | null;
  name: string;
  description: string | null;
  slug: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  tags: string[];
  rules: string | null;
  visibility: SpaceVisibility;
  status: SpaceStatus;
  isArchived: boolean;
  membersCount: number;
  postsCount: number;
  onlineCount: number;
  createdById: string | null;
  createdByName: string | null;
  createdAt: string;
  metadata: string | null;
  weeklyActivityScore?: number;
  newMembersWeekly?: number;
  commentsPerPostRatio?: number;
}

export interface CommunityPost {
  id: string;
  spaceId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string | null;
  content: string;
  postType: PostType;
  acceptedCommentId?: string | null;
  status: PostStatus;
  isPinned: boolean;
  isQuestion: boolean;
  isAnswered: boolean;
  isAnnouncement: boolean;
  reactionsCount: number;
  commentsCount: number;
  tags: string[];
  attachments?: CommunityAttachment[];
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
  isAccepted?: boolean;
  isTeacherAnswer?: boolean;
  reactionsCount: number;
  repliesCount: number;
  replies?: CommunityComment[];
  deletedAt: string | null;
  editHistory: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityMember {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  role: 'OWNER' | 'ADMIN' | 'MODERATOR' | 'TEACHER' | 'VERIFIED_TEACHER' | 'MEMBER';
  reputationScore: number;
  badges: string[];
  joinedAt: string;
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
  type: 'reply' | 'reaction' | 'mention' | 'pin' | 'answer' | 'join_accepted' | 'join_rejected' | 'invitation';
  actorId: string;
  actorName: string;
  targetId: string;
  targetType: 'post' | 'comment' | 'space';
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  cursor: string | null;
}
