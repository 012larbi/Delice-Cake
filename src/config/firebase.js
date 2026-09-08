/**
 * Firebase — chargé dynamiquement uniquement s'il est configuré.
 * Le site public en mode démo (sans .env) n'embarque donc pas le SDK.
 *
 * Copiez .env.example vers .env et renseignez vos clés pour activer
 * le tableau de bord admin et le suivi des commandes.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/** true si les clés minimales sont présentes. */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

let cache = null;

/** true si le bucket Storage est renseigné (upload d'images). */
export const isStorageConfigured = Boolean(
  isFirebaseConfigured && firebaseConfig.storageBucket,
);

/**
 * Initialise (une fois) et renvoie { app, auth, db, storage, fs, fa, st }
 * où `fs` = namespace firebase/firestore, `fa` = firebase/auth,
 * `st` = namespace firebase/storage.
 * Renvoie null si Firebase n'est pas configuré.
 */
export async function loadFirebase() {
  if (!isFirebaseConfigured) return null;
  if (cache) return cache;

  const [{ initializeApp, getApps }, fa, fs, st] = await Promise.all([
    import('firebase/app'),
    import('firebase/auth'),
    import('firebase/firestore'),
    import('firebase/storage'),
  ]);

  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  cache = {
    app,
    auth: fa.getAuth(app),
    db: fs.getFirestore(app),
    storage: firebaseConfig.storageBucket ? st.getStorage(app) : null,
    fs,
    fa,
    st,
  };
  return cache;
}
