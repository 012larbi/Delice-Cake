import { motion } from 'framer-motion';

/* ---------- Layout ---------- */

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold text-burgundy sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-burgundy/55">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Card({ className = '', children, ...rest }) {
  return (
    <div
      className={`rounded-2xl border border-burgundy/10 bg-white p-5 shadow-[0_20px_45px_-35px_rgba(82,21,34,0.4)] ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, hint, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-burgundy/10 bg-white p-5 shadow-[0_20px_45px_-35px_rgba(82,21,34,0.4)]"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-burgundy/45">
          {label}
        </span>
        {Icon && (
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent/12 text-accent">
            <Icon size={17} />
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-3xl font-bold text-burgundy">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-burgundy/45">{hint}</p>}
    </motion.div>
  );
}

/* ---------- Controls ---------- */

const btnBase =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2';

const btnVariants = {
  primary: 'bg-accent text-white hover:bg-accent-dark',
  burgundy: 'bg-burgundy text-cream hover:bg-burgundy-dark',
  soft: 'bg-lightpink text-burgundy hover:bg-blush',
  ghost: 'text-burgundy/70 hover:bg-lightpink hover:text-burgundy',
  danger: 'bg-red-50 text-red-600 hover:bg-red-100',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  as: As = 'button',
  ...rest
}) {
  const sizes = { sm: 'px-3.5 py-2 text-xs', md: 'px-5 py-2.5 text-sm' };
  return (
    <As
      className={`${btnBase} ${sizes[size]} ${btnVariants[variant]} ${className}`}
      {...rest}
    />
  );
}

export function Badge({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}
    >
      {children}
    </span>
  );
}

export function Field({ label, children, hint, required }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-burgundy/70">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      {children}
      {hint && <span className="text-xs text-burgundy/45">{hint}</span>}
    </label>
  );
}

const inputCls =
  'w-full rounded-xl border border-burgundy/15 bg-white px-3.5 py-2.5 text-sm text-burgundy placeholder:text-burgundy/35 focus:border-accent focus:outline-none';

export const Input = (props) => <input className={inputCls} {...props} />;
export const Textarea = (props) => (
  <textarea className={`${inputCls} resize-none`} rows={3} {...props} />
);
export const Select = ({ children, ...props }) => (
  <select className={inputCls} {...props}>
    {children}
  </select>
);

export function EmptyState({ icon: Icon, title, children }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-burgundy/20 bg-white/60 px-6 py-16 text-center">
      {Icon && <Icon size={28} className="text-blush" />}
      <p className="font-display text-lg font-bold text-burgundy">{title}</p>
      {children && (
        <p className="max-w-sm text-sm text-burgundy/55">{children}</p>
      )}
    </div>
  );
}

export function Spinner({ className = '' }) {
  return (
    <span
      className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-burgundy/20 border-t-accent ${className}`}
      role="status"
      aria-label="Chargement"
    />
  );
}
