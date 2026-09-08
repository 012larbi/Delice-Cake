/**
 * Configuration WhatsApp — point d'entrée unique.
 * Remplacez le numéro par le vrai numéro professionnel (format international, sans "+").
 * Il peut aussi être modifié à chaud depuis le tableau de bord admin
 * (Paramètres) via `configureWhatsApp()`.
 */
export const WHATSAPP_NUMBER = '212600000000';

/** Numéro effectivement utilisé (surchargé par les réglages Firestore). */
let activeNumber = WHATSAPP_NUMBER;

export function configureWhatsApp(number) {
  const clean = String(number || '').replace(/[^\d]/g, '');
  if (clean.length >= 8) activeNumber = clean;
}

export const getWhatsAppNumber = () => activeNumber;

const CURRENCY = 'MAD';

/**
 * Formatte un prix : 180 -> "180 MAD"
 */
export function formatPrice(value) {
  return `${new Intl.NumberFormat('fr-FR').format(value)} ${CURRENCY}`;
}

/**
 * Construit le message d'une commande produit.
 * @param {{ name, quantity, unitPrice, note?, portions?, dimensions? }} order
 */
export function createWhatsAppOrderMessage({
  name,
  quantity,
  unitPrice,
  note,
  portions,
  dimensions,
}) {
  const total = unitPrice * quantity;

  const lines = [
    'Bonjour Délice Cake 👋',
    '',
    'Je souhaite commander :',
    '',
    `🍰 Gâteau : ${name}`,
  ];

  if (portions) lines.push(`👥 Portions : ${portions}`);
  if (dimensions) lines.push(`📏 Dimensions : ${dimensions}`);

  lines.push(
    `🔢 Quantité : ${quantity}`,
    `💰 Prix unitaire : ${formatPrice(unitPrice)}`,
    `💵 Total : ${formatPrice(total)}`,
  );

  if (note && note.trim()) {
    lines.push('', '📝 Note :', note.trim());
  }

  lines.push('', 'Merci !');
  return lines.join('\n');
}

/**
 * Ouvre WhatsApp dans un nouvel onglet avec le message pré-rempli.
 */
export function openWhatsApp(message) {
  const url = `https://wa.me/${activeNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Raccourci : construit + ouvre une commande produit.
 */
export function openWhatsAppOrder(order) {
  openWhatsApp(createWhatsAppOrderMessage(order));
}

/**
 * Message générique (bouton flottant, CTA "Commander").
 */
export function openWhatsAppContact(
  message = 'Bonjour Délice Cake 👋 Je souhaite des informations pour commander un gâteau.',
) {
  openWhatsApp(message);
}
