import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockNotifications, type Notification } from '../mockData/notifications';

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;

    // Actions
    markAsRead: (id: string) => void;
    markAllRead: () => void;
    addNotification: (notif: Notification) => void;
    deleteNotification: (id: string) => void;
    clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
    persist(
        (set) => ({
            notifications: [...mockNotifications],
            unreadCount: mockNotifications.filter(n => !n.read).length,

            markAsRead: (id) => set((state) => {
                const newNotifs = state.notifications.map(n =>
                    n.id === id ? { ...n, read: true } : n
                );
                return {
                    notifications: newNotifs,
                    unreadCount: newNotifs.filter(n => !n.read).length
                };
            }),

            markAllRead: () => set((state) => {
                const newNotifs = state.notifications.map(n => ({ ...n, read: true }));
                return {
                    notifications: newNotifs,
                    unreadCount: 0
                };
            }),

            addNotification: (notif) => set((state) => {
                const newNotifs = [notif, ...state.notifications];
                return {
                    notifications: newNotifs,
                    unreadCount: newNotifs.filter(n => !n.read).length
                };
            }),

            deleteNotification: (id) => set((state) => {
                const newNotifs = state.notifications.filter(n => n.id !== id);
                return {
                    notifications: newNotifs,
                    unreadCount: newNotifs.filter(n => !n.read).length
                };
            }),

            clearAll: () => set({ notifications: [], unreadCount: 0 }),
        }),
        {
            name: 'netlistlab-notifications',
        }
    )
);
