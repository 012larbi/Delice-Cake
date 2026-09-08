import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import SectionHeading from './ui/SectionHeading';
import CakeImage from './ui/CakeImage';
import { formatPrice, openWhatsAppContact } from '../config/whatsapp';
import { useSiteData } from '../context/SiteSettingsContext';

export default function NewProducts() {
  const { newProducts } = useSiteData();
  return (
    <section
      id="nouveautes"
      className="relative scroll-mt-24 overflow-hidden bg-cream py-24 sm:py-28"
    >
      <div className="section-x mx-auto max-w-6xl">
        <SectionHeading
          label="Nos nouveautés"
          title="Découvrez nos"
          script="dernières créations"
          subtitle="Une sélection éditoriale renouvelée chaque saison, en quantités limitées."
        />

        <div className="mt-12 flex flex-col gap-6">
          {newProducts.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="group grid items-stretch gap-6 rounded-[2rem] border border-burgundy/8 bg-white p-4 shadow-[0_25px_55px_-38px_rgba(82,21,34,0.45)] sm:p-5 md:grid-cols-2"
            >
              <figure
                className={`relative overflow-hidden rounded-[1.5rem] bg-lightpink ${
                  i % 2 === 1 ? 'md:order-2' : ''
                }`}
              >
                <CakeImage
                  src={item.image}
                  alt={`${item.name} — ${item.description}`}
                  fit="contain"
                  className="aspect-[16/10] w-full md:h-full"
                  imgClassName="p-3 transition-transform duration-700 group-hover:scale-105"
                />
                <figcaption className="absolute left-4 top-4 rounded-full bg-cream/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent">
                  {item.tag}
                </figcaption>
              </figure>

              <div className="flex flex-col justify-center gap-4 px-2 py-4 sm:px-6">
                <h3 className="font-display text-2xl font-bold text-burgundy sm:text-3xl">
                  {item.name}
                </h3>
                <p className="max-w-md text-sm text-burgundy/60 sm:text-base">
                  {item.description}
                </p>
                <div className="flex items-center gap-4 pt-1">
                  <span className="font-display text-xl font-bold text-burgundy">
                    {formatPrice(item.price)}
                  </span>
                  <motion.button
                    type="button"
                    onClick={() =>
                      openWhatsAppContact(
                        `Bonjour Délice Cake 👋 Je suis intéressé(e) par la nouveauté « ${item.name} ».`,
                      )
                    }
                    whileHover={{ x: 3 }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-burgundy/15 px-4 py-2 text-xs font-semibold text-burgundy transition-colors hover:border-accent hover:text-accent"
                  >
                    Commander
                    <ArrowUpRight size={14} />
                  </motion.button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
