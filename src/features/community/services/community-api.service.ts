import {
  CommunityPost,
  CommunityComment,
  CommunitySpace,
  CommunityNotification,
  CommunityAttachment,
  PaginatedResult,
} from '../types';
import { useAuthStore } from '@/features/auth/store/auth.store';

let envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
if (envUrl && !envUrl.startsWith('http://') && !envUrl.startsWith('https://')) {
  envUrl = `https://${envUrl}`;
}
const API_BASE = envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;


async function safeFetch<T>(url: string, opts?: RequestInit, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts?.headers as Record<string, string>),
  };

  let authToken = token;
  if (!authToken && typeof window !== 'undefined') {
    // Read from zustand store directly
    authToken = useAuthStore.getState().accessToken || undefined;
  }
  
  if (!authToken && typeof document !== 'undefined') {
    const match = document.cookie.match(/(?:^|; )access_token=([^;]*)/) || document.cookie.match(/(?:^|; )accessToken=([^;]*)/) || document.cookie.match(/(?:^|; )auth_token=([^;]*)/);
    if (match) {
      authToken = decodeURIComponent(match[1]);
    }
  }

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  if (opts?.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const res = await fetch(url, { credentials: 'include', ...opts, headers });

    if (!res.ok) {
      let message = 'An error occurred';
      try {
        const errorData = await res.json();
        message = errorData.message || message;
      } catch {
        message = res.statusText || message;
      }
      console.warn(`safeFetch ${opts?.method || 'GET'} ${url} returned ${res.status}: ${message}`);
      
      // For GET requests, return safe fallbacks instead of crashing UI
      if (opts?.method === 'GET' || !opts?.method) {
        if (url.includes('/community/spaces/discover')) {
          return { trending: [], forYou: [], new: [], highestGrowth: [], mostDiscussed: [], recommendedTeachers: [] } as unknown as T;
        }
        if (url.includes('/community/spaces/slug/')) {
          return null as unknown as T;
        }
        if (url.includes('/community/spaces')) {
          return [] as unknown as T;
        }
        if (url.includes('/feed') || url.includes('/comments') || url.includes('/search')) {
          return { data: [], total: 0, cursor: null } as unknown as T;
        }
      }
      throw new Error(`[${res.status} ${res.statusText}] ${message} (${opts?.method || 'GET'} ${url})`);
    }

    const text = await res.text();
    return text ? JSON.parse(text) : ({} as T);
  } catch (err: any) {
    if (opts?.method === 'GET' || !opts?.method) {
      if (url.includes('/community/spaces/discover')) {
        return { trending: [], forYou: [], new: [], highestGrowth: [], mostDiscussed: [], recommendedTeachers: [] } as unknown as T;
      }
      if (url.includes('/community/spaces/slug/')) {
        return null as unknown as T;
      }
      if (url.includes('/community/spaces')) {
        return [] as unknown as T;
      }
      if (url.includes('/feed') || url.includes('/comments') || url.includes('/search')) {
        return { data: [], total: 0, cursor: null } as unknown as T;
      }
    }
    throw err;
  }
}

export class CommunityApiService {
  private token: string | undefined;

  constructor(token?: string | null) {
    this.token = token || undefined;
  }

  setToken(token: string) {
    this.token = token;
  }

  // spaces
  async getSpaces(filters?: {
    type?: string;
    category?: string;
    status?: string;
    search?: string;
    limit?: number;
  }): Promise<CommunitySpace[]> {
    const qs = new URLSearchParams();
    if (filters?.type) qs.set('type', filters.type);
    if (filters?.category) qs.set('category', filters.category);
    if (filters?.status) qs.set('status', filters.status);
    if (filters?.search) qs.set('search', filters.search);
    if (filters?.limit) qs.set('limit', String(filters.limit));

    const res = await safeFetch<CommunitySpace[]>(
      `${API_BASE}/community/spaces?${qs}`,
      { method: 'GET' },
      this.token,
    );

    return Array.isArray(res) ? res : [];
  }

  async discoverSpaces(): Promise<{
    trending: CommunitySpace[];
    forYou: CommunitySpace[];
    new: CommunitySpace[];
    highestGrowth: CommunitySpace[];
    mostDiscussed: CommunitySpace[];
    recommendedTeachers: CommunitySpace[];
  }> {
    return safeFetch(
      `${API_BASE}/community/spaces/discover`,
      { method: 'GET' },
      this.token,
    );
  }

