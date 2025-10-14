/**
 * Tipos para el sistema de notificaciones personalizado de AstroLab
 */

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface ToastNotification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number; // milisegundos, 0 = infinito
  icon?: string;
}

export interface ConfirmDialogOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: NotificationType;
  icon?: string;
}

export interface AlertDialogOptions {
  title?: string;
  message: string;
  confirmText?: string;
  type?: NotificationType;
  icon?: string;
}

export interface NotificationContextType {
  // Toast notifications
  showToast: (message: string, type?: NotificationType, duration?: number) => void;
  hideToast: (id: string) => void;
  
  // Dialogs
  showConfirm: (options: ConfirmDialogOptions) => Promise<boolean>;
  showAlert: (options: AlertDialogOptions) => Promise<void>;
  
  // Estado
  toasts: ToastNotification[];
}
