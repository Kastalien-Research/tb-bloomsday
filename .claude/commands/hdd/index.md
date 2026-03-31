# Hypothesis-Driven Development (HDD)

Commands for working with the hypothesis-driven development workflow where ADRs are the source of truth, not code.

## Core Principle

**Code is an implementation artifact. ADRs are the source of truth.**

## Available Commands

### Core Workflow

#### [overview](./overview.md)
Complete explanation of the hypothesis-driven development approach, workflow phases, and philosophy.

#### [quick-reference](./quick-reference.md)
Quick command reference and cheat sheet for the HDD workflow.

### Session Management

#### [init](./init.md)
Initialize a new HDD session by creating local state in `.hdd/state.json`.

#### [state](./state.md)
State management, checkpoints, and phase transitions for the local HDD session.

### Phase Commands

#### [research](./research.md)
Phase 1: Research existing ADRs, rejected approaches, and form hypotheses.

#### [stage-adr](./stage-adr.md)
Phase 2: Create staging ADR with context, decision, hypotheses, and validation criteria.

#### [validate](./validate.md)
Phase 4: Validate hypotheses through automated testing and required manual user testing.

#### [decide](./decide.md)
Phase 5: Make accept/reject decision based on validation results and migrate ADRs.

## Workflow Summary

```text
Research -> Stage ADR -> Implement -> Validate -> Accept/Reject
```

## Notes

- HDD in this repo is local-state based, not Beads-based.
- `.hdd/state.json` is the session source of truth.
