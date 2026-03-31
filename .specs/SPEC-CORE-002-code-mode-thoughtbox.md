# SPEC-CORE-002: Code Mode Thoughtbox

> Status: Active
> Updated: 2026-03-30

## Summary

Thoughtbox is now a code-mode-first MCP gateway. Instead of exposing a growing internal reasoning platform through a large tool catalog, it exposes a minimal code-mode surface that discovers and calls tools hosted on upstream MCP servers.

## Problem

The previous direction mixed several incompatible goals:

- a general reasoning runtime
- notebook and observability features
- progressive-disclosure tool choreography
- code mode as a wrapper over internal Thoughtbox tools

That product shape created too much surface area and too many competing stories. This fork needs a narrower center of gravity.

## Scope

### In Scope

- `thoughtbox_search` as the discovery surface for upstream tools
- `thoughtbox_execute` as the orchestration surface for upstream calls
- hosted HTTP MCP upstream support
- static manifest-based upstream configuration
- in-memory gateway registry and catalog

### Out of Scope

- a canonical reasoning IR
- TBX-C1 or any other custom wire codec
- progressive disclosure stages
- notebook runtime design
- observability stacks
- marketplace auth and DAuth in the first milestone

## Architecture

### Layer 1: Manifest

A local manifest defines the upstream servers Thoughtbox should connect to.

### Layer 2: Gateway Registry

The registry is responsible for:

- loading the manifest
- connecting to configured upstreams
- discovering tools from each upstream
- normalizing tool metadata into a single catalog
- proxying tool calls to the correct upstream

### Layer 3: Code Mode

Code mode exposes a compact public API:

- search for discovery
- execute for orchestration

The `tb` namespace should stay centered on gateway primitives until real usage patterns justify typed wrappers.

## Search Contract

Search should surface:

- upstream identity
- tool name
- tool description
- input schema where available
- enough metadata for a model to decide whether to call the tool

## Execute Contract

Execute should expose gateway-native operations before anything else:

- list upstreams
- list tools
- get the current catalog
- refresh registry state
- call an upstream tool through a generic proxy interface

## Implementation Notes

The initial implementation should optimize for correctness and directness:

- no speculative abstraction layers
- no dual product stories
- no dependency on removed observability or Beads workflow assets
- minimal assumptions about future auth design

## Acceptance Criteria

1. Thoughtbox’s active docs describe it as a gateway.
2. Code mode discovery is upstream-backed.
3. Code mode execution can proxy hosted HTTP MCP tool calls.
4. Static manifest configuration is the supported path in the first pass.
