"use client"

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const checkAuth = useAuthStore(state => state.checkAuth)

    useEffect(() => {
        checkAuth()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return <>{children}</>
}
