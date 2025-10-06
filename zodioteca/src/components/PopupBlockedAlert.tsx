import type { FC } from 'react';
import { X, AlertCircle, Info } from 'lucide-react';

interface PopupBlockedAlertProps {
  onClose: () => void;
  onRetry?: () => void;
}

const PopupBlockedAlert: FC<PopupBlockedAlertProps> = ({ onClose, onRetry }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slideUp max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 sm:p-5 md:p-6 text-white flex justify-between items-start gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg md:text-xl font-bold">Ventanas emergentes bloqueadas</h2>
              <p className="text-orange-100 text-xs sm:text-sm mt-0.5 sm:mt-1">
                Tu navegador bloqueó la ventana de Google
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
          <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-400 dark:border-orange-500 p-3 sm:p-4 rounded">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs sm:text-sm text-orange-900 dark:text-orange-100">
                <p className="font-semibold mb-1.5 sm:mb-2">Tu navegador bloqueó la ventana de Google</p>
                <p className="text-orange-800 dark:text-orange-200">
                  Esto es normal por seguridad, pero necesitas permitirlo una sola vez para conectar tu Drive.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-500 p-3 sm:p-4 rounded">
            <div className="flex items-start gap-2 sm:gap-3">
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs sm:text-sm text-blue-900 dark:text-blue-100">
                <p className="font-semibold mb-1.5 sm:mb-2">Pasos para conectar:</p>
                <ol className="list-decimal list-inside space-y-1 sm:space-y-2 text-blue-800 dark:text-blue-200">
                  <li>Busca el ícono 🚫 o 🔒 en la barra de direcciones (arriba a la derecha)</li>
                  <li>Haz clic y selecciona <strong>"Permitir siempre ventanas emergentes"</strong></li>
                  <li>Haz clic en "Reintentar" abajo</li>
                  <li>Completa el inicio de sesión en la ventana de Google</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500 p-3 sm:p-4 rounded">
            <div className="text-xs sm:text-sm text-yellow-900 dark:text-yellow-100">
              <p className="font-semibold mb-1.5 sm:mb-2">⚠️ ¿El popup se cierra solo inmediatamente?</p>
              <p className="text-[10px] sm:text-xs text-yellow-800 dark:text-yellow-200 mb-1.5 sm:mb-2">
                Esto puede ser causado por:
              </p>
              <ul className="text-[10px] sm:text-xs text-yellow-800 dark:text-yellow-200 list-disc list-inside space-y-0.5 sm:space-y-1">
                <li>Extensiones del navegador (bloqueadores de anuncios, etc.)</li>
                <li>Configuración estricta de privacidad</li>
                <li>Antivirus o firewall</li>
              </ul>
              <p className="text-[10px] sm:text-xs text-yellow-700 dark:text-yellow-300 mt-1.5 sm:mt-2 font-semibold">
                💡 Prueba en modo incógnito: Ctrl + Shift + N (Chrome) o Ctrl + Shift + P (Firefox)
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">
              <strong>💡 Nota:</strong>
            </p>
            <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-300 mt-1.5 sm:mt-2">
              Solo necesitas hacer esto una vez. Tu navegador recordará tu preferencia 
              y las próximas conexiones serán automáticas.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-2 sm:mb-3">
            <button
              onClick={onClose}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium text-xs sm:text-sm"
            >
              Cerrar
            </button>
            {onRetry && (
              <button
                onClick={() => {
                  onClose();
                  onRetry();
                }}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors font-medium text-xs sm:text-sm"
              >
                Reintentar Popup
              </button>
            )}
          </div>
          
          <div className="text-center">
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
              ¿Sigues teniendo problemas? Intenta en modo incógnito o prueba otro navegador
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupBlockedAlert;
