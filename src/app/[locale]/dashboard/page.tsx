'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { ThemeSwitcher } from '@/components/atoms/ThemeSwitcher';
import { LogOut, Mail, User, CheckCircle, Calendar, Settings } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-blue-500 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            Cargando tu dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    router.push('/es/auth/login');
  };

  const userInitials = (((user as any)?.user_metadata?.full_name) || user?.email || '')
    .split(' ')
    .slice(0, 2)
    .map((n: string) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">TE</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Task Enrich
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeSwitcher />
              <Button
                variant="outline"
                size="md"
                icon={<LogOut className="w-4 h-4" />}
                onClick={handleLogout}
              >
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
            ¡Bienvenido de vuelta!
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Aquí está tu panel de control personalizado
          </p>
        </div>

        {/* Success Badge */}
        <div className="mb-8 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-start gap-3 animate-slide-down">
          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-emerald-900 dark:text-emerald-100">
              Autenticación completada
            </p>
            <p className="text-sm text-emerald-700 dark:text-emerald-200">
              Tu sesión está activa y sincronizada con Supabase
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Calendar, label: 'Tareas Hoy', value: '0' },
            { icon: User, label: 'Colaboradores', value: '1' },
            { icon: Settings, label: 'Configuraciones', value: 'Completa' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-lg dark:hover:shadow-lg/20 transition-all duration-300 hover:-translate-y-1 group"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden mb-8 animate-slide-up">
          {/* Card Header */}
          <div className="h-24 bg-gradient-to-r from-blue-600 to-emerald-500"></div>

          {/* Card Content */}
          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="flex items-end gap-4 -mt-12 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 border-4 border-white dark:border-slate-800 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {userInitials}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {((user as any)?.user_metadata?.full_name) || 'Usuario'}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Miembro desde hoy
                </p>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <Mail className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Email
                  </p>
                  <p className="font-mono text-sm text-slate-900 dark:text-white">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Verificación
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    ✓ Completada
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Estado
                  </p>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Activo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 dark:from-blue-500/5 dark:to-emerald-500/5 border border-blue-200/50 dark:border-blue-800/50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            🚀 Próximas funcionalidades
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Estamos trabajando en nuevas características extraordinarias para tu productividad
          </p>
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            Gestión de tareas avanzada
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            Colaboración en tiempo real
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '0.6s' }}></div>
          </div>
        </div>
      </main>
    </div>
  );
}
