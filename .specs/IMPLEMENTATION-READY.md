# Implementation-Ready: Thoughtbox Gateway Alignment

**Status**: Active
**Updated**: 2026-03-30

## What Is Ready Now

The repo is now oriented around one implementation track:

- Thoughtbox as a standalone, code-mode-first MCP gateway
- `thoughtbox_search` backed by a live upstream tool catalog
- `thoughtbox_execute` backed by a generic gateway call surface
- static upstream configuration via `thoughtbox.gateway.json`

## Current Ready Scope

### Milestone 1: Minimal Proof

- manifest loading works from disk
- hosted HTTP upstreams can be contacted
- upstream tools can be discovered and normalized
- code mode can search discovered tools
- code mode can proxy at least one tool call end-to-end

### Milestone 2: Useful Gateway V1

- multiple upstreams from one manifest
- refreshable in-memory catalog
- per-upstream health and tool status
- generic `tb.gateway.call()` and `tb.call()` support
- typed wrappers deferred until usage patterns stabilize

## Acceptance Criteria

1. Thoughtbox starts with an empty or populated static manifest without referencing removed observability infrastructure.
2. `thoughtbox_search` returns upstream-backed tool discovery results instead of the old internal Thoughtbox operation catalog.
3. `thoughtbox_execute` can list upstreams, list tools, refresh the gateway registry, and proxy tool calls.
4. The repo’s primary docs and active specs describe Thoughtbox as a gateway rather than a general reasoning platform.
5. Beads is not part of the active workflow required to understand or operate this fork.

## Explicitly Deferred

- DAuth and runtime-key injection
- marketplace-scale registry sync
- prompt/resource proxying
- typed gateway wrappers beyond the generic call surface
- hosted persistence for discovered state
