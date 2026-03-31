# Dedalus Marketplace Compatibility Audit

## Purpose

This document audits Thoughtbox against the Dedalus MCP server scaffold that exists in:

- `dedalus-sdk-typescript-client/packages/mcp-server`
- `dedalus-typescript/packages/mcp-server`

The premise of this audit is strict:

- those packages are the compatibility target
- the acceptance environment is the Dedalus marketplace
- generic standalone deployment is not the primary target

This is a contract-first audit, not a product brainstorm.

## Current Verdict

Thoughtbox has a working gateway core, but it is not yet Dedalus-marketplace-compatible in the strong scaffold sense.

The gateway logic is reusable.

The outer runtime contract is not yet aligned.

## What the Dedalus Scaffold Actually Defines

The Dedalus MCP scaffold is not just a random implementation. It defines a server model with all of the following:

- HTTP and stdio entrypoints via `src/index.ts`, `src/http.ts`, and `src/stdio.ts`
- server mode selection and filtering via `--tools`, `--tool`, `--resource`, `--operation`, and query params
- client compatibility shaping via `--client` and `--capability`
- a docs search tool
- a code execution tool
- optional dynamic tools
- auth header parsing for `Authorization`, `x-api-key`, and `x-dedalus-api-key`
- sandboxed code execution in a Deno worker with restricted network access

These are not incidental details. They are part of the scaffold's runtime contract.

## Gap Summary

| Area | Dedalus scaffold contract | Thoughtbox current behavior | Keep / Adapt / Replace | Severity |
|------|---------------------------|-----------------------------|------------------------|----------|
| Entry runtime | Standard scaffold entrypoint with HTTP/stdio launch paths | Custom `src/index.ts` server entrypoint | Replace outer runtime | High |
| Tool surface modes | Explicit tools, dynamic tools, or code tools | Fixed two-tool gateway surface | Adapt or replace | High |
| Tool naming | Scaffold conventions like `search_docs` and `execute` | `thoughtbox_search` and `thoughtbox_execute` | Adapt | Medium |
| Search semantics | Docs search over the API/SDK knowledge surface | JavaScript query over a live upstream catalog | Adapt | High |
| Execute semantics | Code runs against an initialized SDK client | Code runs against `tb.gateway` proxy helpers | Keep concept, adapt interface | Medium |
| Execution isolation | Deno worker sandbox with restricted network | `node:vm`, explicitly not a true security boundary | Replace | Critical |
| Client compatibility transforms | Built-in per-client schema shaping | None | Replace or port in | High |
| Auth/header contract | `Authorization`, `x-api-key`, `x-dedalus-api-key` parsed into client options | Thoughtbox-specific bearer/query-key to workspace resolution | Replace or front with Dedalus auth layer | High |
| Request lifecycle | Stateless HTTP server pattern in scaffold | In-memory MCP session map | Adapt or replace | High |
| Config model | CLI/query-driven scaffold options plus env-backed client config | Local manifest file loaded from disk | Adapt | High |
| Deployment model | Marketplace-native scaffold/server behavior | Generic standalone server behavior | Adapt | High |

## Detailed Gaps

### 1. Outer runtime is custom, not scaffold-based

The Dedalus scaffold launches through a standard entrypoint and transport split:

- `dedalus-sdk-typescript-client/packages/mcp-server/src/index.ts`
- `dedalus-sdk-typescript-client/packages/mcp-server/src/http.ts`

Thoughtbox currently launches through its own runtime:

- `src/index.ts`
- `src/server-factory.ts`

This means Thoughtbox currently owns:

- session lifecycle
- auth handling
- tool registration
- transport wiring

That is the wrong ownership boundary if the scaffold is the contract.

**Disposition:** Replace the outer server/runtime shell. Rehost the gateway core inside the Dedalus scaffold pattern.

### 2. Code execution boundary is weaker than the target contract

The Dedalus scaffold runs code in a Deno worker with explicitly constrained network access:

- `dedalus-sdk-typescript-client/packages/mcp-server/src/code-tool.ts`
- `dedalus-sdk-typescript-client/packages/mcp-server/src/code-tool-worker.ts`

Thoughtbox currently uses `node:vm`, and the code states:

> `node:vm is still not a true security boundary`

This appears in:

- `src/code-mode/execute-tool.ts`

If the scaffold is the contract, this is a hard incompatibility, not a style preference.

**Disposition:** Replace the Thoughtbox execute runtime with a Dedalus-style worker boundary.

### 3. Search tool semantics diverge from scaffold code mode

The Dedalus scaffold code-mode pair is:

- `search_docs`
- `execute`

Thoughtbox's current pair is:

- `thoughtbox_search`
- `thoughtbox_execute`

The naming difference is not the biggest problem. The semantic difference is:

- Dedalus search tool is documentation search
- Thoughtbox search tool is live catalog query over upstreams/tools

Those are not equivalent abstractions.

**Disposition:** Adapt. Keep the gateway-discovery intent, but express it through a scaffold-compatible first tool. This may mean one of:

- a `search_docs` tool that returns gateway and upstream usage docs
- dynamic tools for upstream/tool discovery
- a scaffold-compatible renamed wrapper over the gateway catalog

### 4. Current config model is local-manifest-centric

Thoughtbox currently loads configuration from a local file:

- `src/gateway/manifest.ts`

This is fine for local development, but it is not obviously how a Dedalus marketplace deployment wants servers configured.

The scaffold instead centers configuration around:

- CLI options
- query parameters
- environment-backed client configuration

The current Thoughtbox config assumptions are:

- deployment-global manifest
- local filesystem access
- env interpolation inside that file

