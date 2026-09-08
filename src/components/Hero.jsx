import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import Button from './ui/Button';
import CakeImage from './ui/CakeImage';
import { Blob, Floating, Leaf, Strawberry } from './ui/Decor';
import { IMAGES } from '../config/images';
import { openWhatsAppContact } from '../config/whatsapp';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useSiteSettings } from '../context/SiteSettingsContext';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const TRUST = ['Fait maison', 'Ingrédients de qualité', 'Créations personnalisées'];

export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const settings = useSiteSettings();
  const heroSrc = settings.heroImage || IMAGES.hero;

  return (
    <section
      id="accueil"
      className="relative overflow-hidden bg-lightpink pb-20 pt-32 sm:pb-28 sm:pt-36 lg:pt-40"
    >
      {/* Formes de fond */}
      <div
        className="pointer-events-none absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-blush/50 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-0 h-[360px] w-[360px] rounded-full bg-accent/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="section-x relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        {/* Colonne texte */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 flex flex-col items-start gap-6"
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-accent"
          >
            <Sparkles size={14} />
            Pâtisserie artisanale
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="text-[2.6rem] leading-[1.05] text-burgundy sm:text-6xl lg:text-[4.1rem]"
          >
            Les meilleurs
            <br />
            gâteaux{' '}
            <span className="font-script font-normal text-accent">sur mesure</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="max-w-md text-base text-burgundy/70 sm:text-lg"
          >
            Des créations gourmandes préparées avec passion à Casablanca pour
            rendre chaque moment vraiment inoubliable.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <Button href="#nos-creations" size="lg">
              Découvrir nos gâteaux
              <ArrowRight size={17} />
            </Button>
            <Button
              as={motion.button}
              type="button"
              variant="outline"
              size="lg"
              onClick={() => openWhatsAppContact()}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <MessageCircle size={17} />
              Commander maintenant
            </Button>
          </motion.div>

          <motion.ul
            variants={fadeUp}
            className="mt-2 flex flex-wrap gap-x-6 gap-y-2"
          >
            {TRUST.map((t) => (
              <li
                key={t}
                className="flex items-center gap-2 text-sm font-medium text-burgundy/70"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {t}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Colonne visuelle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          className="relative mx-auto aspect-square w-full max-w-md lg:max-w-none"
        >
          {/* Blob burgundy */}
          <Blob
            className="absolute inset-0 h-full w-full scale-110"
            color="#521522"
          />
          {/* Blob rose */}
          <Blob
            className="absolute -right-6 -top-6 h-32 w-32 opacity-80 sm:h-40 sm:w-40"
            color="#F8C8D2"
          />

          {/* Gâteau */}
          <Floating
            className="absolute inset-[12%] drop-shadow-[0_35px_45px_rgba(61,16,26,0.45)]"
            amplitude={reduced ? 0 : 14}
            rotate={reduced ? 0 : 2}
            duration={7}
          >
            <CakeImage
              src={heroSrc}
              alt="Gâteau aux fraises fraîches nappé de crème, création signature Délice Cake"
              eager
              className="h-full w-full rounded-full ring-8 ring-cream/70"
              imgClassName="rounded-full"
            />
          </Floating>

          {/* Fraises + feuilles décoratives */}
          <Floating
            className="absolute -left-2 top-6 w-12 sm:w-14"
            amplitude={reduced ? 0 : 10}
            rotate={-8}
            duration={5.5}
            delay={0.4}
          >
            <Strawberry className="h-full w-full drop-shadow-lg" />
          </Floating>
          <Floating
            className="absolute bottom-6 -right-1 w-10 sm:w-12"
            amplitude={reduced ? 0 : 12}
            rotate={10}
            duration={6.5}
            delay={0.8}
          >
            <Strawberry className="h-full w-full drop-shadow-lg" />
          </Floating>
          <Floating
            className="absolute bottom-2 left-10 w-10 sm:w-12"
            amplitude={reduced ? 0 : 8}
            rotate={14}
            duration={5}
            delay={0.2}
          >
            <Leaf className="h-full w-full drop-shadow" />
          </Floating>
          <Floating
            className="absolute right-8 top-0 w-8 sm:w-10"
            amplitude={reduced ? 0 : 9}
            rotate={-12}
            duration={6}
            delay={0.6}
          >
            <Leaf className="h-full w-full drop-shadow" />
          </Floating>

          {/* Badge note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-[0_20px_40px_-18px_rgba(82,21,34,0.4)] backdrop-blur"
          >
            <div className="flex -space-x-1 text-accent">
              {'★★★★★'.split('').map((s, i) => (
                <span key={i} className="text-sm">
                  {s}
                </span>
              ))}
            </div>
            <div className="text-left leading-tight">
              <p className="text-sm font-bold text-burgundy">+300 clients</p>
              <p className="text-xs text-burgundy/60">à Casablanca</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
