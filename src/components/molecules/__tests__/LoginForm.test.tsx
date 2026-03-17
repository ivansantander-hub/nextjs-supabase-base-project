import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

vi.mock('@/hooks/useAuth');
vi.mock('next/navigation');
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      error: null,
      isInitialized: true,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      isAuthenticated: false,
    });
    vi.mocked(useRouter).mockReturnValue({
      push: vi.fn(),
      refresh: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(),
    } as any);
  });

  it('should render login form', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/auth.email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/auth.password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /auth.login/i })).toBeInTheDocument();
  });

  it('should show validation error when fields are empty', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /auth.login/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/auth.validation.requiredFields/i)).toBeInTheDocument();
    });
  });

  it('should call signIn when form is submitted with valid data', async () => {
    const user = userEvent.setup();
    const mockSignIn = vi.fn().mockResolvedValue({ success: true });

    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      error: null,
      isInitialized: true,
      signIn: mockSignIn,
      signUp: vi.fn(),
      signOut: vi.fn(),
      isAuthenticated: false,
    });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/auth.email/i);
    const passwordInput = screen.getByLabelText(/auth.password/i);
    const submitButton = screen.getByRole('button', { name: /auth.login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should display loading state while signing in', async () => {
    const user = userEvent.setup();

    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: true,
      error: null,
      isInitialized: true,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      isAuthenticated: false,
    });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/auth.email/i) as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /auth.loading/i });

    expect(emailInput.disabled).toBe(true);
    expect(submitButton.disabled).toBe(true);
  });

  it('should display error message on login failure', () => {
    const error = new Error('Invalid credentials');
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      error,
      isInitialized: true,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      isAuthenticated: false,
    });

    render(<LoginForm />);

    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
});