Those may still be useful internally, but they should not be the primary marketplace contract.

**Disposition:** Adapt. Preserve manifest parsing as an internal adapter if useful, but move the public config contract onto marketplace/scaffold configuration channels.

### 5. Auth contract is Thoughtbox-native, not Dedalus-native

The Dedalus scaffold parses:

- `Authorization: Bearer ...`
- `x-api-key`
- `x-dedalus-api-key`

This logic lives in:

- `dedalus-sdk-typescript-client/packages/mcp-server/src/headers.ts`

Thoughtbox currently does:

- static API key match
- local bypass key
- `tbx_*` key resolution against Supabase
- query-string key support

This logic lives in:

- `src/index.ts`
- `src/auth/api-key.ts`

That may be valid for Thoughtbox as an app, but it is not the same auth contract as the Dedalus scaffold.

**Disposition:** Replace the external auth surface with Dedalus-compatible header parsing. Any Thoughtbox-specific tenancy/workspace resolution should sit behind that layer, not instead of it.

### 6. HTTP/session lifecycle differs from the scaffold

The Dedalus scaffold HTTP transport is intentionally simple and stateless per request:

- `dedalus-sdk-typescript-client/packages/mcp-server/src/http.ts`

Thoughtbox currently maintains:

- `Map<string, SessionEntry>`
- session reuse keyed by `mcp-session-id`

in:

- `src/index.ts`

That is a materially different server lifecycle model.

Whether this is allowed in the marketplace depends on the platform, but it is still a divergence from the scaffold contract.

**Disposition:** Adapt or replace. Default assumption should be to converge toward the scaffold's simpler request model unless a marketplace requirement explicitly demands sticky MCP sessions.

### 7. Client capability shaping is missing

The Dedalus scaffold exposes:

- `--client`
- `--capability`
- compatibility transforms for schemas and tool names

This logic exists in:

- `dedalus-sdk-typescript-client/packages/mcp-server/src/options.ts`
- `dedalus-sdk-typescript-client/packages/mcp-server/src/compat.ts`

Thoughtbox currently does none of this.

That means Thoughtbox currently assumes:

- one public schema surface
- no per-client compatibility adaptation

If the marketplace expects the scaffold’s compatibility behavior, this is a real gap.

**Disposition:** Replace or port in the scaffold compatibility layer.

### 8. Registry scope is deployment-global

Thoughtbox creates the gateway registry directly from the default manifest during server creation:

- `src/server-factory.ts`

That means the upstream catalog is effectively deployment-global.

This is likely too rigid for a marketplace-native deployment model, where upstream availability, auth, and policy may need to vary by tenant, org, or marketplace registration context.

**Disposition:** Adapt. Keep the registry core, but stop treating a single local manifest as the authoritative deployment contract.

## Salvage Inventory

### Keep

These components are structurally useful and should survive, though some will need interface changes:

- `src/gateway/registry.ts`
- `src/gateway/types.ts`
- parts of `src/gateway/manifest.ts`
- the upstream fixture in `scripts/demo/gateway-fixture.ts`
- the smoke-test pattern proving discovery and proxy calls

### Adapt

These are conceptually useful but currently shaped wrong for the Dedalus target:

- `src/code-mode/search-tool.ts`
- `src/code-mode/sdk-types.ts`
- the gateway manifest/config model
- the upstream/tool catalog representation
- the current architecture docs and README framing

### Replace

These should not remain the long-term marketplace-facing contract:

- `src/index.ts` as the primary deployed runtime
- `src/server-factory.ts` as the outer contract boundary
- `src/code-mode/execute-tool.ts` execution boundary
- Thoughtbox-native external auth flow in `src/index.ts`
- Cloud Run as the primary acceptance/deployment narrative

## Migration Direction

The right migration is not “delete Thoughtbox and start over.”

The right migration is:

1. Keep the gateway core.
2. Rehost it inside the Dedalus scaffold/runtime contract.
3. Replace the execution sandbox and external auth/config surfaces.
4. Re-test in the actual Dedalus marketplace deployment path.

## Concrete Action List

### Phase 1: Stop targeting the wrong outer contract

- De-emphasize `cloud-run-service.yaml` as the primary deployment target
- Mark generic standalone deployment docs as secondary or historical
- Treat the Dedalus scaffold as the server contract in docs and planning

### Phase 2: Port Thoughtbox onto the Dedalus runtime boundary

- Build a new Thoughtbox marketplace entrypoint on the Dedalus MCP scaffold
- Route scaffold startup, transport, and auth through the Dedalus package model
- Inject the gateway runtime behind the scaffold instead of behind Thoughtbox’s custom `src/index.ts`

### Phase 3: Replace code execution isolation

- Remove `node:vm` as the marketplace execution substrate
- Re-implement Thoughtbox code mode on the scaffold’s worker pattern
- Restrict execution to the necessary gateway capabilities only

### Phase 4: Align config and auth to the marketplace contract

- Replace filesystem-first deployment config as the primary contract
- Map marketplace config into gateway runtime configuration
- Adopt Dedalus-compatible header parsing and client option shaping

### Phase 5: Revalidate against the real target

- Deploy via the Dedalus marketplace path
- connect a real client to the marketplace-hosted Thoughtbox instance
- verify discovery
- verify proxied tool execution
- verify failure modes and auth behavior

## Bottom Line

Thoughtbox is not off-target because the gateway idea was wrong.

It is off-target because the gateway was built as its own server product first, instead of being built as a Dedalus-marketplace-native server implementation.

That means the gateway core is still valuable.

The outer runtime contract is what has to change.
