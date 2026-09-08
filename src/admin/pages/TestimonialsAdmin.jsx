import { MessageSquareQuote, Star } from 'lucide-react';
import CrudManager from '../ui/CrudManager';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  ensureTestimonialsSeeded,
} from '../../services/content';

export default function TestimonialsAdmin() {
  return (
    <CrudManager
      title="Témoignages"
      subtitle="Les avis clients affichés dans « Ils ont adoré »."
      singular="témoignage"
      icon={MessageSquareQuote}
      service={{
        list: getTestimonials,
        seedIfEmpty: ensureTestimonialsSeeded,
        create: createTestimonial,
        update: updateTestimonial,
        remove: deleteTestimonial,
      }}
      columns={[
        {
          key: 'name',
          label: 'Client',
          render: (v, item) => (
            <div>
              <p className="font-medium text-burgundy">{v}</p>
              <p className="text-xs text-burgundy/45">{item.city}</p>
            </div>
          ),
        },
        {
          key: 'text',
          label: 'Avis',
          render: (v) => (
            <span className="line-clamp-2 block max-w-md text-burgundy/60">
              {v}
            </span>
          ),
        },
        {
          key: 'rating',
          label: 'Note',
          render: (v) => (
            <span className="inline-flex items-center gap-1 text-accent">
              <Star size={13} className="fill-accent" />
              {v || 5}
            </span>
          ),
        },
      ]}
      fields={[
        { name: 'name', label: 'Prénom', type: 'text', required: true },
        { name: 'city', label: 'Ville', type: 'text' },
        { name: 'text', label: 'Témoignage', type: 'textarea', required: true },
        {
          name: 'rating',
          label: 'Note (1 à 5)',
          type: 'number',
          hint: 'Par défaut : 5',
        },
      ]}
      emptyValue={{ name: '', city: 'Casablanca', text: '', rating: 5 }}
    />
  );
}
