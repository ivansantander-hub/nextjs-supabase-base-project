'use client'

import React from 'react'
import { useTranslations } from '@/contexts/I18nContext'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button, Input } from '@/components/atoms'
import { cn } from '@/lib/utils'
import { supabase } from '@/services/supabaseClient'
import { AlertCircle, CheckCircle } from 'lucide-react'

export interface ForgotPasswordFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function ForgotPasswordForm({ onSuccess, onError }: ForgotPasswordFormProps) {
  const t = useTranslations('auth')
  const params = useParams()
  const locale = (params?.locale as string) || 'es'

  const [email, setEmail] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState(false)

  const getOrigin = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin
    }
    return 'http://localhost:3000'
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!email) {
      setError(t('emailRequired'))
      onError?.(t('emailRequired'))
      return
    }

    setIsLoading(true)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getOrigin()}/${locale}/auth/reset-password`,
      })

      if (resetError) {
        throw resetError
      }

      setSuccess(true)
      setEmail('')
      onSuccess?.()
    } catch (err) {
      const message = err instanceof Error ? err.message : t('resetPasswordFailed')
      setError(message)
      onError?.(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className={cn(
        'p-6 rounded-lg border-2',
        'bg-emerald-50 dark:bg-emerald-950/30',
        'border-emerald-200 dark:border-emerald-800',
        'animate-fade-in'
      )}>
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-300 mb-2">
              {t('checkEmail')}
            </h3>
            <p className="text-emerald-700 dark:text-emerald-400 text-sm">
              {t('resetLinkSent').replace('{email}', email)}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md animate-fade-in">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          {t('resetPassword')}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t('resetPasswordDesc')}
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 animate-slide-down">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-red-700 dark:text-red-300">
            {error}
          </p>
        </div>
      )}

      <Input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        label={t('email')}
      />

      <Button
        type="submit"
        isLoading={isLoading}
        disabled={isLoading || !email}
        className="w-full"
      >
        {isLoading ? t('sending') : t('sendResetLink')}
      </Button>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        {t('rememberPassword')}{' '}
        <Link
          href={`/${locale}/auth/login`}
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          {t('backToLogin')}
        </Link>
      </p>
    </form>
  )
}
