import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'tpo' | 'viewer' | 'integration';
  theme_preference: 'light' | 'dark' | 'auto';
  language_preference: 'es' | 'en';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  refreshToken: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null, refreshToken: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  updateUserPreferences: (preferences: Partial<Pick<User, 'theme_preference' | 'language_preference'>>) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    token: null,
    refreshToken: null,

    setUser: (user) => set({ user, isAuthenticated: !!user }),
    setToken: (token, refreshToken) => set({ token, refreshToken }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    logout: () => set({
      user: null,
      isAuthenticated: false,
      token: null,
      refreshToken: null,
      error: null,
    }),
    updateUserPreferences: (preferences) => set((state) => ({
      user: state.user ? { ...state.user, ...preferences } : null,
    })),
  }))
);
