import { ArrowRight } from 'lucide-react';
import Button from './ui/Button';
import CakeImage from './ui/CakeImage';
import Reveal from './ui/Reveal';
import { Floating, Strawberry } from './ui/Decor';
import { useSiteSettings } from '../context/SiteSettingsContext';

const STATS = [
  { value: '8 ans', label: "d'expérience" },
  { value: '100%', label: 'fait maison' },
  { value: '4.9/5', label: 'satisfaction' },
];

export default function About() {
  const settings = useSiteSettings();
  return (
    <section
      id="a-propos"
      className="relative scroll-mt-24 overflow-hidden bg-burgundy py-24 text-cream sm:py-28"
    >
      <div
        className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="section-x mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-16">
        {/* Image */}
        <Reveal className="relative">
          <div
            className="absolute -left-6 -top-6 h-40 w-40 rounded-[45%_55%_60%_40%] bg-blush/30 blur-lg"
            aria-hidden="true"
          />
          <div className="absolute -bottom-8 -right-6 h-32 w-32 rounded-full bg-accent/25 blur-lg" aria-hidden="true" />

          <CakeImage
            src={settings.aboutImage}
            alt="Pâtissière décorant un gâteau à la main dans l'atelier Délice Cake"
            eager
            className="relative aspect-[4/5] w-full rounded-[2.2rem] bg-burgundy-dark/40 ring-1 ring-cream/15"
          />

          <Floating
            className="absolute -right-4 top-10 w-12"
            amplitude={10}
            rotate={12}
          >
            <Strawberry className="h-full w-full drop-shadow-xl" />
          </Floating>

          <div className="absolute -bottom-6 left-6 rounded-2xl bg-cream px-5 py-4 text-burgundy shadow-xl">
            <p className="font-script text-2xl text-accent">Fait main</p>
            <p className="text-xs font-medium text-burgundy/60">
              chaque décor, chaque détail
            </p>
          </div>
        </Reveal>

        {/* Texte */}
        <div className="flex flex-col gap-6">
          <Reveal
            as="span"
            className="inline-flex w-fit items-center rounded-full border border-blush/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-blush"
          >
            Notre passion
          </Reveal>

          <Reveal as="h2" delay={0.05} className="text-4xl sm:text-5xl">
            Notre passion pour
            <br />
            <span className="font-script font-normal text-blush">
              la pâtisserie
            </span>
          </Reveal>

          <Reveal as="p" delay={0.1} className="max-w-lg text-cream/75">
            Chez Délice Cake, chaque création est imaginée avec soin, préparée
            avec des ingrédients de qualité et décorée à la main pour donner vie
            à vos plus beaux moments.
          </Reveal>

          <Reveal delay={0.16} className="mt-2 grid grid-cols-3 gap-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-cream/12 bg-cream/5 px-3 py-4 text-center"
              >
                <p className="font-display text-2xl font-bold text-blush">
                  {s.value}
                </p>
                <p className="mt-1 text-xs text-cream/60">{s.label}</p>
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.22}>
            <Button href="#nos-creations" variant="primary" size="lg">
              Découvrir notre histoire
              <ArrowRight size={17} />
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
