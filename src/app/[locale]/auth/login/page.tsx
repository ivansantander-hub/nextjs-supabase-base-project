'use client';

import Link from 'next/link';
import { LoginForm } from '@/components/molecules/LoginForm';
import { ThemeSwitcher } from '@/components/atoms/ThemeSwitcher';
import { LanguageSelector } from '@/components/atoms/LanguageSelector';
import { ArrowRight, Zap, Shield, Rocket } from 'lucide-react';

export default function LoginPage() {
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
        {/* Left Section - Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 py-16">
          <div className="space-y-12">
            {/* Logo/Brand */}
            <div>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <h1 className="mt-6 text-4xl font-bold text-slate-900 dark:text-white">
                Task Enrich
              </h1>
              <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                Enriquece tus tareas, multiplica tu productividad
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-6">
              {[
                {
                  icon: Zap,
                  title: 'Súper rápido',
                  description: 'Interfaz optimizada para máxima productividad',
                },
                {
                  icon: Shield,
                  title: 'Seguro',
                  description: 'Tus datos protegidos con encriptación de nivel empresarial',
                },
                {
                  icon: Rocket,
                  title: 'Potente',
                  description: 'Herramientas avanzadas para gestionar cualquier proyecto',
                },
              ].map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Testimonial */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
              <blockquote className="text-sm italic text-slate-700 dark:text-slate-300">
                "Task Enrich ha transformado cómo organizo mi trabajo. Es simplemente increíble."
              </blockquote>
              <p className="mt-3 font-semibold text-slate-900 dark:text-white">
                — Sofia García, Product Manager
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="w-full">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
