'use client';

import Link from 'next/link';
import { SignupForm } from '@/components/molecules/SignupForm';
import { ThemeSwitcher } from '@/components/atoms/ThemeSwitcher';
import { CheckCircle, Users, Zap, TrendingUp } from 'lucide-react';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 overflow-hidden">
      {/* Theme Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeSwitcher />
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-gradient-to-bl from-purple-300/20 to-pink-300/0 rounded-full blur-3xl dark:from-purple-500/20 dark:to-pink-500/0"></div>
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-gradient-to-tr from-cyan-300/20 to-blue-300/0 rounded-full blur-3xl dark:from-cyan-500/20 dark:to-blue-500/0"></div>
      </div>

      <div className="relative min-h-screen flex">
        {/* Left Section - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-16 order-2 lg:order-1">
          <div className="w-full">
            <SignupForm />
          </div>
        </div>

        {/* Right Section - Benefits */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 py-16 order-1 lg:order-2">
          <div className="space-y-12">
            {/* Header */}
            <div>
              <div className="inline-block">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  Únete a miles de usuarios
                </span>
              </div>
              <h2 className="mt-6 text-4xl font-bold text-slate-900 dark:text-white">
                Comienza tu viaje hoy
              </h2>
              <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
                Gestiona tus tareas de forma más inteligente y colaborativa
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              {[
                'Crea y organiza tareas ilimitadas',
                'Colabora en tiempo real con tu equipo',
                'Automatiza flujos de trabajo repetitivos',
                'Acceso desde cualquier dispositivo',
                'Historial y análisis de productividad',
                'Integraciones con tus herramientas favoritas',
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3 group">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            {/* Social Proof */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Confían en nosotros
              </p>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[
                    'bg-gradient-to-br from-blue-400 to-blue-600',
                    'bg-gradient-to-br from-pink-400 to-pink-600',
                    'bg-gradient-to-br from-emerald-400 to-emerald-600',
                    'bg-gradient-to-br from-purple-400 to-purple-600',
                  ].map((grad, idx) => (
                    <div
                      key={idx}
                      className={`w-10 h-10 rounded-full ${grad} border-2 border-white dark:border-slate-900 flex items-center justify-center`}
                    >
                      <Users className="w-5 h-5 text-white" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    5,000+
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    usuarios activos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
