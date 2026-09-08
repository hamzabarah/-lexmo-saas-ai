import { test } from 'node:test';
import assert from 'node:assert/strict';
import { z } from 'zod';
import { createMcpHandler } from 'mcp-handler';
import { registerFocusStrategyTools } from '../lib/focus/strategy-mcp';
import { focusStrategyResponse } from '../lib/focus/strategy-http';
import { FocusError } from '../lib/focus/commands';

const owner = '00000000-0000-4000-8000-000000000001';
const project = '00000000-0000-4000-8000-000000000002';
const phase = '00000000-0000-4000-8000-000000000003';
type Registration = Parameters<typeof registerFocusStrategyTools>;
type Result = { content: { type: string; text: string }[]; isError?: boolean };
type Tool = {
    config: { annotations: { readOnlyHint: boolean }; inputSchema: z.ZodType };
    call: (input: Record<string, unknown>) => Promise<Result>;
};

function fixture() {
    const tools = new Map<string, Tool>();
    const calls: { method: string; args: unknown[] }[] = [];
    let failure: Error | null = null;
    const serviceNames = [
        'createProjectFor', 'updateProjectFor', 'getProjectFor', 'listProjectsFor',
        'createPhaseFor', 'updatePhaseFor', 'listPhasesFor',
        'createProjectRecordFor', 'listProjectRecordsFor', 'getProjectContextFor',
    ];
    const services = Object.fromEntries(serviceNames.map((method) => [method, async (...args: unknown[]) => {
        calls.push({ method, args });
        if (failure) throw failure;
        return { method, args };
    }])) as unknown as Registration[1]['services'];
    const server = {
        registerTool(name: string, config: Tool['config'], call: Tool['call']) {
            assert.equal(tools.has(name), false, `duplicate tool: ${name}`);
            tools.set(name, { config, call });
        },
    } as unknown as Registration[0];
    registerFocusStrategyTools(server, { services, resolveAdminUserId: async () => owner });
    return { tools, calls, services, fail: (error: Error) => { failure = error; } };
}

test('MCP strategic tools resolve the operator and preserve project creation compatibility', async () => {
    const { tools, calls } = fixture();
    assert.equal(tools.size, 14);
    assert.equal((await tools.get('create_project')!.call({ name: 'Simple' })).isError, undefined);
    assert.equal(calls[0].method, 'createProjectFor');
    assert.deepEqual(calls[0].args, [owner, { name: 'Simple' }]);

    const enriched = { name: 'Conversion', phase_id: phase, engine: 'conversion', delivery_deadline: '2026-10-10' };
    await tools.get('create_project')!.call(enriched);
    assert.deepEqual(calls[1].args, [owner, enriched]);
    await tools.get('update_project')!.call({ project_id: project, purpose: 'Mesurer la conversion' });
    assert.deepEqual(calls[2].args, [owner, project, { purpose: 'Mesurer la conversion' }]);
    await tools.get('update_phase')!.call({ phase_id: phase, name: 'Phase actualisée' });
    assert.deepEqual(calls[3].args, [owner, phase, { name: 'Phase actualisée' }]);
});

test('MCP reads only call read services, expose readOnlyHint and cannot turn active listing into a write', async () => {
    const { tools, calls } = fixture();
    for (const [name, input, method] of [
        ['get_project', { project_id: project }, 'getProjectFor'],
        ['get_project_context', { project_id: project }, 'getProjectContextFor'],
        ['list_active_projects', { engine: 'acquisition' }, 'listProjectsFor'],
        ['list_phases', {}, 'listPhasesFor'],
        ['list_project_records', { project_id: project, limit: 25, offset: 25 }, 'listProjectRecordsFor'],
    ] as const) {
        const tool = tools.get(name)!;
        assert.equal(tool.config.annotations.readOnlyHint, true);
        assert.equal((await tool.call(input)).isError, undefined);
        assert.equal(calls.at(-1)!.method, method);
        assert.equal(calls.at(-1)!.args[0], owner);
    }
    assert.deepEqual(calls[2].args, [owner, { engine: 'acquisition', active_only: true }]);
    const before = calls.length;
    assert.equal((await tools.get('list_active_projects')!.call({ active_only: false })).isError, true);
    assert.equal(calls.length, before);
});

test('MCP rejects malformed identifiers, engines and dates before a service call', async () => {
    const { tools, calls } = fixture();
    for (const [name, input] of [
        ['get_project', { project_id: 'another-user-input' }],
        ['create_project', { name: 'Project', engine: 'new-engine' }],
        ['create_project', { name: 'Project', delivery_deadline: '2026-02-30' }],
        ['update_project', { project_id: project }],
        ['update_project', { project_id: project, delivery_deadline: '2026-10-10', evaluation_deadline: '2026-10-09' }],
        ['update_phase', { phase_id: phase }],
        ['list_project_records', { project_id: project, limit: 101 }],
    ] as const) assert.equal((await tools.get(name)!.call(input)).isError, true);
    assert.equal(calls.length, 0);
});

