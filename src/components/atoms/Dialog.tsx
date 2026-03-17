'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  closeButton?: boolean
}

const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  ({
    open = false,
    onOpenChange,
    title,
    description,
    children,
    footer,
    closeButton = true,
  }, ref) => {
    const [isOpen, setIsOpen] = React.useState(open)

    React.useEffect(() => {
      setIsOpen(open)
    }, [open])

    const handleClose = () => {
      setIsOpen(false)
      onOpenChange?.(false)
    }

    const handleBackdropClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleClose()
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    if (!isOpen) return null

    return (
      <>
        {/* Backdrop */}
        <div
          className={cn(
            'fixed inset-0 bg-black/50 backdrop-blur-sm',
            'transition-opacity duration-200 ease-out z-40'
          )}
          onClick={handleBackdropClick}
          aria-hidden="true"
        />

        {/* Dialog */}
        <div
          ref={ref}
          className={cn(
            'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'w-full max-w-md bg-white dark:bg-slate-900',
            'border border-slate-200 dark:border-slate-700',
            'rounded-lg shadow-xl dark:shadow-2xl',
            'z-50 max-h-[90vh] overflow-y-auto',
            'animate-in fade-in zoom-in-95 duration-200'
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'dialog-title' : undefined}
          aria-describedby={description ? 'dialog-description' : undefined}
          onKeyDown={handleKeyDown}
        >
          {/* Header */}
          {(title || closeButton) && (
            <div className={cn(
              'flex items-start justify-between gap-4 p-6',
              'border-b border-slate-200 dark:border-slate-700'
            )}>
              {title && (
                <div>
                  <h2
                    id="dialog-title"
                    className={cn(
                      'text-lg font-semibold text-slate-900 dark:text-slate-50'
                    )}
                  >
                    {title}
                  </h2>
                  {description && (
                    <p
                      id="dialog-description"
                      className={cn(
                        'text-sm text-slate-500 dark:text-slate-400 mt-1'
                      )}
                    >
                      {description}
                    </p>
                  )}
                </div>
              )}
              {closeButton && (
                <button
                  onClick={handleClose}
                  className={cn(
                    'flex-shrink-0 text-slate-500 dark:text-slate-400',
                    'hover:text-slate-900 dark:hover:text-slate-50',
                    'transition-colors duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    'dark:focus:ring-offset-slate-900 rounded'
                  )}
                  aria-label="Close dialog"
                  type="button"
                >
                  <span className="text-2xl leading-none">×</span>
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6 text-slate-900 dark:text-slate-50">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className={cn(
              'flex items-center justify-end gap-3 p-6',
              'border-t border-slate-200 dark:border-slate-700'
            )}>
              {footer}
            </div>
          )}
        </div>
      </>
    )
  }
)

Dialog.displayName = 'Dialog'

export { Dialog }
