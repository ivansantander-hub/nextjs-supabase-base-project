import { useAuthStore } from '@/stores/authStore';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    token,
    setUser,
    setToken,
    setLoading,
    setError,
    logout,
    updateUserPreferences,
  } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    token,
    setUser,
    setToken,
    setLoading,
    setError,
    logout,
    updateUserPreferences,
  };
};
