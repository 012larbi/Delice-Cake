import { motion } from 'framer-motion';

/**
 * Filtres de catégories sous forme de pills.
 * Scroll horizontal sur mobile, centré sur desktop.
 */
export default function ProductFilters({ categories, active, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Filtrer les gâteaux par catégorie"
      className="no-scrollbar -mx-6 flex snap-x gap-2.5 overflow-x-auto px-6 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0"
    >
      {categories.map((category) => {
        const isActive = category === active;
        return (
          <button
            key={category}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(category)}
            className={`relative shrink-0 snap-start rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 ${
              isActive
                ? 'text-white'
                : 'border border-burgundy/15 bg-white/70 text-burgundy/70 hover:border-burgundy/30 hover:text-burgundy'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="filter-pill"
                className="absolute inset-0 rounded-full bg-accent shadow-[0_14px_28px_-12px_rgba(240,90,120,0.75)]"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{category}</span>
          </button>
        );
      })}
    </div>
  );
}
