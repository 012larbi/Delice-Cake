/**
 * Photos de démarrage (mode démo / valeurs par défaut).
 * De vraies photos vérifiées, prêtes à l'emploi.
 * En production : chaque photo se remplace depuis l'admin
 * (Produits · Nouveautés · Images du site).
 */

const u = (id, w = 1000) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMAGES = {
  // Grandes images du site — servent de défaut tant qu'aucune image
  // n'est ajoutée dans Admin → Images du site.
  hero: u('1535141192574-5d4897c12636', 1200),
  aboutChef: u('1556910103-1c02745aae4d', 1200),
  featuredCake: u('1621303837174-89787a7d4729', 1200),

  products: {
    'fraise-vanille': u('1578985545062-69928b1d9587'),
    'royal-chocolat': u('1606890737304-57a1ca8a5b62'),
    'red-velvet': u('1586788680434-30d324b2d46f'),
    'fruits-rouges': u('1565958011703-44f9829ba187'),
    'chocolate-dream': u('1563729784474-d77dbb933a9e'),
    'gateau-personnalise': u('1535254973040-607b474cb50d'),
  },

  new: [
    u('1519869325930-281384150729'), // Pistache & Framboise
    u('1464349095431-e9a21285b5f3'), // Caramel Beurre Salé
    u('1621303837174-89787a7d4729'), // Fleur de Rose
  ],
};

/** Dégradé affiché quand aucune image n'est définie. */
export const IMAGE_FALLBACK =
  'linear-gradient(135deg, #f8c8d2 0%, #fce3e8 45%, #fff8f5 100%)';
