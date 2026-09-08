/**
 * Props pour un lien vers une section de la page d'accueil, utilisable
 * depuis n'importe quelle page (accueil ou fiche produit).
 * - sur "/"        : défilement doux (SPA)
 * - ailleurs       : navigation vers "/#section" (le navigateur scrolle)
 */
export function sectionLinkProps(hash) {
  const id = String(hash).replace(/^#/, '');
  return {
    href: `/#${id}`,
    onClick: (e) => {
      if (window.location.pathname === '/') {
        const el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth' });
          window.history.replaceState(null, '', `/#${id}`);
        }
      }
    },
  };
}
