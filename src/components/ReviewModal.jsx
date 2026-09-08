import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, CheckCircle2 } from 'lucide-react';
import ModalShell from './ui/ModalShell';
import { createReview } from '../services/content';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const EMPTY = { name: '', email: '', city: '', rating: 5, text: '' };

export default function ReviewModal({ open, onClose }) {
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(EMPTY);
      setError('');
      setDone(false);
      setBusy(false);
    }
  }, [open]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.name.trim().length < 2) return setError('Indiquez votre nom.');
    if (!EMAIL_RE.test(form.email.trim()))
      return setError('Adresse e-mail invalide.');
    if (form.text.trim().length < 5)
      return setError('Votre avis est un peu court.');

    setBusy(true);
    try {
      await createReview(form);
      setDone(true);
    } catch (err) {
      setError(err.message || 'Envoi impossible.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ModalShell open={open} onClose={onClose} labelledBy="review-modal-title">
      {done ? (
        <div className="flex flex-col items-center gap-3 p-8 text-center sm:p-10">
          <CheckCircle2 size={40} className="text-emerald-500" />
          <h3
            id="review-modal-title"
            className="font-display text-2xl font-bold text-burgundy"
          >
            Merci pour votre avis !
          </h3>
          <p className="max-w-sm text-sm text-burgundy/60">
            Il sera publié sur le site après une rapide validation.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-2 rounded-full bg-burgundy px-6 py-3 text-sm font-semibold text-cream hover:bg-burgundy-dark"
          >
            Fermer
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4 p-6 sm:p-8">
          <div className="pr-10">
            <h3
              id="review-modal-title"
              className="font-display text-2xl font-bold text-burgundy"
            >
              Laisser un avis
            </h3>
            <p className="mt-1 text-sm text-burgundy/55">
              Nom et e-mail obligatoires. Votre e-mail ne sera pas publié.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-burgundy/70">
                Nom <span className="text-accent">*</span>
              </span>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                className="rounded-xl border border-burgundy/15 bg-white px-3.5 py-2.5 text-sm text-burgundy focus:border-accent focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-burgundy/70">
                E-mail <span className="text-accent">*</span>
              </span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                className="rounded-xl border border-burgundy/15 bg-white px-3.5 py-2.5 text-sm text-burgundy focus:border-accent focus:outline-none"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-burgundy/70">
              Ville (optionnel)
            </span>
            <input
              type="text"
              value={form.city}
              onChange={(e) => set('city', e.target.value)}
              className="rounded-xl border border-burgundy/15 bg-white px-3.5 py-2.5 text-sm text-burgundy focus:border-accent focus:outline-none"
            />
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-burgundy/70">Note</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
                  onClick={() => set('rating', n)}
                  className="p-0.5"
                >
                  <Star
                    size={26}
                    className={
                      n <= form.rating
                        ? 'fill-accent text-accent'
                        : 'text-blush'
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-burgundy/70">
              Votre avis <span className="text-accent">*</span>
            </span>
            <textarea
              required
              rows={4}
              value={form.text}
              onChange={(e) => set('text', e.target.value)}
              placeholder="Racontez votre expérience Délice Cake…"
              className="resize-none rounded-xl border border-burgundy/15 bg-white px-3.5 py-2.5 text-sm text-burgundy placeholder:text-burgundy/35 focus:border-accent focus:outline-none"
            />
          </label>

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={busy}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_35px_-15px_rgba(240,90,120,0.7)] hover:bg-accent-dark disabled:opacity-60"
          >
            <Send size={16} />
            {busy ? 'Envoi…' : 'Envoyer mon avis'}
          </motion.button>
        </form>
      )}
    </ModalShell>
  );
}
