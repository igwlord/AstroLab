import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GoogleDriveWrapper } from './context/GoogleDriveContext';
import { I18nProvider } from './i18n';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy loading para páginas - reduce bundle inicial ~40-50%
const LoginPage = lazy(() => import('./pages/LoginPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const NatalChartPage = lazy(() => import('./pages/NatalChartPage'));
const GlossaryPage = lazy(() => import('./pages/GlossaryPage'));
const FrequenciesPage = lazy(() => import('./pages/FrequenciesPage'));
const SavedChartsPage = lazy(() => import('./pages/SavedChartsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const TestUserChart = lazy(() => import('./pages/TestUserChart'));

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-purple-900">
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
      

      {/* Glosario */}
      <Route path="/glossary" element={
        <ProtectedRoute>
          <Layout>
            <GlossaryPage />
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
      
      {/* Configuración */}
      <Route path="/settings" element={
        <ProtectedRoute>
          <Layout>
            <SettingsPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Test Chart - Validación */}
      <Route path="/test-chart" element={
        <TestUserChart />
      } />
      
      {/* Ruta raíz - redirige al login */}
      <Route path="/" element={
        <Navigate to="/login" replace />
      } />
      
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
    <I18nProvider>
      <GoogleDriveWrapper>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </GoogleDriveWrapper>
    </I18nProvider>
  );
}

export default App;
