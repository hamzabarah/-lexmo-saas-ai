import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { isRetiredInternalPath, retiredInternalResponse } from '../lib/retired-internal';

test('retirement matches only the four internal roots and their descendants', () => {
    for (const root of ['/api/focus', '/api/mcp', '/dashboard/focus', '/dashboard/pilotage']) {
        for (const suffix of ['', '/', '/tasks', '/projects/00000000-0000-4000-8000-000000000001/records']) {
            assert.equal(isRetiredInternalPath(root + suffix), true);
        }
        assert.equal(isRetiredInternalPath(root + '-other'), false);
    }
    for (const path of ['/', '/formation', '/diagnostic', '/blog', '/login', '/register', '/forgot-password',
        '/dashboard/phases', '/dashboard/admin', '/dashboard/coaching', '/dashboard/settings',
        '/api/check-subscription', '/api/progress', '/api/webhooks/stripe', '/api/verify-payment']) {
        assert.equal(isRetiredInternalPath(path), false, path);
    }
});

test('retired response is terminal, not cached and independent of credentials or provider access', async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => { throw new Error('A retired route must never access a provider'); };
    try {
        const response = retiredInternalResponse();
        assert.equal(response.status, 410);
        assert.equal(response.headers.get('cache-control'), 'no-store');
        assert.equal(response.headers.has('location'), false);
        assert.deepEqual(await response.json(), { error: 'This internal service is no longer available.' });
    } finally { globalThis.fetch = originalFetch; }
});

test('all existing API entry points retire every supported HTTP method without business imports', async () => {
    const modules = [
        await import('../app/api/focus/route'), await import('../app/api/focus/current/route'),
        await import('../app/api/focus/habits/route'), await import('../app/api/focus/habits/checks/route'),
        await import('../app/api/focus/phases/route'), await import('../app/api/focus/projects/route'),
        await import('../app/api/focus/projects/[id]/route'), await import('../app/api/focus/projects/[id]/context/route'),
        await import('../app/api/focus/projects/[id]/records/route'), await import('../app/api/focus/stats/route'),
        await import('../app/api/focus/subtasks/route'), await import('../app/api/focus/tasks/route'),
        await import('../app/api/focus/week/route'), await import('../app/api/mcp/route'),
    ];
    for (const route of modules) for (const method of ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] as const) {
        assert.equal(route[method], retiredInternalResponse);
        assert.equal(route[method]().status, 410);
    }
    const middleware = readFileSync('middleware.ts', 'utf8');
    assert.ok(middleware.indexOf('if (isRetiredInternalPath') < middleware.indexOf('return await updateSession'));
    assert.doesNotMatch(readFileSync('app/api/mcp/route.ts', 'utf8'), /MCP_SECRET_TOKEN|supabase|lib\/focus|mcp-handler/);
});
