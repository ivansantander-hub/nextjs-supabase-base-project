import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';

export const useTheme = () => {
  const nextTheme = useNextTheme();
  const { user, updateUserPreferences } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = (theme?: 'light' | 'dark' | 'system') => {
    const newTheme = theme || (nextTheme.theme === 'dark' ? 'light' : 'dark');
    nextTheme.setTheme(newTheme);
    if (user) {
      updateUserPreferences({ theme_preference: newTheme as any });
    }
  };

  return {
    theme: nextTheme.theme,
    setTheme: nextTheme.setTheme,
    toggleTheme,
    mounted,
  };
};
