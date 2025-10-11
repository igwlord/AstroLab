/**
 * Componente para notificar al usuario cuando hay una actualización disponible
 * Se muestra como un banner en la parte superior
 */

import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function ServiceWorkerUpdatePrompt() {
  const [showReload, setShowReload] = useState(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      console.log('✅ Service Worker registrado');
      // Check for updates every hour
      if (r) {
        setInterval(() => {
          console.log('🔄 Verificando actualizaciones...');
          r.update();
        }, 60 * 60 * 1000); // 1 hora
      }
    },
    onRegisterError(error: Error) {
      console.error('❌ Error al registrar Service Worker:', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      setShowReload(true);
    }
  }, [needRefresh]);

  const handleReload = () => {
    updateServiceWorker(true);
  };

  const handleDismiss = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
    setShowReload(false);
  };

  if (!showReload && !offlineReady) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🚀</div>
          <div className="text-white">
            {offlineReady ? (
              <p className="text-sm font-medium">
                ✅ App lista para funcionar sin conexión
              </p>
            ) : (
              <p className="text-sm font-medium">
                Nueva versión disponible - Click en "Actualizar" para obtener las últimas mejoras
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {needRefresh && (
            <button
              onClick={handleReload}
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-purple-600 transition-all hover:bg-purple-50"
            >
              Actualizar
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="rounded-lg bg-white/20 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-white/30"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
