/**
 * Normalise l'entrée « carte » de l'admin.
 * Accepte : un code <iframe …> complet OU une URL seule.
 * Ne garde que l'URL, et uniquement si c'est bien un embed Google Maps
 * (évite d'injecter un iframe arbitraire).
 */
export function extractMapSrc(input) {
  if (!input || typeof input !== 'string') return '';
  const trimmed = input.trim();
  const match = trimmed.match(/src\s*=\s*["']([^"']+)["']/i);
  const url = (match ? match[1] : trimmed).trim();
  return isAllowedMapUrl(url) ? url : '';
}

export function isAllowedMapUrl(url) {
  try {
    const u = new URL(url);
    return (
      u.protocol === 'https:' &&
      (u.hostname === 'www.google.com' || u.hostname === 'maps.google.com') &&
      u.pathname.startsWith('/maps')
    );
  } catch {
    return false;
  }
}
