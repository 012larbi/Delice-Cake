import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import WhatsAppIcon from './ui/WhatsAppIcon';
import { Floating, Strawberry, Leaf } from './ui/Decor';
import { openWhatsAppContact } from '../config/whatsapp';

export default function OrderCTA() {
  return (
    <section className="section-x bg-cream py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-burgundy px-7 py-16 text-center text-cream sm:px-12 sm:py-20"
      >
        <div
          className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-accent/25 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-blush/15 blur-3xl"
          aria-hidden="true"
        />

        <Floating className="absolute left-8 top-10 hidden w-12 sm:block" rotate={-10}>
          <Strawberry className="h-full w-full drop-shadow-xl" />
        </Floating>
        <Floating
          className="absolute bottom-10 right-10 hidden w-12 sm:block"
          rotate={12}
          delay={0.6}
        >
          <Leaf className="h-full w-full drop-shadow-xl" />
        </Floating>

        <div className="relative mx-auto flex max-w-xl flex-col items-center gap-6">
          <h2 className="text-4xl sm:text-5xl">
            Prêt à créer votre
            <br />
            <span className="font-script font-normal text-blush">
              gâteau idéal ?
            </span>
          </h2>
          <p className="text-cream/75">
            Parlez-nous de votre idée et nous transformons votre imagination en
            une délicieuse création.
          </p>

          <motion.button
            type="button"
            onClick={() => openWhatsAppContact()}
            whileHover={{ y: -3, scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 20 }}
            className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-8 py-4 text-base font-semibold text-white shadow-[0_25px_45px_-18px_rgba(37,211,102,0.75)] hover:bg-[#1ebe5b]"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Commander sur WhatsApp
          </motion.button>

          <p className="flex items-center gap-2 text-sm text-cream/60">
            <Clock size={15} />
            Réponse rapide — généralement en moins de 15 minutes
          </p>
        </div>
      </motion.div>
    </section>
  );
}
