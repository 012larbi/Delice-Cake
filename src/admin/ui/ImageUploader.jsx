import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImagePlus, Loader2, RefreshCw, Trash2, Check } from 'lucide-react';
import {
  uploadImage,
  formatBytes,
  isUploadConfigured,
  recommendedSize,
} from '../../services/storage';
import { useToast } from './toast';

/**
 * Champ d'upload d'image :
 *  fichier PC -> compression + resize + WebP -> hébergeur (Cloudinary /
 *  Firebase Storage) -> URL. Seule l'URL est renvoyée via onChange
 *  (à stocker dans Firestore).
 * onUploaded(url) : signale chaque upload réussi (nettoyage des orphelins).
 */
export default function ImageUploader({
  value,
  onChange,
  onUploaded,
  preset = 'product',
  label = 'Image',
  hint,
}) {
  const inputRef = useRef(null);
  const toast = useToast();
  const recommend = hint || recommendedSize(preset);
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState(''); // 'compress' | 'upload'
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const disabled = !isUploadConfigured;

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type?.startsWith('image/')) {
      toast('Sélectionnez un fichier image.', 'error');
      return;
    }
    setBusy(true);
    setStats(null);
    setPhase('compress');
    setProgress(0);
    try {
      // Laisse le temps d'afficher l'état "compression"
      await new Promise((r) => setTimeout(r, 30));
      setPhase('upload');
      const res = await uploadImage(file, preset, setProgress);
      setStats({
        before: res.originalSize,
        after: res.size,
        width: res.width,
        height: res.height,
        type: res.type,
      });
      onUploaded?.(res.url);
      onChange(res.url);
      toast(
        `Image optimisée : ${formatBytes(res.originalSize)} → ${formatBytes(
          res.size,
        )}`,
      );
    } catch (err) {
      toast(err.message || 'Upload impossible.', 'error');
    } finally {
      setBusy(false);
      setPhase('');
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled || busy) return;
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {value ? (
        <div className="overflow-hidden rounded-xl border border-burgundy/12 bg-white">
          <div className="relative aspect-[4/3] w-full bg-lightpink">
            <img
              key={value}
              src={value}
              alt={label}
              className="h-full w-full object-contain p-2"
            />
            <AnimatePresence>
              {busy && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-burgundy-dark/55 text-cream backdrop-blur-sm"
                >
                  <Loader2 size={22} className="animate-spin" />
                  <span className="text-xs font-medium">
                    {phase === 'compress'
                      ? 'Optimisation…'
                      : `Envoi… ${Math.round(progress)}%`}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-wrap items-center gap-2 p-2.5">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled || busy}
              className="inline-flex items-center gap-1.5 rounded-lg bg-lightpink px-3 py-1.5 text-xs font-semibold text-burgundy hover:bg-blush disabled:opacity-50"
            >
              <RefreshCw size={13} />
              Remplacer
            </button>
            <button
              type="button"
              onClick={() => {
                onChange('');
                setStats(null);
              }}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 size={13} />
              Retirer
            </button>

            {stats && (
              <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-emerald-600">
                <Check size={13} />
                {formatBytes(stats.before)} → {formatBytes(stats.after)} ·{' '}
                {stats.width}×{stats.height}
              </span>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => !disabled && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          disabled={disabled || busy}
          className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-10 text-center transition-colors ${
            dragOver
              ? 'border-accent bg-accent/5'
              : 'border-burgundy/20 bg-white hover:border-burgundy/35'
          } disabled:opacity-60`}
        >
          {busy ? (
            <>
              <Loader2 size={22} className="animate-spin text-accent" />
              <span className="text-xs font-medium text-burgundy/60">
                {phase === 'compress'
                  ? 'Optimisation…'
                  : `Envoi… ${Math.round(progress)}%`}
              </span>
            </>
          ) : (
            <>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/12 text-accent">
                <ImagePlus size={20} />
              </span>
              <span className="text-sm font-medium text-burgundy">
                Choisir une image depuis le PC
              </span>
              <span className="text-xs text-burgundy/45">
                glisser-déposer accepté · compressée automatiquement
              </span>
            </>
          )}
        </button>
      )}

      <p className="flex items-start gap-1.5 text-xs text-burgundy/45">
        <span className="font-semibold text-burgundy/55">Recommandé :</span>
        {recommend}
      </p>

      {disabled && (
        <p className="text-xs text-amber-700">
          Renseignez <code>VITE_CLOUDINARY_CLOUD_NAME</code> et{' '}
          <code>VITE_CLOUDINARY_UPLOAD_PRESET</code> dans <code>.env</code> pour
          activer l'upload (offre gratuite Cloudinary).
        </p>
      )}
    </div>
  );
}
