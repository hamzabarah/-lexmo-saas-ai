import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createStrategyService, createProjectFor } from '../lib/focus/strategy';
import { createProjectFor as oldProjectEntry } from '../lib/focus/commands';
import { strategyFixture, OWNER, OTHER } from './helpers/strategy-fixture';

test('shared strategic services persist validated projects, records and history in isolated PostgreSQL', async () => {
    const { db, client, calls } = await strategyFixture();
    try {
        const service = createStrategyService(client);
        assert.equal(oldProjectEntry, createProjectFor);
        const phase = await service.createPhaseFor(OWNER, { name: 'Validation', position: 1,
            starts_on: '2026-09-01', ends_on: '2026-10-31', mission: 'Validate demand', status: 'active' });
        const objective = (await db.query<{ id: string }>(`INSERT INTO pilotage_objectives
            (title,lever,target_value,unit,source_of_truth,due_date) VALUES
            ('Demand','conversion',10,'sales','test','2026-10-31') RETURNING id`)).rows[0];
        const simple = await service.createProjectFor(OWNER, { name: 'Old name-only call' });
        assert.equal(simple.status, 'queued'); assert.equal(simple.phase_id, null);
        const project = await service.createProjectFor(OWNER, { name: 'Acquisition test', phase_id: phase.id,
            objective_id: objective.id, engine: 'acquisition', purpose: 'Find prospects', hypothesis: 'Useful content attracts buyers',
            expected_outcome: '10 requests', success_criteria: '10 qualified requests', priority: 'urgent',
            delivery_deadline: '2026-09-15', evaluation_deadline: '2026-09-30', planned_time_minutes: 120,
            planned_cost_eur: 12.50, status: 'vital' });
        assert.equal(project.engine, 'acquisition'); assert.equal(project.planned_cost_eur, 12.5);
        assert.equal(project.delivery_deadline, '2026-09-15');
        await assert.rejects(service.updateProjectFor(OWNER, project.id, { evaluation_deadline: '2026-09-10' }));
        assert.equal((await service.getProjectFor(OWNER, project.id)).evaluation_deadline, '2026-09-30');
        await assert.rejects(service.updatePhaseFor(OWNER, phase.id, { ends_on: '2026-08-31' }));
        assert.equal((await service.getPhaseFor(OWNER, phase.id)).ends_on, '2026-10-31');
        for (const engine of ['acquisition', 'conversion', 'expansion', 'systeme', 'risque']) {
            assert.equal((await service.updateProjectFor(OWNER, project.id, { engine })).engine, engine);
        }
        const beforeInvalid = calls.length;
        for (const body of [{ name: 'bad', engine: 'unknown' }, { name: 'bad', delivery_deadline: '2026-02-30' },
            { name: 'bad', planned_cost_eur: 1.001 }, { name: 'bad', user_id: OTHER }, { name: 'bad', planned_time_minutes: -1 }]) {
            await assert.rejects(service.createProjectFor(OWNER, body));
        }
        assert.equal(calls.length, beforeInvalid, 'invalid inputs never reach the database');
        const foreignPhase = await service.createPhaseFor(OTHER, { name: 'Other phase' });
        await assert.rejects(service.updateProjectFor(OWNER, project.id, { phase_id: foreignPhase.id }));
        await assert.rejects(service.updateProjectFor(OTHER, project.id, { purpose: 'Not mine' }));
        await assert.rejects(service.getProjectFor(OTHER, project.id));
        await assert.rejects(service.getProjectContextFor(OTHER, project.id));
        const records = [
            { type: 'decision', title: 'Try channel', payload: { rationale: 'Demand', alternatives: ['Wait'] } },
            { type: 'output', title: 'Landing page', payload: { url: 'https://example.invalid/page', format: 'page' } },
            { type: 'result', title: 'Requests', payload: { metric: 'requests', value: 12, unit: 'requests', source: 'test' } },
            { type: 'lesson', title: 'Keep channel', payload: { next_action: 'Repeat' } },
            { type: 'cost', title: 'Content', payload: { amount_eur: 12.50, category: 'production' } },
        ];
        for (const record of records) {
            const saved = await service.createProjectRecordFor(OWNER, project.id, record);
            assert.equal(saved.type, record.type); assert.ok(saved.created_at); assert.equal(saved.project_id, project.id);
        }
        await assert.rejects(service.createProjectRecordFor(OTHER, project.id, records[0]));
        const invalidRecords = [
            { type: 'cost', title: 'Bad', payload: { amount_eur: -1 } },
            { type: 'cost', title: 'Bad', payload: { amount_eur: 1.001 } },
            { type: 'result', title: 'Bad', payload: { metric: 'requests' } },
            { type: 'output', title: 'Bad', payload: { url: 'javascript:alert(1)' } },
            { ...records[0], created_at: '2020-01-01' },
            { ...records[0], payload: { arbitrary: true } },
        ];
        const beforeBadRecords = calls.length;
        for (const record of invalidRecords) await assert.rejects(service.createProjectRecordFor(OWNER, project.id, record));
        assert.equal(calls.length, beforeBadRecords);
        const task = (await db.query<{ id: string }>('INSERT INTO focus_tasks(user_id,project_id,title) VALUES($1,$2,$3) RETURNING id',
            [OWNER, project.id, 'Existing Focus task'])).rows[0];
        const command = async (action: string, data: unknown) => (await db.query<{ data: { id: string } }>(
            'SELECT focus_session_command($1,$2,$3) AS data', [OWNER, action, JSON.stringify(data)])).rows[0].data;
        const session = await command('start', { task_id: task.id });
        await command('stop', { id: session.id, actual_minutes: 2 });
        await db.query('UPDATE focus_tasks SET archived_at=now() WHERE id=$1', [task.id]);
        const history = (await db.query('SELECT * FROM focus_sessions WHERE id=$1', [session.id])).rows;
        await service.updateProjectFor(OWNER, project.id, { status: 'evaluating', purpose: 'Evaluate outcomes' });
        assert.equal((await service.listProjectsFor(OWNER, { active_only: true }))[0].id, project.id);
        await service.updateProjectFor(OWNER, project.id, { status: 'completed' });
        assert.deepEqual(await service.listProjectsFor(OWNER, { active_only: true }), []);
        assert.equal((await service.listProjectsFor(OWNER)).length, 2, 'completed project remains available to legacy agenda');
        assert.deepEqual((await db.query('SELECT * FROM focus_sessions WHERE id=$1', [session.id])).rows, history);
        const snapshot = (await db.query(`SELECT jsonb_build_object('p',(SELECT jsonb_agg(p) FROM focus_projects p),
            'r',(SELECT jsonb_agg(r) FROM project_records r),'s',(SELECT jsonb_agg(s) FROM focus_sessions s)) AS data`)).rows;
        const context = await service.getProjectContextFor(OWNER, project.id);
        assert.equal(context.project.status, 'completed'); assert.equal(context.phase.id, phase.id); assert.equal(context.objective.id, objective.id);
        assert.equal(context.counts.records, 5); assert.equal(context.totals.cost_eur, 12.5); assert.equal(context.totals.recorded_seconds, 120);
        assert.equal(context.tasks[0].id, task.id); assert.ok(context.tasks[0].archived_at);
        assert.deepEqual(await service.getProjectContextFor(OWNER, project.id), context);
        assert.equal((await service.listProjectRecordsFor(OWNER, project.id, { limit: 2, offset: 2 })).length, 2);
        assert.deepEqual((await db.query(`SELECT jsonb_build_object('p',(SELECT jsonb_agg(p) FROM focus_projects p),
            'r',(SELECT jsonb_agg(r) FROM project_records r),'s',(SELECT jsonb_agg(s) FROM focus_sessions s)) AS data`)).rows, snapshot);
    } finally { await db.close(); }
});
