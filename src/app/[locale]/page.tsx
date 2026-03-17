'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const t = useTranslations('common');
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 py-12 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {t('appName')}
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
            Enriquece tus tareas técnicas con IA
          </p>
        </div>

        <div className="space-y-4">
          {isAuthenticated && user ? (
            <>
              <p className="text-gray-700 dark:text-gray-300">
                Hola, <span className="font-semibold">{user.user_metadata?.full_name || user.email}</span>
              </p>
              <Link
                href="/dashboard"
                className="inline-block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Ir al Dashboard
              </Link>
            </>
          ) : (
            <>
              <p className="text-gray-700 dark:text-gray-300">
                Comienza por crear una cuenta o inicia sesión
              </p>
              <div className="flex gap-4">
                <Link
                  href="/auth/signup"
                  className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  Registrarse
                </Link>
                <Link
                  href="/auth/login"
                  className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
                >
                  Iniciar Sesión
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
