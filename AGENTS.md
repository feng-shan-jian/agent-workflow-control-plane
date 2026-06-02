# AGENTS.md

## Boot

Every task MUST start from this kernel and the mechanism files.

Default entry:

```bash
node .agent/check.mjs
node .agent/check.mjs state
node .agent/check.mjs route <route_name>
```

If the route is unknown:

```bash
node .agent/check.mjs route unknown_task
```

Do NOT read all `docs/`, `spec/`, `workflow/records/`, or historical logs by default.

## Priority

When rules conflict, follow this order:

1. Safety, data protection, destructive-operation restrictions.
2. Current explicit user request.
3. Current task contract from route / lifecycle / spec.
4. This `AGENTS.md`.
5. `.agent/policy.json`.
6. `.agent/lifecycle.json`.
7. `.agent/output-contract.json`.
8. Project files and existing implementation.
9. General development habits.

## Non-negotiable invariants

- Real repository code and real command output override stale documents.
- Unknown / deprecated facts cannot be used as confirmed facts.
- If `project_init_status` is `pending` or `stale`, run initialization route before feature work.
- If a dirty flag is relevant to the current task, refresh only the matching scope.
- Never perform destructive operations without explicit user confirmation.
- Before edits: check working directory and run `git status` when this is a git repository.
- After edits: run relevant checks, inspect diff, update state/log if required.
- If the route or lifecycle cannot classify the task, use `unknown_task`; do not fall back to full-context reading.
- If the task matches multi-agent conditions in `.agent/policy.json`, read `docs/subagent-collaboration.md` and follow it.
- Keep mechanism files machine-readable. Do not write long reasoning, scratch notes, test process, or chat transcripts into `.agent/*.json`.

## Coding and delivery rules

Detailed policy is in `.agent/policy.json`.
Final response must satisfy `.agent/output-contract.json`.

Run before final delivery:

```bash
node .agent/check.mjs
```

If a final report file is created:

```bash
node .agent/check.mjs --delivery <final_report.md>
```
