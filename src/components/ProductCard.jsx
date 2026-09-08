import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Plus } from 'lucide-react';
import CakeImage from './ui/CakeImage';
import { formatPrice } from '../config/whatsapp';

/**
 * Carte produit interactive.
 * Clic sur la carte OU sur le bouton -> ouvre la fiche du gâteau (onSelect).
 */
export default function ProductCard({ product, onSelect }) {
  const [fav, setFav] = useState(false);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: -10 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      onClick={() => onSelect(product)}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-[1.75rem] border border-burgundy/8 bg-white shadow-[0_20px_45px_-30px_rgba(82,21,34,0.4)] transition-shadow duration-300 hover:shadow-[0_35px_60px_-30px_rgba(82,21,34,0.45)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-lightpink">
        <CakeImage
          src={product.image}
          alt={`${product.name} — ${product.description}`}
          fit="contain"
          className="h-full w-full"
          imgClassName="p-2.5 transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <button
          type="button"
          aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          aria-pressed={fav}
          onClick={(e) => {
            e.stopPropagation();
            setFav((v) => !v);
          }}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-burgundy shadow-sm backdrop-blur transition-transform hover:scale-110"
        >
          <Heart
            size={16}
            className={fav ? 'fill-accent text-accent' : ''}
            strokeWidth={2.2}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-bold text-burgundy">
            {product.name}
          </h3>
          <span className="shrink-0 rounded-full bg-lightpink px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-accent">
            {product.category}
          </span>
        </div>

        <p className="flex-1 text-sm text-burgundy/60">{product.description}</p>

        <div className="mt-1 flex items-center justify-between">
          <p className="font-display text-lg font-bold text-burgundy">
            {formatPrice(product.price)}
            <span className="ml-1 text-xs font-normal text-burgundy/45">
              / unité
            </span>
          </p>

          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-burgundy px-4 py-2 text-xs font-semibold text-cream transition-colors hover:bg-accent"
          >
            <Plus size={14} strokeWidth={2.6} />
            Voir le gâteau
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
