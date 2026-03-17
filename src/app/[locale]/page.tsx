'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 py-12 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Task Enrichment PO
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
            Enriquece tus tareas con IA
          </p>
        </div>

        <div className="space-y-4">
          {isAuthenticated && user ? (
            <>
              <p className="text-gray-700 dark:text-gray-300">
                Hola, <span className="font-semibold">{user.user_metadata?.full_name || user.email}</span>
              </p>
              <Link
                href="/es/dashboard"
                className="inline-block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <p className="text-gray-700 dark:text-gray-300">
                Crea una cuenta o inicia sesión
              </p>
              <div className="flex gap-4">
                <Link
                  href="/es/auth/signup"
                  className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  Registrarse
                </Link>
                <Link
                  href="/es/auth/login"
                  className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
                >
                  Iniciar
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
