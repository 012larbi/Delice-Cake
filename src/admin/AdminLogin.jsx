import { useState } from 'react';
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Spinner } from './ui/primitives';

export default function AdminLogin() {
  const { user, loading, login, configured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }
  if (user) return <Navigate to={from} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-lightpink px-4">
      <div className="pointer-events-none absolute -left-32 -top-24 h-96 w-96 rounded-full bg-blush/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md rounded-[2rem] border border-white/70 bg-cream/90 p-8 shadow-[0_40px_80px_-40px_rgba(82,21,34,0.5)] backdrop-blur sm:p-10"
      >
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-burgundy/50 transition-colors hover:text-accent"
        >
          <ArrowLeft size={14} />
          Retour au site
        </Link>

        <div className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-burgundy text-cream">
            <span className="font-script text-xl leading-none">D</span>
          </span>
          <span className="font-display text-lg font-bold text-burgundy">
            Délice{' '}
            <span className="font-script font-normal text-accent">Cake</span>
          </span>
        </div>

        <h1 className="mt-6 font-display text-2xl font-bold text-burgundy">
          Espace administration
        </h1>
        <p className="mt-1 text-sm text-burgundy/55">
          Connectez-vous pour gérer commandes et créations.
        </p>

        {!configured && (
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            Firebase n'est pas configuré. Renseignez <code>.env</code> à partir
            de <code>.env.example</code>, puis créez un utilisateur dans
            Firebase Authentication.
          </p>
        )}

        <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-burgundy/70">
              Adresse e-mail
            </span>
            <div className="relative">
              <Mail
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-burgundy/35"
              />
              <Input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-burgundy/15 bg-white py-2.5 pl-10 pr-3.5 text-sm text-burgundy focus:border-accent focus:outline-none"
                placeholder="admin@delice-cake.ma"
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-burgundy/70">
              Mot de passe
            </span>
            <div className="relative">
              <Lock
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-burgundy/35"
              />
              <Input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-burgundy/15 bg-white py-2.5 pl-10 pr-3.5 text-sm text-burgundy focus:border-accent focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </label>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600"
            >
              {error}
            </motion.p>
          )}

          <Button type="submit" disabled={busy} className="mt-1 w-full">
            {busy ? 'Connexion…' : 'Se connecter'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
