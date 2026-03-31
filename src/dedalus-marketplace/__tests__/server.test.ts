import { describe, expect, it } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createThoughtboxMarketplaceServer } from "../server.js";
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

describe("createThoughtboxMarketplaceServer", () => {
  it("initializes the marketplace-facing two-tool server surface", async () => {
    const server = await createThoughtboxMarketplaceServer({
      gateway: createGateway(),
    });
    const client = new Client(
      { name: "marketplace-server-test", version: "1.0.0" },
      { capabilities: {} },
    );
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    try {
      await server.connect(serverTransport);
      await client.connect(clientTransport);

      const { tools } = await client.listTools();
      expect(tools.map((tool) => tool.name).sort()).toEqual([
        "thoughtbox_execute",
        "thoughtbox_search",
      ]);

      const response = await client.callTool({
        name: "thoughtbox_execute",
        arguments: {
          code: `async () => await tb.gateway.listUpstreams()`,
        },
      });
      const output = JSON.parse(response.content[0].text);

      expect(output.error).toBeUndefined();
      expect(output.result[0].id).toBe("fixture");
    } finally {
      await Promise.allSettled([client.close(), server.close()]);
    }
  });
});
