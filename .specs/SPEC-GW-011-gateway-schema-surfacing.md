# SPEC-GW-011: Gateway Schema Surfacing

> Status: Active
> Updated: 2026-03-30

## Summary

Thoughtbox must surface upstream tool schemas and metadata through code mode without forcing the client to speak raw MCP discovery flows directly.

## Problem

For the gateway to be useful, a model needs enough structure to choose the right upstream tool and call it correctly. Raw upstream MCP discovery exists, but the active product surface is code mode. The gateway therefore needs a normalized catalog that carries schema information into:

- `thoughtbox_search`
- `thoughtbox_execute`

## Requirements

### R1: Unified Catalog

The gateway registry must maintain an in-memory catalog of:

- configured upstreams
- discovered tools per upstream
- normalized descriptions
- normalized input schemas where available
- status information for unavailable upstreams

### R2: Search Visibility

`thoughtbox_search` must return gateway-relevant catalog entries so a model can discover:

- which upstream owns a tool
- what the tool is named
- what it does
- what schema it expects

### R3: Execute Visibility

`thoughtbox_execute` must expose enough runtime metadata for an agent to inspect and use the catalog programmatically:

- `tb.gateway.listUpstreams()`
- `tb.gateway.listTools()`
- `tb.gateway.getCatalog()`
- `tb.gateway.refresh()`

### R4: Generic Call Surface

The first execution contract is a generic proxy call API:

```ts
await tb.gateway.call({
  upstream: "example",
  tool: "search_docs",
  arguments: { query: "mcp" }
})
```

Typed wrappers may be added later, but they are not required for schema surfacing to be successful.

## Non-Goals

This spec does not require:

- first-call schema embedding tricks from the older gateway implementation
- resource-template discovery as the primary UX
- progressive disclosure
- prompt or resource proxying in V1

## Acceptance Criteria

1. A configured upstream tool appears in the search catalog with normalized metadata.
2. Execute can list the discovered tool set and refresh it.
3. Execute can proxy a call to a discovered tool using the generic call surface.
4. Upstream schema information is available through the catalog without reviving the old internal Thoughtbox operations system.
