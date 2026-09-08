import { createContext, useContext, useEffect, useState } from 'react';
import {
  watchSettings,
  getProducts,
  getNewProducts,
  getCategories,
} from '../services/content';
import { configureWhatsApp } from '../config/whatsapp';
import {
  defaultSettings,
  products as seedProducts,
  newProducts as seedNewProducts,
  seedCategories,
} from '../data/products';

// Les témoignages sont chargés en TEMPS RÉEL dans le composant
// <Testimonials/> (watchTestimonials) — pas ici.
const SiteDataContext = createContext({
  settings: defaultSettings,
  products: seedProducts,
  newProducts: seedNewProducts,
  categories: seedCategories,
  ready: false,
});

/**
 * Met à jour les balises méta d'image de partage (best-effort côté client :
 * l'idéal reste de la fixer aussi dans index.html pour les crawlers).
 */
function applyOgImage(url) {
  if (!url) return;
  for (const sel of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    let tag = document.head.querySelector(sel);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(sel.includes('twitter') ? 'name' : 'property',
        sel.includes('twitter') ? 'twitter:image' : 'og:image');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', url);
  }
}

/** Remplace le favicon de l'onglet. */
function applyFavicon(url) {
  if (!url) return;
  let link = document.head.querySelector('link[rel~="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.setAttribute('type', '');
  link.setAttribute('href', url);
}

/**
 * Charge le contenu du site (Firestore si configuré, sinon données
 * statiques). Le rendu initial utilise immédiatement les données de
 * secours : aucun écran de chargement, puis mise à jour transparente.
 */
export function SiteSettingsProvider({ children }) {
  const [state, setState] = useState({
    settings: defaultSettings,
    products: seedProducts,
    newProducts: seedNewProducts,
    categories: seedCategories,
    ready: false,
  });

  useEffect(() => {
    let alive = true;

    // Catalogue : chargé une fois.
    Promise.all([getProducts(), getNewProducts(), getCategories()])
      .then(([products, newProducts, categories]) => {
        if (!alive) return;
        setState((s) => ({
          ...s,
          products,
          newProducts,
          categories,
          ready: true,
        }));
      })
      .catch(() => alive && setState((s) => ({ ...s, ready: true })));

    // Réglages (coordonnées + images) : TEMPS RÉEL.
    const unsub = watchSettings((settings) => {
      if (!alive) return;
      configureWhatsApp(settings.whatsappNumber);
      applyOgImage(settings.ogImage);
      applyFavicon(settings.faviconUrl);
      setState((s) => ({ ...s, settings }));
    });

    return () => {
      alive = false;
      unsub();
    };
  }, []);

  return (
    <SiteDataContext.Provider value={state}>
      {children}
    </SiteDataContext.Provider>
  );
}

export const useSiteData = () => useContext(SiteDataContext);
export const useSiteSettings = () => useContext(SiteDataContext).settings;
