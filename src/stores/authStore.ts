import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AuthUser } from '@/services/authService';

export type User = AuthUser;

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  token: string | null;
  refreshToken: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null, refreshToken: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
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
