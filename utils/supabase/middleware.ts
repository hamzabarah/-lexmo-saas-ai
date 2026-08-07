import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest, type NextFetchEvent } from 'next/server'
import {
    findValidAccessLink,
    getClientIp,
    isAccessLinkPathAllowed,
    recordAccessLinkUse,
} from '@/lib/access-links'

/**
 * Lien d'accès : dernière chance avant la redirection vers /login, pour une
 * requête /dashboard sans session.
 *
 * Le token est lu DANS L'URL à chaque requête et nulle part ailleurs. Aucun
 * cookie n'est posé ici, volontairement : c'est précisément le transport de
 * cookie qui est défaillant chez certains appareils, et poser un cookie
 * rendrait l'accès dépendant de ce qui est cassé.
 *
 * Renvoie true si l'accès est accordé.
 */
async function tryAccessLink(request: NextRequest, event: NextFetchEvent): Promise<boolean> {
    const token = request.nextUrl.searchParams.get('access')
    if (!token) return false

    const path = request.nextUrl.pathname

    // Liste blanche AVANT la base : un token valide ne doit pas ouvrir /admin.
    if (!isAccessLinkPathAllowed(path)) {
        console.log(`[access-link] refus hors-perimetre path=${path} ip=${getClientIp(request.headers)}`)
        return false
    }

    const link = await findValidAccessLink(token)
    if (!link) {
        console.log(`[access-link] refus token-invalide path=${path} ip=${getClientIp(request.headers)}`)
        return false
    }

    const ip = getClientIp(request.headers)
    const userAgent = request.headers.get('user-agent') ?? 'unknown'
    console.log(`[access-link] acces label="${link.label}" path=${path} ip=${ip}`)

    // On ne compte que les vraies ouvertures de page. Les navigations internes
    // de Next (requêtes RSC) passeraient sinon plusieurs fois par ici et
    // rendraient uses_count ininterprétable.
    if (request.headers.get('sec-fetch-dest') === 'document') {
        event.waitUntil(recordAccessLinkUse(token, ip, userAgent, path))
    }

    return true
}

export async function updateSession(request: NextRequest, event: NextFetchEvent) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Public routes that don't require authentication
    const publicRoutes = [
        '/',
        '/login',
        '/register',
        '/reset-password',
        '/payment-success',
        '/api/webhooks/stripe',
        '/formation',
        '/diagnostic',
        '/blog',
    ];

    // '/' doit être comparé EXACTEMENT : avec un startsWith, tout chemin
    // commence par '/', donc chaque route était considérée publique et la
    // protection de /dashboard plus bas n'était jamais atteinte.
    const isPublicRoute = publicRoutes.some(route =>
        route === '/'
            ? request.nextUrl.pathname === '/'
            : request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route)
    );

    // Allow public routes without authentication
    if (isPublicRoute) {
        return response;
    }

    // Protect /dashboard routes
    if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
        // Un lien d'accès valide passe ici, et seulement ici. Sans token dans
        // l'URL, le comportement est identique à l'avant : redirection /login.
        if (await tryAccessLink(request, event)) {
            return response
        }

        // Le marqueur ?access=denied dit au filet de rattrapage côté client que
        // le token mémorisé ne vaut plus rien, et qu'il doit l'oublier au lieu
        // de renvoyer l'élève en boucle vers la formation.
        const loginUrl = new URL('/login', request.url)
        if (request.nextUrl.searchParams.has('access')) {
            loginUrl.searchParams.set('access', 'denied')
        }
        return NextResponse.redirect(loginUrl)
    }

    // Redirect authenticated users away from /login
    if (request.nextUrl.pathname.startsWith('/login') && user) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
}
