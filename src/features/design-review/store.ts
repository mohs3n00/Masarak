import { create } from 'zustand';

export type ViewportSize = 'responsive' | 'mobile-320' | 'mobile-375' | 'mobile-390' | 'mobile-430' | 'tablet-768' | 'tablet-1024' | 'desktop-1280' | 'desktop-1366' | 'desktop-1440' | 'desktop-1600' | 'desktop-1920';
export type ThemeType = 'light' | 'dark';
export type DirType = 'ltr' | 'rtl';
export type DataState = 'default' | 'empty' | 'loading' | 'error' | 'success' | 'large' | 'small' | 'offline' | 'slow' | 'unauthorized' | 'forbidden' | 'no-results';

interface DesignReviewState {
  viewport: ViewportSize;
  theme: ThemeType;
  dir: DirType;
  dataState: DataState;
  animations: boolean;
  hudVisible: boolean;
  
  setViewport: (v: ViewportSize) => void;
  setTheme: (t: ThemeType) => void;
  setDir: (d: DirType) => void;
  setDataState: (ds: DataState) => void;
  toggleAnimations: () => void;
  toggleHud: () => void;
}

export const useDesignReviewStore = create<DesignReviewState>((set) => ({
  viewport: 'responsive',
  theme: 'light',
  dir: 'rtl', // Changed default to rtl since Masarak is an Arabic platform
  dataState: 'default',
  animations: true,
  hudVisible: false,

  setViewport: (viewport) => set({ viewport }),
  setTheme: (theme) => set({ theme }),
  setDir: (dir) => set({ dir }),
  setDataState: (dataState) => set({ dataState }),
  toggleAnimations: () => set((state) => ({ animations: !state.animations })),
  toggleHud: () => set((state) => ({ hudVisible: !state.hudVisible })),
}));

export const viewportWidths: Record<ViewportSize, string> = {
  'responsive': '100%',
  'mobile-320': '320px',
  'mobile-375': '375px',
  'mobile-390': '390px',
  'mobile-430': '430px',
  'tablet-768': '768px',
  'tablet-1024': '1024px',
  'desktop-1280': '1280px',
  'desktop-1366': '1366px',
  'desktop-1440': '1440px',
  'desktop-1600': '1600px',
  'desktop-1920': '1920px',
};
