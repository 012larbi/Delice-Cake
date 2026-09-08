import { motion } from 'framer-motion';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-3 disabled:opacity-60 disabled:pointer-events-none';

const sizes = {
  md: 'px-6 py-3 text-sm',
  lg: 'px-7 py-3.5 text-[15px]',
};

const variants = {
  primary:
    'bg-accent text-white shadow-[0_18px_35px_-15px_rgba(240,90,120,0.7)] hover:bg-accent-dark',
  burgundy: 'bg-burgundy text-cream hover:bg-burgundy-dark',
  outline:
    'border border-burgundy/25 bg-white/70 text-burgundy hover:bg-white hover:border-burgundy/40',
  outlineLight:
    'border border-cream/40 bg-transparent text-cream hover:bg-cream/10',
  whatsapp:
    'bg-[#25D366] text-white shadow-[0_18px_35px_-15px_rgba(37,211,102,0.7)] hover:bg-[#1ebe5b]',
  ghost: 'text-burgundy hover:text-accent',
};

/**
 * Bouton premium animé (whileHover / whileTap).
 * Rend un <a> si `href` est fourni, sinon un <button>.
 */
export default function Button({
  as,
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...rest
}) {
  const Comp = as || (href ? motion.a : motion.button);
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  return (
    <Comp
      href={href}
      className={classes}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
