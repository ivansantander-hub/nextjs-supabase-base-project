'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import es from '@/i18n/es.json';
import en from '@/i18n/en.json';

type Locale = 'es' | 'en';

const translations = {
  es,
  en,
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({
  children,
  initialLocale = 'es',
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocale] = React.useState<Locale>(initialLocale);

  const t = React.useCallback(
    (key: string): string => {
      const keys = key.split('.');
      let value: any = translations[locale];

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return key; // Return key if translation not found
        }
      }

      return typeof value === 'string' ? value : key;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

export function useTranslations(namespace?: string) {
  const { t } = useI18n();

  return (key: string) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    return t(fullKey);
  };
}
