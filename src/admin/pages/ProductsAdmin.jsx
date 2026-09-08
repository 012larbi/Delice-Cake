import { useEffect, useState } from 'react';
import { Cake } from 'lucide-react';
import CrudManager from '../ui/CrudManager';
import { Badge, Spinner } from '../ui/primitives';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  ensureProductsSeeded,
  getCategories,
  ensureCategoriesSeeded,
} from '../../services/content';
import { formatPrice } from '../../config/whatsapp';

export default function ProductsAdmin() {
  const [categoryNames, setCategoryNames] = useState(null);

  useEffect(() => {
    ensureCategoriesSeeded()
      .catch(() => {})
      .finally(() =>
        getCategories().then((cats) =>
          setCategoryNames(cats.map((c) => c.name)),
        ),
      );
  }, []);

  if (!categoryNames) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-7 w-7" />
      </div>
    );
  }

  return (
    <CrudManager
      title="Produits"
      subtitle="Le catalogue affiché dans « Nos créations »."
      singular="produit"
      icon={Cake}
      service={{
        list: getProducts,
        seedIfEmpty: ensureProductsSeeded,
        create: createProduct,
        update: updateProduct,
        remove: deleteProduct,
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
          key: 'category',
          label: 'Catégorie',
          render: (v) => <Badge className="bg-lightpink text-accent">{v}</Badge>,
        },
        {
          key: 'price',
          label: 'Prix',
          render: (v) => formatPrice(v || 0),
        },
      ]}
      fields={[
        { name: 'name', label: 'Nom', type: 'text', required: true },
        {
          name: 'category',
          label: 'Catégorie',
          type: 'select',
          options: categoryNames,
          required: true,
          hint: 'Gère la liste dans Admin → Catégories.',
        },
        { name: 'description', label: 'Description courte', type: 'textarea' },
        { name: 'price', label: 'Prix (MAD)', type: 'number', required: true },
        {
          name: 'image',
          label: 'Photo du gâteau',
          type: 'image',
          preset: 'product',
        },
        {
          name: 'portions',
          label: 'Portions',
          type: 'text',
          placeholder: 'Ex : 8 à 10 parts',
          hint: 'Affiché dans la fiche du gâteau.',
        },
        {
          name: 'dimensions',
          label: 'Dimensions',
          type: 'text',
          placeholder: 'Ex : Ø 20 cm · hauteur 8 cm',
        },
        {
          name: 'weight',
          label: 'Poids indicatif',
          type: 'text',
          placeholder: 'Ex : ≈ 1,5 kg',
        },
        {
          name: 'ingredients',
          label: 'Ingrédients',
          type: 'textarea',
          placeholder: 'Ex : Génoise vanille, crème mascarpone, fraises fraîches…',
        },
        {
          name: 'allergens',
          label: 'Allergènes',
          type: 'text',
          placeholder: 'Ex : Gluten, œufs, lait',
        },
        {
          name: 'conservation',
          label: 'Conservation',
          type: 'text',
          placeholder: 'Ex : À conserver au frais, à consommer sous 48 h',
        },
      ]}
      emptyValue={{
        name: '',
        category: categoryNames[0] || '',
        description: '',
        price: '',
        image: '',
        portions: '',
        dimensions: '',
        weight: '',
        ingredients: '',
        allergens: '',
        conservation: '',
      }}
    />
  );
}
