import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

const locales = ['es', 'en'];

export default getRequestConfig(async ({ locale }) => {
  // Validate locale - default to 'es' if undefined
  const validLocale = (locale && locales.includes(locale)) ? locale : 'es';

  return {
    locale: validLocale,
    messages: (await import(`./i18n/${validLocale}.json`)).default,
  };
});
