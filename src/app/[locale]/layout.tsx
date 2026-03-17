import { ReactNode } from 'react';
import { I18nProvider } from '@/contexts/I18nContext';

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  return (
    <I18nProvider initialLocale={locale as 'es' | 'en'}>
      {children}
    </I18nProvider>
  );
}
