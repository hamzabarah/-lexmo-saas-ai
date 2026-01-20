import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);

    // STRATEGY: Forward EVERYTHING to the client-side verification page.
    // We do NOT attempt to exchange the code on the server, to avoid "PKCE verifier not found" issues
    // often caused by cookie unavailability in Server Actions/Route Handlers vs Browser logic.

    const forwardUrl = new URL(`${origin}/auth/verify`);

    // Copy all search params (code, next, token_hash, type, etc.)
    searchParams.forEach((value, key) => {
        forwardUrl.searchParams.set(key, value);
    });

    return NextResponse.redirect(forwardUrl);
}
