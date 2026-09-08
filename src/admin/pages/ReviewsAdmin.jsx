import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquarePlus, Check, Star, Mail } from 'lucide-react';
import {
  getReviews,
  approveReview,
  deleteReview,
} from '../../services/content';
import { isFirebaseConfigured } from '../../services/firestore';
import ConfirmDialog from '../ui/ConfirmDialog';
import { useToast } from '../ui/toast';
import {
  Button,
  Card,
  EmptyState,
  PageHeader,
  Spinner,
} from '../ui/primitives';

function fmtDate(ts) {
  const d = ts?.toDate ? ts.toDate() : null;
  return d
    ? d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
    : '';
}

export default function ReviewsAdmin() {
  const toast = useToast();
  const [items, setItems] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [rejecting, setRejecting] = useState(null);

  const load = useCallback(() => {
    getReviews()
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const approve = async (review) => {
    setBusyId(review.id);
    try {
      await approveReview(review);
      toast(`Avis de ${review.name} publié.`);
      setItems((l) => l.filter((r) => r.id !== review.id));
    } catch (err) {
      toast(err.message || 'Publication impossible.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  const reject = async () => {
    const r = rejecting;
    setBusyId(r.id);
    try {
      await deleteReview(r.id);
      toast('Avis refusé.');
      setItems((l) => l.filter((x) => x.id !== r.id));
      setRejecting(null);
    } catch (err) {
      toast(err.message || 'Suppression impossible.', 'error');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Avis clients"
        subtitle="Avis soumis depuis le site, à valider avant publication."
      />

      {!isFirebaseConfigured ? (
        <Card className="border-amber-200 bg-amber-50 text-sm text-amber-800">
          Firebase non configuré — les avis clients ne sont pas disponibles.
        </Card>
      ) : items === null ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-7 w-7" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState icon={MessageSquarePlus} title="Aucun avis en attente">
          Les avis envoyés par les visiteurs apparaîtront ici.
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-display font-bold text-burgundy">
                      {r.name}
                      {r.city ? (
                        <span className="font-body text-sm font-normal text-burgundy/45">
                          {' '}
                          · {r.city}
                        </span>
                      ) : null}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-burgundy/45">
                      <Mail size={12} />
                      {r.email}
                      {fmtDate(r.createdAt) && ` · ${fmtDate(r.createdAt)}`}
                    </p>
                  </div>
                  <span className="flex gap-0.5 text-accent">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < (r.rating || 5) ? 'fill-accent' : 'text-blush'
                        }
                      />
                    ))}
                  </span>
                </div>

                <p className="rounded-xl bg-lightpink/50 p-3 text-sm text-burgundy/75">
                  « {r.text} »
                </p>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRejecting(r)}
                    disabled={busyId === r.id}
                  >
                    Refuser
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => approve(r)}
                    disabled={busyId === r.id}
                  >
                    <Check size={15} />
                    {busyId === r.id ? 'Publication…' : 'Publier'}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(rejecting)}
        title="Refuser l'avis"
        message={`Supprimer définitivement l'avis de « ${rejecting?.name ?? ''} » ?`}
        confirmLabel="Refuser"
        onConfirm={reject}
        onCancel={() => setRejecting(null)}
        busy={Boolean(busyId)}
      />
    </div>
  );
}
