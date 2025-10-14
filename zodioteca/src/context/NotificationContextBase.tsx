import { createContext } from 'react';
import type { NotificationContextType } from '../types/notification.types';

// Contexto de notificaciones - separado para Fast Refresh
export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
