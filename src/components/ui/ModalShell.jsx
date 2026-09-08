import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';

/**
 * Coque de modale réutilisable :
 * - backdrop fade + fermeture au clic extérieur
 * - Escape ferme
 * - scroll body bloqué
 * - focus déplacé dans la modale, plein écran scrollable sur mobile
 */
export default function ModalShell({ open, onClose, labelledBy, children }) {
  const panelRef = useRef(null);

  useLockBodyScroll(open);

  // Focus déplacé dans la modale UNIQUEMENT à l'ouverture.
  // (Ne pas dépendre de `onClose` : sinon un parent qui recrée la fonction
  //  à chaque rendu re-déclenche le focus et vole le focus des champs.)
  useEffect(() => {
    if (!open) return undefined;
    const t = setTimeout(() => panelRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [open]);

  // Fermeture au clavier (Escape).
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div
            className="absolute inset-0 bg-burgundy-dark/55 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[2rem] bg-cream shadow-2xl outline-none sm:max-h-[88vh] sm:rounded-[2rem]"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-burgundy shadow-md backdrop-blur transition-transform hover:scale-110"
            >
              <X size={18} />
            </button>

            <div className="no-scrollbar overflow-y-auto overscroll-contain">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
