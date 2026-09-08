import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, ShoppingBag } from 'lucide-react';
import { useScroll } from '../hooks/useScroll';
import { openWhatsAppContact } from '../config/whatsapp';
import { sectionLinkProps } from '../lib/sectionLink';
import MobileMenu from './MobileMenu';

export const NAV_LINKS = [
  { label: 'Accueil', hash: 'accueil' },
  { label: 'À propos', hash: 'a-propos' },
  { label: 'Nos créations', hash: 'nos-creations' },
  { label: 'Nouveautés', hash: 'nouveautes' },
  { label: 'Contact', hash: 'contact' },
];

function Logo({ className = '' }) {
  return (
    <a
      {...sectionLinkProps('accueil')}
      className={`flex items-center gap-2.5 ${className}`}
      aria-label="Délice Cake — accueil"
    >
      <span className="grid h-9 w-9 place-items-center rounded-full bg-burgundy text-cream">
        <span className="font-script text-xl leading-none">D</span>
      </span>
      <span className="font-display text-lg font-bold tracking-tight text-burgundy">
        Délice <span className="font-script font-normal text-accent">Cake</span>
      </span>
    </a>
  );
}

export default function Navbar() {
  const scrolled = useScroll(20);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-5"
      >
        <motion.nav
          animate={{
            paddingTop: scrolled ? 8 : 12,
            paddingBottom: scrolled ? 8 : 12,
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          className={`flex w-full max-w-6xl items-center justify-between gap-4 rounded-full border border-white/60 px-4 pl-5 transition-shadow duration-300 sm:px-6 ${
            scrolled
              ? 'glass-nav-scrolled shadow-[0_20px_45px_-20px_rgba(82,21,34,0.4)]'
              : 'glass-nav shadow-[0_14px_35px_-22px_rgba(82,21,34,0.3)]'
          }`}
        >
          <Logo />

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.hash}>
                <a
                  {...sectionLinkProps(link.hash)}
                  className="rounded-full px-4 py-2 text-sm font-medium text-burgundy/80 transition-colors hover:bg-white/70 hover:text-burgundy"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              onClick={() => openWhatsAppContact()}
              whileHover={{ y: -2, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="hidden items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_30px_-14px_rgba(240,90,120,0.75)] hover:bg-accent-dark sm:inline-flex"
            >
              <ShoppingBag size={16} strokeWidth={2.2} />
              Commander
            </motion.button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/70 text-burgundy transition-colors hover:bg-white lg:hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </motion.nav>
      </motion.header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={NAV_LINKS}
      />
    </>
  );
}
