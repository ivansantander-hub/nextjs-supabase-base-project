import { ReactNode } from 'react';

export const generateStaticParams = () => [
  { locale: 'es' },
  { locale: 'en' },
];

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  return children;
}
