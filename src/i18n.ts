import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

const locales = ['es', 'en'];

export default getRequestConfig(async ({ locale }) => {
  // Validate locale
  if (!locales.includes(locale)) {
    notFound();
  }

  return {
    messages: (await import(`./i18n/${locale}.json`)).default,
  };
});
