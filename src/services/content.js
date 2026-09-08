import {
  listDocs,
  watchDocs,
  watchDoc,
  createDoc,
  removeDoc,
  upsertDoc,
  getDocById,
  isFirebaseConfigured,
} from './firestore';
import {
  products as seedProducts,
  newProducts as seedNewProducts,
  testimonials as seedTestimonials,
  seedCategories,
  defaultSettings,
} from '../data/products';

/**
 * Couche de contenu : lit Firestore si disponible, sinon renvoie les
 * données statiques de secours. Le site public reste 100% fonctionnel
 * sans backend.
 */

const COL = {
  products: 'products',
  newProducts: 'newProducts',
  testimonials: 'testimonials',
  categories: 'categories',
  reviews: 'reviews',
  settings: 'settings',
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const byOrder = (a, b) =>
  (a.order ?? 0) - (b.order ?? 0) || String(a.name).localeCompare(b.name);

const warned = new Set();

async function readWithFallback(path, seed) {
  if (!isFirebaseConfigured) return seed;
  try {
    const docs = await listDocs(path);
    return docs.length ? docs : seed;
  } catch (err) {
    // permission-denied = règles Firestore non encore déployées : attendu,
    // on bascule silencieusement sur les données statiques.
    if (import.meta.env.DEV && !warned.has(path)) {
      warned.add(path);
      const expected = err?.code === 'permission-denied';
      // eslint-disable-next-line no-console
      console[expected ? 'info' : 'warn'](
        `[content] "${path}" : ${
          expected
            ? 'règles Firestore non déployées — données statiques utilisées'
            : `lecture impossible (${err?.code || err}) — données statiques`
        }`,
      );
    }
    return seed;
  }
}

/**
 * Si la collection Firestore est vide, y écrit les données de départ
 * (en conservant les identifiants « slug »). Idempotent : ne fait rien
 * si la collection contient déjà des documents. Réservé à l'admin
 * (échoue silencieusement côté public via les règles).
 */
async function seedCollectionIfEmpty(path, seed) {
  if (!isFirebaseConfigured) return;
  const docs = await listDocs(path);
  if (docs.length) return;
  await Promise.all(
    seed.map(({ id, ...rest }) => upsertDoc(path, id, rest)),
  );
}

/* ---------- Lecture (site public + admin) ---------- */

export const getProducts = () => readWithFallback(COL.products, seedProducts);
export const getNewProducts = () =>
  readWithFallback(COL.newProducts, seedNewProducts);
export const getTestimonials = () =>
  readWithFallback(COL.testimonials, seedTestimonials);

/**
 * Abonnement TEMPS RÉEL aux témoignages (onSnapshot).
 * Le tri « plus récents d'abord » se fait côté composant.
 * @returns {() => void} fonction de désinscription
 */
export function watchTestimonials(callback) {
  if (!isFirebaseConfigured) {
    callback(seedTestimonials);
    return () => {};
  }
  return watchDocs(COL.testimonials, (docs) =>
    callback(docs.length ? docs : seedTestimonials),
  );
}

export async function getCategories() {
  const list = await readWithFallback(COL.categories, seedCategories);
  return [...list].sort(byOrder);
}

export const ensureProductsSeeded = () =>
  seedCollectionIfEmpty(COL.products, seedProducts);
export const ensureNewProductsSeeded = () =>
  seedCollectionIfEmpty(COL.newProducts, seedNewProducts);
export const ensureTestimonialsSeeded = () =>
  seedCollectionIfEmpty(COL.testimonials, seedTestimonials);
export const ensureCategoriesSeeded = () =>
  seedCollectionIfEmpty(COL.categories, seedCategories);

/** Peuple toutes les collections vides (appelé à l'ouverture de l'admin). */
export async function ensureAllSeeded() {
  if (!isFirebaseConfigured) return;
  await Promise.allSettled([
    ensureProductsSeeded(),
    ensureNewProductsSeeded(),
    ensureTestimonialsSeeded(),
    ensureCategoriesSeeded(),
  ]);
}

/**
 * (Ré)importe le catalogue de démo : produits, nouveautés, témoignages,
 * catégories. Idempotent (upsert par identifiant « slug »).
 * NE TOUCHE PAS aux réglages (coordonnées, images du site) — ceux-ci ne
 * sont initialisés que s'ils n'existent pas encore.
 */
export async function importSeedData() {
  if (!isFirebaseConfigured) throw new Error('Firebase non configuré');
  await Promise.all([
    ...seedProducts.map(({ id, ...r }) => upsertDoc(COL.products, id, r)),
    ...seedNewProducts.map(({ id, ...r }) => upsertDoc(COL.newProducts, id, r)),
    ...seedTestimonials.map(({ id, ...r }) =>
      upsertDoc(COL.testimonials, id, r),
    ),
    ...seedCategories.map(({ id, ...r }) => upsertDoc(COL.categories, id, r)),
  ]);
  // Réglages : uniquement si absents (ne pas écraser ce que l'admin a saisi).
  const existing = await getDocById(COL.settings, 'general').catch(() => null);
  if (!existing) await upsertDoc(COL.settings, 'general', defaultSettings);
}

export async function getSettings() {
  if (!isFirebaseConfigured) return defaultSettings;
  try {
    const s = await getDocById(COL.settings, 'general');
    return { ...defaultSettings, ...(s || {}) };
  } catch {
    return defaultSettings;
  }
}

/**
 * Abonnement TEMPS RÉEL aux réglages du site (coordonnées, images).
 * Une image changée dans l'admin s'affiche aussitôt sur le site.
 * @returns {() => void} désinscription
 */
export function watchSettings(callback) {
  if (!isFirebaseConfigured) {
    callback(defaultSettings);
    return () => {};
  }
  return watchDoc(COL.settings, 'general', (s) =>
    callback({ ...defaultSettings, ...(s || {}) }),
  );
}

/* ---------- Écriture (admin uniquement) ---------- */
/* `update*` = upsert (set + merge) : fonctionne même si le document
   n'existe pas encore en base (ex : élément affiché depuis les données
   de secours). Évite l'erreur "No document to update". */

export const createProduct = (data) => createDoc(COL.products, data);
export const updateProduct = (id, data) => upsertDoc(COL.products, id, data);
export const deleteProduct = (id) => removeDoc(COL.products, id);

export const createNewProduct = (data) => createDoc(COL.newProducts, data);
export const updateNewProduct = (id, data) =>
  upsertDoc(COL.newProducts, id, data);
export const deleteNewProduct = (id) => removeDoc(COL.newProducts, id);

export const createTestimonial = (data) => createDoc(COL.testimonials, data);
export const updateTestimonial = (id, data) =>
  upsertDoc(COL.testimonials, id, data);
export const deleteTestimonial = (id) => removeDoc(COL.testimonials, id);

export const createCategory = (data) => createDoc(COL.categories, data);
export const updateCategory = (id, data) => upsertDoc(COL.categories, id, data);
export const deleteCategory = (id) => removeDoc(COL.categories, id);

/* ---------- Avis clients (soumis par les visiteurs, modérés) ---------- */

/**
 * Crée un avis en attente de validation.
 * Nom + e-mail + texte obligatoires. L'e-mail n'est jamais affiché
 * publiquement (collection `reviews` réservée à l'admin en lecture).
 */
export async function createReview({ name, email, text, rating, city }) {
  const n = String(name || '').trim();
  const e = String(email || '').trim();
  const t = String(text || '').trim();
  if (n.length < 2) throw new Error('Indiquez votre nom.');
  if (!EMAIL_RE.test(e)) throw new Error('Adresse e-mail invalide.');
  if (t.length < 5) throw new Error('Votre avis est trop court.');
  if (!isFirebaseConfigured) {
    throw new Error("L'envoi d'avis n'est pas disponible pour le moment.");
  }
  const r = Math.min(5, Math.max(1, Math.round(Number(rating) || 5)));
  return createDoc(COL.reviews, {
    name: n.slice(0, 80),
    email: e.slice(0, 120),
    text: t.slice(0, 1000),
    rating: r,
    city: String(city || '').trim().slice(0, 80),
    status: 'pending',
  });
}

/** Liste des avis en attente (admin). */
export const getReviews = () => listDocs(COL.reviews);

/** Publie un avis : crée le témoignage puis supprime l'avis. */
export async function approveReview(review) {
  await createDoc(COL.testimonials, {
    name: review.name,
    city: review.city || '',
    text: review.text,
    rating: review.rating || 5,
  });
  await removeDoc(COL.reviews, review.id);
}

export const deleteReview = (id) => removeDoc(COL.reviews, id);

export const saveSettings = (data) => upsertDoc(COL.settings, 'general', data);

/** Enregistre un seul champ image des réglages (merge). */
export const saveSettingsField = (name, value) =>
  upsertDoc(COL.settings, 'general', { [name]: value });
