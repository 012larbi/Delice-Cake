import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from './primitives';

export default function ConfirmDialog({
  open,
  title = 'Confirmer',
  message,
  confirmLabel = 'Supprimer',
  onConfirm,
  onCancel,
  busy = false,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-burgundy-dark/50 backdrop-blur-sm"
            onClick={busy ? undefined : onCancel}
            aria-hidden="true"
          />
          <motion.div
            role="alertdialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="relative w-full max-w-sm rounded-2xl bg-cream p-6 shadow-2xl"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-red-50 text-red-500">
              <AlertTriangle size={20} />
            </span>
            <h3 className="mt-4 font-display text-lg font-bold text-burgundy">
              {title}
            </h3>
            <p className="mt-1.5 text-sm text-burgundy/60">{message}</p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={onCancel} disabled={busy}>
                Annuler
              </Button>
              <Button variant="danger" onClick={onConfirm} disabled={busy}>
                {busy ? 'Suppression…' : confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
