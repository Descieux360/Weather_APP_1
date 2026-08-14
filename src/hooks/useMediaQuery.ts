import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  // Lazily initialize state to avoid unnecessary DOM queries on re-renders
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false; // Fallback for Server-Side Rendering (SSR/Next.js)
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery: MediaQueryList = window.matchMedia(query);

    // Sync state on query change
    setMatches(mediaQuery.matches);

    // Strongly-typed event handler for MediaQueryList
    const handler = (event: MediaQueryListEvent): void => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);

    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
}

export default useMediaQuery;