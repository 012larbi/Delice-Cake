import { motion } from 'framer-motion';
import WhatsAppIcon from './ui/WhatsAppIcon';
import { InstagramIcon, FacebookIcon } from './ui/SocialIcons';
import { NAV_LINKS } from './Navbar';
import { sectionLinkProps } from '../lib/sectionLink';
import { openWhatsAppContact } from '../config/whatsapp';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7 }}
      className="bg-burgundy-dark text-cream"
    >
      <div className="section-x mx-auto max-w-6xl py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <span className="font-display text-2xl font-bold">
              Délice{' '}
              <span className="font-script font-normal text-blush">Cake</span>
            </span>
            <p className="max-w-xs text-sm text-cream/60">
              Des créations gourmandes imaginées avec passion, à Casablanca.
            </p>
          </div>

          <nav className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blush/70">
              Navigation
            </p>
            {NAV_LINKS.map((link) => (
              <a
                key={link.hash}
                {...sectionLinkProps(link.hash)}
                className="w-fit text-sm text-cream/70 transition-colors hover:text-blush"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blush/70">
              Suivez-nous
            </p>
            <div className="flex gap-3">
              {[
                { Icon: InstagramIcon, label: 'Instagram', href: '#' },
                { Icon: FacebookIcon, label: 'Facebook', href: '#' },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-cream/15 text-cream/70 transition-colors hover:border-blush hover:text-blush"
                >
                  <Icon size={17} />
                </a>
              ))}
              <button
                type="button"
                aria-label="WhatsApp"
                onClick={() => openWhatsAppContact()}
                className="grid h-10 w-10 place-items-center rounded-full border border-cream/15 text-cream/70 transition-colors hover:border-blush hover:text-blush"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-cream/10 pt-6 text-center text-xs text-cream/45">
          © 2026 Délice Cake. Tous droits réservés.
        </div>
      </div>
    </motion.footer>
  );
}
