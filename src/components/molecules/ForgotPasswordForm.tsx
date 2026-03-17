'use client'

import React from 'react'
import { Button, Input } from '@/components/atoms'
import { cn } from '@/lib/utils'
import { supabase } from '@/services/supabaseClient'

export interface ForgotPasswordFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function ForgotPasswordForm({ onSuccess, onError }: ForgotPasswordFormProps) {
  const [email, setEmail] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!email) {
      setError('Email is required')
      onError?.('Email is required')
      return
    }

    setIsLoading(true)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (resetError) {
        throw resetError
      }

      setSuccess(true)
      setEmail('')
      onSuccess?.()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reset email'
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
        'border-emerald-200 dark:border-emerald-800'
      )}>
        <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-300 mb-2">
          Check your email
        </h3>
        <p className="text-emerald-700 dark:text-emerald-400">
          We've sent a password reset link to {email}. Please check your inbox and follow the link to reset your password.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
          Reset Password
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {error && (
        <div className={cn(
          'p-4 rounded-lg border-2',
          'bg-red-50 dark:bg-red-950/30',
          'border-red-200 dark:border-red-800',
          'text-red-700 dark:text-red-400 text-sm'
        )}>
          {error}
        </div>
      )}

      <Input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        error={error ? 'Invalid email' : undefined}
        label="Email Address"
      />

      <Button
        type="submit"
        isLoading={isLoading}
        disabled={isLoading || !email}
        className="w-full"
      >
        {isLoading ? 'Sending...' : 'Send Reset Link'}
      </Button>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        Remember your password?{' '}
        <a
          href="/auth/login"
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          Back to login
        </a>
      </p>
    </form>
  )
}
