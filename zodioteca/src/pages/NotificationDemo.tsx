/**
 * NotificationDemo - Página de demostración del sistema de notificaciones
 * 
 * Esta página muestra ejemplos de todos los tipos de notificaciones disponibles
 * en el sistema AstroLab. Úsala para probar y entender cómo funcionan.
 */

import { useState } from 'react';
import type { FC } from 'react';
import { useNotification } from '../hooks/useNotification';

const NotificationDemo: FC = () => {
  const { showToast, showConfirm, showAlert } = useNotification();
  const [lastResult, setLastResult] = useState<string>('');

  // ============================================
  // TOAST EXAMPLES
  // ============================================

  const handleSuccessToast = () => {
    showToast('✅ Carta guardada exitosamente', 'success');
    setLastResult('Toast de éxito mostrado (5s)');
  };

  const handleErrorToast = () => {
    showToast('❌ Error al conectar con el servidor', 'error');
    setLastResult('Toast de error mostrado (5s)');
  };

  const handleWarningToast = () => {
    showToast('⚠️ Revisa los datos ingresados', 'warning');
    setLastResult('Toast de advertencia mostrado (5s)');
  };

  const handleInfoToast = () => {
    showToast('ℹ️ Calculando posiciones planetarias...', 'info');
    setLastResult('Toast de info mostrado (5s)');
  };

  const handleCustomDurationToast = () => {
    showToast('⏰ Este toast dura 10 segundos', 'info', 10000);
    setLastResult('Toast con duración personalizada (10s)');
  };

  const handlePermanentToast = () => {
    showToast('📌 Este toast no se cierra automáticamente', 'warning', 0);
    setLastResult('Toast permanente (cierra manualmente)');
  };

  // ============================================
  // CONFIRM EXAMPLES
  // ============================================

  const handleSimpleConfirm = async () => {
    const confirmed = await showConfirm({
      message: '¿Eliminar esta carta natal?'
    });
    setLastResult(`Confirm simple: ${confirmed ? 'Confirmado ✅' : 'Cancelado ❌'}`);
  };

  const handleDeleteConfirm = async () => {
    const confirmed = await showConfirm({
      title: 'Confirmar eliminación',
      message: '¿Eliminar esta carta? Esta acción no se puede deshacer.',
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      type: 'warning',
      icon: '🗑️'
    });
    
    if (confirmed) {
      showToast('✅ Carta eliminada exitosamente', 'success');
      setLastResult('Confirm eliminación: Confirmado');
    } else {
      setLastResult('Confirm eliminación: Cancelado');
    }
  };

  const handleRegenerateConfirm = async () => {
    const confirmed = await showConfirm({
      title: '¿Regenerar plan de ejercicios?',
      message: 'Se perderá el progreso actual y se creará un nuevo plan.',
      confirmText: 'Sí, regenerar',
      cancelText: 'No, conservar',
      type: 'warning',
      icon: '🔄'
    });
    
    if (confirmed) {
      showToast('✅ Plan regenerado', 'success');
      setLastResult('Confirm regenerar: Confirmado');
    } else {
      setLastResult('Confirm regenerar: Cancelado');
    }
  };

  const handleErrorConfirm = async () => {
    const retry = await showConfirm({
      title: 'Error de conexión',
      message: 'No se pudo conectar con el servidor. ¿Deseas reintentar?',
      confirmText: 'Reintentar',
      cancelText: 'Cancelar',
      type: 'error',
      icon: '🔌'
    });
    
    if (retry) {
      showToast('🔄 Reintentando conexión...', 'info');
      setLastResult('Confirm error: Reintentando');
    } else {
      setLastResult('Confirm error: Cancelado');
    }
  };

  // ============================================
  // ALERT EXAMPLES
  // ============================================

  const handleSimpleAlert = async () => {
    await showAlert({
      message: 'Por favor ingresa un nombre para la carta'
    });
    setLastResult('Alert simple mostrado');
  };

  const handleValidationAlert = async () => {
    await showAlert({
      title: 'Validación',
      message: 'La latitud debe estar entre -90 y 90 grados',
      type: 'warning',
      icon: '📍'
    });
    setLastResult('Alert de validación mostrado');
  };

  const handleSuccessAlert = async () => {
    await showAlert({
      title: '¡Éxito!',
      message: 'Tu carta natal ha sido calculada correctamente',
      confirmText: '¡Genial!',
      type: 'success',
      icon: '✨'
    });
    setLastResult('Alert de éxito mostrado');
  };

  const handleErrorAlert = async () => {
    await showAlert({
      title: 'Error',
      message: 'No se pudo calcular la carta natal. Verifica los datos e intenta nuevamente.',
      type: 'error',
      icon: '❌'
    });
    setLastResult('Alert de error mostrado');
  };

  const handleInfoAlert = async () => {
    await showAlert({
      title: 'Información Importante',
      message: 'Las posiciones planetarias se calculan usando efemérides suizas de alta precisión.',
      confirmText: 'Entendido',
      type: 'info',
      icon: '💫'
    });
    setLastResult('Alert de info mostrado');
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 mb-4">
            🔔 Sistema de Notificaciones AstroLab
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Demo interactiva de todos los tipos de notificaciones
          </p>
          
          {/* Last Result */}
          {lastResult && (
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-purple-200 dark:border-purple-800">
              <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                Último resultado: <span className="font-bold">{lastResult}</span>
              </p>
            </div>
          )}
        </div>

        {/* Toast Section */}
        <section className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-2 border-purple-200 dark:border-purple-800">
            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4 flex items-center gap-2">
              🍞 Toast Notifications
              <span className="text-sm font-normal text-gray-500">(Auto-cierre, esquina inferior derecha)</span>
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={handleSuccessToast}
                className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                ✅ Success Toast
              </button>
              
              <button
                onClick={handleErrorToast}
                className="px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                ❌ Error Toast
              </button>
              
              <button
                onClick={handleWarningToast}
                className="px-4 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                ⚠️ Warning Toast
              </button>
              
              <button
                onClick={handleInfoToast}
                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                ℹ️ Info Toast
              </button>
              
              <button
                onClick={handleCustomDurationToast}
                className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                ⏰ Custom Duration (10s)
              </button>
              
              <button
                onClick={handlePermanentToast}
                className="px-4 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                📌 Permanent Toast
              </button>
            </div>
          </div>
        </section>

        {/* Confirm Section */}
        <section className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-2 border-purple-200 dark:border-purple-800">
            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4 flex items-center gap-2">
              ❓ Confirm Dialogs
              <span className="text-sm font-normal text-gray-500">(Requieren respuesta del usuario)</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={handleSimpleConfirm}
                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                💬 Simple Confirm
              </button>
              
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                🗑️ Delete Confirm
              </button>
              
              <button
                onClick={handleRegenerateConfirm}
                className="px-4 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                🔄 Regenerate Confirm
              </button>
              
              <button
                onClick={handleErrorConfirm}
                className="px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                🔌 Error Retry Confirm
              </button>
            </div>
          </div>
        </section>

        {/* Alert Section */}
        <section className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-2 border-purple-200 dark:border-purple-800">
            <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4 flex items-center gap-2">
              📢 Alert Dialogs
              <span className="text-sm font-normal text-gray-500">(Información importante)</span>
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={handleSimpleAlert}
                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                💬 Simple Alert
              </button>
              
              <button
                onClick={handleValidationAlert}
                className="px-4 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                ⚠️ Validation Alert
              </button>
              
              <button
                onClick={handleSuccessAlert}
                className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                ✨ Success Alert
              </button>
              
              <button
                onClick={handleErrorAlert}
                className="px-4 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                ❌ Error Alert
              </button>
              
              <button
                onClick={handleInfoAlert}
                className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                💫 Info Alert
              </button>
            </div>
          </div>
        </section>

        {/* Code Example */}
        <section>
          <div className="bg-gray-900 rounded-2xl shadow-xl p-6 border-2 border-purple-500">
            <h3 className="text-xl font-bold text-purple-400 mb-4">📝 Código de Ejemplo</h3>
            <pre className="text-sm text-gray-300 overflow-x-auto">
{`import { useNotification } from '../hooks/useNotification';

function MiComponente() {
  const { showToast, showConfirm, showAlert } = useNotification();
  
  // Toast
  showToast('✅ Guardado exitosamente', 'success');
  
  // Confirm
  const confirmed = await showConfirm({
    message: '¿Eliminar esta carta?',
    type: 'warning',
    icon: '🗑️'
  });
  
  if (confirmed) {
    // Usuario confirmó
  }
  
  // Alert
  await showAlert({
    message: 'Campo requerido',
    type: 'warning'
  });
}`}
            </pre>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">
            ✨ Sistema de Notificaciones AstroLab v1.0.0
          </p>
          <p className="text-xs mt-2">
            Lee la documentación completa en <code className="bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded">NOTIFICATION-QUICK-START.md</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationDemo;
