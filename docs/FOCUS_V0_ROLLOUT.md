# Focus V0 ? Mission 005 / Option B

## Status and scope

LOCAL PREPARATION ONLY. No remote reset, migration, deployment or business write.
No Lot 2. Initial operator is Karim, with the existing auth account unchanged.
Focus measures human time even when its command is issued by an AI; autonomous
AI and machine time remain future, separate concepts.

REST inspection on 2026-09-08 found one owner, 4 projects, 17 tasks, 4 subtasks,
14 sessions, 4 bad habits and zero habit checks. No external incoming relation
was exposed by REST. REST does not establish the complete catalog or external
integration inventory. Production SQL preflights have NOT been executed.

## Exact deliverables

* `supabase/operations/20260908_focus_catalog_READ_ONLY.sql`: catalog inspection.
* `supabase/operations/20260908_focus_snapshot_READ_ONLY.sql`: read-only exact
  snapshot/dependency validation. Expected final result: FOCUS_RESET_PREFLIGHT_OK.
* `supabase/operations/20260908_focus_test_reset_ONCE.sql`: one-shot test reset.
* `supabase/migrations/20260908_focus_v0.sql`: engine installation, no reset.
* `supabase/superseded/20260907_focus_execution.sql`: obsolete, DO NOT APPLY.

Never replay the old migrations to reconcile CLI history. They contain demo
seeds and are not a safe empty-database bootstrap order. The V0 migration targets
the already-existing Focus tables, emptied by the separate operation.

## Reset guarantees and limits

Explicit six-table allowlist: focus_projects, focus_tasks, focus_subtasks,
focus_sessions, focus_bad_habits, focus_habit_checks. Frozen manifest contains
exact UUIDs, owners, counts (array lengths), and hashes of every field. Timestamps
are compared in UTC with microsecond precision. No titles, notes or secrets are
stored in the manifest. Hashes detect accidental drift; they are not an anonymity
or adversarial tamper-proof guarantee.

Checks run under table locks and within a transaction. A changed row (even without
updated_at changing), missing/extra row, owner change or schema-field change aborts.
The script rejects an installed engine, custom table triggers/rules, external
incoming FKs, dependent views, inheritance/partitions and logical publications.
TRUNCATE names ONLY the six tables, with RESTRICT, CONTINUE IDENTITY, no CASCADE.
It does not run row DELETE cascades and never deletes an auth account. A replay
fails on the now-empty snapshot, or on the installed engine. Never regenerate or
edit the manifest simply to suppress a mismatch: inspect and revalidate scope.

The catalog/permission checks and runtime rejection are fail-closed, not proof
that the remote database has no unknown integration. Review external consumers,
DDL event triggers and platform hooks before intervention. An unexpected effect
outside Focus blocks that operation. No auth/client/payment/course/progress/
diagnostic/coaching/Pilotage/storage table is a reset target. A backup/recovery
path for the shared environment is not verified by this mission.

## Engine rules

No engine_version column, legacy-pause branches or legacy uniqueness exemptions.
Every session needs a task, one running/paused session per owner, server pause
instants, explicit stop/resume/expiry and closed/open state constraints. The RPC
locks per owner; task/subtask SQL triggers preserve ownership and completed_at.
All web/MCP session mutations use the same command/RPC. GET/get_overview do not
close sessions. UI expiry is an explicit command and is marked estimated_expiry.
A declared duration stays separate in duration_override_seconds. UTC storage,
Paris calendar (DST covered), Monday weeks, recorded time includes closed abandoned
sessions. Sessions are attributed to their Paris start date, not split at midnight.

Archiving preserves FUTURE history. Task/project changes with history and deletes
of tasks/subtasks/sessions are blocked. Account deletion cascades can therefore
fail and need a separately designed erasure procedure. A shared MCP token and
admin-by-email remain existing limitations. service_role is trusted and has
privileges beyond the RPC; old server code must remain stopped during transition.

Basic project creation by name is exposed through POST /api/focus/projects and
MCP create_project using createProjectFor. No strategy fields or new UI were added.
There are no automatic demo projects. Create the first real project deliberately;
the existing web task form can also use a task without a project. The MCP task
creation path requires an existing named project.

First migration installation requires an empty execution graph and refuses the
old engine or conflicting protections. Same-version replay preserves real rows.
A function marker rejects an unrelated existing RPC. IF NOT EXISTS is not a full
schema-drift reconciler: inspect index/constraint definitions in catalog preflight.

