import { Suspense, useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard,
  Cake,
  Tags,
  Sparkles,
  MessageSquareQuote,
  MessageSquarePlus,
  ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ensureAllSeeded } from '../services/content';
import { ToastProvider } from './ui/toast';
import { Spinner } from './ui/primitives';

const NAV = [
  { to: '/admin', end: true, label: 'Tableau de bord', icon: LayoutDashboard },
  { to: '/admin/produits', label: 'Produits', icon: Cake },
  { to: '/admin/categories', label: 'Catégories', icon: Tags },
  { to: '/admin/nouveautes', label: 'Nouveautés', icon: Sparkles },
  { to: '/admin/temoignages', label: 'Témoignages', icon: MessageSquareQuote },
  { to: '/admin/avis', label: 'Avis clients', icon: MessageSquarePlus },
  { to: '/admin/images', label: 'Images du site', icon: ImageIcon },
  { to: '/admin/parametres', label: 'Paramètres', icon: Settings },
];

function NavItems({ onNavigate }) {
  return (
    <nav className="flex flex-1 flex-col gap-1">
      {NAV.map(({ to, end, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-accent text-white shadow-[0_14px_28px_-14px_rgba(240,90,120,0.8)]'
                : 'text-cream/70 hover:bg-cream/10 hover:text-cream'
            }`
          }
        >
          <Icon size={17} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-1">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-white">
        <span className="font-script text-lg leading-none">D</span>
      </span>
      <div className="leading-tight">
        <p className="font-display text-base font-bold text-cream">
          Délice Cake
        </p>
        <p className="text-[11px] uppercase tracking-[0.18em] text-cream/45">
          Admin
        </p>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Peuple les collections Firestore vides avec les données par défaut,
  // pour que le catalogue soit toujours complet et éditable.
  useEffect(() => {
    ensureAllSeeded().catch(() => {});
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  // Fonction de rendu (pas un composant) — évite un remount à chaque render.
  const renderSidebar = (onNavigate) => (
    <>
      <Brand />
      <div className="mt-8 flex flex-1 flex-col">
        <NavItems onNavigate={onNavigate} />
        <div className="mt-4 flex flex-col gap-1 border-t border-cream/10 pt-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
          >
            <ExternalLink size={17} />
            Voir le site
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-cream/70 transition-colors hover:bg-red-500/15 hover:text-red-200"
          >
            <LogOut size={17} />
            Déconnexion
          </button>
        </div>
      </div>
      {user?.email && (
        <p className="mt-4 truncate px-1 text-xs text-cream/40" title={user.email}>
          {user.email}
        </p>
      )}
    </>
  );

  return (
    <ToastProvider>
      <div className="min-h-screen bg-cream text-burgundy">
        {/* Sidebar desktop */}
        <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-burgundy p-5 lg:flex">
          {renderSidebar()}
        </aside>

        {/* Topbar mobile */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-burgundy/10 bg-cream/90 px-4 py-3 backdrop-blur lg:hidden">
          <Brand />
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
            className="grid h-10 w-10 place-items-center rounded-full bg-burgundy text-cream"
          >
            <Menu size={18} />
          </button>
        </header>

        {/* Drawer mobile */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="fixed inset-0 z-50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className="absolute inset-0 bg-burgundy-dark/50 backdrop-blur-sm"
                onClick={() => setMobileOpen(false)}
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                className="absolute inset-y-0 left-0 flex w-72 flex-col bg-burgundy p-5"
              >
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Fermer le menu"
                  className="absolute right-4 top-4 text-cream/60 hover:text-cream"
                >
                  <X size={20} />
                </button>
                {renderSidebar(() => setMobileOpen(false))}
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contenu */}
        <main className="px-4 py-6 sm:px-8 sm:py-10 lg:ml-64">
          <div className="mx-auto max-w-5xl">
            <Suspense
              fallback={
                <div className="flex justify-center py-20">
                  <Spinner className="h-7 w-7" />
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
