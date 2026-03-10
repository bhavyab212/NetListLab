import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PROTECTED_PREFIXES = [
    '/dashboard',
    '/project/new',
    '/settings',
    '/notifications',
]

const PUBLIC_PREFIXES = [
    '/login',
    '/register',
    '/reset-password',
    '/auth/callback',
]

const EDIT_ROUTE_RE = /^\/project\/[^/]+\/edit(\/.*)?$/

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    if (PUBLIC_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
        return NextResponse.next()
    }

    const isProtected =
        PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix)) ||
        EDIT_ROUTE_RE.test(pathname)

    if (!isProtected) {
        return NextResponse.next()
    }

    let response = NextResponse.next({ request: req })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        req.cookies.set(name, value)
                    )
                    response = NextResponse.next({ request: req })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        const loginUrl = req.nextUrl.clone()
        loginUrl.pathname = '/login'
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    if (!session.user.email_confirmed_at) {
        const loginUrl = req.nextUrl.clone()
        loginUrl.pathname = '/login'
        loginUrl.searchParams.set('reason', 'email_not_confirmed')
        return NextResponse.redirect(loginUrl)
    }

    return response
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/project/new',
        '/project/:id/edit',
        '/settings/:path*',
        '/notifications/:path*',
        '/auth/callback',
    ],
}
