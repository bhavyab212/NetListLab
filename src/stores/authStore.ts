import { create } from 'zustand';
import { type User } from '../mockData/users';
import { mockLogin, mockRegister, type LoginCredentials, type RegisterData } from '../mockData/auth';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<boolean>;
    register: (data: RegisterData) => Promise<boolean>;
    logout: () => void;
    clearError: () => void;
    updateProfile: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: async (credentials) => {
        set({ isLoading: true, error: null });
        const result = await mockLogin(credentials);

        if (result.success && result.user) {
            set({ user: result.user, isAuthenticated: true, isLoading: false });
            return true;
        } else {
            set({ error: result.error || 'Login failed', isLoading: false });
            return false;
        }
    },

    register: async (data) => {
        set({ isLoading: true, error: null });
        const result = await mockRegister(data);

        if (result.success && result.user) {
            set({ user: result.user, isAuthenticated: true, isLoading: false });
            return true;
        } else {
            set({ error: result.error || 'Registration failed', isLoading: false });
            return false;
        }
    },

    logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
    },

    clearError: () => {
        set({ error: null });
    },

    updateProfile: (updates) => {
        const { user } = get();
        if (user) {
            set({ user: { ...user, ...updates } });
        }
    },
}));
