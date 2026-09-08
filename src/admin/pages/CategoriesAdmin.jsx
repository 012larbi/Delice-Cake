import { Tags } from 'lucide-react';
import CrudManager from '../ui/CrudManager';
import { Card } from '../ui/primitives';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  ensureCategoriesSeeded,
} from '../../services/content';

export default function CategoriesAdmin() {
  return (
    <div>
      <Card className="mb-6 border-blush/60 bg-lightpink/50 text-sm text-burgundy/70">
        Les catégories alimentent les filtres de « Nos créations » et la liste
        déroulante des produits. Renommer une catégorie ne renomme pas
        automatiquement les produits qui l'utilisent — pense à les rouvrir pour
        choisir la nouvelle catégorie.
      </Card>

      <CrudManager
        title="Catégories"
        subtitle="Filtres affichés au-dessus du catalogue."
        singular="catégorie"
        icon={Tags}
        service={{
          list: getCategories,
          seedIfEmpty: ensureCategoriesSeeded,
          create: createCategory,
          update: updateCategory,
          remove: deleteCategory,
        }}
        columns={[
          {
            key: 'name',
            label: 'Nom',
            render: (v) => <span className="font-medium text-burgundy">{v}</span>,
          },
          { key: 'order', label: 'Ordre', render: (v) => v ?? 0 },
        ]}
        fields={[
          { name: 'name', label: 'Nom', type: 'text', required: true },
          {
            name: 'order',
            label: "Ordre d'affichage",
            type: 'number',
            hint: 'Les plus petits nombres apparaissent en premier.',
          },
        ]}
        emptyValue={{ name: '', order: 99 }}
      />
    </div>
  );
}
