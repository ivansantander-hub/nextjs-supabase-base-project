'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';

interface SignupFormProps {
  onSuccess?: () => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const router = useRouter();
  const { signUp, loading, error } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 10) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);
    setPasswordStrength(calculatePasswordStrength(pwd));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email || !password) {
      setFormError('Por favor completa los campos requeridos');
      return;
    }

    if (password.length < 6) {
      setFormError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const { success, error } = await signUp(email, password, fullName);
    if (success) {
      if (onSuccess) onSuccess();
      router.push('/es/dashboard');
    } else {
      setFormError(error?.message || 'Error al registrarse');
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-slate-200 dark:bg-slate-700';
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 2) return 'Contraseña débil';
    if (passwordStrength <= 3) return 'Contraseña media';
    return 'Contraseña fuerte';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md animate-fade-in">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Crear cuenta
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Únete a nuestra plataforma hoy
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

      {/* Full Name Input */}
      <div className="relative">
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Juan Pérez"
          disabled={loading}
          label="Nombre completo (opcional)"
          icon={<User className="w-5 h-5" />}
          iconPosition="left"
          hint="Nos ayuda a personalizarte la experiencia"
        />
      </div>

      {/* Email Input */}
      <div className="relative">
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tú@ejemplo.com"
          disabled={loading}
          label="Correo electrónico"
          icon={<Mail className="w-5 h-5" />}
          iconPosition="left"
          required
        />
      </div>

      {/* Password Input */}
      <div className="space-y-3">
        <Input
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="••••••••"
          disabled={loading}
          label="Contraseña"
          icon={<Lock className="w-5 h-5" />}
          iconPosition="left"
          hint="Mínimo 6 caracteres"
          required
        />

        {/* Password Strength Indicator */}
        {password && (
          <div className="space-y-2 animate-slide-down">
            <div className="flex items-center justify-between">
              <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                ></div>
              </div>
              {passwordStrength >= 4 && (
                <CheckCircle className="w-4 h-4 text-green-500 ml-2 flex-shrink-0" />
              )}
            </div>
            <p className={`text-xs font-medium ${
              passwordStrength <= 2 ? 'text-red-600 dark:text-red-400' :
              passwordStrength <= 3 ? 'text-yellow-600 dark:text-yellow-400' :
              'text-green-600 dark:text-green-400'
            }`}>
              {getPasswordStrengthText()}
            </p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading || !email || !password}
        size="lg"
        isLoading={loading}
        className="w-full mt-8"
      >
        {loading ? 'Registrando...' : 'Crear cuenta'}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">
            ¿Ya tienes cuenta?
          </span>
        </div>
      </div>

      {/* Login Link */}
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        onClick={() => router.push('/es/auth/login')}
      >
        Iniciar sesión
      </Button>

      {/* Footer */}
      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
        Al registrarte, aceptas nuestros términos de servicio y política de privacidad
      </p>
    </form>
  );
}
