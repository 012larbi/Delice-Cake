import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import WhatsAppIcon from './ui/WhatsAppIcon';
import { openWhatsAppContact } from '../config/whatsapp';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export default function FloatingWhatsApp() {
  const [hover, setHover] = useState(false);
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 18 }}
      className="fixed bottom-5 right-5 z-40 flex items-center gap-3 sm:bottom-7 sm:right-7"
    >
      <AnimatePresence>
        {hover && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="hidden rounded-full bg-burgundy px-4 py-2 text-sm font-medium text-cream shadow-lg sm:block"
          >
            Commander sur WhatsApp
          </motion.span>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => openWhatsAppContact()}
        onHoverStart={() => setHover(true)}
        onHoverEnd={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        aria-label="Commander sur WhatsApp"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_18px_35px_-12px_rgba(37,211,102,0.8)]"
      >
        {!reduced && (
          <motion.span
            className="absolute inset-0 rounded-full bg-[#25D366]"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <WhatsAppIcon className="relative h-6 w-6" />
      </motion.button>
    </motion.div>
  );
}
