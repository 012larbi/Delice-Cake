import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { isFirebaseConfigured, loadFirebase } from '../config/firebase';

const AuthContext = createContext(null);

const FR_ERRORS = {
  'auth/invalid-email': 'Adresse e-mail invalide.',
  'auth/user-disabled': 'Ce compte est désactivé.',
  'auth/user-not-found': 'Aucun compte pour cette adresse.',
  'auth/wrong-password': 'Mot de passe incorrect.',
  'auth/invalid-credential': 'Identifiants incorrects.',
  'auth/too-many-requests': 'Trop de tentatives. Réessayez plus tard.',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    let unsub = () => {};
    let cancelled = false;
    loadFirebase().then((fb) => {
      if (cancelled || !fb) {
        setLoading(false);
        return;
      }
      unsub = fb.fa.onAuthStateChanged(fb.auth, (u) => {
        setUser(u);
        setLoading(false);
      });
    });
    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      configured: isFirebaseConfigured,
      async login(email, password) {
        const fb = await loadFirebase();
        if (!fb) {
          throw new Error('Firebase non configuré (voir .env.example).');
        }
        try {
          await fb.fa.signInWithEmailAndPassword(fb.auth, email, password);
        } catch (err) {
          throw new Error(FR_ERRORS[err.code] || 'Connexion impossible.');
        }
      },
      async logout() {
        const fb = await loadFirebase();
        if (fb) await fb.fa.signOut(fb.auth);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans <AuthProvider>');
  return ctx;
}
