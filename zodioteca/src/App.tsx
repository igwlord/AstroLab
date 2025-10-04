import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { I18nProvider } from './i18n';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import NatalChartPage from './pages/NatalChartPage';
import GlossaryPage from './pages/GlossaryPage';
import FrequenciesPage from './pages/FrequenciesPage';
import SavedChartsPage from './pages/SavedChartsPage';
import SettingsPage from './pages/SettingsPage';
import TestSignsPage from './pages/TestSignsPage';
import TestPlanetsPage from './pages/TestPlanetsPage';
import TestHousesPage from './pages/TestHousesPage';
import TestAspectsPage from './pages/TestAspectsPage';
import TestMoonsPage from './pages/TestMoonsPage';
import TestAscendantsPage from './pages/TestAscendantsPage';
import TestAsteroidsPage from './pages/TestAsteroidsPage';
import TestCelestialPage from './pages/TestCelestialPage';
import TestConfigurationsPage from './pages/TestConfigurationsPage';
import TestRelationalPage from './pages/TestRelationalPage';
import TestDignitiesPage from './pages/TestDignitiesPage';
import TestPolarizationsPage from './pages/TestPolarizationsPage';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

// Componente para rutas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// Componente para rutas públicas (redirige si ya está autenticado)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      
      {/* Rutas protegidas */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/natal-chart" element={
        <ProtectedRoute>
          <NatalChartPage />
        </ProtectedRoute>
      } />
      
      <Route path="/glossary" element={
        <ProtectedRoute>
          <Layout>
            <GlossaryPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/frequencies" element={
        <ProtectedRoute>
          <Layout>
            <FrequenciesPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/saved-charts" element={
        <ProtectedRoute>
          <Layout>
            <SavedChartsPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <Layout>
            <SettingsPage />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Ruta de prueba temporal para signos */}
      <Route path="/test-signs" element={
        <ProtectedRoute>
          <TestSignsPage />
        </ProtectedRoute>
      } />
      
      {/* Ruta de prueba temporal para planetas */}
      <Route path="/test-planets" element={
        <ProtectedRoute>
          <TestPlanetsPage />
        </ProtectedRoute>
      } />
      
      {/* Ruta de prueba temporal para casas */}
      <Route path="/test-houses" element={
        <ProtectedRoute>
          <TestHousesPage />
        </ProtectedRoute>
      } />
      
      {/* Ruta de prueba temporal para aspectos */}
      <Route path="/test-aspects" element={
        <ProtectedRoute>
          <TestAspectsPage />
        </ProtectedRoute>
      } />
      
      {/* Ruta de prueba temporal para lunas */}
      <Route path="/test-moons" element={
        <ProtectedRoute>
          <TestMoonsPage />
        </ProtectedRoute>
      } />
      
      {/* Ruta de prueba temporal para ascendentes */}
      <Route path="/test-ascendants" element={
        <ProtectedRoute>
          <TestAscendantsPage />
        </ProtectedRoute>
      } />
      
      {/* Ruta de prueba temporal para asteroides */}
      <Route path="/test-asteroids" element={
        <ProtectedRoute>
          <TestAsteroidsPage />
        </ProtectedRoute>
      } />
      
      {/* Ruta de prueba temporal para otros cuerpos celestes */}
      <Route path="/test-celestial" element={
        <ProtectedRoute>
          <TestCelestialPage />
        </ProtectedRoute>
      } />
      
      {/* Ruta de prueba temporal para configuraciones */}
      <Route path="/test-configurations" element={
        <ProtectedRoute>
          <TestConfigurationsPage />
        </ProtectedRoute>
      } />
      
      {/* Ruta de prueba temporal para astrología relacional */}
      <Route path="/test-relational" element={
        <ProtectedRoute>
          <TestRelationalPage />
        </ProtectedRoute>
      } />
      
      {/* Ruta de prueba temporal para dignidades */}
      <Route path="/test-dignities" element={
        <ProtectedRoute>
          <TestDignitiesPage />
        </ProtectedRoute>
      } />
      
      {/* Ruta de prueba temporal para polarizaciones */}
      <Route path="/test-polarizations" element={
        <ProtectedRoute>
          <TestPolarizationsPage />
        </ProtectedRoute>
      } />
      
      {/* Ruta por defecto */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Ruta 404 */}
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
  );
}

function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </I18nProvider>
  );
}

export default App;