test('MCP records preserve all five structured types and do not accept invalid costs', async () => {
    const { tools, calls } = fixture();
    const payloads = {
        decision: { rationale: 'Mesurer avant de développer', alternatives: ['Attendre'] },
        output: { url: 'https://www.ecomy.ai/formation', format: 'page' },
        result: { metric: 'conversion', value: 3.1, unit: '%' },
        lesson: { next_action: 'Vérifier la semaine suivante' },
        cost: { amount_eur: 12.34, category: 'outil' },
    };
    for (const type of Object.keys(payloads) as (keyof typeof payloads)[]) {
        const input = { project_id: project, title: `Record ${type}`, payload: payloads[type] };
        const tool = tools.get(`record_${type}`)!;
        assert.equal(tool.config.annotations.readOnlyHint, false);
        assert.equal((await tool.call(input)).isError, undefined);
        assert.deepEqual(calls.at(-1), {
            method: 'createProjectRecordFor', args: [owner, project, { type, title: input.title, payload: input.payload }],
        });
    }
    const before = calls.length;
    for (const input of [
        { project_id: project, title: 'Coût sans montant' },
        { project_id: project, title: 'Montant négatif', payload: { amount_eur: -1 } },
        { project_id: project, title: 'Fraction de centime', payload: { amount_eur: 1.234 } },
    ]) assert.equal((await tools.get('record_cost')!.call(input)).isError, true);
    assert.equal(calls.length, before);
});

test('MCP transport exposes valid tool schemas and dispatches to the shared service', async () => {
    const { services, calls } = fixture();
    const handler = createMcpHandler((server) => registerFocusStrategyTools(server, {
        services, resolveAdminUserId: async () => owner,
    }), { serverInfo: { name: 'focus-strategy-test', version: '1.0.0' } });
    let id = 0;
    const request = async (method: string, params: unknown) => {
        const response = await handler(new Request('http://localhost/api/mcp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
            body: JSON.stringify({ jsonrpc: '2.0', id: ++id, method, params }),
        }));
        assert.equal(response.status, 200);
        const body = await response.text();
        const data = body.split('\n').find(line => line.startsWith('data: '));
        return JSON.parse(data ? data.slice(6) : body);
    };
    const initialized = await request('initialize', {
        protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'test', version: '1.0.0' },
    });
    assert.equal(initialized.error, undefined);
    const listed = await request('tools/list', {});
    assert.equal(listed.error, undefined);
    assert.equal(listed.result.tools.length, 14);
    assert.equal(listed.result.tools.find((tool: { name: string }) => tool.name === 'record_cost').inputSchema.type, 'object');
    const called = await request('tools/call', { name: 'create_project', arguments: { name: 'Transport' } });
    assert.equal(called.error, undefined);
    assert.equal(called.result.isError, undefined);
    assert.deepEqual(calls, [{ method: 'createProjectFor', args: [owner, { name: 'Transport' }] }]);
});

test('MCP returns safe errors without leaking unexpected infrastructure details', async () => {
    const f = fixture();
    f.fail(new Error('private infrastructure detail'));
    let result = await f.tools.get('get_project')!.call({ project_id: project });
    assert.equal(result.isError, true);
    assert.equal(result.content[0].text, 'Focus strategy request failed');
    f.fail(new FocusError('focus_project_forbidden'));
    result = await f.tools.get('get_project')!.call({ project_id: project });
    assert.equal(result.content[0].text, 'focus_project_forbidden');
});

test('HTTP strategy guard rejects non-admin before calling any service and preserves envelopes', async () => {
    let calls = 0;
    const operation = async (userId: string) => { calls += 1; assert.equal(userId, owner); return [{ id: project }]; };
    const denied = await focusStrategyResponse(operation, 'projects', async () => null);
    assert.equal(denied.status, 403);
    assert.equal(calls, 0);
    const allowed = await focusStrategyResponse(operation, 'projects', async () => ({ id: owner }));
    assert.equal(allowed.status, 200);
    assert.deepEqual(await allowed.json(), { projects: [{ id: project }] });
    const invalid = await focusStrategyResponse(async () => z.string().uuid().parse('bad'), undefined, async () => ({ id: owner }));
    assert.equal(invalid.status, 400);
    const forbidden = await focusStrategyResponse(async () => { throw new FocusError('focus_phase_forbidden'); }, undefined, async () => ({ id: owner }));
    assert.equal(forbidden.status, 409);
});
