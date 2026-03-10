import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'
import { api } from '@/lib/api'
import type { ApiUser } from '@/lib/api-types'
import { toast } from 'sonner'

export type AuthStatus =
    | 'idle'
    | 'loading'
    | 'authenticated'
    | 'unauthenticated'
    | 'email_not_confirmed'
    | 'session_expired'
    | 'profile_incomplete'

interface AuthState {
    // The raw Supabase-synced user profile
    user: ApiUser | null
    // Alias kept for components that access `profile` separately
    profile: ApiUser | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
    authStatus: AuthStatus

    // Actions
    login: (credentials: { email: string; password: string }) => Promise<true | false | 'email_not_confirmed'>
    register: (data: { email: string; password: string; username: string; fullName: string }) => Promise<true | false | 'confirm_email'>
    registerWithOtp: (data: { email: string; password: string; username: string; fullName: string }) => Promise<boolean>
    logout: () => Promise<void>
    checkAuth: () => Promise<void>
    sendOtp: (email: string) => Promise<boolean>
    verifyOtp: (email: string, token: string) => Promise<'authenticated' | 'new_user' | false>
    loginWithGoogle: () => Promise<void>
    updateProfile: (updates: Partial<ApiUser>) => void
    clearError: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            authStatus: 'idle',

            // ── OTP ─────────────────────────────────────────────────────────────
            sendOtp: async (email) => {
                set({ isLoading: true, error: null })
                try {
                    const { error } = await supabase.auth.signInWithOtp({
                        email,
                        options: {
                            shouldCreateUser: true,
                        }
                    })
                    if (error) throw new Error(error.message)
                    set({ isLoading: false })
                    return true
                } catch (err) {
                    const message = err instanceof Error ? err.message : 'OTP request failed'
                    set({ error: message, isLoading: false })
                    return false
                }
            },

            verifyOtp: async (email, token) => {
                set({ isLoading: true, error: null })
                try {
                    const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' })
                    if (error) throw new Error(error.message)
                    
                    const supabaseUser = data.user
                    if (!supabaseUser) throw new Error('Verification failed — no user returned')

                    let profile: ApiUser | null = null
                    let isNewUser = false

                    try {
                        profile = await api.getMe()
                    } catch {
                        // Backend has no profile yet — try to sync the user record
                        try {
                            const username = email.split('@')[0]
                            const fullName = supabaseUser.user_metadata?.full_name ?? ''
                            profile = await api.syncUser({ id: supabaseUser.id, email, username, full_name: fullName })
                            isNewUser = true
                        } catch {
                            // Sync failed
                        }
                    }

                    set({
                        user: profile,
                        profile,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                        authStatus: profile ? 'authenticated' : 'profile_incomplete'
                    })
                    
                    return isNewUser ? 'new_user' : 'authenticated'
                } catch (err) {
                    const message = err instanceof Error ? err.message : 'OTP verification failed'
                    set({ error: message, isLoading: false })
                    return false
                }
            },

