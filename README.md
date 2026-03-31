# Thoughtbox

Thoughtbox is converging on a Dedalus-marketplace-compatible MCP gateway.

The codebase currently contains a working standalone gateway runtime. That runtime is useful because it proves the gateway core works, but it is not the final contract.

The actual target is:

- Dedalus marketplace deployment
- Dedalus MCP scaffold/runtime compatibility
- Thoughtbox gateway logic rehosted onto that scaffold

The current runtime connects to upstream hosted HTTP MCP servers, discovers their tools, and exposes a stable two-tool surface to clients:

- `thoughtbox_search` for querying the live upstream/tool catalog with JavaScript
- `thoughtbox_execute` for listing upstreams and calling proxied tools through the `tb` SDK

This fork is no longer positioned as a general multi-agent reasoning platform. The active product surface is the gateway, and the acceptance boundary is the Dedalus marketplace contract.

## Status

There are two truths that both matter:

1. The current standalone gateway path works.
2. It is not yet the final marketplace-native runtime shape.

What is proven today:

- Thoughtbox can discover upstream MCP tools
- `thoughtbox_search` can query the live tool catalog
- `thoughtbox_execute` can proxy a real upstream tool call

What still has to change:

- outer runtime and transport ownership
- auth/header contract
- client compatibility shaping
- code execution isolation
- deployment/config contract

Read these next:

- `docs/architecture/dedalus-marketplace-compatibility-audit.md`
- `docs/architecture/dedalus-runtime-rehost-plan.md`

## Current Standalone Scope

V1 is intentionally narrow:

- Hosted HTTP MCP upstreams only
- Tools only
- Static local manifest
- Generic proxy-call API first

Out of scope for the current standalone pass:

- Prompts/resources proxying
- Marketplace-scale concerns
- Dynamic registry mutation
- DAuth or runtime key injection beyond static headers

## Manifest

Thoughtbox loads upstreams from `thoughtbox.gateway.json` by default.

You can override the path with `THOUGHTBOX_GATEWAY_MANIFEST`.

Example:

```json
{
  "version": 1,
  "upstreams": [
    {
      "id": "demo",
      "name": "Demo Server",
      "url": "https://example.com/mcp"
    }
  ]
}
```

Static headers are supported:

```json
{
  "version": 1,
  "upstreams": [
    {
      "id": "internal-api",
      "url": "https://mcp.internal.example/mcp",
      "headers": {
        "x-api-key": "${INTERNAL_MCP_API_KEY}"
      }
    }
  ]
}
```

## Code Mode

Thoughtbox exposes exactly two MCP tools:

- `thoughtbox_search`
- `thoughtbox_execute`

### `thoughtbox_search`

Write JavaScript against:

```ts
interface SearchCatalog {
  upstreams: Array<{
    id: string
    name: string
    url: string
    status: "available" | "unavailable" | "disabled"
    toolCount: number
    error?: string
  }>
  tools: Array<{
    upstreamId: string
    upstreamName: string
    name: string
    title?: string
    description?: string
    inputSchema: object
    annotations?: object
  }>
}
```

Examples:

```js
async () => catalog.upstreams
```

```js
async () => catalog.tools.filter((tool) => tool.upstreamId === "demo")
```

### `thoughtbox_execute`

Write JavaScript using:

```ts
interface TB {
  gateway: {
    listUpstreams(): Promise<unknown>
    listTools(args?: { upstreamId?: string }): Promise<unknown>
    getCatalog(): Promise<unknown>
    refresh(): Promise<unknown>
    call(args: {
      upstreamId: string
      toolName: string
      arguments?: Record<string, unknown>
    }): Promise<unknown>
  }
  call(args: {
    upstreamId: string
    toolName: string
    arguments?: Record<string, unknown>
  }): Promise<unknown>
}
```

Example:

```js
async () => {
  const tools = await tb.gateway.listTools()
  const target = tools.find((tool) => tool.name === "ping")
  if (!target) throw new Error("No ping tool found")

  return await tb.gateway.call({
    upstreamId: target.upstreamId,
    toolName: target.name,
    arguments: { name: "Thoughtbox" }
  })
}
```

