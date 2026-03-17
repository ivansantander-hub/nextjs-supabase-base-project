'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from '@/contexts/I18nContext';
import { useParams } from 'next/navigation';
import { Button, Input } from '@/components/atoms';
import { cn } from '@/lib/utils';
import { supabase } from '@/services/supabaseClient';
import { AlertCircle, CheckCircle, Lock } from 'lucide-react';

export interface ResetPasswordFormProps {
  accessToken?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function ResetPasswordForm({
  accessToken,
  onSuccess,
  onError,
}: ResetPasswordFormProps) {
  const t = useTranslations('auth');
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'es';

  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [passwordMismatch, setPasswordMismatch] = React.useState(false);

  React.useEffect(() => {
    // Check if token exists
    if (!accessToken) {
      setError(t('invalidToken'));
    }
  }, [accessToken, t]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    if (confirmPassword && e.target.value !== confirmPassword) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (newPassword && newPassword !== e.target.value) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!newPassword || !confirmPassword) {
      setError(t('requiredFields'));
      onError?.(t('requiredFields'));
      return;
    }

    if (newPassword.length < 6) {
      setError(t('passwordMinLength'));
      onError?.(t('passwordMinLength'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t('passwordMismatch'));
      onError?.(t('passwordMismatch'));
      return;
    }

    if (!accessToken) {
      setError(t('invalidToken'));
      onError?.(t('invalidToken'));
      return;
    }

    setIsLoading(true);

    try {
      // Create a new session with the access token
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: '',
      });

      if (sessionError) {
        throw sessionError;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      onSuccess?.();

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push(`/${locale}/auth/login`);
      }, 2000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t('resetPasswordFailed');
      setError(message);
      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className={cn(
          'p-6 rounded-lg border-2',
          'bg-emerald-50 dark:bg-emerald-950/30',
          'border-emerald-200 dark:border-emerald-800',
          'animate-fade-in'
        )}
      >
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-300 mb-2">
              {t('resetSuccess')}
            </h3>
            <p className="text-emerald-700 dark:text-emerald-400 text-sm">
              {t('resetSuccess')} {t('redirectingToLogin')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md animate-fade-in">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {t('resetPasswordTitle')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {t('resetPasswordDesc')}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 animate-slide-down">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-red-700 dark:text-red-300">
            {error}
          </p>
        </div>
      )}

      {/* New Password Input */}
      <div className="relative">
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={handlePasswordChange}
          placeholder="••••••••"
          disabled={isLoading}
          label={t('newPassword')}
          icon={<Lock className="w-5 h-5" />}
          iconPosition="left"
          required
        />
      </div>

      {/* Confirm Password Input */}
      <div className="relative">
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          placeholder="••••••••"
          disabled={isLoading}
          label={t('confirmPassword')}
          icon={<Lock className="w-5 h-5" />}
          iconPosition="left"
          error={passwordMismatch ? t('passwordMismatch') : undefined}
          required
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading || !newPassword || !confirmPassword || passwordMismatch}
        size="lg"
        isLoading={isLoading}
        className="w-full mt-8"
      >
        {isLoading ? t('resetPassword') : t('resetPassword')}
      </Button>

      {/* Footer Link */}
      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        {t('rememberPassword')}{' '}
        <Link
          href={`/${locale}/auth/login`}
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          {t('backToLogin')}
        </Link>
      </p>
    </form>
  );
}
