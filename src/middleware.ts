import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Protected routes — unauthenticated users are redirected to /login
const PROTECTED_PREFIXES = [
    '/dashboard',
    '/project/new',
    '/settings',
    '/notifications',
]

// Public routes that must NEVER be blocked even with a bad session state
const PUBLIC_PREFIXES = [
    '/login',
    '/register',
    '/reset-password',
]

// Pattern for /project/:id/edit
const EDIT_ROUTE_RE = /^\/project\/[^/]+\/edit(\/.*)?$/

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl

    // Always let public routes through — no session check needed
    if (PUBLIC_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
        return NextResponse.next()
    }

    const isProtected =
        PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix)) ||
        EDIT_ROUTE_RE.test(pathname)

    if (!isProtected) {
        return NextResponse.next()
    }

    // Read Supabase session from request cookies
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: false,
        },
        global: {
            headers: {
                cookie: req.headers.get('cookie') ?? '',
            },
        },
    })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    // No session at all → redirect to login
    if (!session) {
        const loginUrl = req.nextUrl.clone()
        loginUrl.pathname = '/login'
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // Session exists but email not confirmed → redirect to login with reason
    if (!session.user.email_confirmed_at) {
        const loginUrl = req.nextUrl.clone()
        loginUrl.pathname = '/login'
        loginUrl.searchParams.set('reason', 'email_not_confirmed')
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/project/new',
        '/project/:id/edit',
        '/settings/:path*',
        '/notifications/:path*',
    ],
}
