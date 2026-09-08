import { isStorageConfigured, loadFirebase } from '../config/firebase';
import {
  isCloudinaryConfigured,
  CLOUDINARY_UPLOAD_URL,
  CLOUDINARY_UPLOAD_PRESET,
  CLOUDINARY_FOLDER,
} from '../config/cloudinary';

/**
 * Upload d'images — deux fournisseurs possibles :
 *  1. Cloudinary (offre gratuite, recommandé)   -> VITE_CLOUDINARY_*
 *  2. Firebase Storage (nécessite le plan Blaze) -> VITE_FIREBASE_STORAGE_BUCKET
 * Dans tous les cas : compression + resize + WebP côté client, puis on
 * n'enregistre QUE l'URL renvoyée (jamais de Base64, pas de dossier local).
 */

export function getUploadProvider() {
  if (isCloudinaryConfigured) return 'cloudinary';
  if (isStorageConfigured) return 'firebase';
  return null;
}

export const isUploadConfigured = getUploadProvider() !== null;

export const uploadProviderLabel = {
  cloudinary: 'Cloudinary',
  firebase: 'Firebase Storage',
  null: 'aucun',
}[getUploadProvider() ?? 'null'];

/** Presets de redimensionnement selon l'usage de l'image. */
export const IMAGE_PRESETS = {
  product: {
    maxW: 1200,
    maxH: 1200,
    quality: 0.82,
    folder: 'products',
    recommend: '≈ 1200 × 900 px · format paysage · JPG ou PNG · < 3 Mo',
  },
  new: {
    maxW: 1400,
    maxH: 1050,
    quality: 0.82,
    folder: 'new',
    recommend: '≈ 1400 × 1050 px · format paysage · JPG ou PNG',
  },
  hero: {
    maxW: 2000,
    maxH: 1500,
    quality: 0.85,
    folder: 'hero',
    recommend: '≥ 1600 × 1200 px · haute qualité · sujet bien centré',
  },
  og: {
    maxW: 1200,
    maxH: 630,
    quality: 0.85,
    folder: 'site',
    recommend: '1200 × 630 px exactement · format aperçu réseaux sociaux',
  },
  favicon: {
    maxW: 512,
    maxH: 512,
    quality: 0.9,
    folder: 'site',
    recommend: '512 × 512 px · carré · logo simple sur fond uni',
  },
};

/** Texte de taille recommandée pour un preset. */
export const recommendedSize = (preset) =>
  (IMAGE_PRESETS[preset] || IMAGE_PRESETS.product).recommend;

const MAX_SOURCE_BYTES = 25 * 1024 * 1024;

export function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '—';
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`;
}

let webpSupport = null;
function supportsWebp() {
  if (webpSupport !== null) return webpSupport;
  const c = document.createElement('canvas');
  webpSupport =
    !!c.toDataURL && c.toDataURL('image/webp').startsWith('data:image/webp');
  return webpSupport;
}

const canvasToBlob = (canvas, type, quality) =>
  new Promise((resolve) => canvas.toBlob(resolve, type, quality));

/**
 * Compresse + redimensionne une image côté client (WebP si possible).
 * @returns {Promise<{blob: Blob, width: number, height: number, type: string, ext: string}>}
 */
export async function compressImage(file, presetKey = 'product') {
  if (!file || !file.type?.startsWith('image/')) {
    throw new Error('Fichier image invalide.');
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error('Image trop lourde (25 Mo max).');
  }
  if (file.type === 'image/svg+xml') {
    throw new Error('Format SVG non pris en charge — utilisez JPG ou PNG.');
  }

  const preset = IMAGE_PRESETS[presetKey] || IMAGE_PRESETS.product;

  const bitmap = await createImageBitmap(file, {
    imageOrientation: 'from-image',
  }).catch(() =>
    createImageBitmap(file).catch(() => {
      throw new Error("Impossible de lire l'image.");
    }),
  );

  const ratio = Math.min(
    1,
    preset.maxW / bitmap.width,
    preset.maxH / bitmap.height,
  );
  const width = Math.max(1, Math.round(bitmap.width * ratio));
  const height = Math.max(1, Math.round(bitmap.height * ratio));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const type = supportsWebp() ? 'image/webp' : 'image/jpeg';
  let blob = await canvasToBlob(canvas, type, preset.quality);
  if (!blob) blob = await canvasToBlob(canvas, 'image/jpeg', preset.quality);
  if (!blob) throw new Error('Compression impossible.');

  return {
    blob,
    width,
    height,
    type: blob.type,
    ext: blob.type === 'image/webp' ? 'webp' : 'jpg',
  };
}

/* ---------------------------------------------------------------- */
/*  Fournisseur : Cloudinary (upload non signé, XHR pour progress)  */
/* ---------------------------------------------------------------- */

function explainCloudinaryError(message, status) {
  const m = (message || '').toLowerCase();
  if (m.includes('preset not found')) {
    return `Preset Cloudinary « ${CLOUDINARY_UPLOAD_PRESET} » introuvable. Créez-le dans Cloudinary (Settings → Upload → Add upload preset), passez « Signing Mode » sur Unsigned, enregistrez, et vérifiez que le nom correspond EXACTEMENT à VITE_CLOUDINARY_UPLOAD_PRESET (sensible à la casse).`;
  }
  if (m.includes('whitelisted for unsigned')) {
    return `Le preset « ${CLOUDINARY_UPLOAD_PRESET} » existe mais n'est pas en mode « Unsigned ». Ouvrez-le dans Cloudinary et réglez « Signing Mode » sur Unsigned.`;
  }
  if (m.includes('unknown api key') || m.includes('cloud_name')) {
    return `Cloud name Cloudinary invalide (VITE_CLOUDINARY_CLOUD_NAME). Copiez la valeur exacte affichée sur le Dashboard Cloudinary.`;
  }
  return message || `Cloudinary : erreur ${status}.`;
}

