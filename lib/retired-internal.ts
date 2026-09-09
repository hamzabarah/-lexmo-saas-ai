/** Former internal services are permanently unavailable on the public app. */
const retiredRoots = ['/api/focus', '/api/mcp', '/dashboard/focus', '/dashboard/pilotage'];

export function isRetiredInternalPath(pathname: string): boolean {
    return retiredRoots.some(root => pathname === root || pathname.startsWith(root + '/'));
}

export function retiredInternalResponse(): Response {
    return Response.json({ error: 'This internal service is no longer available.' }, {
        status: 410,
        headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
    });
}
