import { create } from 'zustand';

interface UserData {
  uid: string;
  name: string;
  chosenIdentity: string;
  goals: string[];
  habits: string[];
  futureFaceUrl?: string;
  xp: number;
  streak: number;
}

interface AppState {
  user: UserData | null;
  hasSeenIntro: boolean;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  setUser: (user: UserData | null) => void;
  setHasSeenIntro: (status: boolean) => void;
  setAuthenticated: (status: boolean) => void;
  setOnboardingComplete: (status: boolean) => void;
  updateUserField: (field: Partial<UserData>) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  hasSeenIntro: false,
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  setUser: (user) => set({ user }),
  setHasSeenIntro: (status) => set({ hasSeenIntro: status }),
  setAuthenticated: (status) => set({ isAuthenticated: status }),
  setOnboardingComplete: (status) => set({ hasCompletedOnboarding: status }),
  updateUserField: (field) => set((state) => ({ user: state.user ? { ...state.user, ...field } : null })),
}));
