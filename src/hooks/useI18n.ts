import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './useAuth';

export const useI18n = () => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const { user, updateUserPreferences } = useAuth();

  const changeLanguage = (locale: 'es' | 'en') => {
    // Change URL locale
    const newPathname = pathname.replace(/^\/[a-z]{2}/, `/${locale}`);
    router.push(newPathname);

    // Update user preference
    if (user) {
      updateUserPreferences({ language_preference: locale });
    }
  };

  return {
    t,
    changeLanguage,
  };
};
