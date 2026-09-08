import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { openWhatsAppContact } from '../config/whatsapp';
import { sectionLinkProps } from '../lib/sectionLink';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';

const panel = {
  hidden: { x: '100%' },
  show: {
    x: 0,
    transition: { type: 'spring', stiffness: 260, damping: 30 },
  },
  exit: { x: '100%', transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } },
};

const list = {
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, x: 24 },
  show: { opacity: 1, x: 0 },
};

export default function MobileMenu({ open, onClose, links }) {
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-burgundy-dark/45 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
            variants={panel}
            initial="hidden"
            animate="show"
            exit="exit"
            className="absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-cream px-7 pb-10 pt-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-bold text-burgundy">
                Délice{' '}
                <span className="font-script font-normal text-accent">Cake</span>
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer le menu"
                className="grid h-10 w-10 place-items-center rounded-full bg-white text-burgundy shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            <motion.nav
              variants={list}
              initial="hidden"
              animate="show"
              className="mt-10 flex flex-col gap-1"
            >
              {links.map((link) => {
                const props = sectionLinkProps(link.hash);
                return (
                  <motion.a
                    key={link.hash}
                    {...props}
                    variants={item}
                    onClick={(e) => {
                      props.onClick(e);
                      onClose();
                    }}
                    className="border-b border-burgundy/10 py-4 font-display text-2xl text-burgundy transition-colors hover:text-accent"
                  >
                    {link.label}
                  </motion.a>
                );
              })}
            </motion.nav>

            <motion.button
              type="button"
              variants={item}
              initial="hidden"
              animate="show"
              onClick={() => {
                onClose();
                openWhatsAppContact();
              }}
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-base font-semibold text-white shadow-lg"
            >
              <ShoppingBag size={18} />
              Commander
            </motion.button>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
