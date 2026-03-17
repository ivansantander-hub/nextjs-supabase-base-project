'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, signOut, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/es/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            ¡Bienvenido al Dashboard!
          </h1>

          <div className="space-y-4">
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Tu Perfil
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Email: <span className="font-mono">{user.email}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Nombre: <span className="font-semibold">{user.user_metadata?.full_name || 'N/A'}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Tema: <span className="font-semibold">{user.user_metadata?.theme_preference || 'auto'}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Idioma: <span className="font-semibold">{user.user_metadata?.language_preference || 'es'}</span>
              </p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <button
                onClick={async () => {
                  await signOut();
                  router.push('/auth/login');
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              ✅ Autenticación funciona correctamente. Estás conectado a Supabase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
