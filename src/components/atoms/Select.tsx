'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[]
  placeholder?: string
  multiple?: boolean
  label?: string
  error?: string
  hint?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({
    options,
    placeholder,
    label,
    error,
    hint,
    className,
    disabled,
    multiple,
    ...props
  }, ref) => {
    const hasError = !!error
    const id = React.useId()

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className={cn(
              'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'
            )}
          >
            {label}
          </label>
        )}

        <select
          ref={ref}
          id={id}
          disabled={disabled}
          multiple={multiple}
          className={cn(
            'w-full px-4 py-2.5 text-base rounded-lg',
            'bg-white dark:bg-slate-900',
            'border-2 text-slate-900 dark:text-slate-50',
            'placeholder:text-slate-500 dark:placeholder:text-slate-400',
            'transition-all duration-200 ease-out',
            'focus:outline-none focus:ring-2',
            'hover:border-slate-300 dark:hover:border-slate-600',
            hasError
              ? cn(
                'border-red-500 dark:border-red-400',
                'focus:border-red-500 focus:ring-red-500/20'
              )
              : cn(
                'border-slate-200 dark:border-slate-700',
                'focus:border-blue-500 focus:ring-blue-500/20'
              ),
            disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer',
            className
          )}
          aria-invalid={hasError}
          aria-describedby={error || hint ? id + '-description' : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled selected hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {(error || hint) && (
          <div
            id={id + '-description'}
            className={cn(
              'text-sm mt-2',
              error
                ? 'text-red-600 dark:text-red-400'
                : 'text-slate-500 dark:text-slate-400'
            )}
          >
            {error || hint}
          </div>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export { Select }
