import { create } from 'zustand';

interface CommunityState {
  activeSpaceId: string | null;
  isCreatePostModalOpen: boolean;
  setActiveSpaceId: (id: string | null) => void;
  setCreatePostModalOpen: (isOpen: boolean) => void;
}

export const useCommunityStore = create<CommunityState>((set) => ({
  activeSpaceId: null,
  isCreatePostModalOpen: false,
  setActiveSpaceId: (id) => set({ activeSpaceId: id }),
  setCreatePostModalOpen: (isOpen) => set({ isCreatePostModalOpen: isOpen }),
}));
