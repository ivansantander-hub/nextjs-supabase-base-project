import { supabase } from './supabaseClient';

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    theme_preference?: 'light' | 'dark' | 'auto';
    language_preference?: 'es' | 'en';
  };
}

export interface AuthResponse {
  user: AuthUser | null;
  error: Error | null;
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(
  email: string,
  password: string,
  fullName?: string
): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || email.split('@')[0],
          theme_preference: 'auto',
          language_preference: 'es',
        },
      },
    });

    if (error) throw error;

    return {
      user: data.user
        ? {
            id: data.user.id,
            email: data.user.email || '',
            user_metadata: data.user.user_metadata as any,
          }
        : null,
      error: null,
    };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error : new Error('Sign up failed'),
    };
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return {
      user: data.user
        ? {
            id: data.user.id,
            email: data.user.email || '',
            user_metadata: data.user.user_metadata as any,
          }
        : null,
      error: null,
    };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error : new Error('Sign in failed'),
    };
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error('Sign out failed'),
    };
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;

    return {
      id: data.user.id,
      email: data.user.email || '',
      user_metadata: data.user.user_metadata as any,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Get current session
 */
export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    return null;
  }
}

/**
 * Refresh access token
 */
export async function refreshSession() {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return { session: data.session, error: null };
  } catch (error) {
    return {
      session: null,
      error: error instanceof Error ? error : new Error('Refresh session failed'),
    };
  }
}

/**
 * Update user profile (theme, language preferences)
 */
export async function updateUserPreferences(preferences: {
  theme_preference?: 'light' | 'dark' | 'auto';
  language_preference?: 'es' | 'en';
  full_name?: string;
}): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: preferences,
    });

    if (error) throw error;

    return {
      user: data.user
        ? {
            id: data.user.id,
            email: data.user.email || '',
            user_metadata: data.user.user_metadata as any,
          }
        : null,
      error: null,
    };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error : new Error('Update preferences failed'),
    };
  }
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email || '',
        user_metadata: session.user.user_metadata as any,
      });
    } else {
      callback(null);
    }
  });
}
