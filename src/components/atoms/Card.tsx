'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined'
  interactive?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', interactive = false, ...props }, ref) => {
    const baseStyles = cn(
      'rounded-lg transition-all duration-300 ease-out'
    )

    const variantStyles = {
      default: cn(
        'bg-white dark:bg-slate-800',
        'border border-slate-200 dark:border-slate-700'
      ),
      elevated: cn(
        'bg-white dark:bg-slate-800',
        'border border-slate-200 dark:border-slate-700',
        'shadow-md dark:shadow-lg'
      ),
      outlined: cn(
        'bg-transparent',
        'border-2 border-slate-300 dark:border-slate-600'
      ),
    }

    const interactiveStyles = interactive && cn(
      'hover:shadow-lg dark:hover:shadow-xl',
      'hover:-translate-y-1',
      'cursor-pointer'
    )

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], interactiveStyles, className)}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

export { Card }
