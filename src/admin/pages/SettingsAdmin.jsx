import { useEffect, useState } from 'react';
import { Save, Database, MapPin } from 'lucide-react';
import { getSettings, saveSettings, importSeedData } from '../../services/content';
import { isFirebaseConfigured } from '../../services/firestore';
import { configureWhatsApp } from '../../config/whatsapp';
import { extractMapSrc } from '../../config/map';
import { useToast } from '../ui/toast';
import {
  Button,
  Card,
  Field,
  Input,
  Textarea,
  PageHeader,
  Spinner,
} from '../ui/primitives';

const CONTACT_FIELDS = [
  {
    name: 'whatsappNumber',
    label: 'Numéro WhatsApp',
    hint: 'Format international sans « + » — ex : 2126XXXXXXXX',
  },
  { name: 'phone', label: 'Téléphone affiché' },
  { name: 'city', label: 'Ville / adresse (texte affiché)' },
  { name: 'instagram', label: 'Instagram' },
  { name: 'hours', label: 'Horaires' },
];

export default function SettingsAdmin() {
  const toast = useToast();
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    getSettings().then(setForm);
  }, []);

  const set = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Normalise : accepte un <iframe …> collé, on ne garde que l'URL src.
      const clean = { ...form, mapEmbedUrl: extractMapSrc(form.mapEmbedUrl) };
      await saveSettings(clean);
      setForm(clean);
      configureWhatsApp(clean.whatsappNumber);
      toast('Paramètres enregistrés.');
    } catch (err) {
      toast(err.message || 'Enregistrement impossible.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await importSeedData();
      toast('Données de démo importées dans Firestore.');
    } catch (err) {
      toast(err.message || 'Import impossible.', 'error');
    } finally {
      setSeeding(false);
    }
  };

  if (!form) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-7 w-7" />
      </div>
    );
  }

  const saveDisabled = saving || !isFirebaseConfigured;

  return (
    <div>
      <PageHeader
        title="Paramètres"
        subtitle="Coordonnées, WhatsApp et localisation affichés sur le site."
      />

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <Card className="flex flex-col gap-5">
          <h2 className="font-display text-lg font-bold text-burgundy">
            Coordonnées
          </h2>
          {CONTACT_FIELDS.map((f) => (
            <Field key={f.name} label={f.label} hint={f.hint}>
              <Input
                value={form[f.name] ?? ''}
                onChange={(e) => set(f.name, e.target.value)}
              />
            </Field>
          ))}
        </Card>

        <Card className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-accent" />
            <h2 className="font-display text-lg font-bold text-burgundy">
              Localisation (carte)
            </h2>
          </div>
          <Field
            label="Carte Google Maps à intégrer"
            hint="Sur Google Maps : cherche ton adresse → Partager → « Intégrer une carte » → copie tout le code <iframe …> ou seulement l'URL src. Laisser vide = plan illustré par défaut."
          >
            <Textarea
              rows={4}
              value={form.mapEmbedUrl ?? ''}
              onChange={(e) => set('mapEmbedUrl', e.target.value)}
              placeholder='<iframe src="https://www.google.com/maps/embed?pb=..."></iframe>'
            />
          </Field>
          <Field
            label="Lien Google Maps (bouton « Itinéraire »)"
            hint="Partager → Copier le lien. Optionnel."
          >
            <Input
              value={form.mapLink ?? ''}
              onChange={(e) => set('mapLink', e.target.value)}
              placeholder="https://maps.app.goo.gl/…"
            />
          </Field>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saveDisabled}>
            <Save size={16} />
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </Button>
        </div>
      </form>

      <Card className="mt-6">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/12 text-accent">
            <Database size={18} />
          </span>
          <div className="flex-1">
            <h2 className="font-display text-lg font-bold text-burgundy">
              Importer les données de démo
            </h2>
            <p className="mt-1 text-sm text-burgundy/55">
              (Ré)installe les produits, nouveautés et témoignages par défaut.
              Sans doublon — vos éléments ajoutés sont conservés.
            </p>
            <Button
              type="button"
              variant="soft"
              className="mt-4"
              onClick={handleSeed}
              disabled={seeding || !isFirebaseConfigured}
            >
              {seeding ? 'Import en cours…' : 'Importer maintenant'}
            </Button>
          </div>
        </div>
      </Card>

      {!isFirebaseConfigured && (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          Firebase non configuré — les enregistrements sont désactivés.
        </p>
      )}
    </div>
  );
}
