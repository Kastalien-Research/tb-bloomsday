# Code Mode: Hosted Alignment Target State

> Status: Active
> Updated: 2026-03-30

## Intent

This document defines the desired near-term end state for the Thoughtbox fork after gateway alignment.

Thoughtbox should present a code-mode-first surface that helps an agent discover and call tools that live on upstream hosted HTTP MCP servers.

## Target Outcome

When alignment is complete:

- Thoughtbox is described and shipped as a standalone MCP gateway
- `thoughtbox_search` is the primary discovery surface
- `thoughtbox_execute` is the primary orchestration surface
- the active catalog is built from upstream tool discovery, not from legacy Thoughtbox subsystems
- upstream configuration comes from a static local manifest
- the runtime keeps discovered catalog and status state in memory

## Public Surface

### `thoughtbox_search`

Search returns a unified gateway catalog containing:

- upstreams
- tools
- normalized descriptions and schemas where available

It does not serve as a front door to the older notebook, observability, or broad internal operations catalogs.

### `thoughtbox_execute`

Execute exposes a generic gateway namespace first:

- `tb.gateway.listUpstreams()`
- `tb.gateway.listTools()`
- `tb.gateway.getCatalog()`
- `tb.gateway.refresh()`
- `tb.gateway.call(...)`
- `tb.call(...)` as a short alias

Typed wrappers for specific upstream tools are a later optimization, not a prerequisite.

## Runtime Shape

### Manifest

The gateway runtime loads upstream definitions from:

- `thoughtbox.gateway.json`, or
- `THOUGHTBOX_GATEWAY_MANIFEST`

The manifest is the only supported upstream registry source in the first pass.

### Upstream Scope

The first pass supports:

- hosted HTTP MCP servers
- tool discovery
- tool execution

The first pass does not require:

- resource proxying
- prompt proxying
- DAuth runtime key injection
- marketplace-scale sync

### State Model

Runtime state is intentionally simple:

- manifest on disk
- discovered upstream/tool catalog in memory
- per-upstream status in memory

A future hosted persistence layer may be added later, but it is not required for the current target state.

## Codebase Expectations

The aligned codebase should have:

- gateway runtime code under `src/gateway/`
- code-mode search/execute code aimed at gateway behavior
- docs and packaging that position Thoughtbox as a gateway
- no dependency on the removed observability stack
- no dependency on Beads for understanding the active workflow

## Acceptance Criteria

1. A fresh client can connect to Thoughtbox and immediately use the code-mode gateway surface.
2. Search results come from discovered upstream tools rather than the old internal Thoughtbox operation surface.
3. Execute can proxy a tool call to a configured upstream successfully.
4. The repo’s active docs/specs no longer describe observability, notebooks, or progressive disclosure as the product center.
