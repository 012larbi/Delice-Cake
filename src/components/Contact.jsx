import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import SectionHeading from './ui/SectionHeading';
import Reveal from './ui/Reveal';
import WhatsAppIcon from './ui/WhatsAppIcon';
import { InstagramIcon } from './ui/SocialIcons';
import { openWhatsAppContact } from '../config/whatsapp';
import { isAllowedMapUrl } from '../config/map';
import { useSiteSettings } from '../context/SiteSettingsContext';

/** Carte Google Maps intégrée si configurée, sinon plan illustré (SVG). */
function MapCard({ embedUrl, link }) {
  if (embedUrl && isAllowedMapUrl(embedUrl)) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] border border-burgundy/10 shadow-[0_25px_55px_-35px_rgba(82,21,34,0.45)]">
        <iframe
          src={embedUrl}
          title="Localisation Délice Cake"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0"
        />
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-burgundy px-3.5 py-2 text-xs font-semibold text-cream shadow-lg hover:bg-burgundy-dark"
          >
            <Navigation size={13} />
            Itinéraire
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] border border-burgundy/10 bg-lightpink shadow-[0_25px_55px_-35px_rgba(82,21,34,0.45)]">
      <svg
        viewBox="0 0 400 300"
        className="h-full w-full"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="400" height="300" fill="#FCE3E8" />
        <g stroke="#F8C8D2" strokeWidth="14" fill="none" opacity="0.9">
          <path d="M-20 90 L420 60" />
          <path d="M-20 200 L420 230" />
          <path d="M80 -20 L110 320" />
          <path d="M260 -20 L300 320" />
        </g>
        <g fill="#fff8f5" opacity="0.7">
          <rect x="20" y="100" width="45" height="80" rx="6" />
          <rect x="125" y="75" width="110" height="50" rx="6" />
          <rect x="125" y="235" width="110" height="45" rx="6" />
          <rect x="315" y="90" width="70" height="120" rx="6" />
          <rect x="315" y="235" width="70" height="55" rx="6" />
        </g>
        <circle cx="200" cy="150" r="46" fill="#F05A78" opacity="0.14" />
      </svg>

      <motion.div
        initial={{ y: -6 }}
        animate={{ y: 6 }}
        transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.8 }}
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center"
      >
        <span className="rounded-full bg-burgundy px-3 py-1 text-xs font-semibold text-cream shadow-lg">
          Délice Cake
        </span>
        <MapPin size={30} className="fill-accent text-burgundy drop-shadow" />
      </motion.div>
    </div>
  );
}

export default function Contact() {
  const settings = useSiteSettings();

  const INFOS = [
    { icon: MapPin, label: 'Adresse', value: settings.city },
    { icon: Phone, label: 'Téléphone', value: settings.phone },
    { icon: InstagramIcon, label: 'Instagram', value: settings.instagram },
  ];

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 bg-lightpink py-24 sm:py-28"
    >
      <div className="section-x mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="flex flex-col gap-7">
          <SectionHeading
            align="left"
            label="Contact"
            title="Parlons de votre"
            script="prochain gâteau"
          />

          <Reveal delay={0.1} className="flex flex-col gap-4">
            {INFOS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-accent shadow-sm">
                  <Icon size={19} />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-burgundy/45">
                    {label}
                  </p>
                  <p className="font-medium text-burgundy">{value}</p>
                </div>
              </div>
            ))}

            <div className="flex items-center gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-accent shadow-sm">
                <Clock size={19} />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-burgundy/45">
                  Horaires
                </p>
                <p className="font-medium text-burgundy">{settings.hours}</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <motion.button
              type="button"
              onClick={() => openWhatsAppContact()}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_35px_-15px_rgba(37,211,102,0.7)] hover:bg-[#1ebe5b]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Écrire sur WhatsApp
            </motion.button>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <MapCard embedUrl={settings.mapEmbedUrl} link={settings.mapLink} />
        </Reveal>
      </div>
    </section>
  );
}
