import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Plus, Trash2, Database } from 'lucide-react';
import ModalShell from '../../components/ui/ModalShell';
import ConfirmDialog from './ConfirmDialog';
import ImageUploader from './ImageUploader';
import { useToast } from './toast';
import { isFirebaseConfigured } from '../../services/firestore';
import { deleteImageByUrl } from '../../services/storage';
import {
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  PageHeader,
  Select,
  Spinner,
  Textarea,
} from './primitives';

function FieldControl({ field, value, onChange }) {
  const common = {
    id: `f-${field.name}`,
    value: field.type === 'checkbox' ? undefined : value ?? '',
    onChange: (e) =>
      onChange(
        field.type === 'checkbox'
          ? e.target.checked
          : field.type === 'number'
            ? e.target.value === ''
              ? ''
              : Number(e.target.value)
            : e.target.value,
      ),
  };

  if (field.type === 'textarea') return <Textarea {...common} />;
  if (field.type === 'checkbox')
    return (
      <span className="flex items-center gap-2.5">
        <input
          id={`f-${field.name}`}
          type="checkbox"
          checked={Boolean(value)}
          onChange={common.onChange}
          className="h-4 w-4 accent-[#F05A78]"
        />
        <span className="text-sm text-burgundy/60">{field.checkboxLabel}</span>
      </span>
    );
  if (field.type === 'select')
    return (
      <Select {...common}>
        <option value="">—</option>
        {field.options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </Select>
    );
  return (
    <Input
      type={field.type === 'number' ? 'number' : 'text'}
      placeholder={field.placeholder}
      {...common}
    />
  );
}

export default function CrudManager({
  title,
  subtitle,
  singular = 'élément',
  service,
  columns,
  fields,
  emptyValue,
  icon: Icon,
}) {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | 'new' | item
  const [form, setForm] = useState(emptyValue);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const writable = isFirebaseConfigured;
  const imageFields = useMemo(
    () => fields.filter((f) => f.type === 'image'),
    [fields],
  );

  // URLs Storage téléversées pendant l'ouverture de la modale — pour
  // supprimer les orphelins si l'admin annule ou remplace l'image.
  const sessionUploads = useRef([]);
  const registerUpload = (url) => {
    if (url) sessionUploads.current.push(url);
  };
  const discardSessionUploads = (keep = []) => {
    const keepSet = new Set(keep.filter(Boolean));
    const toDelete = [...new Set(sessionUploads.current)].filter(
      (u) => !keepSet.has(u),
    );
    sessionUploads.current = [];
    toDelete.forEach((u) => deleteImageByUrl(u));
  };

  const refresh = async () => {
    setLoading(true);
    try {
      // Peuple la collection Firestore si elle est vide, pour que
      // les éléments affichés existent réellement (édition = mise à jour).
      if (service.seedIfEmpty) {
        try {
          await service.seedIfEmpty();
        } catch {
          /* règles non déployées / hors ligne : on garde le secours */
        }
      }
      setItems(await service.list());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openNew = () => {
    sessionUploads.current = [];
    setForm(emptyValue);
    setEditing('new');
  };
  const openEdit = (item) => {
    sessionUploads.current = [];
    setForm({ ...emptyValue, ...item });
    setEditing(item);
  };
  // Fermeture SANS enregistrer : on supprime les images téléversées.
  // (référence stable -> ne re-déclenche pas les effets de ModalShell)
  const close = useCallback(() => {
    discardSessionUploads([]);
    setEditing(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const missing = useMemo(
    () =>
      fields
        .filter((f) => f.required)
        .filter((f) => {
          const v = form[f.name];
          return v === '' || v === undefined || v === null;
        })
        .map((f) => f.label),
    [fields, form],
  );

  const handleSave = async (e) => {
    e.preventDefault();
    if (missing.length) {
      toast(`Champs requis : ${missing.join(', ')}`, 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form };
      delete payload.id;
      delete payload.createdAt;
      delete payload.updatedAt;
      if (editing === 'new') {
        await service.create(payload);
        toast(`${singular} ajouté.`);
      } else {
        await service.update(editing.id, payload);
        // Supprime les anciennes images remplacées (Storage).
        await Promise.all(
          imageFields
            .filter((f) => editing[f.name] && editing[f.name] !== form[f.name])
            .map((f) => deleteImageByUrl(editing[f.name])),
        );
        toast(`${singular} mis à jour.`);
      }
      // Conserve uniquement les images finales, supprime les intermédiaires.
      discardSessionUploads(imageFields.map((f) => form[f.name]));
      setEditing(null);
      await refresh();
    } catch (err) {
      toast(err.message || 'Enregistrement impossible.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleteBusy(true);
    try {
      await service.remove(deleting.id);
      // Supprime les images associées du Storage.
      await Promise.all(
        imageFields.map((f) => deleteImageByUrl(deleting[f.name])),
      );
      toast(`${singular} supprimé.`);
      setDeleting(null);
      await refresh();
    } catch (err) {
      toast(err.message || 'Suppression impossible.', 'error');
    } finally {
      setDeleteBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        action={
          <Button onClick={openNew} disabled={!writable}>
            <Plus size={16} />
            Ajouter
          </Button>
        }
      />

      {!writable && (
        <Card className="mb-6 flex items-start gap-3 border-amber-200 bg-amber-50">
          <Database size={18} className="mt-0.5 shrink-0 text-amber-600" />
          <p className="text-sm text-amber-800">
            Mode démo — connectez Firebase (<code>.env</code>) pour créer,
            modifier et supprimer. Les données affichées sont celles du site.
          </p>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-7 w-7" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState icon={Icon} title={`Aucun ${singular}`}>
          Cliquez sur « Ajouter » pour créer votre premier {singular}.
        </EmptyState>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead>
                <tr className="border-b border-burgundy/10 text-xs uppercase tracking-wide text-burgundy/45">
                  {columns.map((c) => (
                    <th key={c.key} className="px-5 py-3 font-semibold">
                      {c.label}
                    </th>
                  ))}
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.3) }}
                    className="border-b border-burgundy/5 last:border-0 hover:bg-lightpink/40"
                  >
                    {columns.map((c) => (
                      <td key={c.key} className="px-5 py-3.5 align-middle">
                        {c.render ? c.render(item[c.key], item) : item[c.key]}
                      </td>
                    ))}
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        disabled={!writable}
                        aria-label="Modifier"
                        className="mr-1 rounded-lg p-2 text-burgundy/60 hover:bg-lightpink hover:text-burgundy disabled:opacity-40"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleting(item)}
                        disabled={!writable}
                        aria-label="Supprimer"
                        className="rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <ModalShell
        open={editing !== null}
        onClose={close}
        labelledBy="crud-modal-title"
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4 p-6 sm:p-8">
          <h2
            id="crud-modal-title"
            className="pr-10 font-display text-xl font-bold text-burgundy"
          >
            {editing === 'new' ? `Nouveau ${singular}` : `Modifier ${singular}`}
          </h2>

          {fields.map((f) =>
            f.type === 'image' ? (
              <Field key={f.name} label={f.label} hint={f.hint}>
                <ImageUploader
                  value={form[f.name] || ''}
                  preset={f.preset || 'product'}
                  label={f.label}
                  onChange={(url) =>
                    setForm((s) => ({ ...s, [f.name]: url }))
                  }
                  onUploaded={registerUpload}
                />
              </Field>
            ) : (
              <Field
                key={f.name}
                label={f.label}
                required={f.required}
                hint={f.hint}
              >
                <FieldControl
                  field={f}
                  value={form[f.name]}
                  onChange={(v) => setForm((s) => ({ ...s, [f.name]: v }))}
                />
              </Field>
            ),
          )}

          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={close}>
              Annuler
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </ModalShell>

      <ConfirmDialog
        open={Boolean(deleting)}
        message={`Supprimer définitivement « ${
          deleting?.[columns[0].key] ?? ''
        } » ?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        busy={deleteBusy}
      />
    </div>
  );
}
