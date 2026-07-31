import {
  CommunityPost,
  CommunityComment,
  CommunitySpace,
  CommunityReaction,
  CommunityAttachment,
  CommunityNotification,
  PaginatedResult
} from '../types';

let envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
if (envUrl && !envUrl.startsWith('http://') && !envUrl.startsWith('https://')) {
  envUrl = `https://${envUrl}`;
}
const API_BASE = envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;

async function safeFetch<T>(url: string, opts?: RequestInit, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts?.headers as Record<string, string>)
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Remove content-type if it's form data (browser sets it with boundary)
  if (opts?.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const res = await fetch(url, { ...opts, headers });
  
  if (!res.ok) {
    let message = 'An error occurred';
    try {
      const errorData = await res.json();
      message = errorData.message || message;
    } catch {
      message = res.statusText || message;
    }
    throw new Error(message);
  }
  
  // For DELETE requests or empty responses
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return {} as T;
  }
  
  return await res.json();
}

export class CommunityApiService {
  private token?: string;

  constructor(token?: string) {
    this.token = token;
  }

  setToken(token: string) {
    this.token = token;
  }

  // spaces
  async getSpaces(): Promise<CommunitySpace[]> {
    return safeFetch<CommunitySpace[]>(`${API_BASE}/community/spaces`, { method: 'GET' }, this.token);
  }

  // posts
  async getFeed(spaceId?: string, cursor?: string, limit?: number): Promise<PaginatedResult<CommunityPost>> {
    const qs = new URLSearchParams();
    if (spaceId) qs.set('spaceId', spaceId);
    if (cursor) qs.set('cursor', cursor);
    if (limit) qs.set('limit', String(limit));
    return safeFetch<PaginatedResult<CommunityPost>>(`${API_BASE}/community/posts/feed?${qs}`, { method: 'GET' }, this.token);
  }

  async createPost(data: Partial<CommunityPost>): Promise<CommunityPost> {
    return safeFetch<CommunityPost>(`${API_BASE}/community/posts`, {
      method: 'POST',
      body: JSON.stringify(data)
    }, this.token);
  }

  async getPost(id: string): Promise<CommunityPost> {
    return safeFetch<CommunityPost>(`${API_BASE}/community/posts/${id}`, { method: 'GET' }, this.token);
  }

  async updatePost(id: string, data: Partial<CommunityPost>): Promise<CommunityPost> {
    return safeFetch<CommunityPost>(`${API_BASE}/community/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }, this.token);
  }

  async deletePost(id: string): Promise<void> {
    return safeFetch<void>(`${API_BASE}/community/posts/${id}`, { method: 'DELETE' }, this.token);
  }

  // comments
  async getComments(postId: string, cursor?: string, limit?: number): Promise<PaginatedResult<CommunityComment>> {
    const qs = new URLSearchParams();
    if (cursor) qs.set('cursor', cursor);
    if (limit) qs.set('limit', String(limit));
    return safeFetch<PaginatedResult<CommunityComment>>(`${API_BASE}/community/posts/${postId}/comments?${qs}`, { method: 'GET' }, this.token);
  }

  async createComment(postId: string, data: { content: string; parentId?: string }): Promise<CommunityComment> {
    return safeFetch<CommunityComment>(`${API_BASE}/community/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data)
    }, this.token);
  }

  async deleteComment(id: string): Promise<void> {
    return safeFetch<void>(`${API_BASE}/community/comments/${id}`, { method: 'DELETE' }, this.token);
  }

  // reactions
  async toggleReaction(targetType: 'post' | 'comment', targetId: string, type: string): Promise<{ action: string }> {
    return safeFetch<{ action: string }>(`${API_BASE}/community/reactions/${targetType}/${targetId}`, {
      method: 'POST',
      body: JSON.stringify({ type })
    }, this.token);
  }

  // attachments
  async uploadAttachment(postId: string, file: File): Promise<CommunityAttachment> {
    const formData = new FormData();
    formData.append('file', file);
    return safeFetch<CommunityAttachment>(`${API_BASE}/community/posts/${postId}/attachments`, {
      method: 'POST',
      body: formData
    }, this.token);
  }

  // search
  async search(q: string, spaceId?: string, cursor?: string, limit?: number): Promise<PaginatedResult<CommunityPost>> {
    const qs = new URLSearchParams();
    qs.set('q', q);
    if (spaceId) qs.set('spaceId', spaceId);
    if (cursor) qs.set('cursor', cursor);
    if (limit) qs.set('limit', String(limit));
    return safeFetch<PaginatedResult<CommunityPost>>(`${API_BASE}/community/search?${qs}`, { method: 'GET' }, this.token);
  }

  // notifications
  async getNotifications(cursor?: string, limit?: number): Promise<PaginatedResult<CommunityNotification>> {
    const qs = new URLSearchParams();
    if (cursor) qs.set('cursor', cursor);
    if (limit) qs.set('limit', String(limit));
    return safeFetch<PaginatedResult<CommunityNotification>>(`${API_BASE}/community/notifications?${qs}`, { method: 'GET' }, this.token);
  }

  async markNotificationRead(id: string): Promise<void> {
    return safeFetch<void>(`${API_BASE}/community/notifications/${id}/read`, { method: 'PUT' }, this.token);
  }
}

export const createCommunityApi = (token?: string) => new CommunityApiService(token);
