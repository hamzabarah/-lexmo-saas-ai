import { NextResponse } from 'next/server';

// Simple test endpoint to verify the webhook route is accessible
export async function GET() {
    return NextResponse.json({
        status: 'Webhook endpoint is accessible',
        message: 'This endpoint expects POST requests from Stripe with a valid signature',
        timestamp: new Date().toISOString()
    }, { status: 200 });
}

// The actual webhook handler (already exists in route.ts)
