import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Minus,
  Plus,
  Users,
  Ruler,
  Scale,
  Leaf,
  Snowflake,
  AlertCircle,
} from 'lucide-react';
import CakeImage from '../components/ui/CakeImage';
import WhatsAppIcon from '../components/ui/WhatsAppIcon';
import { useSiteData } from '../context/SiteSettingsContext';
import { formatPrice, openWhatsAppOrder } from '../config/whatsapp';

const SPECS = [
  { key: 'portions', label: 'Portions', icon: Users },
  { key: 'dimensions', label: 'Dimensions', icon: Ruler },
  { key: 'weight', label: 'Poids indicatif', icon: Scale },
  { key: 'ingredients', label: 'Ingrédients', icon: Leaf },
  { key: 'allergens', label: 'Allergènes', icon: AlertCircle },
  { key: 'conservation', label: 'Conservation', icon: Snowflake },
];

export default function ProductPage() {
  const { id } = useParams();
  const { products, ready } = useSiteData();
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  const product = useMemo(
    () => (products || []).find((p) => p.id === id),
    [products, id],
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1);
    setNote('');
  }, [id]);

  useEffect(() => {
    if (product) document.title = `${product.name} | Délice Cake`;
    return () => {
      document.title = 'Délice Cake | Gâteaux personnalisés à Casablanca';
    };
  }, [product]);

  if (!product) {
    return (
      <main className="section-x mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center gap-4 pt-28 text-center">
        <p className="font-script text-3xl text-accent">Oups…</p>
        <h1 className="font-display text-2xl font-bold text-burgundy">
          {ready ? 'Ce gâteau est introuvable' : 'Chargement…'}
        </h1>
        {ready && (
          <Link
            to="/#nos-creations"
            className="inline-flex items-center gap-2 rounded-full bg-burgundy px-6 py-3 text-sm font-semibold text-cream hover:bg-burgundy-dark"
          >
            <ArrowLeft size={16} />
            Retour aux créations
          </Link>
        )}
      </main>
    );
  }

  const total = product.price * quantity;
  const specs = SPECS.filter((s) => product[s.key]);

  const handleOrder = () =>
    openWhatsAppOrder({
      name: product.name,
      quantity,
      unitPrice: product.price,
      note,
      portions: product.portions,
      dimensions: product.dimensions,
    });

  return (
    <main className="bg-cream pb-24 pt-24 sm:pt-28">
      <div className="section-x mx-auto max-w-6xl">
        <Link
          to="/#nos-creations"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-burgundy/60 transition-colors hover:text-accent"
        >
          <ArrowLeft size={15} />
          Toutes les créations
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <CakeImage
              src={product.image}
              alt={product.name}
              eager
              fit="contain"
              className="aspect-square w-full rounded-[2rem] bg-lightpink ring-1 ring-burgundy/10"
              imgClassName="p-4"
            />
          </motion.div>

          {/* Infos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6"
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
                {product.category}
              </span>
              <h1 className="mt-1.5 font-display text-3xl font-bold text-burgundy sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-3 text-burgundy/70">{product.description}</p>
            </div>

            <p className="font-display text-2xl font-bold text-burgundy">
              {formatPrice(product.price)}
              <span className="ml-1.5 text-sm font-normal text-burgundy/45">
                / unité
              </span>
            </p>

            {/* Fiche du gâteau */}
            {specs.length > 0 && (
              <dl className="grid gap-3 rounded-2xl border border-burgundy/10 bg-white p-5 sm:grid-cols-2">
                {specs.map(({ key, label, icon: Icon }) => (
                  <div key={key} className="flex gap-3">
                    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-lightpink text-accent">
                      <Icon size={15} />
                    </span>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-burgundy/45">
                        {label}
                      </dt>
                      <dd className="mt-0.5 text-sm text-burgundy/75">
                        {product[key]}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            )}

            {/* Quantité */}
            <div className="flex items-center justify-between rounded-2xl border border-burgundy/12 bg-white p-2">
              <span className="pl-3 text-sm font-medium text-burgundy/70">
                Quantité
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Diminuer la quantité"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="grid h-9 w-9 place-items-center rounded-full bg-lightpink text-burgundy transition-colors hover:bg-blush disabled:opacity-40"
                >
                  <Minus size={16} />
                </button>
                <span
                  aria-live="polite"
                  className="w-8 text-center font-display text-lg font-bold text-burgundy"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Augmenter la quantité"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="grid h-9 w-9 place-items-center rounded-full bg-accent text-white transition-colors hover:bg-accent-dark"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="cake-note"
                className="mb-1.5 block text-sm font-medium text-burgundy/70"
              >
                Votre message (optionnel)
              </label>
              <textarea
                id="cake-note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ex : décoration rose, inscription « Joyeux anniversaire Lina », date de retrait…"
                className="w-full resize-none rounded-2xl border border-burgundy/12 bg-white px-4 py-3 text-sm text-burgundy placeholder:text-burgundy/35 focus:border-accent focus:outline-none"
              />
            </div>

            {/* Total + commande */}
            <div className="flex flex-col gap-3 border-t border-burgundy/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-burgundy/50">
                  Total
                </p>
                <p className="font-display text-2xl font-bold text-burgundy">
                  {formatPrice(total)}
                </p>
              </div>
              <motion.button
                type="button"
                onClick={handleOrder}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_35px_-15px_rgba(37,211,102,0.7)] hover:bg-[#1ebe5b]"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Commander sur WhatsApp
              </motion.button>
            </div>

            <p className="text-xs text-burgundy/45">
              Commande confirmée par message. Prévoir 48 h avant la date de
              retrait.
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
