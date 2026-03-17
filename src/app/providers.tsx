'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { I18nProvider } from '@/contexts/I18nContext'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="theme">
      <I18nProvider initialLocale="es">
        {children}
      </I18nProvider>
    </ThemeProvider>
  )
}
