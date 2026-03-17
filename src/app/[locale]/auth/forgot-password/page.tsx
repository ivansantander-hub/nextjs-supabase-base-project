'use client';

export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from '@/contexts/I18nContext';
import { ForgotPasswordForm } from '@/components/molecules/ForgotPasswordForm';
import { ThemeSwitcher } from '@/components/atoms/ThemeSwitcher';
import { LanguageSelector } from '@/components/atoms/LanguageSelector';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const t = useTranslations('auth');
  const params = useParams();
  const locale = (params?.locale as string) || 'es';

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

      <div className="relative min-h-screen flex">
        {/* Left Section - Info */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 py-16">
          <div className="space-y-12">
            {/* Back Link */}
            <Link
              href={`/${locale}/auth/login`}
              className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              {t('backToLogin')}
            </Link>

            {/* Header */}
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h1 className="mt-6 text-4xl font-bold text-slate-900 dark:text-white">
                {t('recoverAccess')}
              </h1>
              <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                {t('sendResetEmail')}
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-6">
              {[
                {
                  step: '1',
                  title: t('enterEmail'),
                  description: t('emailAssociated'),
                },
                {
                  step: '2',
                  title: t('receiveLink'),
                  description: t('sendEmailInstructions'),
                },
                {
                  step: '3',
                  title: t('createNewPassword'),
                  description: t('followEmailLink'),
                },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 font-semibold text-blue-600 dark:text-blue-400">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Note */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t('checkSpamFolder')}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="w-full max-w-md">
            <div className="lg:hidden mb-8">
              <Link
                href={`/${locale}/auth/login`}
                className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                {t('back')}
              </Link>
            </div>
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
