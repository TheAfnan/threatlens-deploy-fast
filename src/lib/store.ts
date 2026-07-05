import { create } from 'zustand';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppState {
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;

  isProUser: boolean;
  credits: number;
  upgradeToPro: () => void;
  useCredit: () => boolean;
  syncUserStatus: (uid: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
  
  toasts: [],
  addToast: (toast) => set((state) => {
    // Deduplicate: don't stack the same title+type toast
    const isDuplicate = state.toasts.some(
      t => t.title === toast.title && t.type === toast.type
    );
    if (isDuplicate) return state;
    const id = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 11);
    return { toasts: [...state.toasts, { ...toast, id }] };
  }),
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id)
  })),

  // Monetization State
  isProUser: false,
  credits: 5, // Free users start with 5 AI credits
  upgradeToPro: () => set({ isProUser: true, credits: 9999 }),
  useCredit: () => {
    const state = get();
    if (state.isProUser) return true;
    if (state.credits > 0) {
      set({ credits: state.credits - 1 });
      return true;
    }
    return false;
  },
  syncUserStatus: async (uid) => {
    try {
      const response = await fetch(`/api/user-status/${uid}`);
      if (response.ok) {
        const data = await response.json();
        set({
          isProUser: data.isProUser ?? false,
          credits: data.credits ?? 5
        });
      } else {
        console.error('Failed to sync user status from server');
      }
    } catch (error) {
      console.error('Error syncing user status:', error);
    }
  }
}));
