import { Leaf, Palette, HeartHandshake, MessageCircle } from 'lucide-react';
import SectionHeading from './ui/SectionHeading';
import { RevealGroup, RevealItem } from './ui/Reveal';

const FEATURES = [
  {
    icon: Leaf,
    title: 'Des ingrédients de qualité',
    text: 'Nous sélectionnons soigneusement nos ingrédients pour garantir une expérience gourmande.',
  },
  {
    icon: Palette,
    title: '100% personnalisé',
    text: 'Votre gâteau est créé selon vos envies, votre thème et votre événement.',
  },
  {
    icon: HeartHandshake,
    title: 'Préparé avec passion',
    text: 'Chaque création est préparée avec soin dans notre atelier.',
  },
  {
    icon: MessageCircle,
    title: 'Commande facile',
    text: 'Commandez directement et simplement via WhatsApp.',
  },
];

export default function Features() {
  return (
    <section className="relative bg-lightpink py-24 sm:py-28">
      <div className="section-x mx-auto max-w-6xl">
        <SectionHeading
          label="Pourquoi nous choisir"
          title="L'exigence, du premier"
          script="au dernier détail"
        />

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text }, i) => (
            <RevealItem
              key={title}
              as="article"
              whileHover={{ y: -6 }}
              className="group flex flex-col gap-4 rounded-[1.75rem] border border-white/70 bg-cream p-6 shadow-[0_20px_45px_-32px_rgba(82,21,34,0.45)] transition-shadow hover:shadow-[0_35px_55px_-30px_rgba(82,21,34,0.4)]"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent/12 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                  <Icon size={22} strokeWidth={2} />
                </span>
                <span className="font-script text-3xl text-blush">
                  0{i + 1}
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-burgundy">
                {title}
              </h3>
              <p className="text-sm text-burgundy/60">{text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
