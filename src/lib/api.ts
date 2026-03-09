import { supabase } from './supabase'
import type {
    ApiProjectListResult,
    ApiProject,
    ApiBOMItem,
    ApiComment,
    ApiNotification,
    ApiStarResult,
    ApiFollowResult,
    ApiUploadResult,
    ApiUser,
} from './api-types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

// ─── Core Request Function ──────────────────────────────────────────────────
async function request<T>(
    endpoint: string,
    options?: RequestInit & { timeout?: number }
): Promise<T> {
    // Get active session token from Supabase (do not use manual localStorage)
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token

    // Timeout via AbortController — 60s to handle Render cold starts
    const { timeout = 60000, ...restOptions } = options ?? {}
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)

    // Build headers — don't set Content-Type for FormData (browser must add boundary)
    const isFormData = restOptions.body instanceof FormData
    const headers: Record<string, string> = isFormData
        ? {}
        : { 'Content-Type': 'application/json' }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    try {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            ...restOptions,
            headers: {
                ...headers,
                ...(restOptions.headers as Record<string, string> ?? {}),
            },
            signal: controller.signal,
        })

        if (!res.ok) {
            const error = await res.json().catch(() => ({}))
            throw new Error(error.error || error.message || `Request failed with status ${res.status}`)
        }

        const json = await res.json()
        // Unwrap backend's { data: T } envelope if present
        return ('data' in json ? json.data : json) as T
    } finally {
        clearTimeout(timer)
    }
}

// ─── Query String Builder ────────────────────────────────────────────────────
export function buildQueryString(params: Record<string, string | number | boolean | undefined | null>): string {
    const entries = Object.entries(params).filter(
        ([, v]) => v !== undefined && v !== null && v !== ''
    )
    if (entries.length === 0) return ''
    return entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&')
}

// ─── API Methods ─────────────────────────────────────────────────────────────
export const api = {
    // ── Projects ──────────────────────────────────────────────────────────────
    getProjects: (params?: string) =>
        request<ApiProjectListResult>(`/api/projects${params ? `?${params}` : ''}`),

    getProject: (id: string) =>
        request<ApiProject>(`/api/projects/${id}`),

    createProject: (data: object) =>
        request<ApiProject>('/api/projects', { method: 'POST', body: JSON.stringify(data) }),

    updateProject: (id: string, data: object) =>
        request<ApiProject>(`/api/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

    deleteProject: (id: string) =>
        request<{ message: string }>(`/api/projects/${id}`, { method: 'DELETE' }),

    publishProject: (id: string) =>
        request<ApiProject>(`/api/projects/${id}/publish`, { method: 'POST' }),

    incrementViewCount: (id: string) =>
        request<{ message: string }>(`/api/projects/${id}/views`).catch(() => null),

    // ── Users ─────────────────────────────────────────────────────────────────
    getUser: (username: string) =>
        request<ApiUser>(`/api/users/${username}`),

    getMe: () =>
        request<ApiUser>('/api/users/me'),

    updateMe: (data: object) =>
        request<ApiUser>('/api/users/me', { method: 'PATCH', body: JSON.stringify(data) }),

    getUserProjects: (username: string) =>
        request<ApiProject[]>(`/api/users/${username}/projects`),

    getUserStarred: (username: string) =>
        request<ApiProject[]>(`/api/users/${username}/starred`),

    // ── Stars ─────────────────────────────────────────────────────────────────
    // Backend route: POST /api/stars/:id/star
    toggleStar: (projectId: string) =>
        request<ApiStarResult>(`/api/stars/${projectId}/star`, { method: 'POST' }),

    // Backend route: GET /api/stars/:id/starred
    checkStarred: (projectId: string) =>
        request<{ starred: boolean }>(`/api/stars/${projectId}/starred`),

    // ── Follows ───────────────────────────────────────────────────────────────
    // Backend route: POST /api/follows/:username/follow
    toggleFollow: (username: string) =>
        request<ApiFollowResult>(`/api/follows/${username}/follow`, { method: 'POST' }),

    // ── Comments ──────────────────────────────────────────────────────────────
    // Backend route: GET /api/comments/:id/comments
    getComments: (projectId: string) =>
        request<ApiComment[]>(`/api/comments/${projectId}/comments`),

    // Backend route: POST /api/comments/:id/comments
    addComment: (projectId: string, data: object) =>
        request<ApiComment>(`/api/comments/${projectId}/comments`, {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    // Backend route: DELETE /api/comments/comments/:commentId
    deleteComment: (commentId: string) =>
        request<{ message: string }>(`/api/comments/comments/${commentId}`, { method: 'DELETE' }),

    // Backend route: POST /api/comments/comments/:commentId/upvote
    upvoteComment: (commentId: string) =>
        request<ApiComment>(`/api/comments/comments/${commentId}/upvote`, { method: 'POST' }),

    // ── Notifications ─────────────────────────────────────────────────────────
    getNotifications: () =>
        request<ApiNotification[]>('/api/notifications'),

    markAllRead: () =>
        request<{ message: string }>('/api/notifications/read', { method: 'PATCH' }),

    markOneRead: (id: string) =>
        request<{ message: string }>(`/api/notifications/${id}/read`, { method: 'PATCH' }),

    // ── BOM ───────────────────────────────────────────────────────────────────
    // Backend route: GET /api/bom/:id/bom
    getBOM: (projectId: string) =>
        request<ApiBOMItem[]>(`/api/bom/${projectId}/bom`),

    // Backend route: GET /api/bom/:id/bom/csv (returns CSV text, not JSON)
    getBOMcsvUrl: (projectId: string) =>
        `${BASE_URL}/api/bom/${projectId}/bom/csv`,

    // ── Forks ─────────────────────────────────────────────────────────────────
    // Backend route: POST /api/forks/:id/fork
    forkProject: (projectId: string) =>
        request<ApiProject>(`/api/forks/${projectId}/fork`, { method: 'POST' }),

    // ── Auth (DB sync) ────────────────────────────────────────────────────────
    // POST /api/auth/register — create user record in DB after Supabase signup
    registerUser: (data: { id: string; email: string; username: string; full_name: string; avatar_url?: string }) =>
        request<ApiUser>('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),

    // POST /api/auth/sync — sync Supabase user with our DB (master prompt spec)
    syncUser: (data: { id: string; email: string; username: string; full_name: string; avatar_url?: string }) =>
        request<ApiUser>('/api/auth/sync', { method: 'POST', body: JSON.stringify(data) }),

    // ── Uploads ───────────────────────────────────────────────────────────────
    uploadImage: (formData: FormData) =>
        request<ApiUploadResult>('/api/upload/image', { method: 'POST', body: formData }),

    uploadAvatar: (formData: FormData) =>
        request<ApiUploadResult>('/api/upload/avatar', { method: 'POST', body: formData }),

    uploadFile: (formData: FormData) =>
        request<ApiUploadResult>('/api/upload/file', { method: 'POST', body: formData }),
}