  async getSpaceBySlug(slug: string): Promise<CommunitySpace> {
    return safeFetch<CommunitySpace>(
      `${API_BASE}/community/spaces/slug/${encodeURIComponent(slug)}`,
      { method: 'GET' },
      this.token,
    );
  }

  async createSpace(data: Partial<CommunitySpace>): Promise<CommunitySpace> {
    return safeFetch<CommunitySpace>(
      `${API_BASE}/community/spaces`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      this.token,
    );
  }

  async updateSpaceStatus(id: string, status: string, reason?: string): Promise<CommunitySpace> {
    return safeFetch<CommunitySpace>(
      `${API_BASE}/community/spaces/${id}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status, reason }),
      },
      this.token,
    );
  }

  async seedDefaultCommunities(): Promise<{ created: number; existing: number }> {
    return safeFetch<{ created: number; existing: number }>(
      `${API_BASE}/community/spaces/seed-defaults`,
      { method: 'POST' },
      this.token,
    );
  }

  async deleteSpace(id: string): Promise<void> {
    return safeFetch<void>(
      `${API_BASE}/community/spaces/${id}`,
      { method: 'DELETE' },
      this.token,
    );
  }

  // memberships
  async joinSpace(id: string): Promise<void> {
    if (!id || id === 'undefined' || id === 'null') {
      console.warn('[joinSpace] Invalid space id:', id);
      return;
    }
    return safeFetch<void>(
      `${API_BASE}/community/spaces/${encodeURIComponent(id)}/join`,
      { method: 'POST' },
      this.token,
    );
  }

  async leaveSpace(id: string): Promise<void> {
    if (!id || id === 'undefined' || id === 'null') {
      console.warn('[leaveSpace] Invalid space id:', id);
      return;
    }
    return safeFetch<void>(
      `${API_BASE}/community/spaces/${encodeURIComponent(id)}/leave`,
      { method: 'DELETE' },
      this.token,
    );
  }

  async getMyMemberships(): Promise<string[]> {
    return safeFetch<string[]>(
      `${API_BASE}/community/members/me`,
      { method: 'GET' },
      this.token,
    );
  }

  // posts
  async getFeed(
    spaceId?: string,
    cursor?: string,
    limit?: number,
  ): Promise<PaginatedResult<CommunityPost>> {
    const qs = new URLSearchParams();
    if (spaceId) qs.set('spaceId', spaceId);
    if (cursor) qs.set('cursor', cursor);
    if (limit) qs.set('limit', String(limit));
    return safeFetch<PaginatedResult<CommunityPost>>(
      `${API_BASE}/community/posts/feed?${qs}`,
      { method: 'GET' },
      this.token,
    );
  }

  async classifyPost(content: string): Promise<string> {
    try {
      const res = await fetch('/api/community/posts/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.type || 'DISCUSSION';
      }
    } catch (e) {
      console.error('Classification error', e);
    }
    return 'DISCUSSION';
  }

  async createPost(data: Partial<CommunityPost>): Promise<CommunityPost> {
    if (!data.postType && data.content) {
      data.postType = (await this.classifyPost(data.content)) as any;
      data.isQuestion = data.postType === 'QUESTION';
    }

    return safeFetch<CommunityPost>(
      `${API_BASE}/community/posts`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      this.token,
    );
  }

  async getPost(id: string): Promise<CommunityPost> {
    return safeFetch<CommunityPost>(
      `${API_BASE}/community/posts/${id}`,
      { method: 'GET' },
      this.token,
    );
  }

  async updatePost(id: string, data: Partial<CommunityPost>): Promise<CommunityPost> {
    return safeFetch<CommunityPost>(
      `${API_BASE}/community/posts/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      this.token,
    );
  }

  async deletePost(id: string): Promise<void> {
    return safeFetch<void>(
      `${API_BASE}/community/posts/${id}`,
      { method: 'DELETE' },
      this.token,
    );
  }

  async bookmarkPost(id: string): Promise<void> {
    return safeFetch<void>(
      `${API_BASE}/community/posts/${id}/bookmark`,
      { method: 'POST' },
      this.token,
    );
  }

  async unbookmarkPost(id: string): Promise<void> {
    return safeFetch<void>(
      `${API_BASE}/community/posts/${id}/bookmark`,
      { method: 'DELETE' },
      this.token,
    );
  }

