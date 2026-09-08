import { IMAGES } from '../config/images';

/**
 * Données produits réutilisables.
 * `id` sert de clé stable (filtre, page produit, images).
 * Champs « fiche » optionnels : ingredients, portions, dimensions, weight,
 * allergens, conservation.
 */
export const products = [
  {
    id: 'fraise-vanille',
    name: 'Fraise & Vanille',
    category: 'Fraise',
    description: 'Crème légère, fraises fraîches et génoise moelleuse.',
    price: 180,
    image: IMAGES.products['fraise-vanille'],
    ingredients:
      'Génoise vanille, crème légère mascarpone, fraises fraîches, sirop vanille, nappage neutre.',
    portions: '6 à 8 parts',
    dimensions: 'Ø 18 cm · hauteur 8 cm',
    weight: '≈ 1,2 kg',
    allergens: 'Gluten, œufs, lait.',
    conservation: 'À conserver au frais. À consommer sous 48 h.',
  },
  {
    id: 'royal-chocolat',
    name: 'Royal Chocolat',
    category: 'Chocolat',
    description: 'Chocolat intense et ganache fondante.',
    price: 220,
    image: IMAGES.products['royal-chocolat'],
    ingredients:
      'Biscuit cacao, croustillant praliné, mousse chocolat noir 66 %, ganache, glaçage miroir.',
    portions: '8 à 10 parts',
    dimensions: 'Ø 20 cm · hauteur 7 cm',
    weight: '≈ 1,5 kg',
    allergens: 'Gluten, œufs, lait, fruits à coque (noisette).',
    conservation: 'À conserver au frais. Sortir 20 min avant dégustation.',
  },
  {
    id: 'red-velvet',
    name: 'Red Velvet',
    category: 'Fruits rouges',
    description: 'Velours rouge, cream cheese et fruits rouges.',
    price: 200,
    image: IMAGES.products['red-velvet'],
    ingredients:
      'Biscuit velours rouge, crème cheese vanille, éclats de fruits rouges, décor mascarpone.',
    portions: '8 parts',
    dimensions: 'Ø 18 cm · hauteur 9 cm',
    weight: '≈ 1,3 kg',
    allergens: 'Gluten, œufs, lait.',
    conservation: 'À conserver au frais. À consommer sous 48 h.',
  },
  {
    id: 'fruits-rouges',
    name: 'Fruits Rouges',
    category: 'Fruits rouges',
    description: 'Crème vanillée et fruits rouges frais.',
    price: 240,
    image: IMAGES.products['fruits-rouges'],
    ingredients:
      'Génoise vanille, crème diplomate, fraises, framboises, myrtilles, groseilles, sirop maison.',
    portions: '10 à 12 parts',
    dimensions: 'Ø 22 cm · hauteur 8 cm',
    weight: '≈ 1,8 kg',
    allergens: 'Gluten, œufs, lait.',
    conservation: 'À conserver au frais. À consommer le jour même de préférence.',
  },
  {
    id: 'chocolate-dream',
    name: 'Chocolate Dream',
    category: 'Chocolat',
    description: 'Ganache chocolat et décoration gourmande.',
    price: 230,
    image: IMAGES.products['chocolate-dream'],
    ingredients:
      'Génoise chocolat, ganache montée chocolat au lait, copeaux et perles craquantes.',
    portions: '8 à 10 parts',
    dimensions: 'Ø 20 cm · hauteur 8 cm',
    weight: '≈ 1,5 kg',
    allergens: 'Gluten, œufs, lait, soja.',
    conservation: 'À conserver au frais. Sortir 15 min avant dégustation.',
  },
  {
    id: 'gateau-personnalise',
    name: 'Gâteau Personnalisé',
    category: 'Personnalisés',
    description:
      'Un gâteau conçu selon votre thème, vos couleurs et votre message.',
    price: 200,
    image: IMAGES.products['gateau-personnalise'],
    ingredients: 'Au choix : vanille, chocolat, fraise, red velvet, fruits rouges.',
    portions: 'De 6 à 30 parts (selon votre demande)',
    dimensions: 'Sur mesure',
    weight: 'Selon le nombre de parts',
    allergens: 'Nous préciser toute allergie à la commande.',
    conservation: 'À conserver au frais. À consommer sous 48 h.',
  },
];

/** slug simple pour un identifiant de document. */
export const slugify = (s) =>
  String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'categorie';

const CATEGORY_NAMES = [
  'Fraise',
  'Vanille',
  'Chocolat',
  'Fruits rouges',
  'Personnalisés',
];

/** Catégories (secours si Firestore vide / non configuré). */
export const seedCategories = CATEGORY_NAMES.map((name, i) => ({
  id: slugify(name),
  name,
  order: i,
}));

/** Liste de noms avec « Tous » — filtres du site public. */
export const categories = ['Tous', ...CATEGORY_NAMES];

/** Nouveautés — sélection éditoriale mise en avant. */
export const newProducts = [
  {
    id: 'nouveaute-pistache',
    name: 'Pistache & Framboise',
    description:
      'Biscuit pistache, insert framboise et crème mascarpone infusée.',
    price: 260,
    image: IMAGES.new[0],
    tag: 'Édition limitée',
  },
  {
    id: 'nouveaute-caramel',
    name: 'Caramel Beurre Salé',
    description: 'Génoise vanille, caramel coulant et éclats de noisette.',
    price: 250,
    image: IMAGES.new[1],
    tag: 'Nouveau',
  },
  {
    id: 'nouveaute-fleur',
    name: 'Fleur de Rose',
    description: 'Layer cake litchi-rose et décor floral fait main.',
    price: 300,
    image: IMAGES.new[2],
    tag: 'Signature',
  },
];

/** Témoignages (secours si Firestore vide / non configuré). */
export const testimonials = [
  {
    id: 'temoignage-sarah',
    name: 'Sarah',
    city: 'Casablanca',
    rating: 5,
    text: "Le gâteau était magnifique et encore meilleur que ce que j'imaginais. Tout le monde a adoré !",
  },
  {
    id: 'temoignage-imane',
    name: 'Imane',
    city: 'Rabat',
    rating: 5,
    text: "Une vraie merveille ! La décoration était exactement comme je l'avais demandée.",
  },
  {
    id: 'temoignage-yasmine',
    name: 'Yasmine',
    city: 'Casablanca',
    rating: 5,
    text: 'Très beau gâteau, délicieux et livré dans les temps. Je recommande les yeux fermés.',
  },
];

/** Paramètres du site (secours si Firestore non configuré). */
export const defaultSettings = {
  whatsappNumber: '212600000000',
  city: 'Casablanca, Maroc',
  phone: '+212 6 XX XX XX XX',
  instagram: '@delice.cake',
  hours: 'Lundi – Samedi · 09:00 – 19:00',
  // Localisation
  mapEmbedUrl: '', // src d'un iframe Google Maps (Partager → Intégrer une carte)
  mapLink: '', // lien Google Maps « ouvrir l'itinéraire »
  // Images (vide = image intégrée par défaut)
  heroImage: '',
  aboutImage: '',
  featuredImage: '',
  ogImage: '',
  faviconUrl: '',
};
