import { isFirebaseConfigured, loadFirebase } from '../config/firebase';

/**
 * Helpers Firestore génériques (SDK chargé dynamiquement).
 * Toutes les fonctions restent sûres si Firebase n'est pas configuré :
 * le site public bascule alors sur les données statiques.
 */

export { isFirebaseConfigured };

export async function listDocs(path, sortField) {
  const fb = await loadFirebase();
  if (!fb) return [];
  const { collection, getDocs, query, orderBy } = fb.fs;
  const ref = collection(fb.db, path);
  const snap = await getDocs(sortField ? query(ref, orderBy(sortField)) : ref);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Abonnement temps réel. Renvoie une fonction de désinscription
 * (synchrone) même si le SDK se charge encore en arrière-plan.
 */
export function watchDocs(path, callback, { sortField, sortDir = 'desc' } = {}) {
  if (!isFirebaseConfigured) {
    callback([]);
    return () => {};
  }
  let unsub = () => {};
  let cancelled = false;

  loadFirebase().then((fb) => {
    if (cancelled || !fb) return;
    const { collection, onSnapshot, query, orderBy } = fb.fs;
    const ref = collection(fb.db, path);
    const q = sortField ? query(ref, orderBy(sortField, sortDir)) : ref;
    unsub = onSnapshot(
      q,
      (snap) =>
        callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => {
        // eslint-disable-next-line no-console
        console.error(`[Firestore] watch ${path}`, err);
        callback([]);
      },
    );
  });

  return () => {
    cancelled = true;
    unsub();
  };
}

export async function getDocById(path, id) {
  const fb = await loadFirebase();
  if (!fb) return null;
  const { doc, getDoc } = fb.fs;
  const snap = await getDoc(doc(fb.db, path, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/**
 * Abonnement temps réel à UN document. `callback(data | null)`.
 * Renvoie une fonction de désinscription synchrone.
 */
export function watchDoc(path, id, callback) {
  if (!isFirebaseConfigured) {
    callback(null);
    return () => {};
  }
  let unsub = () => {};
  let cancelled = false;

  loadFirebase().then((fb) => {
    if (cancelled || !fb) return;
    const { doc, onSnapshot } = fb.fs;
    unsub = onSnapshot(
      doc(fb.db, path, id),
      (snap) => callback(snap.exists() ? { id: snap.id, ...snap.data() } : null),
      (err) => {
        // eslint-disable-next-line no-console
        console.error(`[Firestore] watch ${path}/${id}`, err);
        callback(null);
      },
    );
  });

  return () => {
    cancelled = true;
    unsub();
  };
}

async function requireFb() {
  const fb = await loadFirebase();
  if (!fb) throw new Error('Firebase non configuré');
  return fb;
}

export async function createDoc(path, data) {
  const fb = await requireFb();
  const { collection, addDoc, serverTimestamp } = fb.fs;
  const ref = await addDoc(collection(fb.db, path), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function upsertDoc(path, id, data) {
  const fb = await requireFb();
  const { doc, setDoc, serverTimestamp } = fb.fs;
  await setDoc(
    doc(fb.db, path, id),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true },
  );
}

export async function patchDoc(path, id, data) {
  const fb = await requireFb();
  const { doc, updateDoc, serverTimestamp } = fb.fs;
  await updateDoc(doc(fb.db, path, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function removeDoc(path, id) {
  const fb = await requireFb();
  const { doc, deleteDoc } = fb.fs;
  await deleteDoc(doc(fb.db, path, id));
}
