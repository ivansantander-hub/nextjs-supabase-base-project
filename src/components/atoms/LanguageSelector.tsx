'use client'

import { useParams, useRouter, usePathname } from 'next/navigation'
import { Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LanguageSelector() {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()

  const currentLocale = (params?.locale as string) || 'es'
  const locales = ['es', 'en'] as const

  const labels: Record<string, string> = {
    es: 'Español',
    en: 'English'
  }

  const handleLanguageChange = (newLocale: string) => {
    if (currentLocale === newLocale) return

    // Remove current locale from pathname and add new one
    const pathWithoutLocale = pathname.replace(/^\/(es|en)/, '')
    router.push(`/${newLocale}${pathWithoutLocale}`)
  }

  return (
    <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
      <Globe className="w-4 h-4 text-slate-600 dark:text-slate-400 ml-2" />
      <div className="flex gap-1">
        {locales.map((locale) => (
          <button
            key={locale}
            onClick={() => handleLanguageChange(locale)}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded transition-all duration-200',
              currentLocale === locale
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50'
            )}
            aria-current={currentLocale === locale ? 'page' : undefined}
            title={labels[locale]}
          >
            {locale.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}
