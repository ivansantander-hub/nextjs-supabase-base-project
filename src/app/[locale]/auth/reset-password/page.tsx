'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from '@/contexts/I18nContext';
import { ResetPasswordForm } from '@/components/molecules/ResetPasswordForm';
import { ThemeSwitcher } from '@/components/atoms/ThemeSwitcher';
import { LanguageSelector } from '@/components/atoms/LanguageSelector';
import { AlertCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'es';
  const t = useTranslations('auth');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isInvalidToken, setIsInvalidToken] = useState(false);

  useEffect(() => {
    // Extract token from URL hash fragment
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1)); // Remove the # at the start
    const token = params.get('access_token');

    if (!token) {
      setIsInvalidToken(true);
    } else {
      setAccessToken(token);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 overflow-hidden">
      {/* Header Controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-4">
        <LanguageSelector />
        <ThemeSwitcher />
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-blue-600/0 rounded-full blur-3xl dark:from-blue-500/20 dark:to-blue-700/0"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 to-emerald-600/0 rounded-full blur-3xl dark:from-emerald-500/20 dark:to-emerald-700/0"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="w-full max-w-md">
          {isInvalidToken ? (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-semibold text-red-900 dark:text-red-300 mb-1">
                    {t('invalidToken')}
                  </h2>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {t('invalidToken')}
                  </p>
                </div>
              </div>

              <Link
                href={`/${locale}/auth/forgot-password`}
                className="block w-full px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors text-center"
              >
                {t('sendResetLink')}
              </Link>
            </div>
          ) : accessToken ? (
            <ResetPasswordForm accessToken={accessToken} />
          ) : (
            <div className="text-center text-slate-600 dark:text-slate-400">
              {t('loading')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