  async getBookmarks(): Promise<CommunityPost[]> {
    return safeFetch<CommunityPost[]>(
      `${API_BASE}/community/posts/bookmarks/me`,
      { method: 'GET' },
      this.token,
    );
  }

  // comments
  async getComments(
    postId: string,
    cursor?: string,
    limit?: number,
  ): Promise<PaginatedResult<CommunityComment>> {
    const qs = new URLSearchParams();
    if (cursor) qs.set('cursor', cursor);
    if (limit) qs.set('limit', String(limit));
    return safeFetch<PaginatedResult<CommunityComment>>(
      `${API_BASE}/community/posts/${postId}/comments?${qs}`,
      { method: 'GET' },
      this.token,
    );
  }

  async createComment(
    postId: string,
    data: { content: string; parentId?: string; authorName?: string; authorRole?: string },
  ): Promise<CommunityComment> {
    return safeFetch<CommunityComment>(
      `${API_BASE}/community/posts/${postId}/comments`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      this.token,
    );
  }

  async markAcceptedAnswer(id: string): Promise<CommunityComment> {
    return safeFetch<CommunityComment>(
      `${API_BASE}/community/comments/${id}/accept`,
      { method: 'PATCH' },
      this.token,
    );
  }

  async deleteComment(id: string): Promise<void> {
    return safeFetch<void>(
      `${API_BASE}/community/comments/${id}`,
      { method: 'DELETE' },
      this.token,
    );
  }

  // reactions
  async toggleReaction(
    targetType: 'post' | 'comment',
    targetId: string,
    type: string,
  ): Promise<{ action: string }> {
    return safeFetch<{ action: string }>(
      `${API_BASE}/community/reactions/${targetType}/${targetId}`,
      {
        method: 'POST',
        body: JSON.stringify({ type }),
      },
      this.token,
    );
  }

  // attachments & image upload
  async uploadImage(file: File, folder = 'masarak/community'): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return safeFetch<{ url: string }>(
      `${API_BASE}/community/upload-image`,
      {
        method: 'POST',
        body: formData,
      },
      this.token,
    );
  }

  async uploadSpaceCover(spaceId: string, file: File): Promise<CommunitySpace> {
    const formData = new FormData();
    formData.append('file', file);
    return safeFetch<CommunitySpace>(
      `${API_BASE}/community/spaces/${spaceId}/cover`,
      {
        method: 'POST',
        body: formData,
      },
      this.token,
    );
  }

  async uploadSpaceAvatar(spaceId: string, file: File): Promise<CommunitySpace> {
    const formData = new FormData();
    formData.append('file', file);
    return safeFetch<CommunitySpace>(
      `${API_BASE}/community/spaces/${spaceId}/avatar`,
      {
        method: 'POST',
        body: formData,
      },
      this.token,
    );
  }

  async uploadAttachment(postId: string, file: File): Promise<CommunityAttachment> {
    const formData = new FormData();
    formData.append('file', file);
    return safeFetch<CommunityAttachment>(
      `${API_BASE}/community/posts/${postId}/attachments`,
      {
        method: 'POST',
        body: formData,
      },
      this.token,
    );
  }

  // search
  async search(
    q: string,
    spaceId?: string,
    cursor?: string,
    limit?: number,
  ): Promise<PaginatedResult<CommunityPost>> {
    const qs = new URLSearchParams();
    qs.set('q', q);
    if (spaceId) qs.set('spaceId', spaceId);
    if (cursor) qs.set('cursor', cursor);
    if (limit) qs.set('limit', String(limit));
    return safeFetch<PaginatedResult<CommunityPost>>(
      `${API_BASE}/community/search?${qs}`,
      { method: 'GET' },
      this.token,
    );
  }

  // notifications
  async getNotifications(
    cursor?: string,
    limit?: number,
  ): Promise<PaginatedResult<CommunityNotification>> {
    const qs = new URLSearchParams();
    if (cursor) qs.set('cursor', cursor);
    if (limit) qs.set('limit', String(limit));
    return safeFetch<PaginatedResult<CommunityNotification>>(
      `${API_BASE}/community/notifications?${qs}`,
      { method: 'GET' },
      this.token,
    );
  }

  async markNotificationRead(id: string): Promise<void> {
    return safeFetch<void>(
      `${API_BASE}/community/notifications/${id}/read`,
      { method: 'PUT' },
      this.token,
    );
  }
}

export const createCommunityApi = (token?: string) => new CommunityApiService(token);
