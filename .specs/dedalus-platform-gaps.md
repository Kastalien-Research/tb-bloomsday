# Thoughtbox Gateway — Platform Integration Points

Technical reference for implementing the Thoughtbox Gateway as a first-party
Dedalus Marketplace server. Maps where the gateway's requirements intersect
with platform internals that aren't exposed through the current public API
surface.

**What Thoughtbox is**: A Code Mode MCP server on the Dedalus Marketplace that
gives agents horizontal access to every other Marketplace server's tools
through two meta-tools (`thoughtbox_search` and `thoughtbox_execute`). Agents
write JavaScript to discover and call tools without loading per-server schemas
into context.

**Why this document exists**: The gateway is implemented and tested locally
against direct MCP connections. Deploying it on the Marketplace requires
platform-level access to tool schemas and tool execution on sibling servers.
This document maps those integration points and the implementation options for
each.

---

## Current platform surface (verified 2026-04-02)

The public API exposes Marketplace servers through `POST /v1/chat/completions`
with `mcp_servers: [slug]`. The platform handles MCP transport internally.

- The marketplace catalog API (`/api/marketplace`) returns server metadata
  including slugs, descriptions, tool counts, and an `mcp_url` routing ID
- `mcp_url` is an internal deployment identifier; the platform routes through
  it at `mcp.dedaluslabs.ai` to reach server processes
- Tool execution is mediated by the chat completions API — the platform
  connects to the server, the model generates tool calls, and results are
  returned in `mcp_tool_results`

---

## Integration point 1: Tool schema access

### Requirement

The gateway needs to enumerate the tools exposed by sibling Marketplace
servers — their names, descriptions, and input schemas — to populate the
search catalog that agents query through `thoughtbox_search`.

### Current state

The marketplace catalog API provides `tool_count` per server but not the
tool definitions themselves. The `catalog.tools` array is empty for
Marketplace upstreams, which means agents have nothing to search against.

### Implementation options

**Option A — Extend the marketplace catalog API**

Add a `tools` array to each repository entry:

```json
{
  "slug": "windsor/brave-search-mcp",
  "tool_count": 2,
  "tools": [
    {
      "name": "brave_web_search",
      "description": "Performs a web search using the Brave Search API",
      "inputSchema": {
        "type": "object",
        "properties": {
          "query": { "type": "string" },
          "count": { "type": "number" }
        },
        "required": ["query"]
      }
    }
  ]
}
```

The platform already calls `listTools()` on these servers internally. This
surfaces that data in the existing catalog endpoint.

**Option B — Internal MCP client access between Marketplace servers**

If the gateway runs inside the platform, it could connect to sibling servers
via their internal MCP endpoints using `StreamableHTTPClientTransport`. This
is the same mechanism the platform itself uses to reach servers during chat
completions. The gateway would call `listTools()` directly and get full
schemas, annotations, and capabilities.

Auth model for this option: The gateway operator pre-registers the gateway as
an OAuth client through the Dedalus dashboard, obtaining a `client_id`. At
runtime, the gateway authenticates with a composite credential:

- **DEDALUS_API_KEY** — identifies the caller's account and billing context
- **OAuth access token** — scoped to the specific servers the gateway needs,
  obtained via client credentials flow against the Dedalus authorization server

The Dedalus Python MCP SDK already implements the full OAuth discovery flow
(RFC 9728 Protected Resource Metadata → RFC 8414 Authorization Server
Metadata → token exchange). The gateway would need the same flow in
TypeScript, using `StreamableHTTPClientTransport` with the OAuth Bearer token
in transport headers.

The platform's `mcp.dedaluslabs.ai` routing layer would need to:
1. Accept OAuth tokens on the `/{mcp_url}` endpoints
2. Validate token audience matches the target server
3. Forward the authenticated MCP request to the server process

This aligns with the MCP spec's authorization model (OAuth 2.1 with PKCE,
Protected Resource Metadata for server discovery, optional DPoP for proof of
possession). The Python SDK has DPoP support; the TypeScript side would need
it if the auth server requires proof-of-possession tokens.

**Option C — A dedicated tool listing endpoint**

```
GET /v1/mcp/servers/{slug}/tools
Authorization: Bearer {DEDALUS_API_KEY}

→ { "tools": [ { "name": "...", "description": "...", "inputSchema": {...} } ] }
```

A REST endpoint wrapping `listTools()` for a given server. The platform
handles the MCP transport; the caller gets a clean REST response.

---

## Integration point 2: Deterministic tool execution

### Requirement

The gateway needs to call a specific tool on a specific server with exact
arguments and get back the raw structured result — without model inference
in the execution path.

### Current state

Tool execution goes through `POST /v1/chat/completions`, which puts a model
in the loop. This introduces:

- **Non-determinism**: The model interprets a natural language instruction to
  call the tool. It may call the wrong tool, rewrite arguments, or decline.
- **Inference overhead**: Each tool call requires a separate model completion.
  An agent chaining 5 tools burns 5 completions as overhead.
- **Result mediation**: The raw tool output is available in
  `mcp_tool_results`, but the primary response path (`message.content`) is
  the model's interpretation.

Note: the gateway already reads `mcp_tool_results` when present, which
recovers the raw tool output. The non-determinism and cost remain.

### Implementation options

**Option A — Internal MCP client access (same as point 1, option B)**

If the gateway can connect to sibling servers as an MCP client, it calls
`callTool({ name, arguments })` directly — deterministic, no inference cost,
raw structured result.

**Option B — A dedicated tool execution endpoint**

```
POST /v1/mcp/servers/{slug}/tools/{tool_name}/call
Authorization: Bearer {DEDALUS_API_KEY}
Content-Type: application/json

{ "arguments": { "query": "hello", "count": 5 } }

→ {
    "content": [{ "type": "text", "text": "..." }],
    "isError": false,
    "structuredContent": { ... }
  }
```

The platform routes to the server and executes the tool. No model in the
path. This is the highest-leverage single addition for the gateway use case.

---

## Integration point 3: Tool annotations

### Requirement

MCP tool annotations (`readOnlyHint`, `destructiveHint`, `idempotentHint`)
for each tool, so agents can reason about safety before calling.

### Current state

Not available through the catalog API or chat completions response.

### Resolution

Comes with any resolution to point 1 — annotations are part of the
`listTools()` response and would be included in the tool schema data.

---

## What works today

- **Marketplace catalog API**: Returns server metadata for all 100 servers —
  slugs, descriptions, categories, auth types, tool counts. The gateway uses
  this for upstream discovery.
- **`mcp_tool_results`**: The chat completions response includes raw tool
  output. The gateway reads this to bypass the model's summary.
- **Gateway architecture**: Implemented and tested locally against direct MCP
  connections via `GatewayRegistry`. The code-mode tools, worker sandboxing,
  catalog search, and composite runtime routing all work. The Marketplace
  integration is the remaining piece.

---

## Summary

| Integration point | What it enables | Implementation options |
|---|---|---|
| Tool schema access | Populated search catalog | Extend catalog API / internal MCP access / REST endpoint |
| Deterministic tool execution | Reliable, cost-efficient tool calls | Internal MCP access / REST endpoint |
| Tool annotations | Safety reasoning for agents | Included in schema access |
