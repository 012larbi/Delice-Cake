import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/** Fraise décorative en SVG. */
export function Strawberry({ className = '', style }) {
  return (
    <svg
      viewBox="0 0 64 72"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M32 8c-3 0-5 2-6 5-4-3-9-3-13 0 2 5 6 7 10 7-6 4-9 12-9 20 0 13 8 24 18 24s18-11 18-24c0-8-3-16-9-20 4 0 8-2 10-7-4-3-9-3-13 0-1-3-3-5-6-5z"
        fill="#F05A78"
      />
      <path
        d="M25 13c-2-2-6-3-9-1 1 3 4 5 7 5"
        fill="#7FB77E"
      />
      <path d="M39 13c2-2 6-3 9-1-1 3-4 5-7 5" fill="#7FB77E" />
      <g fill="#FFF8F5">
        <circle cx="24" cy="40" r="1.6" />
        <circle cx="33" cy="36" r="1.6" />
        <circle cx="40" cy="43" r="1.6" />
        <circle cx="28" cy="50" r="1.6" />
        <circle cx="37" cy="53" r="1.6" />
        <circle cx="31" cy="60" r="1.6" />
      </g>
    </svg>
  );
}

/** Feuille de menthe décorative. */
export function Leaf({ className = '', style }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M8 56C8 28 28 8 56 8c0 28-20 48-48 48z"
        fill="#7FB77E"
      />
      <path
        d="M18 46C30 34 40 24 50 16"
        stroke="#4E7A4D"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** Petit blob organique (fond burgundy ou rose). */
export function Blob({ className = '', color = '#521522', style }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill={color}
        d="M42.7,-64.6C55.9,-56.3,67.4,-45.1,73.6,-31.3C79.8,-17.6,80.6,-1.3,77,13.7C73.4,28.7,65.3,42.5,53.6,52.9C41.9,63.4,26.5,70.5,9.8,74.6C-6.9,78.7,-24.9,79.8,-39.9,72.9C-54.9,66,-66.9,51.1,-73.3,34.4C-79.7,17.7,-80.5,-0.8,-75.6,-17.4C-70.7,-34,-60.1,-48.7,-46.4,-57C-32.7,-65.3,-16.4,-67.2,-0.3,-66.8C15.8,-66.4,31.6,-63.6,42.7,-64.6Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}

/**
 * Élément décoratif flottant. Anime un léger va-et-vient
 * (désactivé si prefers-reduced-motion).
 */
export function Floating({
  children,
  className = '',
  amplitude = 12,
  rotate = 4,
  duration = 6,
  delay = 0,
}) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -amplitude, 0],
        rotate: [0, rotate, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}