function cloudinaryUpload(blob, filename, folder, onProgress) {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append('file', blob, filename);
    form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    form.append('folder', `${CLOUDINARY_FOLDER}/${folder}`);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', CLOUDINARY_UPLOAD_URL);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.((e.loaded / e.total) * 100);
    };
    xhr.onload = () => {
      let data;
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        return reject(new Error('Réponse Cloudinary invalide.'));
      }
      if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) {
        onProgress?.(100);
        resolve({
          url: data.secure_url,
          path: data.public_id,
          size: data.bytes,
        });
      } else {
        reject(new Error(explainCloudinaryError(data?.error?.message, xhr.status)));
      }
    };
    xhr.onerror = () => reject(new Error('Cloudinary : échec réseau.'));
    xhr.send(form);
  });
}

/* ---------------------------------------------------------------- */
/*  Fournisseur : Firebase Storage (resumable)                      */
/* ---------------------------------------------------------------- */

async function firebaseUpload(blob, path, type, onProgress) {
  const fb = await loadFirebase();
  if (!fb?.storage) throw new Error('Firebase Storage indisponible.');
  const { ref, uploadBytesResumable, getDownloadURL } = fb.st;

  const task = uploadBytesResumable(ref(fb.storage, path), blob, {
    contentType: type,
    cacheControl: 'public, max-age=31536000, immutable',
  });

  await new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      (s) =>
        onProgress?.(
          s.totalBytes ? (s.bytesTransferred / s.totalBytes) * 100 : 0,
        ),
      reject,
      resolve,
    );
  });

  return {
    url: await getDownloadURL(task.snapshot.ref),
    path,
    size: blob.size,
  };
}

/* ---------------------------------------------------------------- */

/**
 * Compresse puis téléverse une image chez le fournisseur configuré.
 * @param {File} file
 * @param {'product'|'new'|'hero'} presetKey
 * @param {(pct:number)=>void} [onProgress]
 * @returns {Promise<{url, path, size, originalSize, width, height, type, provider}>}
 */
export async function uploadImage(file, presetKey = 'product', onProgress) {
  const provider = getUploadProvider();
  if (!provider) {
    throw new Error(
      "Aucun hébergeur d'images configuré (voir .env : VITE_CLOUDINARY_*).",
    );
  }

  const { blob, width, height, type, ext } = await compressImage(
    file,
    presetKey,
  );
  const folder = (IMAGE_PRESETS[presetKey] || IMAGE_PRESETS.product).folder;
  const id =
    (crypto.randomUUID && crypto.randomUUID()) ||
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info(
      `[storage] upload via ${provider} · ${folder}/${id}.${ext} · ${formatBytes(
        blob.size,
      )} ${type}`,
    );
  }

  const res =
    provider === 'cloudinary'
      ? await cloudinaryUpload(blob, `${id}.${ext}`, folder, onProgress)
      : await firebaseUpload(
          blob,
          `images/${folder}/${id}.${ext}`,
          type,
          onProgress,
        );

  return {
    ...res,
    originalSize: file.size,
    size: blob.size,
    width,
    height,
    type,
    provider,
  };
}

/** Reconnaît une URL gérée par nous (Cloudinary ou Firebase). */
export function isManagedImageUrl(url) {
  return (
    typeof url === 'string' &&
    (url.includes('res.cloudinary.com') ||
      url.includes('firebasestorage.googleapis.com') ||
      url.includes('firebasestorage.app') ||
      url.startsWith('gs://'))
  );
}

/**
 * Supprime une image précédemment téléversée.
 *  - Firebase Storage : suppression réelle.
 *  - Cloudinary : impossible sans clé secrète côté client -> no-op
 *    (les anciens fichiers restent dans le dashboard Cloudinary, à
 *    nettoyer manuellement ; sans impact sur l'offre gratuite).
 */
export async function deleteImageByUrl(url) {
  if (typeof url !== 'string' || !url) return;

  if (url.includes('res.cloudinary.com')) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.info(
        '[storage] Cloudinary : suppression côté client non disponible, ignorée.',
      );
    }
    return;
  }

  if (!isManagedImageUrl(url)) return;

  const fb = await loadFirebase();
  if (!fb?.storage) return;
  try {
    const { ref, deleteObject } = fb.st;
    await deleteObject(ref(fb.storage, url));
  } catch (err) {
    if (err?.code !== 'storage/object-not-found') {
      // eslint-disable-next-line no-console
      console.warn('[storage] suppression impossible', err?.code || err);
    }
  }
}