## Controlled switchover ? owner/authorized operator, NOT performed here

1. Prepare and validate the new local build first. Agree a maintenance window and
   verify a recovery path for the shared environment. Do not restore anything now.
2. Stop ALL old Focus access before SQL: web pages/polling, API consumers, MCP and
   automations. Enforce a deployment/gateway maintenance block on /api/focus/* and
   /api/mcp (including GET), covering existing deployment URLs too. Merely closing
   one browser tab is insufficient. Drain requests and keep the block until step 8.
   This mission does not configure that block. If it cannot be guaranteed, STOP.
3. In Supabase SQL Editor, verify the project is ruhkuamtmgzjkcdyrpel. Run the catalog
   READ_ONLY file and review unknown triggers/functions/policies/permissions,
   external dependencies and publications. Any uncertainty: STOP, no reset.
4. Run the snapshot READ_ONLY file in full. Require FOCUS_RESET_PREFLIGHT_OK. Any
   mismatch requires investigation, not a relaxed manifest or a new broad snapshot.
5. Execute ONLY the one-shot reset file in full, once. Require SQL success and
   independently confirm all six counts are zero. No normal migration runner for it.
6. Execute 20260908_focus_v0.sql in full. Verify its four new columns, state constraint,
   task_id/paused_seconds NOT NULL, focus_one_open_v0 unique index, three triggers,
   three functions and effective RPC/table grants. Confirm auth and non-Focus data
   unchanged against a pre-intervention baseline. Inspect catalog definitions, not
   merely object names. Verify SELECT/RLS with real user roles.
7. Install the matching new application while the maintenance block remains. The
   old application is NOT a safe fallback on the new state model. Close/reload old
   browser tabs before allowing access. Confirm the new deployed build identity.
8. Run controlled web/MCP recipe: create_project -> create_task -> start -> pause ->
   resume -> stop -> done -> reopen -> archive; subtask links, times, completed_at,
   expired-session read without mutation then explicit expiry. Check Kanban, timer,
   agenda and stats. Archive recipe items and retain the future test history.
   Remove the block only for verified new clients/paths. Do not start Lot 2.

On any SQL error: STOP, do not run subsequent files or snippets, keep maintenance
active; collect the error (no secrets). Execute ROLLBACK if SQL Editor still has
an aborted/open transaction. Each file has its own transaction; a successful reset
is NOT undone by a later migration failure. No rollback deleting V0 columns/data
is provided. Prefer keeping Focus unavailable and fixing forward after diagnosis.

## Verification and remaining gates

npm run test:focus exercises isolated PostgreSQL (PGlite), actual migration SQL,
reset allowlist and negative guards, sentinel tables outside Focus unchanged,
empty bootstrap, project/task creation, completion/reopening, ownership,
competing starts, pause/resume/stop, expiry, subtask linkage, archive/history,
permissions and SQL replay. Source-contract tests check web/MCP delegation and
absence of hidden cleanup in reads; they are NOT authenticated HTTP/MCP E2E tests.

PGlite is a single PostgreSQL connection. No postgres/psql/initdb/pg_ctl/docker
binary or PostgreSQL/Docker installation was found in the checked standard paths.
No real two-connection test was performed. In an isolated PostgreSQL instance:
create a disposable owner/project/task, connection A BEGIN then call start and
hold the transaction; connection B BEGIN then call start for the same owner/task.
Verify B waits; COMMIT A; verify B rejects focus_session_already_open and ROLLBACK B.
Assert exactly one open row. Also test A ROLLBACK then B succeeds, and a direct
second insert fails the unique index. Never point this test at production.

Unverified: remote SQL catalog and recovery, authenticated browser/web/MCP recipe,
real multi-connection lock behavior, effective inherited/column grants. Direct task
updates and session RPCs can acquire row/advisory locks in opposite order: a real
concurrency test must cover deadlock handling. No destructive workaround is allowed.

## Local results ? Mission 005

Six Focus tests passed (including execution of both SQL preflights in isolation).
TypeScript --noEmit passed. Production build passed: 376 static pages.
Existing Next middleware deprecation warning remains. No authenticated browser or
remote MCP recipe was executed. No new package installation or broad dependency
upgrade was performed. Git changes remain uncommitted and unrelated SEO changes
are untouched. Remote intervention is NOT yet cleared: catalog/maintenance/
recovery and real multi-connection verification remain outstanding.
