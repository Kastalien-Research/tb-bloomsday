# Spec: Thoughtbox Gateway — Python Implementation

**Status**: Implementation-ready  
**Date**: 2026-04-01  
**Purpose**: Deploy a working gateway to the Dedalus Marketplace using their Python SDK.
The TypeScript version has been blocked by an opaque build system for 7 attempts with zero
error output. This spec replaces it for the deployment test.

---

## What This Is

A minimal MCP server with two tools:

- `thoughtbox_search` — query the Dedalus Marketplace tool catalog with a JavaScript expression
- `thoughtbox_execute` — call a Marketplace tool by upstream ID and tool name

That's it. No Hub. No Observatory. No knowledge graph. No SQLite. This is purely a proof
that the gateway pattern works end-to-end on the Dedalus platform.

---

## Done Looks Like

1. Server is deployed and live on the Dedalus Marketplace
2. An agent can call `thoughtbox_search` and get back a list of available Marketplace tools
3. An agent can call `thoughtbox_execute` and get back a real tool result from a Marketplace server

---

## Stack

- **Language**: Python 3.11+
- **MCP framework**: `mcp` (the official Python MCP SDK)
- **HTTP client**: `httpx` (async)
- **No database. No native addons. No build step.**

---

## Files

```
thoughtbox-gateway/
  server.py          # entry point — everything lives here for now
  requirements.txt   # pinned deps
  manifest.json      # Dedalus DXT manifest
```

---

## `requirements.txt`

```
mcp>=1.0.0
httpx>=0.27.0
```

---

## `manifest.json`

```json
{
  "dxt_version": "0.2",
  "name": "thoughtbox",
  "version": "1.0.0",
  "description": "Code-mode-first MCP gateway for discovering and calling Dedalus Marketplace tools",
  "author": {
    "name": "Kastalien Research"
  },
  "server": {
    "type": "python",
    "entry_point": "server.py",
    "mcp_config": {
      "command": "python",
      "args": ["server.py"],
      "env": {
        "DEDALUS_API_KEY": "${user_config.DEDALUS_API_KEY}"
      }
    }
  },
  "user_config": {
    "DEDALUS_API_KEY": {
      "title": "Dedalus API Key",
      "description": "Used to call Marketplace tools via thoughtbox_execute.",
      "required": false,
      "type": "string"
    }
  },
  "tools": [
    {
      "name": "thoughtbox_search",
      "description": "Search the live Dedalus Marketplace tool catalog"
    },
    {
      "name": "thoughtbox_execute",
      "description": "Call a proxied Marketplace tool by upstream ID and tool name"
    }
  ],
  "compatibility": {
    "runtimes": {
      "python": ">=3.11"
    }
  }
}
```

---

## `server.py` — Full Implementation

### Imports and constants

```python
import os
import json
import asyncio
import httpx
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent, CallToolResult

MARKETPLACE_URL = "https://www.dedaluslabs.ai/api/marketplace"
DEDALUS_API_URL = "https://api.dedaluslabs.ai/v1/chat/completions"
TOOL_EXEC_MODEL  = "anthropic/claude-haiku-4-5-20251001"
```

### Catalog fetch

```python
async def fetch_open_servers() -> list[dict]:
    """Fetch no-auth Marketplace servers."""
    async with httpx.AsyncClient() as client:
        resp = await client.get(MARKETPLACE_URL)
        resp.raise_for_status()
        data = resp.json()
    return [
        r for r in data.get("repositories", [])
        if r.get("tags", {}).get("auth", {}).get("none") is True
    ]
```

### Tool implementations

**`thoughtbox_search`**

Input: `{ "query": string }`

```python
async def handle_search(query: str) -> str:
    servers = await fetch_open_servers()
    results = []
    q = query.lower()
    for s in servers:
        name = s.get("title") or s.get("slug", "")
        desc = s.get("description") or s.get("subtitle") or ""
        if q in name.lower() or q in desc.lower() or not q:
            results.append({
                "upstreamId": f"dedalus:{s['slug']}",
                "name": name,
                "description": desc,
                "toolCount": s.get("tool_count", 0),
            })
    return json.dumps(results, indent=2)
```

**`thoughtbox_execute`**

Input: `{ "upstream_id": string, "tool_name": string, "arguments": object (optional) }`

```python
async def handle_execute(
    upstream_id: str,
    tool_name: str,
    arguments: dict | None,
    api_key: str,
) -> str:
    slug = upstream_id.removeprefix("dedalus:")
    args_str = json.dumps(arguments) if arguments else "no arguments"
    prompt = (
        f'Call the tool "{tool_name}" with arguments: {args_str}. '
        f"Return only the tool result."
    )
    body = {
        "model": TOOL_EXEC_MODEL,
        "mcp_servers": [slug],
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 4096,
    }
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            DEDALUS_API_URL,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {api_key}",
            },
            json=body,
            timeout=60.0,
        )
        resp.raise_for_status()
    text = resp.json()["choices"][0]["message"].get("content", "")
    return text
```

### Server wiring

```python
app = Server("thoughtbox")

@app.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="thoughtbox_search",
            description=(
                "Search the live Dedalus Marketplace tool catalog. "
                "Pass a query string to filter by name or description. "
                "Returns a list of available upstream servers and their tool counts."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "Search term. Empty string returns all available servers.",
                    }
                },
                "required": ["query"],
            },
        ),
        Tool(
            name="thoughtbox_execute",
            description=(
                "Call a Marketplace tool by upstream ID and tool name. "
                "Use thoughtbox_search first to find the upstreamId. "
                "Routes through Dedalus chat completions with mcp_servers."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "upstream_id": {
                        "type": "string",
                        "description": "Upstream ID from thoughtbox_search, e.g. 'dedalus:some-slug'",
                    },
                    "tool_name": {
                        "type": "string",
                        "description": "Name of the tool to call on the upstream server.",
                    },
                    "arguments": {
                        "type": "object",
                        "description": "Arguments to pass to the tool.",
                    },
                },
                "required": ["upstream_id", "tool_name"],
            },
        ),
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    api_key = os.environ.get("DEDALUS_API_KEY", "")

    if name == "thoughtbox_search":
        result = await handle_search(arguments.get("query", ""))
        return [TextContent(type="text", text=result)]

    if name == "thoughtbox_execute":
        if not api_key:
            return [TextContent(type="text", text="Error: DEDALUS_API_KEY not set")]
        result = await handle_execute(
            upstream_id=arguments["upstream_id"],
            tool_name=arguments["tool_name"],
            arguments=arguments.get("arguments"),
            api_key=api_key,
        )
        return [TextContent(type="text", text=result)]

    return [TextContent(type="text", text=f"Unknown tool: {name}")]


async def main():
    async with stdio_server() as (read_stream, write_stream):
        await app.run(read_stream, write_stream, app.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())
```

---

## What Is Not In This Spec

- Worker thread isolation for code execution
- Gateway manifest file loading
- CompositeGatewayRuntime / GatewayRegistry
- Hub, Observatory, knowledge graph, evaluation
- Supabase, filesystem storage
- Authentication beyond API key passthrough

All of that comes later, after this proves the basic pattern works on the platform.

---

## Open Questions This Deployment Will Answer

1. Does a Python MCP server with this structure actually deploy and run on the Marketplace?
2. Are Marketplace slugs the correct `mcp_servers` values for the Dedalus chat completions API?
3. How does the caller's API key arrive at runtime — from the env config or injected per-request?
4. Does `thoughtbox_execute` actually return a tool result, or does the LLM mediation layer mangle it?
