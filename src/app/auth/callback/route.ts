import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/explore'

    if (code) {
        const cookieStore = await cookies()

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    },
                },
            }
        )

        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && data.user) {
            // Sync user to backend — fire and forget
            const apiUrl = process.env.NEXT_PUBLIC_API_URL
            if (apiUrl) {
                try {
                    await fetch(`${apiUrl}/users/sync`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: data.user.id,
                            email: data.user.email,
                            username: (data.user.email ?? '').split('@')[0],
                            full_name: data.user.user_metadata?.full_name ?? 
                                       data.user.user_metadata?.name ?? '',
                            avatar_url: data.user.user_metadata?.avatar_url ?? 
                                        data.user.user_metadata?.picture ?? '',
                        }),
                    })
                } catch {
                    // Don't block login if sync fails
                }
            }

            // Check if user has completed onboarding
            // New Google users (no username set) → onboarding
            // Returning users → explore
            const isNewUser = !data.user.user_metadata?.username_set
            const redirectTo = isNewUser ? '/onboarding' : next

            return NextResponse.redirect(`${origin}${redirectTo}`)
        }
    }

    // Something went wrong
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`)
}
