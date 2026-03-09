import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';
import type { ApiNotification } from '@/lib/api-types';
import type { Notification, NotificationType } from '../mockData/notifications';

function getMessageForType(type: string): string {
    switch (type) {
        case 'STAR': return 'starred your project';
        case 'FORK': return 'forked your lab';
        case 'COMMENT': return 'commented on your project';
        case 'FOLLOW': return 'followed you';
        case 'REPLY': return 'replied to your comment';
        default: return 'interacted with your profile';
    }
}

export function mapApiNotification(n: ApiNotification): Notification {
    return {
        id: n.id,
        type: n.type.toLowerCase() as NotificationType,
        actorId: n.actor_id ?? 'unknown',
        actor: n.actor?.username ?? 'someone',
        actorAvatar: n.actor?.avatar_url ?? `https://api.dicebear.com/9.x/avataaars/svg?seed=${n.actor_id}`,
        message: getMessageForType(n.type),
        projectId: n.project_id ? Number(n.project_id) : undefined,
        projectTitle: n.project?.title,
        read: n.is_read,
        createdAt: n.created_at
    };
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    hasFetched: boolean;

    // Actions
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllRead: () => Promise<void>;
    addNotification: (notif: Notification) => void;
    deleteNotification: (id: string) => void;
    clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
    persist(
        (set, get) => ({
            notifications: [],
            unreadCount: 0,
            hasFetched: false,

            fetchNotifications: async () => {
                try {
                    const data = await api.getNotifications();
                    const notifs = data.map(mapApiNotification).sort((a, b) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                    set({
                        notifications: notifs,
                        unreadCount: notifs.filter(n => !n.read).length,
                        hasFetched: true
                    });
                } catch (err) {
                    console.error("Failed to fetch notifications:", err);
                }
            },

            markAsRead: async (id) => {
                const prev = get().notifications;
                // Optimistic
                set(state => ({
                    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
                    unreadCount: Math.max(0, state.unreadCount - 1)
                }));
                try {
                    await api.markOneRead(id);
                } catch {
                    // Revert on fail
                    set({ notifications: prev, unreadCount: prev.filter(n => !n.read).length });
                }
            },

            markAllRead: async () => {
                const prev = get().notifications;
                // Optimistic
                set(state => ({
                    notifications: state.notifications.map(n => ({ ...n, read: true })),
                    unreadCount: 0
                }));
                try {
                    await api.markAllRead();
                } catch {
                    set({ notifications: prev, unreadCount: prev.filter(n => !n.read).length });
                }
            },

            addNotification: (notif) => set((state) => {
                if (state.notifications.some(n => n.id === notif.id)) return state; // Duplicate check
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
            name: 'netlistlab-notifications-v2',
        }
    )
);
