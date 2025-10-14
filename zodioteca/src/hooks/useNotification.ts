import { useContext } from 'react';
import type { NotificationContextType } from '../types/notification.types';
import { NotificationContext } from '../context/NotificationContext';

export function useNotification(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}
