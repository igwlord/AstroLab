import type { FC } from 'react';
import { ExternalLink, X } from 'lucide-react';

interface PopupWaitingIndicatorProps {
  onCancel: () => void;
}

const PopupWaitingIndicator: FC<PopupWaitingIndicatorProps> = ({ onCancel }) => {
  return (
    <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 z-50 animate-slideUp max-w-[calc(100vw-24px)] sm:max-w-sm">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-2xl p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-xs sm:text-sm">Ventana de Google abierta</h3>
              <p className="text-[10px] sm:text-xs text-purple-100 mt-1">
                Completa el inicio de sesión en la ventana emergente
              </p>
              <p className="text-[10px] sm:text-xs text-purple-200 mt-1.5 sm:mt-2 italic">
                💡 Si no ves la ventana, revisa si tu navegador la bloqueó
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-white/20 rounded transition-colors flex-shrink-0"
            title="Cancelar"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupWaitingIndicator;
