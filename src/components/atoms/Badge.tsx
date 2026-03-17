'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const variantStyles = {
      default: cn(
        'bg-slate-100 dark:bg-slate-700',
        'text-slate-700 dark:text-slate-200'
      ),
      primary: cn(
        'bg-blue-100 dark:bg-blue-900/30',
        'text-blue-700 dark:text-blue-300'
      ),
      success: cn(
        'bg-emerald-100 dark:bg-emerald-900/30',
        'text-emerald-700 dark:text-emerald-300'
      ),
      warning: cn(
        'bg-amber-100 dark:bg-amber-900/30',
        'text-amber-700 dark:text-amber-300'
      ),
      error: cn(
        'bg-red-100 dark:bg-red-900/30',
        'text-red-700 dark:text-red-300'
      ),
      info: cn(
        'bg-cyan-100 dark:bg-cyan-900/30',
        'text-cyan-700 dark:text-cyan-300'
      ),
    }

    const sizeStyles = {
      sm: 'px-2 py-1 text-xs font-semibold rounded',
      md: 'px-3 py-1.5 text-sm font-semibold rounded-md',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center',
          'transition-colors duration-200',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = 'Badge'

export { Badge }
