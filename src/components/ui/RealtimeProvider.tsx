"use client"

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore, mapApiNotification } from '@/stores/notificationStore'
import { toast } from 'sonner'
import type { ApiNotification } from '@/lib/api-types'

export default function RealtimeProvider({ children }: { children: React.ReactNode }) {
    const user = useAuthStore(state => state.user)
    const { fetchNotifications, addNotification, hasFetched } = useNotificationStore()

    useEffect(() => {
        if (!user) return

        if (!hasFetched) {
            fetchNotifications()
        }

        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
            setTimeout(() => {
                Notification.requestPermission().catch(() => { });
            }, 5000);
        }

        const channelName = `public:notifications:recipient_id=eq.${user.id}`
        let channel = supabase.channel(channelName)
        let retryCount = 0;
        let reconnectTimer: NodeJS.Timeout;

        const setupSubscription = () => {
            channel = supabase
                .channel(channelName)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `recipient_id=eq.${user.id}`
                },
                async (payload) => {
                    const record = payload.new as ApiNotification;

                    // Attempt to fetch missing relations since realtime payloads don't include joins
                    try {
                        if (record.actor_id) {
                            const { data: actor } = await supabase.from('users').select('username, avatar_url').eq('id', record.actor_id).single();
                            if (actor) {
                                record.actor = actor as any;
                            }
                        }
                        if (record.project_id) {
                            const { data: project } = await supabase.from('projects').select('title').eq('id', record.project_id).single();
                            if (project) {
                                record.project = project as any;
                            }
                        }
                    } catch (e) {
                        // ignore join parsing errors
                    }

                    const notif = mapApiNotification(record);
                    addNotification(notif);

                    toast.info("Incoming Transmission", {
                        description: `[${notif.type.toUpperCase()}] @${notif.actor} ${notif.message}`,
                    });

                    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                        if (document.hidden) {
                            new Notification(`NetListLab: New ${notif.type}`, {
                                body: `@${notif.actor} ${notif.message}`,
                                icon: '/favicon.ico'
                            });
                        }
                    }
                }
            )

            channel.subscribe((status, err) => {
                if (status === 'SUBSCRIBED') {
                    retryCount = 0; // Reset backoff on success
                } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                    // Stop current channel to prevent duplicate listeners
                    supabase.removeChannel(channel);
                    
                    // Exponential backoff (1s, 2s, 4s, 8s -> max 30s)
                    const timeout = Math.min(1000 * Math.pow(2, retryCount), 30000);
                    retryCount++;
                    
                    reconnectTimer = setTimeout(() => {
                        setupSubscription();
                    }, timeout);
                }
            });
        }

        setupSubscription();

        return () => {
            clearTimeout(reconnectTimer);
            supabase.removeChannel(channel)
        }
    }, [user, fetchNotifications, addNotification, hasFetched])

    return <>{children}</>
}
