'use client';

import Link from 'next/link';
import { SignupForm } from '@/components/molecules/SignupForm';
import { useTranslations } from 'next-intl';

export default function SignupPage() {
  const t = useTranslations('auth');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            {t('signupTitle')}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('haveAccount')}{' '}
            <Link
              href="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              {t('login')}
            </Link>
          </p>
        </div>

        <SignupForm />
      </div>
    </div>
  );
}
