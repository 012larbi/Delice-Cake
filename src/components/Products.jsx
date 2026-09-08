import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SectionHeading from './ui/SectionHeading';
import ProductFilters from './ProductFilters';
import ProductCard from './ProductCard';
import { useSiteData } from '../context/SiteSettingsContext';

export default function Products() {
  const { products, categories: cats } = useSiteData();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Tous');

  const categories = useMemo(
    () => ['Tous', ...(cats || []).map((c) => c.name)],
    [cats],
  );

  const active = categories.includes(activeCategory) ? activeCategory : 'Tous';

  const filtered = useMemo(() => {
    if (active === 'Tous') return products;
    return products.filter((p) => p.category === active);
  }, [active, products]);

  const openProduct = (product) => navigate(`/gateau/${product.id}`);

  return (
    <section
      id="nos-creations"
      className="relative scroll-mt-24 overflow-hidden bg-cream py-24 sm:py-28"
    >
      <div
        className="pointer-events-none absolute -left-24 top-32 h-64 w-64 rounded-full bg-blush/30 blur-3xl"
        aria-hidden="true"
      />

      <div className="section-x mx-auto max-w-6xl">
        <SectionHeading
          label="Nos créations"
          title="Des gâteaux aussi"
          script="beaux que délicieux"
          subtitle="Choisissez une catégorie, ouvrez la fiche du gâteau et commandez en quelques secondes."
        />

        <div className="mt-10">
          <ProductFilters
            categories={categories}
            active={active}
            onChange={setActiveCategory}
          />
        </div>

        <motion.div
          layout
          className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={openProduct}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 text-center text-burgundy/55"
          >
            De nouvelles créations {active.toLowerCase()} arrivent très bientôt.
            Contactez-nous pour une demande sur mesure.
          </motion.p>
        )}
      </div>
    </section>
  );
}
