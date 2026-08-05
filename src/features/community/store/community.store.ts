import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CommunityState {
  activeSpaceId: string | null;
  isCreatePostModalOpen: boolean;
  joinedSpaceIds: string[];
  savedPostIds: string[];
  userReactions: Record<string, string>;
  setActiveSpaceId: (id: string | null) => void;
  setCreatePostModalOpen: (isOpen: boolean) => void;
  toggleJoinSpace: (spaceId: string) => void;
  isJoined: (spaceId: string) => boolean;
  toggleSavePost: (postId: string) => void;
  isSaved: (postId: string) => boolean;
  setSavedPosts: (postIds: string[]) => void;
  setJoinedSpaces: (spaceIds: string[]) => void;
  setUserReaction: (postId: string, emoji: string | null) => void;
  getUserReaction: (postId: string) => string | undefined;
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      activeSpaceId: null,
      isCreatePostModalOpen: false,
      joinedSpaceIds: [],
      savedPostIds: [],
      userReactions: {},
      setActiveSpaceId: (id) => set({ activeSpaceId: id }),
      setCreatePostModalOpen: (isOpen) => set({ isCreatePostModalOpen: isOpen }),
      toggleJoinSpace: (spaceId) =>
        set((state) => ({
          joinedSpaceIds: state.joinedSpaceIds.includes(spaceId)
            ? state.joinedSpaceIds.filter((id) => id !== spaceId)
            : [...state.joinedSpaceIds, spaceId],
        })),
      isJoined: (spaceId) => get().joinedSpaceIds.includes(spaceId),
      toggleSavePost: (postId) =>
        set((state) => ({
          savedPostIds: state.savedPostIds.includes(postId)
            ? state.savedPostIds.filter((id) => id !== postId)
            : [...state.savedPostIds, postId],
        })),
      isSaved: (postId) => get().savedPostIds.includes(postId),
      setSavedPosts: (postIds) => set({ savedPostIds: postIds }),
      setJoinedSpaces: (spaceIds) => set({ joinedSpaceIds: spaceIds }),
      setUserReaction: (postId, emoji) =>
        set((state) => {
          const updated = { ...state.userReactions };
          if (emoji === null || emoji === undefined) {
            delete updated[postId];
          } else {
            updated[postId] = emoji;
          }
          return { userReactions: updated };
        }),
      getUserReaction: (postId) => get().userReactions[postId],
    }),
    {
      name: 'masarak-community-storage',
      partialize: (state) => ({ 
        savedPostIds: state.savedPostIds,
        joinedSpaceIds: state.joinedSpaceIds,
        userReactions: state.userReactions,
      }),
    }
  )
);

