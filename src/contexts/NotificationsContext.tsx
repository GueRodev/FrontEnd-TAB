/**
 * Notifications Context
 * Manages admin notifications using localStorage
 * 
 * @next-migration: Will use real-time subscriptions in Next.js
 * - Replace localStorage with Supabase Realtime
 * - Subscribe to database changes (new orders, low stock, etc.)
 * - Add push notifications support
 * - Store notifications in database for persistence
 * 
 * Migration path:
 * 1. Create notifications table in Supabase
 * 2. Use Supabase Realtime for live updates
 * 3. Add notification preferences per user
 * 4. Implement push notifications via Edge Functions
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Notification } from '@/types/notification.types';
import { localStorageAdapter } from '@/lib/storage';
import { STORAGE_KEYS } from '@/data/constants';

// Re-export types for backward compatibility
export type { Notification, NotificationType } from '@/types/notification.types';

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// Mock notifications - replace with real data
const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Nuevo pedido',
    message: 'Pedido #1234 recibido de Juan Pérez',
    time: '5 min',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: '2',
    type: 'user',
    title: 'Nuevo usuario registrado',
    message: 'María García se ha registrado',
    time: '1 h',
    read: false,
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: '3',
    type: 'order',
    title: 'Pedido completado',
    message: 'Pedido #1230 ha sido completado',
    time: '2 h',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '4',
    type: 'product',
    title: 'Stock bajo',
    message: 'Funko Pop Naruto tiene stock bajo',
    time: '3 h',
    read: true,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
];

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorageAdapter.getItem<Notification[]>(STORAGE_KEYS.notifications);
    return saved || initialNotifications;
  });

  useEffect(() => {
    localStorageAdapter.setItem(STORAGE_KEYS.notifications, notifications);
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationsProvider');
  }
  return context;
};
