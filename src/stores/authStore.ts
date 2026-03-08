import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'
import { api } from '@/lib/api'
import type { ApiUser } from '@/lib/api-types'
import { toast } from 'sonner'

interface AuthState {
    user: ApiUser | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null

    // Actions
    login: (credentials: { email: string; password: string }) => Promise<boolean>
    register: (data: { email: string; password: string; username: string; fullName: string }) => Promise<boolean>
    logout: () => Promise<void>
    checkAuth: () => Promise<void>
    updateProfile: (updates: Partial<ApiUser>) => void
    clearError: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // ── Login ─────────────────────────────────────────────────────────────
            login: async ({ email, password }) => {
                set({ isLoading: true, error: null })
                try {
                    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
                    if (error) throw new Error(error.message)
                    if (!data.session) throw new Error('No session returned')

                    const profile = await api.getMe()
                    set({ user: profile, isAuthenticated: true, isLoading: false, error: null })
                    return true
                } catch (err) {
                    const message = err instanceof Error ? err.message : 'Login failed'
                    set({ error: message, isLoading: false })
                    return false
                }
            },

            // ── Register ──────────────────────────────────────────────────────────
            register: async ({ email, password, username, fullName }) => {
                set({ isLoading: true, error: null })
                try {
                    // 1. Create Supabase auth user
                    const { data, error } = await supabase.auth.signUp({ email, password })
                    if (error) throw new Error(error.message)
                    const supabaseUser = data.user
                    if (!supabaseUser) throw new Error('Registration failed — no user returned')

                    // 2. Create user record in our DB
                    await api.registerUser({
                        id: supabaseUser.id,
                        email,
                        username,
                        full_name: fullName,
                    })

                    // 3. Fetch full profile
                    const profile = await api.getMe()
                    set({ user: profile, isAuthenticated: true, isLoading: false, error: null })
                    return true
                } catch (err) {
                    const message = err instanceof Error ? err.message : 'Registration failed'
                    set({ error: message, isLoading: false })
                    return false
                }
            },

            // ── Logout ────────────────────────────────────────────────────────────
            logout: async () => {
                await supabase.auth.signOut()
                set({ user: null, isAuthenticated: false, error: null })
                toast.success('Logged out', { description: 'See you next time.' })
            },

            // ── Check / restore auth on app mount ────────────────────────────────
            checkAuth: async () => {
                try {
                    const { data: { session } } = await supabase.auth.getSession()
                    if (!session) {
                        set({ user: null, isAuthenticated: false })
                        return
                    }
                    // Only fetch if we don't already have the profile
                    if (!get().user) {
                        const profile = await api.getMe()
                        set({ user: profile, isAuthenticated: true })
                    } else {
                        set({ isAuthenticated: true })
                    }
                } catch {
                    // Session exists but profile fetch failed — clear state silently
                    set({ user: null, isAuthenticated: false })
                }
            },

            // ── Helpers ───────────────────────────────────────────────────────────
            updateProfile: (updates) => {
                const { user } = get()
                if (user) set({ user: { ...user, ...updates } })
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: 'netlistlab-auth',
            // Only persist the user profile + auth state, not loading/error
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)
