import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { I18nProvider } from './i18n';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import NatalChartPage from './pages/NatalChartPage';
import GlossaryPage from './pages/GlossaryPage';
import FrequenciesPage from './pages/FrequenciesPage';
import SavedChartsPage from './pages/SavedChartsPage';
import SettingsPage from './pages/SettingsPage';
import Layout from './components/Layout';

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
      
      {/* Ruta raíz - redirige según estado de auth */}
      <Route path="/" element={
        <Navigate to="/dashboard" replace />
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
