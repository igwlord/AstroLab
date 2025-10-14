import { createContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type {
  NotificationContextType,
  ToastNotification,
  ConfirmDialogOptions,
  AlertDialogOptions,
  NotificationType,
} from '../types/notification.types';

interface DialogState {
  isOpen: boolean;
  type: 'confirm' | 'alert';
  options: ConfirmDialogOptions | AlertDialogOptions;
  resolve?: (value: boolean | void) => void;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [dialog, setDialog] = useState<DialogState>({
    isOpen: false,
    type: 'alert',
    options: { message: '' },
  });

  // Toast notifications
  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: NotificationType = 'info', duration: number = 5000) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: ToastNotification = {
        id,
        type,
        message,
        duration,
      };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          hideToast(id);
        }, duration);
      }
    },
    [hideToast]
  );

  // Confirm dialog
  const showConfirm = useCallback((options: ConfirmDialogOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        type: 'confirm',
        options,
        resolve: (value: boolean | void) => resolve(value as boolean),
      });
    });
  }, []);

  // Alert dialog
  const showAlert = useCallback((options: AlertDialogOptions): Promise<void> => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        type: 'alert',
        options,
        resolve: () => resolve(),
      });
    });
  }, []);

  const handleDialogClose = useCallback((confirmed: boolean = false) => {
    if (dialog.resolve) {
      dialog.resolve(confirmed);
    }
    setDialog({
      isOpen: false,
      type: 'alert',
      options: { message: '' },
    });
  }, [dialog]);

  const contextValue: NotificationContextType = {
    showToast,
    hideToast,
    showConfirm,
    showAlert,
    toasts,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      {/* Renderizar componentes de notificación aquí */}
      <ToastContainer toasts={toasts} onClose={hideToast} />
      {dialog.isOpen && (
        <DialogContainer
          type={dialog.type}
          options={dialog.options}
          onClose={handleDialogClose}
        />
      )}
    </NotificationContext.Provider>
  );
}

// Contexto exportado
export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Exportar componentes y provider solamente

// Componentes internos
function ToastContainer({
  toasts,
  onClose,
}: {
  toasts: ToastNotification[];
  onClose: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-4 right-4 z-[110000] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}

function Toast({
  toast,
  onClose,
}: {
  toast: ToastNotification;
  onClose: (id: string) => void;
}) {
  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-gradient-to-r from-emerald-600 to-green-600 border-emerald-500/50';
      case 'error':
        return 'bg-gradient-to-r from-red-600 to-rose-600 border-red-500/50';
      case 'warning':
        return 'bg-gradient-to-r from-amber-600 to-yellow-600 border-amber-500/50';
      case 'info':
      default:
        return 'bg-gradient-to-r from-purple-600 to-violet-600 border-purple-500/50';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return (
    <div
      className={`${getToastStyles()} pointer-events-auto backdrop-blur-xl shadow-2xl border-2 rounded-xl px-4 py-3 min-w-[280px] max-w-md animate-slideInRight flex items-start gap-3`}
    >
      <span className="text-2xl flex-shrink-0">{toast.icon || getIcon()}</span>
      <p className="text-white font-medium flex-1 text-sm leading-relaxed">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="text-white/80 hover:text-white transition-colors flex-shrink-0 text-xl leading-none"
        aria-label="Cerrar notificación"
      >
        ×
      </button>
    </div>
  );
}

function DialogContainer({
  type,
  options,
  onClose,
}: {
  type: 'confirm' | 'alert';
  options: ConfirmDialogOptions | AlertDialogOptions;
  onClose: (confirmed: boolean) => void;
}) {
  const getDialogStyles = () => {
    switch (options.type || 'info') {
      case 'success':
        return {
          gradient: 'from-emerald-600 via-green-600 to-emerald-600',
          border: 'border-emerald-500/40',
        };
      case 'error':
        return {
          gradient: 'from-red-600 via-rose-600 to-red-600',
          border: 'border-red-500/40',
        };
      case 'warning':
        return {
          gradient: 'from-amber-600 via-yellow-600 to-amber-600',
          border: 'border-amber-500/40',
        };
      case 'info':
      default:
        return {
          gradient: 'from-purple-600 via-violet-600 to-indigo-600',
          border: 'border-purple-500/40',
        };
    }
  };

  const getIcon = () => {
    if (options.icon) return options.icon;
    switch (options.type || 'info') {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return '💫';
    }
  };

  const styles = getDialogStyles();

  return (
    <div className="fixed inset-0 z-[110000] flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => type === 'alert' && onClose(true)}
      />

      {/* Dialog */}
      <div
        className={`relative bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 rounded-2xl shadow-2xl max-w-md w-full border-2 ${styles.border} animate-scaleIn`}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${styles.gradient} p-6 rounded-t-2xl text-white`}>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{getIcon()}</span>
            <h3 className="text-xl font-bold flex-1">
              {options.title || (type === 'confirm' ? 'Confirmación' : 'Aviso')}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-200 text-base leading-relaxed">{options.message}</p>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 flex gap-3">
          {type === 'confirm' ? (
            <>
              <button
                onClick={() => onClose(false)}
                className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 touch-manipulation"
              >
                {(options as ConfirmDialogOptions).cancelText || 'Cancelar'}
              </button>
              <button
                onClick={() => onClose(true)}
                className={`flex-1 px-4 py-3 bg-gradient-to-r ${styles.gradient} hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 touch-manipulation`}
              >
                {options.confirmText || 'Confirmar'}
              </button>
            </>
          ) : (
            <button
              onClick={() => onClose(true)}
              className={`w-full px-4 py-3 bg-gradient-to-r ${styles.gradient} hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 touch-manipulation`}
            >
              {options.confirmText || 'Entendido'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
