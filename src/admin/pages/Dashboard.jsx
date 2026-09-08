import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cake,
  Tags,
  Sparkles,
  MessageSquareQuote,
  MessageSquarePlus,
  ImageIcon,
  Settings,
  ArrowRight,
} from 'lucide-react';
import {
  getProducts,
  getNewProducts,
  getTestimonials,
} from '../../services/content';
import { isFirebaseConfigured } from '../../services/firestore';
import { Card, PageHeader, StatCard } from '../ui/primitives';

const LINKS = [
  { to: '/admin/produits', label: 'Gérer les produits', icon: Cake },
  { to: '/admin/categories', label: 'Gérer les catégories', icon: Tags },
  { to: '/admin/nouveautes', label: 'Gérer les nouveautés', icon: Sparkles },
  {
    to: '/admin/temoignages',
    label: 'Gérer les témoignages',
    icon: MessageSquareQuote,
  },
  { to: '/admin/avis', label: 'Valider les avis clients', icon: MessageSquarePlus },
  { to: '/admin/images', label: 'Images du site', icon: ImageIcon },
  { to: '/admin/parametres', label: 'Coordonnées & localisation', icon: Settings },
];

export default function Dashboard() {
  const [counts, setCounts] = useState({ p: 0, n: 0, t: 0 });

  useEffect(() => {
    Promise.all([getProducts(), getNewProducts(), getTestimonials()]).then(
      ([p, n, t]) => setCounts({ p: p.length, n: n.length, t: t.length }),
    );
  }, []);

  return (
    <div>
      <PageHeader
        title="Tableau de bord"
        subtitle="Gère le contenu et les images du site Délice Cake."
      />

      {!isFirebaseConfigured && (
        <Card className="mb-6 border-amber-200 bg-amber-50 text-sm text-amber-800">
          Firebase n'est pas connecté — l'enregistrement est désactivé (mode
          démo).
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Cake} label="Produits" value={counts.p} delay={0} />
        <StatCard
          icon={Sparkles}
          label="Nouveautés"
          value={counts.n}
          delay={0.06}
        />
        <StatCard
          icon={MessageSquareQuote}
          label="Témoignages"
          value={counts.t}
          delay={0.12}
        />
      </div>

      <Card className="mt-6 flex flex-col divide-y divide-burgundy/8 p-0">
        {LINKS.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-lightpink/50"
          >
            <span className="flex items-center gap-3 font-medium text-burgundy">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent/12 text-accent">
                <Icon size={17} />
              </span>
              {label}
            </span>
            <ArrowRight size={16} className="text-burgundy/40" />
          </Link>
        ))}
      </Card>
    </div>
  );
}
