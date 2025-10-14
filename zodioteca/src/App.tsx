import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SupabaseProvider } from './context/SupabaseContext';
import { AudioPlayerProvider } from './context/AudioPlayerContext';
import { NotificationProvider } from './context/NotificationContext';
import { I18nProvider } from './i18n';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import { ServiceWorkerUpdatePrompt } from './utils/sw-update-prompt';
import { ToastProvider } from './components/ToastProvider';

// ⚡ FASE 3: Lazy load componentes pesados adicionales
const FloatingMiniPlayer = lazy(() => import('./components/FloatingMiniPlayer'));

// Lazy loading para páginas - reduce bundle inicial ~40-50%
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const WelcomePage = lazy(() => import('./pages/WelcomePage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const NatalChartPage = lazy(() => import('./pages/NatalChartPage'));
const ExercisePlanPage = lazy(() => import('./pages/ExercisePlanPage'));
const SavedPlansPage = lazy(() => import('./pages/SavedPlansPage'));
const GlossaryPage = lazy(() => import('./pages/GlossaryPage'));
const FrequenciesPage = lazy(() => import('./pages/FrequenciesPage'));
const SavedChartsPage = lazy(() => import('./pages/SavedChartsPage'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ReflexPage = lazy(() => import('./pages/ReflexPage'));
const NotificationDemo = lazy(() => import('./pages/NotificationDemo'));

// ============================================
// RUTAS PROTEGIDAS
// ============================================

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Autorización deshabilitada: todas las rutas son accesibles.
  return <>{children}</>;
};

// ============================================
// RUTAS PÚBLICAS
// ============================================

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

// ============================================
// APP
// ============================================

function AppRoutes() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFE5D9] to-[#F8E6F1] dark:from-gray-900 dark:to-purple-900">
        <LoadingSpinner />
      </div>
    }>
      <Routes>
        {/* Login */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />

        {/* Reset Password */}
        <Route path="/reset-password" element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        } />

        {/* Welcome (después del registro) */}
        <Route path="/welcome" element={
          <PublicRoute>
            <WelcomePage />
          </PublicRoute>
        } />
      
      {/* Dashboard */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Carta Natal */}
      <Route path="/natal-chart" element={
        <ProtectedRoute>
          <Layout>
            <NatalChartPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Ejercicios Holísticos */}
      <Route path="/ejercicios/:chartId?" element={
        <ProtectedRoute>
          <Layout>
            <ExercisePlanPage />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Planes Guardados */}
      <Route path="/saved-plans" element={
        <ProtectedRoute>
          <Layout>
            <SavedPlansPage />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Glosario */}
      <Route path="/glossary" element={
        <ProtectedRoute>
          <Layout>
            <GlossaryPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Reflexiones */}
      <Route path="/reflexiones" element={
        <ProtectedRoute>
          <Layout>
            <ReflexPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Frecuencias */}
      <Route path="/frequencies" element={
        <ProtectedRoute>
          <Layout>
            <FrequenciesPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Cartas Guardadas */}
      <Route path="/saved-charts" element={
        <ProtectedRoute>
          <Layout>
            <SavedChartsPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Favoritos */}
      <Route path="/favorites" element={
        <ProtectedRoute>
          <Layout>
            <FavoritesPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Configuración */}
      <Route path="/settings" element={
        <ProtectedRoute>
          <Layout>
            <SettingsPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Demo de Notificaciones (solo desarrollo) */}
      <Route path="/notifications-demo" element={
        <PublicRoute>
          <NotificationDemo />
        </PublicRoute>
      } />
      
      {/* Ruta raíz - redirige a login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* 404 */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-purple-900 mb-4">404</h1>
            <p className="text-purple-700 mb-6">Página no encontrada</p>
            <a href="/" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
              Volver al inicio
            </a>
          </div>
        </div>
      } />
    </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <SupabaseProvider>
          <AuthProvider>
            <AudioPlayerProvider>
              <NotificationProvider>
                <ToastProvider>
                  <Router>
                    <ErrorBoundary>
                      {/* Notificación de actualización de Service Worker */}
                      <ServiceWorkerUpdatePrompt />
                      <AppRoutes />
                      {/* FloatingMiniPlayer solo en desktop - en mobile está integrado en Navbar */}
                      <Suspense fallback={null}>
                        <FloatingMiniPlayer isMobile={false} />
                      </Suspense>
                    </ErrorBoundary>
                  </Router>
                </ToastProvider>
              </NotificationProvider>
            </AudioPlayerProvider>
          </AuthProvider>
        </SupabaseProvider>
      </I18nProvider>
    </ErrorBoundary>
  );
}

export default App;
