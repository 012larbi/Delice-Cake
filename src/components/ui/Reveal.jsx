import { motion } from 'framer-motion';

/**
 * Enveloppe "scroll reveal" réutilisable.
 * Anime opacity + translateY à l'entrée dans le viewport (une seule fois).
 */
export default function Reveal({
  children,
  as = 'div',
  delay = 0,
  y = 28,
  className = '',
  once = true,
  amount = 0.25,
  ...rest
}) {
  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

/** Conteneur avec stagger pour animer une liste d'enfants <RevealItem>. */
export function RevealGroup({
  children,
  className = '',
  stagger = 0.12,
  delayChildren = 0.05,
  amount = 0.2,
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: stagger, delayChildren },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export const revealItemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export function RevealItem({ children, className = '', as = 'div', ...rest }) {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag className={className} variants={revealItemVariants} {...rest}>
      {children}
    </MotionTag>
  );
}
