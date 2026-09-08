/**
 * Cloudinary — hébergement d'images, offre gratuite (aucune carte requise).
 * Upload direct depuis le navigateur via un "upload preset" NON signé :
 * pas de backend, CORS déjà autorisé par Cloudinary.
 *
 * .env :
 *   VITE_CLOUDINARY_CLOUD_NAME=xxxxx
 *   VITE_CLOUDINARY_UPLOAD_PRESET=xxxxx   (Settings → Upload → Add upload preset → Signing mode: Unsigned)
 *   VITE_CLOUDINARY_FOLDER=delice-cake    (optionnel)
 */
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env
  .VITE_CLOUDINARY_UPLOAD_PRESET;
export const CLOUDINARY_FOLDER =
  import.meta.env.VITE_CLOUDINARY_FOLDER || 'delice-cake';

export const isCloudinaryConfigured = Boolean(
  CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET,
);

export const CLOUDINARY_UPLOAD_URL = isCloudinaryConfigured
  ? `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
  : null;
