'use client'

import * as React from "react"
import { Spinner } from "./Spinner"
import { cn } from "@/lib/utils"

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: cn(
    'bg-gradient-to-r from-blue-600 to-blue-500',
    'text-white font-semibold',
    'hover:shadow-lg hover:from-blue-700 hover:to-blue-600',
    'active:scale-95',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100'
  ),
  secondary: cn(
    'bg-slate-100 dark:bg-slate-800',
    'text-slate-900 dark:text-slate-50 font-semibold',
    'hover:bg-slate-200 dark:hover:bg-slate-700 hover:shadow-md',
    'active:scale-95',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100'
  ),
  outline: cn(
    'border-2 border-slate-300 dark:border-slate-600',
    'text-slate-900 dark:text-slate-50 font-semibold',
    'hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:border-blue-500 hover:shadow-md',
    'active:scale-95',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100'
  ),
  ghost: cn(
    'text-slate-700 dark:text-slate-300 font-semibold',
    'hover:bg-slate-100 dark:hover:bg-slate-900/50',
    'active:scale-95',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100'
  ),
  danger: cn(
    'bg-red-600 text-white font-semibold',
    'hover:bg-red-700 hover:shadow-lg',
    'active:scale-95',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100'
  ),
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg gap-2',
  md: 'px-6 py-2.5 text-base rounded-lg gap-2',
  lg: 'px-8 py-3 text-lg rounded-lg gap-3',
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading,
      icon,
      iconPosition = 'left',
      disabled,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <button
        disabled={isLoading || disabled}
        className={cn(
          'inline-flex items-center justify-center',
          'font-sans font-semibold',
          'transition-all duration-200 ease-out',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
          'active:transition-transform active:duration-100',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {isLoading && <Spinner size="sm" className="mr-2" />}
        {!isLoading && icon && iconPosition === 'left' && (
          <span className="flex items-center justify-center">{icon}</span>
        )}
        {children}
        {!isLoading && icon && iconPosition === 'right' && (
          <span className="flex items-center justify-center">{icon}</span>
        )}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
