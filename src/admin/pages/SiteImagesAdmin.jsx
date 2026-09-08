import { useEffect, useState } from 'react';
import { RotateCcw, CheckCircle2 } from 'lucide-react';
import {
  getSettings,
  saveSettingsField,
  getProducts,
  getNewProducts,
  updateProduct,
  updateNewProduct,
  ensureProductsSeeded,
  ensureNewProductsSeeded,
} from '../../services/content';
import { isFirebaseConfigured } from '../../services/firestore';
import { deleteImageByUrl } from '../../services/storage';
import { useToast } from '../ui/toast';
import ImageUploader from '../ui/ImageUploader';
import { Card, PageHeader, Spinner } from '../ui/primitives';

/**
 * Toutes les images du site public, modifiables au même endroit.
 * Chaque changement est enregistré IMMÉDIATEMENT en base (aucun bouton
 * "Enregistrer" à cliquer).
 */
const SITE_IMAGES = [
  {
    name: 'heroImage',
    title: 'Accueil — image principale (hero)',
    where: "En haut de la page d'accueil, dans le cercle animé.",
  },
  {
    name: 'aboutImage',
    title: 'Section « Notre passion »',
    where: "Fond bordeaux, photo de l'atelier / pâtissier·ère.",
  },
  {
    name: 'featuredImage',
    title: 'Section « Gâteau signature »',
    where: 'Bloc « Votre gâteau, votre histoire ».',
  },
  {
    name: 'ogImage',
    title: 'Image de partage (réseaux sociaux)',
    where: 'Aperçu quand on partage le lien du site.',
    preset: 'og',
  },
  {
    name: 'faviconUrl',
    title: 'Favicon (icône de l’onglet)',
    where: "Petite icône dans l'onglet du navigateur et les favoris.",
    preset: 'favicon',
  },
];

export default function SiteImagesAdmin() {
  const toast = useToast();
  const [values, setValues] = useState(null);
  const [busy, setBusy] = useState(null);

  useEffect(() => {
    getSettings().then((s) =>
      setValues(
        Object.fromEntries(SITE_IMAGES.map((f) => [f.name, s[f.name] || ''])),
      ),
    );
  }, []);

  const commit = async (name, url) => {
    const previous = values[name] || '';
    if (url === previous) return;
    setBusy(name);
    setValues((v) => ({ ...v, [name]: url }));
    try {
      await saveSettingsField(name, url);
      if (previous && previous !== url) deleteImageByUrl(previous);
      toast(url ? 'Image mise à jour.' : 'Image par défaut rétablie.');
    } catch (err) {
      setValues((v) => ({ ...v, [name]: previous }));
      toast(err.message || 'Enregistrement impossible.', 'error');
    } finally {
      setBusy(null);
    }
  };

  if (!values) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-7 w-7" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Images du site"
        subtitle="Chaque image est enregistrée automatiquement dès que tu la changes."
      />

      {!isFirebaseConfigured && (
        <Card className="mb-6 border-amber-200 bg-amber-50 text-sm text-amber-800">
          Firebase non configuré — l'enregistrement est désactivé.
        </Card>
      )}

      <div className="flex flex-col gap-5">
        {SITE_IMAGES.map((f) => (
          <Card key={f.name} className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-base font-bold text-burgundy">
                  {f.title}
                </h2>
                <p className="mt-0.5 text-xs text-burgundy/50">{f.where}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {busy === f.name && (
                  <span className="text-xs text-burgundy/40">
                    enregistrement…
                  </span>
                )}
                {values[f.name] ? (
                  <button
                    type="button"
                    onClick={() => commit(f.name, '')}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-burgundy/60 hover:bg-lightpink hover:text-burgundy"
                  >
                    <RotateCcw size={13} />
                    Image par défaut
                  </button>
                ) : (
                  <span className="rounded-lg bg-lightpink px-2.5 py-1.5 text-xs font-medium text-burgundy/60">
                    Image par défaut
                  </span>
                )}
              </div>
            </div>
            <ImageUploader
              value={values[f.name] || ''}
              preset={f.preset || 'hero'}
              label={f.title}
              onChange={(url) => commit(f.name, url)}
            />
          </Card>
        ))}
      </div>

      <ContentImageGrid
        title="Photos des gâteaux (Produits)"
        preset="product"
        load={async () => {
          await ensureProductsSeeded().catch(() => {});
          return getProducts();
        }}
        save={updateProduct}
      />

      <ContentImageGrid
        title="Photos des nouveautés"
        preset="new"
        load={async () => {
          await ensureNewProductsSeeded().catch(() => {});
          return getNewProducts();
        }}
        save={updateNewProduct}
      />

      <p className="mt-5 flex items-start gap-1.5 text-xs text-burgundy/45">
        <CheckCircle2 size={13} className="mt-px shrink-0" />
        Après un changement, recharge la page d'accueil pour voir le résultat.
        L'aperçu de partage réseaux sociaux peut mettre quelques heures (cache
        Facebook / WhatsApp).
      </p>
    </div>
  );
}

/**
 * Grille d'images d'une collection (produits / nouveautés).
 * Chaque changement est enregistré immédiatement en base (upsert).
 */
function ContentImageGrid({ title, preset, load, save }) {
  const toast = useToast();
  const [items, setItems] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let alive = true;
    load()
      .then((list) => alive && setItems(list))
      .catch(() => alive && setItems([]));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = async (item, url) => {
    if (url === (item.image || '')) return;
    setBusyId(item.id);
    const previous = item.image;
    setItems((list) =>
      list.map((it) => (it.id === item.id ? { ...it, image: url } : it)),
    );
    try {
      await save(item.id, { image: url });
      if (previous && previous !== url) deleteImageByUrl(previous);
      toast(`Photo mise à jour : ${item.name}`);
    } catch (err) {
      setItems((list) =>
        list.map((it) => (it.id === item.id ? { ...it, image: previous } : it)),
      );
      toast(err.message || 'Enregistrement impossible.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Card className="mt-6 flex flex-col gap-4">
      <h2 className="font-display text-base font-bold text-burgundy">{title}</h2>

      {items === null ? (
        <div className="flex justify-center py-8">
          <Spinner className="h-6 w-6" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-burgundy/50">Aucun élément.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col gap-2">
              <p className="text-sm font-medium text-burgundy">
                {item.name}
                {busyId === item.id && (
                  <span className="ml-2 text-xs text-burgundy/40">
                    enregistrement…
                  </span>
                )}
              </p>
              <ImageUploader
                value={item.image || ''}
                preset={preset}
                label={item.name}
                onChange={(url) => handleChange(item, url)}
              />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
