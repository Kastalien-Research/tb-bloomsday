# Dedalus Marketplace Session Handoff

Date: 2026-03-31

## Why This Integration Exists

The purpose of this integration is not just to make Thoughtbox run on Dedalus.

The product goal, as established in `transcript.md`, is to use Thoughtbox as a thin code-mode gateway so an agent can access Dedalus Marketplace capabilities behind a small MCP surface, instead of loading large stacked server schemas into context. The intended value is:

- one central gateway instead of exposing many heavyweight vertical servers
- tool-level composition behind code execution
- large upfront token savings from not injecting full Marketplace tool schemas into the prompt
- a substrate for building many small products from combinations of Marketplace capabilities

## Retrieved Facts

These claims are supported by files or docs retrieved during the session.

- Dedalus documents that agents built with their SDK can connect to any MCP server on their Marketplace. See `dedalus-refs/llms-full.txt`.
- Dedalus documents that `mcp_servers` can be passed directly to SDK/runner calls, and says the SDK handles connection, tool discovery, and execution for the servers passed in. See `dedalus-refs/llms-full.txt`.
- The TypeScript client accepts `mcp_servers` as URLs, repository slugs, or server IDs. See `dedalus-refs/dedalus-sdk-typescript-client/src/resources/chat/completions.ts`.
- The Dedalus TypeScript MCP server is a code-mode server with a fixed outer tool surface. It returns only code-mode tools and performs real capability access behind execution, not by flattening Marketplace tools into top-level MCP tools. See `dedalus-refs/dedalus-typescript/packages/mcp-server/src/server.ts` and `dedalus-refs/dedalus-typescript/packages/mcp-server/src/code-tool.ts`.
- Dedalus Marketplace/runner authentication is documented as DAuth-backed. See `dedalus-refs/llms-full.txt`.
- OAuth connections are scoped to API key, not organization. See `dedalus-refs/llms-full.txt`.
- The `dedalus-cli` source bundled in `dedalus-refs/dedalus-cli` exposes workspace-oriented commands and does not show commands for listing API keys, OAuth connections, or Marketplace server inventory. See `dedalus-refs/dedalus-cli/pkg/cmd/cmd.go` and `dedalus-refs/dedalus-cli/README.md`.

## What Was Implemented

The repo was partially reworked toward the Dedalus/Stainless code-mode pattern.

- Added a scaffold-style outer MCP runtime:
  - `src/dedalus-marketplace/server.ts`
  - `src/dedalus-marketplace/http.ts`
- Reworked `src/index.ts` so the server bootstrap is thinner and marketplace-facing.
- Replaced `node:vm` execution with worker-based isolation:
  - `src/code-mode/execute-tool.ts`
  - `src/code-mode/execute-worker.ts`
- Added or updated targeted tests around the new runtime and worker path:
  - `src/dedalus-marketplace/__tests__/server.test.ts`
  - `src/code-mode/__tests__/execute-tool.test.ts`
  - existing marketplace endpoint tests

## What Was Verified

- The local two-tool server shape works.
- The worker-based `thoughtbox_execute` path works locally.
- The local fixture smoke test works against a manually configured upstream fixture.
- Type checks passed.
- Local build passed.

This means the outer shell and execution boundary are in materially better shape than before the session.

## What Is Not Proven

The critical unresolved question remains unresolved.

- We do not currently have a retrieved, documented source for "the Marketplace server list available to this caller".
- We do not currently have a retrieved SDK method, CLI command, or documented API endpoint in the bundled refs that returns:
  - all Marketplace servers
  - all Marketplace servers available to the current API key
  - all Marketplace servers already authenticated for the current caller
- We therefore have not yet proven how Thoughtbox should obtain the `mcp_servers=[...]` set needed for the real product path.

## Correct Current Conclusion

The product direction is supported.

Based on the docs, it is possible in principle to build a thin code-mode MCP server whose `execute` path delegates to Dedalus and reaches Marketplace capabilities behind execution.

What is still unknown is the bootstrap/discovery source for the relevant Marketplace server identifiers. That is not a minor detail. It is the main blocker.

## Mistake Made During This Session

Implementation work proceeded further than the evidence justified.

The session improved the outer runtime and execution boundary, but it did not resolve the central discovery problem early enough. Architectural plausibility was sometimes treated as if it were proof of the missing dependency. That was incorrect.

## Recommended Next Step

Do not continue architectural refactoring until the server-list source is resolved.

The next session should work only on this question:

> From where does Thoughtbox obtain the Marketplace server identifiers that should be passed into Dedalus execution?

Acceptable outcomes for that investigation:

- documented source found
- source exists in code but not docs
- not present in bundled refs, meaning external confirmation is required
