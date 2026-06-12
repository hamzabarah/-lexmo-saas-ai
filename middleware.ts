import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
    // Canonicalisation du domaine : apex ecomy.ai -> www.ecomy.ai en 301
    // permanent (consolide les signaux SEO sur une seule version).
    const host = request.headers.get('host')
    if (host === 'ecomy.ai') {
        const url = request.nextUrl.clone()
        url.protocol = 'https'
        url.host = 'www.ecomy.ai'
        url.port = ''
        return NextResponse.redirect(url, 301)
    }
    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
