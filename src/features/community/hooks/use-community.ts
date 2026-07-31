import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createCommunityApi } from '../services/community-api.service';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { CommunityPost, CommunityComment, CommunitySpace } from '../types';

export const useCommunityApi = () => {
  const { accessToken } = useAuthStore();
  return createCommunityApi(accessToken || undefined);
};

// --- Spaces ---
export const useSpaces = () => {
  const api = useCommunityApi();
  return useQuery({
    queryKey: ['community', 'spaces'],
    queryFn: () => api.getSpaces(),
  });
};

// --- Posts ---
export const useFeed = (spaceId?: string, cursor?: string, limit?: number) => {
  const api = useCommunityApi();
  return useQuery({
    queryKey: ['community', 'feed', spaceId, cursor, limit],
    queryFn: () => api.getFeed(spaceId, cursor, limit),
  });
};

export const usePost = (id: string) => {
  const api = useCommunityApi();
  return useQuery({
    queryKey: ['community', 'post', id],
    queryFn: () => api.getPost(id),
    enabled: !!id,
  });
};

export const useCreatePost = () => {
  const api = useCommunityApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<CommunityPost>) => api.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', 'feed'] });
    },
  });
};

export const useUpdatePost = () => {
  const api = useCommunityApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CommunityPost> }) => api.updatePost(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['community', 'post', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['community', 'feed'] });
    },
  });
};

export const useDeletePost = () => {
  const api = useCommunityApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', 'feed'] });
    },
  });
};

// --- Comments ---
export const useComments = (postId: string, cursor?: string, limit?: number) => {
  const api = useCommunityApi();
  return useQuery({
    queryKey: ['community', 'comments', postId, cursor, limit],
    queryFn: () => api.getComments(postId, cursor, limit),
    enabled: !!postId,
  });
};

export const useCreateComment = () => {
  const api = useCommunityApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: { content: string; parentId?: string } }) =>
      api.createComment(postId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['community', 'comments', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['community', 'post', variables.postId] });
    },
  });
};

export const useDeleteComment = () => {
  const api = useCommunityApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteComment(id),
    onSuccess: () => {
      // Might want to invalidate specific post's comments, but we lack postId in the delete payload here
      // Broad invalidation for simplicity
      queryClient.invalidateQueries({ queryKey: ['community', 'comments'] });
      queryClient.invalidateQueries({ queryKey: ['community', 'post'] });
    },
  });
};

// --- Reactions ---
export const useToggleReaction = () => {
  const api = useCommunityApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ targetType, targetId, type }: { targetType: 'post' | 'comment'; targetId: string; type: string }) =>
      api.toggleReaction(targetType, targetId, type),
    onSuccess: (_, variables) => {
      if (variables.targetType === 'post') {
        queryClient.invalidateQueries({ queryKey: ['community', 'post', variables.targetId] });
        queryClient.invalidateQueries({ queryKey: ['community', 'feed'] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['community', 'comments'] });
      }
    },
  });
};

// --- Attachments ---
export const useUploadAttachment = () => {
  const api = useCommunityApi();
  return useMutation({
    mutationFn: ({ postId, file }: { postId: string; file: File }) => api.uploadAttachment(postId, file),
  });
};

// --- Search ---
export const useCommunitySearch = (q: string, spaceId?: string) => {
  const api = useCommunityApi();
  return useQuery({
    queryKey: ['community', 'search', q, spaceId],
    queryFn: () => api.search(q, spaceId),
    enabled: !!q,
  });
};

// --- Notifications ---
export const useNotifications = () => {
  const api = useCommunityApi();
  return useQuery({
    queryKey: ['community', 'notifications'],
    queryFn: () => api.getNotifications(),
  });
};

export const useMarkNotificationRead = () => {
  const api = useCommunityApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community', 'notifications'] });
    },
  });
};
