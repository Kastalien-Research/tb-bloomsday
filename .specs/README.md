# Thoughtbox Gateway Specs

## Overview

This directory now documents Thoughtbox as a standalone, code-mode-first MCP gateway.

The active product is not a general reasoning platform, notebook environment, observability suite, or self-improvement runtime. The active product surface is:

- `thoughtbox_search`
- `thoughtbox_execute`
- a static upstream manifest in `thoughtbox.gateway.json`
- a gateway runtime that discovers and calls upstream MCP tools over hosted HTTP

## Active Specs

These documents are the current sources of truth for the gateway direction:

- `.specs/code-mode/target-state.md`
- `.specs/SPEC-CORE-002-code-mode-thoughtbox.md`
- `.specs/SPEC-GW-011-gateway-schema-surfacing.md`

## Reference Material

Some older documents may still remain in this tree because they could inform later work, but they are not binding on current implementation unless they are explicitly pulled back into the active set.

Treat the following as dormant unless a future task revives them:

- observability / observatory design
- notebook and Srcbook integration work
- recursive language model work
- hub-first product shaping
- self-improvement loop and evaluation orchestration
- Letta-specific integrations

Archived material lives under `.specs/old-specs/`.

## Current Architectural Position

Thoughtbox currently targets the following shape:

- code-mode-first public API
- hosted HTTP upstream MCP servers only
- tool proxying only in V1
- static local manifest as the source of upstream configuration
- in-memory discovered catalog and health state
- generic proxy call API first, typed wrappers later

## Non-Goals For This Spec Set

The active spec suite does not currently define or require:

- a new canonical reasoning IR
- progressive disclosure stages
- notebook lifecycle management
- observability stacks based on OTEL, Prometheus, or Grafana
- Beads-based workflow state
- marketplace-scale auth or DAuth runtime-key injection in the first milestone
