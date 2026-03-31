## Development Workflow (Source of Truth)

This repo no longer uses Beads or `bd`.

Treat any historical references to Beads, `bd`, `bead-workflow`, `beads-sync`, or `.beads/` elsewhere in the tree as stale unless a user explicitly asks to restore them.

### Active Workflow

- Use **GitHub Flow**: short-lived branches from `main`, one focused PR per unit of work.
- Specs live in `.specs/`. ADRs use `.adr/staging/` and then `.adr/accepted/` or `.adr/rejected/`.
- If code changes are described by a spec or ADR, update the doc in the same commit.
- Keep work units small, reviewable, and branch-scoped.
- Default: human is not in the loop. Operate autonomously up to the escalation thresholds in `agentic-dev-team/agentic-dev-team-spec.md`.
- Use `ulysses-protocol` when debugging produces repeated surprises and you need a tighter recovery loop.
- Use `theseus-protocol` for behavior-preserving refactors.

### References

- Ulysses protocol: `.claude/skills/ulysses-protocol/SKILL.md`
- Theseus protocol: `.claude/skills/theseus-protocol/SKILL.md`
- Agent team structure: `agentic-dev-team/agentic-dev-team-spec.md`
- Escalation thresholds: `agentic-dev-team/agentic-dev-team-spec.md` § Escalation Threshold Definition

## Branch Rules for Agents

This project uses **GitHub Flow**: short-lived feature branches off `main`, one PR per unit of work, merge when green.

1. **Before first commit: verify branch scope matches work.**
   - `git branch --show-current`
   - `fix/X` branches are for fixing X, not unrelated features
   - `feat/X` branches are for feature X, not unrelated fixes
   - If scope does not match, create a new branch from `main`
2. **Branch names must be human-readable and match the work.**
   - Example: `fix/gateway-timeout`, `feat/http-gateway-manifest`
3. **Never commit to `main` directly.**
4. **Never create branches with timestamps, UUIDs, or auto-generated suffixes.**
5. **After PR is merged: delete the branch locally and remotely.**

Committing unrelated work to an existing branch pollutes PRs, makes reverts dangerous, and destroys useful history.

## Landing the Plane (Session Completion)

When ending a work session:

1. Record any remaining follow-up work in durable project artifacts if needed.
2. Run quality gates for changed code.
3. Confirm docs/specs are updated for any behavior changes.
4. Push the work:
   ```bash
   git pull --rebase
   git push
   git status
   ```
5. Clean up obvious local detritus if it was created during the work.
6. Provide a concise handoff if the work is incomplete.

Work is not complete until the relevant commits are pushed successfully.

## Local Agent Asset Bridge (`.claude/` and `.gemini/`)

These directories contain project-local agent instructions. Codex cannot natively install Claude/Gemini hooks or slash commands from them, so treat them as manual operating instructions for this repo.

### Resolution Order

When these sources disagree, use this order:

1. `AGENTS.md`
2. `.claude/skills/` and `.claude/commands/`
3. `.gemini/skills/` and `.gemini/commands/`
4. `.claude/rules/`, `.claude/agents/`, `.claude/team-prompts/`, and hook docs as supporting context

Notes:
- Prefer `.claude/` over `.gemini/`.
- Treat older references to `specs/` or legacy ADR paths inside local skill docs as historical if they conflict with the rules above. The canonical locations remain `.specs/` and `.adr/`.
- Treat any `bd` or Beads instructions inside local skills or commands as deprecated.

### Local Skills to Honor Manually

If the user invokes one of these names, or the task clearly matches one, open the matching local file and follow it directly:

- Conditional protocols: `ulysses-protocol`, `theseus-protocol`
- Implementation: `implement`
- Research and knowledge: `research-task`, `knowledge`, `synthesize`, `distill`, `capture-learning`, `session-review`, `assumptions`, `eval`, `taste`, `diagram`
- Coordination and autonomy: `team`, `hub-collab`, `deploy-team-hub`, `experiment`, `ulc-loop`, `loop-status`, `status`, `escalate`, `claude-prompt`

Primary path pattern:
- `.claude/skills/<skill-name>/SKILL.md`

Fallback path pattern:
- `.gemini/skills/<skill-name>/SKILL.md`

### Local Commands to Treat as Project Procedures

The following command docs are not executable slash commands in Codex, but they define repo-specific procedures and should be read before doing matching work:

- HDD command set: `.claude/commands/hdd/*.md`
- Development TDD profiles: `.claude/commands/development/*.md`
- Gemini mirrors of the same procedures: `.gemini/commands/**/*.toml`

Important:
- HDD materials may still contain stale Beads references. Do not run `bd` commands from them.
- If a user references `/hdd` or HDD phases, follow the architectural reasoning parts and ignore historical issue-tracker instructions.

### Local Agent and Team Prompt Reuse

When spawning agents or structuring multi-agent work, reuse these local prompt libraries before inventing new role prompts:

- Role prompts: `.claude/team-prompts/_thoughtbox-process.md`, `.claude/team-prompts/architect.md`, `.claude/team-prompts/debugger.md`, `.claude/team-prompts/researcher.md`, `.claude/team-prompts/reviewer.md`
- Specialized agents: `.claude/agents/*.md`

### Hook-Derived Guardrails to Follow Manually

Codex cannot auto-register `.claude/settings.json`, `.gemini/settings.json`, or their shell hooks here. Still, emulate their intent during normal work.

Hook intent by event:

- `PreToolUse` / `BeforeTool`: apply command safety checks before running risky shell commands. Block direct pushes to protected branches, force pushes, branch deletion, dangerous `rm -rf`, and unrequested writes to `.env`-style files.
- `PostToolUse` / `AfterTool`: treat file access and tool side effects as auditable. Keep track of files touched, note meaningful state changes, and prefer leaving a clear trail in commit messages, specs, and handoff artifacts.
- `PermissionRequest`: preserve the repo's git safety policy when escalating. Default to caution on branch-destructive operations and anything that bypasses normal review flow.
- `UserPromptSubmit`: if a prompt implies assumptions, risks, or session context worth preserving, record them in the right project artifact instead of keeping them implicit.
- `SessionStart`: check whether `.claude/session-handoff.json`, `.claude/rules/`, or relevant state files should shape the current task.
- `SessionEnd` / `Stop`: before considering work complete, capture handoff context, update specs/ADRs, and follow the landing-the-plane steps above.
- `PreCompact`: before large context shifts, preserve the minimal durable context needed for safe continuation.
- `Notification`: assume important async events should be surfaced clearly in commentary rather than silently ignored.
- `SubagentStop`: when using agents, persist their outputs in durable artifacts immediately if the surrounding workflow expects that.

Concrete guardrails:

- Do not push directly to protected branches: `main`, `master`, `develop`, `production`
- Do not force-push or delete branches unless the user explicitly requests it
- Avoid modifying `.env` or other secret-bearing files unless the task explicitly requires it
- Preserve the repo's commit-message conventions when committing

### Knowledge and State Files Worth Consulting Selectively

Use these only when relevant to the task; do not bulk-load them by default:

- Session continuity: `.claude/session-handoff.json`
- Project rules: `.claude/rules/*.md`
- Local state: `.claude/state/*`

The intent is to inherit the project's accumulated operating context without pretending the Claude/Gemini runtime integrations are literally active in Codex.
