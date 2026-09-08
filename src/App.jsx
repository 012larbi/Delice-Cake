import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';

// L'espace admin (et le SDK Firebase) est chargé à la demande :
// le site public reste léger.
const AdminLogin = lazy(() => import('./admin/AdminLogin'));
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const ProtectedRoute = lazy(() => import('./admin/ProtectedRoute'));
const Dashboard = lazy(() => import('./admin/pages/Dashboard'));
const ProductsAdmin = lazy(() => import('./admin/pages/ProductsAdmin'));
const CategoriesAdmin = lazy(() => import('./admin/pages/CategoriesAdmin'));
const NewProductsAdmin = lazy(() => import('./admin/pages/NewProductsAdmin'));
const TestimonialsAdmin = lazy(() => import('./admin/pages/TestimonialsAdmin'));
const ReviewsAdmin = lazy(() => import('./admin/pages/ReviewsAdmin'));
const SiteImagesAdmin = lazy(() => import('./admin/pages/SiteImagesAdmin'));
const SettingsAdmin = lazy(() => import('./admin/pages/SettingsAdmin'));

function AdminFallback() {
  return (
    <div className="grid min-h-screen place-items-center bg-cream">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-burgundy/20 border-t-accent" />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/gateau/:id" element={<ProductPage />} />
      </Route>

      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminLogin />
          </Suspense>
        }
      />
      <Route
        path="/admin"
        element={
          <Suspense fallback={<AdminFallback />}>
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          </Suspense>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="produits" element={<ProductsAdmin />} />
        <Route path="categories" element={<CategoriesAdmin />} />
        <Route path="nouveautes" element={<NewProductsAdmin />} />
        <Route path="temoignages" element={<TestimonialsAdmin />} />
        <Route path="avis" element={<ReviewsAdmin />} />
        <Route path="images" element={<SiteImagesAdmin />} />
        <Route path="parametres" element={<SettingsAdmin />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
