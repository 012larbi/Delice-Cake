import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from './ui/primitives';

/**
 * Protège l'espace admin.
 * - Firebase configuré  -> connexion obligatoire.
 * - Firebase non configuré (mode démo) -> accès en lecture seule autorisé
 *   (aucune écriture possible), pour prévisualiser le tableau de bord.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading, configured } = useAuth();
  const location = useLocation();

  if (!configured) return children;

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
}
