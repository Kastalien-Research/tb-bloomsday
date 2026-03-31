# Dedalus Runtime Rehost Plan

## Purpose

This document turns the compatibility audit into an implementation plan.

The goal is not to redesign Thoughtbox again. The goal is to transplant the working gateway core onto the Dedalus MCP scaffold/runtime contract.

## Non-Negotiable Target

The target is:

- Dedalus marketplace deployment
- Dedalus MCP scaffold/runtime compatibility
- Thoughtbox gateway logic hosted inside that runtime

The target is not:

- Cloud Run as the primary acceptance environment
- Thoughtbox as a generic standalone gateway product
- Thoughtbox-specific auth or transport semantics as the public contract

## Current Working Core

These files contain the gateway logic that is worth preserving:

- `src/gateway/registry.ts`
- `src/gateway/types.ts`
- useful parts of `src/gateway/manifest.ts`
- `src/code-mode/search-index.ts`
- the fixture and smoke-test assets in `scripts/demo/gateway-fixture.ts` and `thoughtbox.gateway.demo.json`

Everything else should be judged by one question:

Does it help host that gateway core inside the Dedalus scaffold, or does it keep Thoughtbox trapped in its own server/runtime contract?

## Workstream 1: Replace the outer runtime shell

### Why

Right now Thoughtbox owns the transport, session lifecycle, and auth boundary in:

- `src/index.ts`
- `src/server-factory.ts`

That is the wrong ownership boundary if the Dedalus scaffold is the contract.

### Keep

- gateway runtime internals

### Replace

- `src/index.ts` as the deployed marketplace entrypoint
- `src/server-factory.ts` as the primary runtime shell

### Target shape

Introduce a marketplace-facing runtime layer that mirrors the scaffold split:

- entrypoint
- HTTP transport wrapper
- server initialization
- auth/header parsing
- compatibility shaping

### First concrete slice

Build a new Thoughtbox marketplace server module that:

1. constructs a fresh MCP server the same way the Dedalus scaffold does
2. initializes Thoughtbox tools through a scaffold-style `init` function
3. keeps Thoughtbox gateway logic behind that initializer instead of behind the current monolithic `createMcpServer()`

## Workstream 2: Re-express Thoughtbox tools as scaffold endpoints

### Why

The current two-tool idea is fine. The current packaging is not.

Today the tools are registered directly from:

- `src/code-mode/search-tool.ts`
- `src/code-mode/execute-tool.ts`
- `src/server-factory.ts`

The Dedalus scaffold expects an endpoint-oriented initialization path, then runs compatibility transforms across those tool definitions.

### Keep

- the two-tool strategy
- the gateway catalog model
- the `tb.gateway.call()` interaction model, if it survives execution rehosting cleanly

### Adapt

- `thoughtbox_search` tool definition and description
- `thoughtbox_execute` tool definition and description
- schema shaping and naming

### Replace

- direct registration from `src/server-factory.ts`

### First concrete slice

Create a marketplace adapter that turns the Thoughtbox tool pair into scaffold-compatible endpoint definitions, then runs the Dedalus compatibility transforms before exposure.

## Workstream 3: Replace the execution boundary

### Why

`src/code-mode/execute-tool.ts` currently uses `node:vm`. That is explicitly weaker than the scaffold contract.

### Keep

- the high-level execute use case
- the `tb` helper concept, if it can be injected into the worker safely

### Replace

- the current `node:vm` execution boundary

### Target shape

Move execution onto the same worker-based isolation model the Dedalus scaffold uses:

- worker bootstrap
- restricted environment
- only the minimum gateway helper surface available inside execution

### First concrete slice

Split `execute-tool.ts` into:

1. a host-side adapter that validates input and launches the worker
2. a worker-side runtime that exposes only the gateway helper surface

## Workstream 4: Replace the external auth and config contract

### Why

Thoughtbox currently treats these as its own application concerns:

- bearer/query-string key parsing
- `tbx_*` workspace resolution
- local manifest as the primary deployment contract

That is not the right public boundary for Dedalus marketplace compatibility.

### Keep

- internal manifest parsing as an adapter, if still useful
- internal workspace/upstream resolution logic that can sit behind the marketplace contract

### Replace

- Thoughtbox-specific public auth semantics in `src/index.ts`
- filesystem-first config as the primary deployment interface

### Target shape

The external contract should be scaffold-compatible first:

- header parsing aligned with the Dedalus scaffold
- client options shaped by scaffold inputs
- deployment/runtime config injected through marketplace/scaffold channels

### First concrete slice

Introduce a thin adapter that:

1. accepts scaffold-style client/auth inputs
2. resolves them into the internal Thoughtbox gateway runtime configuration
3. stops exposing query-string auth as part of the primary public surface

## Workstream 5: Add client compatibility shaping

### Why

The Dedalus scaffold includes client-specific schema compatibility transforms. Thoughtbox currently exposes one fixed surface.

### Keep

- the semantic gateway behavior

### Replace or port in

- schema shaping and tool-name handling with the scaffold compatibility layer

### First concrete slice

Wrap Thoughtbox endpoint definitions with:

- client presets
- capability overrides
- schema transforms
- name-length adjustments where required

## Workstream 6: Narrow the acceptance tests to the real target

### What to keep

- the existing local smoke test
- the fixture upstream

### What to add

1. scaffold-hosted local smoke test
2. Dedalus marketplace deployment smoke test
3. auth/header behavior test
4. client compatibility-shaping test
5. execution-isolation regression test

### Real acceptance condition

Thoughtbox is only aligned when:

1. it is hosted through the Dedalus-compatible runtime boundary
2. a client can connect to it through the marketplace path
3. Thoughtbox exposes the intended gateway/code-mode surface through that boundary
4. proxied upstream tool calls work there

## Ordered Migration Steps

1. Create the new marketplace-facing runtime module without deleting the current standalone runtime.
2. Repackage the Thoughtbox tool pair as scaffold-compatible endpoints.
3. Port in scaffold auth/header parsing and compatibility shaping.
4. Rehost execute on the worker isolation boundary.
5. Run the existing smoke test through the new runtime.
6. Add the marketplace deployment smoke test.
7. Only then de-emphasize or remove the old standalone runtime path.

## File-by-File Disposition

| File | Disposition | Reason |
|------|-------------|--------|
| `src/gateway/registry.ts` | Keep | Core upstream discovery and proxy-call logic |
| `src/gateway/types.ts` | Keep | Useful gateway contracts |
| `src/gateway/manifest.ts` | Adapt | Useful parser, wrong as the public deployment contract |
| `src/code-mode/search-tool.ts` | Adapt | Tool idea is useful; packaging and naming need scaffold alignment |
| `src/code-mode/execute-tool.ts` | Replace | Wrong execution boundary |
| `src/code-mode/sdk-types.ts` | Adapt | Useful as helper surface documentation, but likely needs scaffold-oriented wording |
| `src/server-factory.ts` | Replace as primary runtime shell | Too monolithic and owns the wrong boundary |
| `src/index.ts` | Replace as primary marketplace entrypoint | Owns auth/session/transport directly |
| `cloud-run-service.yaml` | Historical | Not the primary target environment |

## Bottom Line

The immediate job is not “add more gateway features.”

The immediate job is:

1. preserve the gateway core
2. rebuild the outer runtime boundary around the Dedalus scaffold contract
3. stop treating the current standalone runtime as the finish line
