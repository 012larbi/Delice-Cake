import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Quote, Star, PenLine } from 'lucide-react';
import SectionHeading from './ui/SectionHeading';
import ReviewModal from './ReviewModal';
import { watchTestimonials } from '../services/content';

/** Horodatage comparable, quel que soit le format. */
function toMillis(v) {
  if (v?.toDate) return v.toDate().getTime();
  if (typeof v?.seconds === 'number') return v.seconds * 1000;
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const t = Date.parse(v);
    return Number.isNaN(t) ? 0 : t;
  }
  return 0;
}

/** Priorité à createdAt (avis validés), sinon updatedAt. */
const recencyOf = (t) => toMillis(t.createdAt) || toMillis(t.updatedAt);

function Stars({ rating = 5 }) {
  const n = Math.max(1, Math.min(5, Number(rating) || 5));
  return (
    <div
      className="flex gap-0.5 text-accent"
      aria-label={`Note : ${n} sur 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={15}
          className={i < n ? 'fill-accent' : 'text-blush'}
        />
      ))}
    </div>
  );
}

function Card({ t }) {
  return (
    <figure className="flex h-full flex-col gap-4 rounded-[1.75rem] border border-burgundy/8 bg-cream p-6 shadow-[0_20px_45px_-32px_rgba(82,21,34,0.4)]">
      <Quote size={26} className="text-blush" />
      <blockquote className="flex-1 text-[15px] leading-relaxed text-burgundy/75">
        « {t.text} »
      </blockquote>
      <div className="flex items-center justify-between border-t border-burgundy/10 pt-4">
        <figcaption>
          <p className="font-display font-bold text-burgundy">{t.name}</p>
          <p className="text-xs text-burgundy/50">{t.city}</p>
        </figcaption>
        <Stars rating={t.rating} />
      </div>
    </figure>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [index, setIndex] = useState(0);
  const [reviewOpen, setReviewOpen] = useState(false);

  // Abonnement temps réel : un nouvel avis validé apparaît sans rechargement.
  useEffect(() => watchTestimonials(setTestimonials), []);

  // Les 3 plus récents, en tête.
  const list = useMemo(
    () =>
      [...(testimonials || [])]
        .sort((a, b) => recencyOf(b) - recencyOf(a))
        .slice(0, 3),
    [testimonials],
  );

  return (
    <section className="relative bg-white py-24 sm:py-28">
      <div className="section-x mx-auto max-w-6xl">
        <SectionHeading
          label="Témoignages"
          title="Ils ont"
          script="adoré"
          subtitle="Ce que nos client·e·s racontent après avoir goûté."
        />

        <div className="mt-6 flex justify-center">
          <motion.button
            type="button"
            onClick={() => setReviewOpen(true)}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-full border border-burgundy/20 bg-cream px-5 py-2.5 text-sm font-semibold text-burgundy transition-colors hover:border-accent hover:text-accent"
          >
            <PenLine size={15} />
            Laisser un avis
          </motion.button>
        </div>

        {/* Desktop : grille (mise à jour en direct) */}
        <div className="mt-12 hidden gap-6 md:grid md:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((t) => (
              <motion.div
                key={t.id || t.name}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="h-full"
              >
                <Card t={t} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Mobile : carrousel */}
        <div className="mt-10 md:hidden">
          <div
            className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2"
            onScroll={(e) => {
              const { scrollLeft, scrollWidth } = e.currentTarget;
              const i = Math.round((scrollLeft / scrollWidth) * list.length);
              setIndex(Math.min(list.length - 1, Math.max(0, i)));
            }}
          >
            {list.map((t) => (
              <div
                key={t.id || t.name}
                className="w-[85%] shrink-0 snap-center"
              >
                <Card t={t} />
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-2">
            {list.map((t, i) => (
              <motion.span
                key={t.id || t.name}
                animate={{
                  width: i === index ? 22 : 8,
                  opacity: i === index ? 1 : 0.4,
                }}
                className="h-2 rounded-full bg-accent"
              />
            ))}
          </div>
        </div>
      </div>

      <ReviewModal open={reviewOpen} onClose={() => setReviewOpen(false)} />
    </section>
  );
}
