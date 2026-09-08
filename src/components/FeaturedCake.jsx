import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Button from './ui/Button';
import CakeImage from './ui/CakeImage';
import { Floating, Leaf, Strawberry } from './ui/Decor';
import { IMAGES } from '../config/images';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function FeaturedCake() {
  const ref = useRef(null);
  const reduced = usePrefersReducedMotion();
  const settings = useSiteSettings();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const yImg = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [60, -60]);
  const yShape = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [-40, 40],
  );

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-burgundy-dark py-24 text-cream sm:py-32"
    >
      <motion.div
        style={{ y: yShape }}
        className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full bg-accent/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-blush/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="section-x mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-6">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex w-fit items-center rounded-full border border-blush/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-blush"
          >
            Gâteau signature
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-4xl sm:text-5xl lg:text-[3.4rem]"
          >
            Votre gâteau,
            <br />
            <span className="font-script font-normal text-blush">
              votre histoire.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="max-w-lg text-cream/75"
          >
            Anniversaire, mariage, naissance ou simplement une envie gourmande :
            nous créons un gâteau unique qui vous ressemble, de la première
            esquisse à la dernière touche de décor.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.16 }}
          >
            <Button href="#nos-creations" size="lg">
              Voir nos gâteaux
              <ArrowRight size={17} />
            </Button>
          </motion.div>
        </div>

        {/* Composition visuelle */}
        <div className="relative mx-auto aspect-square w-full max-w-md">
          <motion.div
            style={{ y: yShape }}
            className="absolute inset-4 rounded-[42%_58%_58%_42%/48%_42%_58%_52%] bg-accent/25"
            aria-hidden="true"
          />
          <motion.div style={{ y: yImg }} className="absolute inset-0">
            <CakeImage
              src={settings.featuredImage || IMAGES.featuredCake}
              alt="Grand gâteau de mariage à étages décoré de fleurs fraîches"
              className="h-full w-full rounded-[2.5rem] ring-1 ring-cream/15"
            />
          </motion.div>

          <Floating
            className="absolute -left-3 top-8 w-14"
            amplitude={12}
            rotate={-10}
          >
            <Strawberry className="h-full w-full drop-shadow-xl" />
          </Floating>
          <Floating
            className="absolute -right-2 bottom-16 w-12"
            amplitude={10}
            rotate={12}
            delay={0.5}
          >
            <Leaf className="h-full w-full drop-shadow-xl" />
          </Floating>
          <Floating
            className="absolute bottom-2 left-1/3 w-10"
            amplitude={8}
            rotate={-14}
            delay={0.8}
          >
            <Strawberry className="h-full w-full drop-shadow-xl" />
          </Floating>
        </div>
      </div>
    </section>
  );
}
