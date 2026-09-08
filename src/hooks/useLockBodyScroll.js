import { useEffect } from 'react';

/**
 * Bloque le scroll de l'arrière-plan quand `locked` est vrai
 * (modales, menu mobile). Compense la largeur de la scrollbar.
 */
export function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return;

    const { overflow, paddingRight } = document.body.style;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [locked]);
}
