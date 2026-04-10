import { create } from 'zustand';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  duration?: number; // In minutes
  insight?: string;
  suggestedDuration?: number;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export const DAYS_OF_WEEK: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export interface WeeklyPlan {
  [key: string]: Task[]; // keyed by DayOfWeek
}

interface UserData {
  uid: string;
  name: string;
  chosenIdentity: string;
  goals: string[];
  habits: string[]; // weaknesses
  hobbies: string[];
  strengths: string[];
  imageUri?: string;
  futureFaceUrl?: string;
  xp: number;
  streak: number;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'future-self';
  timestamp: number;
}

interface AppState {
  user: UserData | null;
  hasSeenIntro: boolean;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  weeklyPlan: WeeklyPlan;
  chatHistory: ChatMessage[];
  setUser: (user: UserData | null) => void;
  setHasSeenIntro: (status: boolean) => void;
  setAuthenticated: (status: boolean) => void;
  setOnboardingComplete: (status: boolean) => void;
  updateUserField: (field: Partial<UserData>) => void;
  // Weekly plan actions
  addTask: (day: DayOfWeek, task: Task) => void;
  updateTask: (day: DayOfWeek, taskId: string, updates: Partial<Task>) => void;
  toggleTask: (day: DayOfWeek, taskId: string) => void;
  removeTask: (day: DayOfWeek, taskId: string) => void;
  resetWeeklyPlan: () => void;
  // Chat actions
  addChatMessage: (message: ChatMessage) => void;
  clearChatHistory: () => void;
}

const createEmptyWeek = (): WeeklyPlan => {
  const plan: WeeklyPlan = {};
  DAYS_OF_WEEK.forEach(day => { plan[day] = []; });
  return plan;
};

export const useStore = create<AppState>((set) => ({
  user: null,
  hasSeenIntro: false,
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  weeklyPlan: createEmptyWeek(),
  chatHistory: [],
  setUser: (user) => set({ user }),
  setHasSeenIntro: (status) => set({ hasSeenIntro: status }),
  setAuthenticated: (status) => set({ isAuthenticated: status }),
  setOnboardingComplete: (status) => set({ hasCompletedOnboarding: status }),
  updateUserField: (field) => set((state) => ({ user: state.user ? { ...state.user, ...field } : null })),
  // Weekly plan
  addTask: (day, task) => set((state) => ({
    weeklyPlan: {
      ...state.weeklyPlan,
      [day]: [...(state.weeklyPlan[day] || []), task],
    }
  })),
  updateTask: (day, taskId, updates) => set((state) => ({
    weeklyPlan: {
      ...state.weeklyPlan,
      [day]: (state.weeklyPlan[day] || []).map(t =>
        t.id === taskId ? { ...t, ...updates } : t
      ),
    }
  })),
  toggleTask: (day, taskId) => set((state) => ({
    weeklyPlan: {
      ...state.weeklyPlan,
      [day]: (state.weeklyPlan[day] || []).map(t =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ),
    }
  })),
  removeTask: (day, taskId) => set((state) => ({
    weeklyPlan: {
      ...state.weeklyPlan,
      [day]: (state.weeklyPlan[day] || []).filter(t => t.id !== taskId),
    }
  })),
  resetWeeklyPlan: () => set({ weeklyPlan: createEmptyWeek() }),
  // Chat
  addChatMessage: (message) => set((state) => ({
    chatHistory: [...state.chatHistory, message],
  })),
  clearChatHistory: () => set({ chatHistory: [] }),
}));
