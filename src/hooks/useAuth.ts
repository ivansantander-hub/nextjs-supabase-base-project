'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { signIn, signUp, signOut, getCurrentUser, onAuthStateChange } from '@/services/authService';

export function useAuth() {
  const { user, loading, error, setUser, setLoading, setError } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const initAuth = async () => {
      try {
        setLoading(true);
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        // Subscribe to auth changes - returns unsubscribe function
        const subscription = onAuthStateChange((authUser) => {
          setUser(authUser);
        });

        // Handle both function and object return types from Supabase
        if (typeof subscription === 'function') {
          unsubscribe = subscription;
        } else if (subscription && typeof subscription.unsubscribe === 'function') {
          unsubscribe = () => subscription.unsubscribe();
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Auth initialization failed'));
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    initAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [setUser, setLoading, setError]);

  const handleSignUp = async (email: string, password: string, fullName?: string) => {
    try {
      setLoading(true);
      setError(null);
      const { user: newUser, error } = await signUp(email, password, fullName);
      if (error) throw error;
      setUser(newUser);
      return { success: true, user: newUser };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Sign up failed');
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { user: authUser, error } = await signIn(email, password);
      if (error) throw error;
      setUser(authUser);
      return { success: true, user: authUser };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Sign in failed');
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await signOut();
      if (error) throw error;
      setUser(null);
      return { success: true };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Sign out failed');
      setError(error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    isInitialized,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    isAuthenticated: !!user,
  };
}
