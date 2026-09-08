import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingWhatsApp from './FloatingWhatsApp';
import { SiteSettingsProvider } from '../context/SiteSettingsContext';

/** Coque du site public : contenu chargé une fois, navbar + footer partagés. */
export default function PublicLayout() {
  return (
    <SiteSettingsProvider>
      <Navbar />
      <Outlet />
      <Footer />
      <FloatingWhatsApp />
    </SiteSettingsProvider>
  );
}
