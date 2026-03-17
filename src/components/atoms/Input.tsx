'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      icon,
      iconPosition = "left",
      className,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random()}`

    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-semibold transition-colors duration-200",
              error
                ? "text-red-600 dark:text-red-400"
                : "text-slate-700 dark:text-slate-300"
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === "left" && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 transition-colors duration-200">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={cn(
              "w-full px-4 py-2.5 text-base rounded-lg",
              "bg-white dark:bg-slate-900",
              "border-2 border-slate-200 dark:border-slate-700",
              "text-slate-900 dark:text-slate-50",
              "placeholder:text-slate-500 dark:placeholder:text-slate-400",
              "transition-all duration-200 ease-out",
              "focus:outline-none focus:border-blue-500 focus:dark:border-blue-400",
              "focus:shadow-md focus:ring-2 focus:ring-blue-500/20",
              "hover:border-slate-300 dark:hover:border-slate-600",
              disabled && "opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800",
              error && "border-red-500 dark:border-red-400 focus:border-red-500 focus:ring-red-500/20",
              icon && iconPosition === "left" && "pl-12",
              icon && iconPosition === "right" && "pr-12",
              className
            )}
            {...props}
          />
          {icon && iconPosition === "right" && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 transition-colors duration-200">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm font-medium text-red-600 dark:text-red-400 animate-slide-down">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {hint}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
