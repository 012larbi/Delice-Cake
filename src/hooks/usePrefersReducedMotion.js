import { useEffect, useState } from 'react';

/**
 * Respecte la préférence système "prefers-reduced-motion".
 * Les composants l'utilisent pour désactiver les animations décoratives.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return reduced;
}
