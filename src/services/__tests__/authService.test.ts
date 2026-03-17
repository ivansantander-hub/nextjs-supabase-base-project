import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signUp, signIn, signOut, getCurrentUser } from '../authService';
import { supabase } from '../supabaseClient';

vi.mock('../supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
    },
  },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signUp', () => {
    it('should sign up a new user with email and password', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        user_metadata: { full_name: 'Test User' },
      };

      vi.mocked(supabase.auth.signUp).mockResolvedValueOnce({
        data: { user: mockUser as any },
        error: null,
      });

      const result = await signUp('test@example.com', 'password', 'Test User');

      expect(result.user).toEqual({
        id: '123',
        email: 'test@example.com',
        user_metadata: { full_name: 'Test User' },
      });
      expect(result.error).toBeNull();
    });

    it('should return error on signup failure', async () => {
      const error = new Error('Signup failed');
      vi.mocked(supabase.auth.signUp).mockResolvedValueOnce({
        data: { user: null },
        error,
      });

      const result = await signUp('test@example.com', 'password');

      expect(result.user).toBeNull();
      expect(result.error).toEqual(error);
    });
  });

  describe('signIn', () => {
    it('should sign in user with email and password', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        user_metadata: {},
      };

      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
        data: { user: mockUser as any, session: null },
        error: null,
      });

      const result = await signIn('test@example.com', 'password');

      expect(result.user?.email).toBe('test@example.com');
      expect(result.error).toBeNull();
    });

    it('should return error on signin failure', async () => {
      const error = new Error('Invalid credentials');
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
        data: { user: null, session: null },
        error,
      });

      const result = await signIn('test@example.com', 'wrongpassword');

      expect(result.user).toBeNull();
      expect(result.error).toEqual(error);
    });
  });

  describe('signOut', () => {
    it('should sign out the user', async () => {
      vi.mocked(supabase.auth.signOut).mockResolvedValueOnce({
        error: null,
      });

      const result = await signOut();

      expect(result.error).toBeNull();
    });

    it('should return error on signout failure', async () => {
      const error = new Error('Signout failed');
      vi.mocked(supabase.auth.signOut).mockResolvedValueOnce({
        error,
      });

      const result = await signOut();

      expect(result.error).toEqual(error);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        user_metadata: {},
      };

      vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({
        data: { user: mockUser as any },
        error: null,
      });

      const result = await getCurrentUser();

      expect(result?.email).toBe('test@example.com');
    });

    it('should return null if no user is logged in', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({
        data: { user: null },
        error: null,
      });

      const result = await getCurrentUser();

      expect(result).toBeNull();
    });
  });
});
