import { useEffect, useState } from 'react';
import { IMAGE_FALLBACK } from '../../config/images';

/**
 * <img> robuste :
 *  - `src` vide/absent  -> aucun `<img>`, on affiche un repli sobre
 *  - erreur de chargement -> même repli (jamais d'image cassée à l'écran)
 *  - `src` qui change   -> l'ancienne image disparaît immédiatement
 *                          (pas de « couverture » par l'ancienne)
 *
 * fit="cover"   -> remplit le cadre (peut rogner)
 * fit="contain" -> image ENTIÈRE visible, jamais rognée
 */
export default function CakeImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  fit = 'cover',
  eager = false,
  ...rest
}) {
  const [failed, setFailed] = useState(false);

  // Nouvelle URL -> on repart d'un état propre (sinon l'erreur ou l'image
  // précédente reste affichée le temps du chargement).
  useEffect(() => {
    setFailed(false);
  }, [src]);

  const fitClass = fit === 'contain' ? 'object-contain' : 'object-cover';
  const empty = !src || failed;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={empty ? { background: IMAGE_FALLBACK } : undefined}
      {...rest}
    >
      {!empty ? (
        <img
          key={src}
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
          className={`h-full w-full ${fitClass} ${imgClassName}`}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-center">
          <span className="font-script text-2xl text-burgundy/45">
            Délice Cake
          </span>
          <span className="text-xs font-medium uppercase tracking-wide text-burgundy/30">
            Photo à venir
          </span>
        </div>
      )}
    </div>
  );
}
