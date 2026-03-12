"use client"

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/lib/supabase'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const checkAuth = useAuthStore(state => state.checkAuth)

    useEffect(() => {
        // Run once on mount
        checkAuth()

        // Subscribe to ALL auth state changes from Supabase
        // This fires on: login, logout, token refresh, tab focus
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_IN' && session) {
                    // Re-run checkAuth to sync Zustand with new session
                    await checkAuth()
                } else if (event === 'SIGNED_OUT') {
                    useAuthStore.getState().logout()
                } else if (event === 'TOKEN_REFRESHED' && session) {
                    // Token silently refreshed — make sure we stay authenticated
                    useAuthStore.setState({ isAuthenticated: true })
                } else if (event === 'USER_UPDATED' && session) {
                    await checkAuth()
                }
            }
        )

        // Cleanup subscription on unmount
        return () => {
            subscription.unsubscribe()
        }
    }, [checkAuth])

    return <>{children}</>
}
