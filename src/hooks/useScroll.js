import { useEffect, useState } from 'react';

/**
 * Retourne true dès que la page est défilée au-delà de `threshold` px.
 * Utilisé pour l'état "scrolled" du navbar.
 */
export function useScroll(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}
