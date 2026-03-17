import { useEffect, useState } from 'react';

// Tailwind breakpoints
const breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 1024px)',
  lg: '(min-width: 1280px)',
};

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

export const useResponsive = () => {
  const sm = useMediaQuery(breakpoints.sm);
  const md = useMediaQuery(breakpoints.md);
  const lg = useMediaQuery(breakpoints.lg);

  return {
    isMobile: !sm,
    isTablet: sm && !md,
    isDesktop: md,
    sm,
    md,
    lg,
  };
};
