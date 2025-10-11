import type { FC } from 'react';
import { X, Info } from 'lucide-react';

interface PopupBlockedAlertProps {
  onClose: () => void;
  onRetry?: () => void;
}

const PopupBlockedAlert: FC<PopupBlockedAlertProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4 sm:p-6 text-white flex justify-between items-start gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <Info className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Sincronización con Drive</h2>
              <p className="text-purple-100 text-sm sm:text-base mt-1">
                Función en desarrollo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 text-center">
          <div className="mb-6">
            <div className="text-6xl sm:text-7xl mb-4">☁️</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
              Próximamente
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              La sincronización con Google Drive estará disponible en una futura actualización.
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4">
            <p className="text-xs sm:text-sm text-purple-900 dark:text-purple-100">
              <strong>💡 Mientras tanto:</strong> Tus cartas se guardan de forma segura en el almacenamiento local de tu navegador.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 sm:p-5 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors font-medium text-sm sm:text-base"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupBlockedAlert;
