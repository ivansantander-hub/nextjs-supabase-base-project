'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'es';
  const { signIn, loading, error } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email || !password) {
      setFormError('Por favor completa todos los campos');
      return;
    }

    const { success, error } = await signIn(email, password);
    if (success) {
      if (onSuccess) onSuccess();
      router.push(`/${locale}/dashboard`);
    } else {
      setFormError(error?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md animate-fade-in">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Bienvenido de vuelta
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Inicia sesión en tu cuenta
        </p>
      </div>

      {/* Error Message */}
      {(formError || error) && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 animate-slide-down">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-red-700 dark:text-red-300">
            {formError || error?.message}
          </p>
        </div>
      )}

      {/* Email Input */}
      <div className="relative">
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField(null)}
          placeholder="tú@ejemplo.com"
          disabled={loading}
          label="Correo electrónico"
          icon={<Mail className="w-5 h-5" />}
          iconPosition="left"
          required
        />
      </div>

      {/* Password Input */}
      <div className="relative">
        <div className="flex items-center justify-between gap-2 mb-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Contraseña
          </label>
          <Link
            href={`/${locale}/auth/forgot-password`}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setFocusedField('password')}
          onBlur={() => setFocusedField(null)}
          placeholder="••••••••"
          disabled={loading}
          icon={<Lock className="w-5 h-5" />}
          iconPosition="left"
          required
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        size="lg"
        isLoading={loading}
        className="w-full mt-8"
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">
            ¿No tienes cuenta?
          </span>
        </div>
      </div>

      {/* Signup Link */}
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        onClick={() => router.push(`/${locale}/auth/signup`)}
      >
        Crear cuenta
      </Button>

      {/* Footer */}
      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
        Al iniciar sesión, aceptas nuestros términos de servicio
      </p>
    </form>
  );
}
