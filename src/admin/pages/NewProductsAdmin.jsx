import { Sparkles } from 'lucide-react';
import CrudManager from '../ui/CrudManager';
import { Badge } from '../ui/primitives';
import {
  getNewProducts,
  createNewProduct,
  updateNewProduct,
  deleteNewProduct,
  ensureNewProductsSeeded,
} from '../../services/content';
import { formatPrice } from '../../config/whatsapp';

export default function NewProductsAdmin() {
  return (
    <CrudManager
      title="Nouveautés"
      subtitle="La sélection éditoriale mise en avant sur la page d'accueil."
      singular="nouveauté"
      icon={Sparkles}
      service={{
        list: getNewProducts,
        seedIfEmpty: ensureNewProductsSeeded,
        create: createNewProduct,
        update: updateNewProduct,
        remove: deleteNewProduct,
      }}
      columns={[
        {
          key: 'name',
          label: 'Nom',
          render: (v, item) => (
            <div className="flex items-center gap-3">
              {item.image ? (
                <img
                  src={item.image}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-lg object-cover"
                />
              ) : null}
              <span className="font-medium text-burgundy">{v}</span>
            </div>
          ),
        },
        {
          key: 'tag',
          label: 'Badge',
          render: (v) =>
            v ? <Badge className="bg-lightpink text-accent">{v}</Badge> : '—',
        },
        { key: 'price', label: 'Prix', render: (v) => formatPrice(v || 0) },
      ]}
      fields={[
        { name: 'name', label: 'Nom', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'price', label: 'Prix (MAD)', type: 'number', required: true },
        {
          name: 'tag',
          label: 'Badge',
          type: 'text',
          placeholder: 'Nouveau, Édition limitée…',
        },
        { name: 'image', label: 'Photo', type: 'image', preset: 'new' },
      ]}
      emptyValue={{ name: '', description: '', price: '', tag: '', image: '' }}
    />
  );
}
