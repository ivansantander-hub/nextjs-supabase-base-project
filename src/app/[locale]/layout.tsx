import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';
import es from '@/i18n/es.json';
import en from '@/i18n/en.json';

const messages = {
  es,
  en,
};

export function generateStaticParams() {
  return [{ locale: 'es' }, { locale: 'en' }];
}

interface RootLayoutProps {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function LocaleLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;

  // Validar locale
  if (!Object.keys(messages).includes(locale)) {
    notFound();
  }

  // Type assertion es necesario aquí
  const typedLocale = locale as keyof typeof messages;

  return (
    <NextIntlClientProvider locale={locale} messages={messages[typedLocale]}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