## Current Local Runtime

### Local development

```bash
pnpm install
pnpm build
pnpm dev
```

The current standalone MCP server listens on `http://localhost:1731/mcp`.

### Docker

```bash
docker compose up --build
```

## MCP Client Configuration

### Claude Code

Use a project-local `.mcp.json` file or add the same entry to the current project block inside `~/.claude.json`:

```json
{
  "mcpServers": {
    "thoughtbox": {
      "type": "http",
      "url": "http://localhost:1731/mcp"
    }
  }
}
```

## Manual Smoke Test

This is the simplest end-to-end local smoke test for the current standalone gateway runtime using Claude Code itself.

### 1. Start the demo upstream

```bash
pnpm demo:gateway-fixture
```

This serves a tiny hosted HTTP MCP server at `http://127.0.0.1:1741/mcp` with two tools:

- `ping`
- `fixture_info`

### 2. Start Thoughtbox against the demo manifest

In a second terminal:

```bash
PORT=1732 THOUGHTBOX_STORAGE=memory THOUGHTBOX_GATEWAY_MANIFEST=./thoughtbox.gateway.demo.json pnpm dev
```

Thoughtbox will then proxy the fixture upstream through its normal two-tool surface at `http://localhost:1732/mcp`.

`1732` is used here to avoid collisions with anything already bound to the default `1731` port.

### 3. Point Claude Code at Thoughtbox

Use a project-local `.mcp.json` file or add this under the current project in `~/.claude.json`:

```json
{
  "mcpServers": {
    "thoughtbox": {
      "type": "http",
      "url": "http://localhost:1732/mcp"
    }
  }
}
```

Reload Claude Code if needed.

### 4. Run the smoke test in Claude Code

Ask Claude Code to do two things:

1. Use `thoughtbox_search` to inspect the available upstreams and tools
2. Use `thoughtbox_execute` to call the proxied `ping` tool on upstream `fixture` with `{ name: "Claude Code" }`

A minimal execute snippet is:

```js
async () => await tb.gateway.call({
  upstreamId: "fixture",
  toolName: "ping",
  arguments: { name: "Claude Code" }
})
```

### Expected result

The proxied tool call should return text containing:

```json
{
  "ok": true,
  "upstream": "gateway-fixture",
  "greeting": "pong:Claude Code"
}
```

If that works, the current standalone runtime is doing the gateway job:

- loading a static manifest
- discovering upstream tools
- exposing them through `thoughtbox_search`
- proxying a tool call through `thoughtbox_execute`

This is a functional gateway smoke test. It is not the final Dedalus marketplace acceptance test.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `THOUGHTBOX_GATEWAY_MANIFEST` | Path to the gateway manifest file | `./thoughtbox.gateway.json` |
| `PORT` | HTTP server port | `1731` |
| `HOST` | HTTP bind address | `0.0.0.0` |
| `THOUGHTBOX_TRANSPORT` | Transport type | `http` |
| `THOUGHTBOX_DATA_DIR` | Data directory for existing persistence surfaces still present in-tree | `~/.thoughtbox` |

## Current Runtime Architecture

```text
src/
├── index.ts                # HTTP entrypoint
├── server-factory.ts       # MCP server factory and tool registration
├── gateway/
│   ├── manifest.ts         # Static manifest loading and header interpolation
│   ├── registry.ts         # Upstream MCP client registry and proxy calls
│   └── types.ts            # Gateway runtime contracts
├── code-mode/
│   ├── search-tool.ts      # thoughtbox_search
│   ├── execute-tool.ts     # thoughtbox_execute
│   ├── search-index.ts     # Gateway catalog shape
│   └── sdk-types.ts        # tb SDK typings embedded in tool descriptions
```

Large portions of the previous Thoughtbox codebase still remain in-tree, but they are no longer the active product story.

The current runtime above should be treated as the working gateway core. The target runtime is the Dedalus-compatible rehost described in:

- `docs/architecture/dedalus-marketplace-compatibility-audit.md`
- `docs/architecture/dedalus-runtime-rehost-plan.md`
