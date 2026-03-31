# HDD Initialization: Create Local Session State

**Purpose**: Initialize a new HDD session by creating `.hdd/state.json` and starting Phase 1 locally.

---

## Overview

This repo no longer uses Beads for HDD tracking. HDD state lives in `.hdd/state.json`.

## Command: `/hdd:init`

### Usage

```bash
/hdd:init [adr-number] [title]
```

### Arguments

- `adr-number`: ADR number (for example `008`)
- `title`: Brief title for the ADR

---

## What This Command Does

### Step 1: Create the HDD state file

```bash
mkdir -p .hdd
cat > .hdd/state.json <<'STATE'
{
  "workflow": "hdd",
  "version": "2.1",
  "adr_number": "008",
  "title": "Task Endpoint Implementation",
  "phase": "research",
  "phases_requested": [1, 2, 3, 4, 5],
  "status": "in_progress",
  "artifacts": [],
  "hypotheses": [],
  "staging_adr_path": null,
  "spec_path": null,
  "open_risks": [],
  "reconciliation_flags": [],
  "updated_at": "<ISO timestamp>"
}
STATE
```

### Step 2: Start Phase 1

```bash
jq '.phase = "research" | .status = "in_progress"' .hdd/state.json > .hdd/state.json.tmp && mv .hdd/state.json.tmp .hdd/state.json
```

### Step 3: Display Session Summary

```markdown
# HDD Session Initialized: ADR-008

State file: .hdd/state.json

## Phases

✓ Phase 1: Research (in_progress)
○ Phase 2: Stage Docs
○ Phase 3: Implementation
○ Phase 4: Validation
○ Phase 5: Decision

## Next Steps

1. Begin Phase 1 research
2. Record approved hypotheses in `.hdd/state.json`
3. Use the state file as the source of truth for checkpoint progress
```

---

## Querying Session State

```bash
jq . .hdd/state.json
```

## Benefits

1. State survives session crashes.
2. The workflow has a single local source of truth.
3. HDD no longer depends on Beads-specific plumbing.
4. Agents can recover context by reading one file.