            loginWithGoogle: async () => {
                set({ isLoading: true, error: null })
                try {
                    const { error } = await supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: {
                            redirectTo: `${window.location.origin}/auth/callback`,
                            queryParams: {
                                access_type: 'offline',
                                prompt: 'consent',
                            }
                        }
                    })
                    if (error) throw new Error(error.message)
                    // Don't set isLoading: false here — page will redirect
                } catch (err) {
                    const message = err instanceof Error ? err.message : 'Google login failed'
                    set({ error: message, isLoading: false })
                    toast.error('Google login failed', { description: message })
                }
            },

            // ── Login ─────────────────────────────────────────────────────────────
            login: async ({ email, password }) => {
                set({ isLoading: true, error: null })
                try {
                    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

                    // Detect "Email not confirmed" BEFORE treating as a general error
                    if (error) {
                        if (error.message.toLowerCase().includes('email not confirmed')) {
                            set({ isLoading: false, authStatus: 'email_not_confirmed' })
                            return 'email_not_confirmed'
                        }
                        throw new Error(error.message)
                    }
                    if (!data.session) throw new Error('No session returned')

                    // Try to get backend profile — never fail the whole login because of this
                    let profile: ApiUser | null = null
                    try {
                        profile = await api.getMe()
                    } catch {
                        // Backend has no profile yet — try to sync the user record
                        try {
                            const sbUser = data.user
                            await api.syncUser({
                                id: sbUser.id,
                                email: sbUser.email ?? email,
                                username: (sbUser.email ?? email).split('@')[0],
                                full_name: sbUser.user_metadata?.full_name ?? '',
                            })
                            // Retry getMe after sync
                            profile = await api.getMe().catch(() => null)
                        } catch {
                            // Sync also failed — fine, continue with null profile
                        }
                    }

                    set({
                        user: profile,
                        profile,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                        authStatus: profile ? 'authenticated' : 'profile_incomplete',
                    })
                    return true
                } catch (err) {
                    const message = err instanceof Error ? err.message : 'Login failed'
                    set({ error: message, isLoading: false, authStatus: 'unauthenticated' })
                    return false
                }
            },

            // ── Register ──────────────────────────────────────────────────────────
            registerWithOtp: async ({ email, password, username, fullName }) => {
                set({ isLoading: true, error: null })
                try {
                    // Step 1: Create the Supabase account
                    const { data, error } = await supabase.auth.signUp({ email, password })
                    
                    if (error) {
                        if (
                            error.message.toLowerCase().includes('already registered') ||
                            error.message.toLowerCase().includes('already exists') ||
                            error.message.toLowerCase().includes('user already')
                        ) {
                            throw new Error('An account with this email already exists. Try logging in instead.')
                        }
                        throw new Error(error.message)
                    }

                    if (!data.user) throw new Error('Registration failed — no user returned')

                    // Step 2: Send OTP for email verification
                    const { error: otpError } = await supabase.auth.signInWithOtp({
                        email,
                        options: { shouldCreateUser: false } // account already created above
                    })

                    if (otpError) throw new Error(otpError.message)

                    // Store name/username in memory for use after OTP verification
                    set({ isLoading: false, error: null })
                    return true

                } catch (err) {
                    const message = err instanceof Error ? err.message : 'Registration failed'
                    set({ error: message, isLoading: false })
                    return false
                }
            },

            register: async ({ email, password, username, fullName }) => {
                set({ isLoading: true, error: null })
                try {
                    const { data, error } = await supabase.auth.signUp({ email, password })
                    if (error) {
                        if (
                            error.message.toLowerCase().includes('already registered') ||
                            error.message.toLowerCase().includes('already exists') ||
                            error.message.toLowerCase().includes('user already')
                        ) {
                            throw new Error('An account with this email already exists. Try logging in instead.')
                        }
                        throw new Error(error.message)
                    }
                    const supabaseUser = data.user
                    if (!supabaseUser) throw new Error('Registration failed — no user returned')

                    // Email confirmation required (session is null when email confirm is ON)
                    if (!data.session) {
                        set({ isLoading: false, authStatus: 'email_not_confirmed' })
                        return 'confirm_email'
                    }

                    // Session exists (email confirmation OFF) — sync user to backend now
                    let profile: ApiUser | null = null
                    try {
                        profile = await api.syncUser({ id: supabaseUser.id, email, username, full_name: fullName })
                    } catch {
                        try {
                            profile = await api.registerUser({ id: supabaseUser.id, email, username, full_name: fullName })
                        } catch {
                            // Ignore — profile will sync on next login
                        }
                    }

                    set({
                        user: profile,
                        profile,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                        authStatus: 'authenticated',
                    })
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
                set({ user: null, profile: null, isAuthenticated: false, error: null, authStatus: 'unauthenticated' })
                toast.success('Logged out', { description: 'See you next time.' })
            },

            // ── Check / restore auth on app mount ────────────────────────────────
            checkAuth: async () => {
                set({ authStatus: 'loading' })
                try {
                    const { data: { session } } = await supabase.auth.getSession()
                    
                    if (!session) {
                        set({ 
                            user: null, 
                            profile: null, 
                            isAuthenticated: false, 
                            authStatus: 'unauthenticated' 
                        })
                        return
                    }

                    // Email not yet confirmed
                    if (!session.user.email_confirmed_at) {
                        set({ 
                            user: null, 
                            profile: null, 
                            isAuthenticated: false, 
                            authStatus: 'email_not_confirmed' 
                        })
                        return
                    }

                    // ✅ Valid session = user IS authenticated
                    // Set this IMMEDIATELY before trying backend
                    set({ isAuthenticated: true, authStatus: 'authenticated' })

                    // Now try to get backend profile (non-blocking)
                    if (!get().user) {
                        try {
                            const profile = await api.getMe()
                            set({ user: profile, profile, authStatus: 'authenticated' })
                        } catch {
                            // Backend failed (cold start, network, etc.)
                            // DO NOT set isAuthenticated = false here
                            // User still has valid Supabase session
                            set({ authStatus: 'profile_incomplete' })
                        }
                    }
                } catch {
                    // Only set unauthenticated if getSession() itself fails
                    set({ 
                        user: null, 
                        profile: null, 
                        isAuthenticated: false, 
                        authStatus: 'session_expired' 
                    })
                }
            },

            // ── Helpers ───────────────────────────────────────────────────────────
            updateProfile: (updates) => {
                const { user } = get()
                if (user) {
                    const updated = { ...user, ...updates }
                    set({ user: updated, profile: updated })
                }
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: 'netlistlab-auth',
            // Only persist the user profile + auth state, not loading/error/status
            partialize: (state) => ({
                user: state.user,
                profile: state.profile,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)
