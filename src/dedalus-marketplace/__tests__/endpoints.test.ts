import { describe, expect, it } from "vitest";
import { createThoughtboxMarketplaceEndpoints } from "../endpoints.js";
import type { GatewayRuntime } from "../../gateway/types.js";

function createGateway(): GatewayRuntime {
  return {
    async getCatalog() {
      return {
        upstreams: [
          {
            id: "fixture",
            name: "Fixture Upstream",
            url: "http://127.0.0.1:1741/mcp",
            enabled: true,
            status: "available",
            toolCount: 1,
          },
        ],
        tools: [
          {
            upstreamId: "fixture",
            upstreamName: "Fixture Upstream",
            name: "ping",
            description: "Return pong",
            inputSchema: {
              type: "object",
              properties: {
                name: { type: "string" },
              },
            },
          },
        ],
      };
    },
    async listUpstreams() {
      return (await this.getCatalog()).upstreams;
    },
    async listTools(args) {
      const tools = (await this.getCatalog()).tools;
      if (args?.upstreamId) {
        return tools.filter((tool) => tool.upstreamId === args.upstreamId);
      }
      return tools;
    },
    async refresh() {
      return;
    },
    async close() {
      return;
    },
    async callTool(args) {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({
              upstreamId: args.upstreamId,
              toolName: args.toolName,
              arguments: args.arguments ?? {},
            }),
          },
        ],
      };
    },
  };
}

describe("createThoughtboxMarketplaceEndpoints", () => {
  it("returns scaffold-style endpoint definitions for the Thoughtbox tool pair", () => {
    const endpoints = createThoughtboxMarketplaceEndpoints({
      gateway: createGateway(),
    });

    expect(endpoints).toHaveLength(2);
    expect(endpoints.map((endpoint) => endpoint.tool.name)).toEqual([
      "thoughtbox_search",
      "thoughtbox_execute",
    ]);
    expect(endpoints.map((endpoint) => endpoint.metadata)).toEqual([
      {
        resource: "gateway.catalog",
        operation: "read",
        tags: ["gateway", "code-mode", "search"],
      },
      {
        resource: "gateway.execute",
        operation: "write",
        tags: ["gateway", "code-mode", "execute"],
      },
    ]);
  });

  it("delegates the search endpoint to the existing search tool", async () => {
    const [search] = createThoughtboxMarketplaceEndpoints({
      gateway: createGateway(),
    });

    const result = await search.handler({
      code: `async () => catalog.tools.map((tool) => tool.name)`,
    });
    const output = JSON.parse(result.content[0].text);

    expect(output.result).toEqual(["ping"]);
    expect(output.error).toBeUndefined();
  });

  it("delegates the execute endpoint to the existing execute tool", async () => {
    const [, execute] = createThoughtboxMarketplaceEndpoints({
      gateway: createGateway(),
    });

    const result = await execute.handler({
      code: `async () => {
        return await tb.gateway.call({
          upstreamId: "fixture",
          toolName: "ping",
          arguments: { name: "Claude Code" },
        });
      }`,
    });
    const output = JSON.parse(result.content[0].text);

    expect(output.result.content[0].text).toContain("\"toolName\":\"ping\"");
    expect(output.result.content[0].text).toContain("\"name\":\"Claude Code\"");
  });
});
