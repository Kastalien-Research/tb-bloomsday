import { randomUUID } from "node:crypto";
import { afterEach, describe, expect, it } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";
import { GatewayRegistry } from "../registry.js";
import type { GatewayManifest } from "../types.js";

const silentLogger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
};

function createFixtureMcpServer(): McpServer {
  const server = new McpServer({
    name: "gateway-fixture",
    version: "1.0.0",
  });

  server.registerTool(
    "ping",
    {
      title: "Ping",
      description: "Return a pong greeting",
      inputSchema: {
        name: z.string().optional(),
      },
    },
    async ({ name }) => ({
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            ok: true,
            greeting: `pong:${name ?? "world"}`,
          }),
        },
      ],
    }),
  );

  return server;
}

async function startFixtureEndpoint(): Promise<{ url: string; fetch: typeof fetch; close: () => Promise<void> }> {
  const server = createFixtureMcpServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
    enableJsonResponse: true,
  });
  await server.connect(transport);

  const url = "http://fixture.test/mcp";
  const fetchImpl: typeof fetch = async (input, init) => {
    const request = input instanceof Request
      ? input
      : new Request(typeof input === "string" || input instanceof URL ? input.toString() : input.url, init);

    return transport.handleRequest(request);
  };

  return {
    url,
    fetch: fetchImpl,
    close: async () => {
      await Promise.allSettled([
        transport.close(),
        server.close(),
      ]);
    },
  };
}

const cleanup: Array<() => Promise<void>> = [];

afterEach(async () => {
  await Promise.allSettled(cleanup.splice(0).map((fn) => fn()));
});

describe("GatewayRegistry", () => {
  it("discovers tools from hosted HTTP upstreams and can proxy tool calls", async () => {
    const fixture = await startFixtureEndpoint();
    cleanup.push(fixture.close);

    const manifest: GatewayManifest = {
      version: 1,
      upstreams: [
        {
          id: "fixture",
          name: "Fixture Upstream",
          url: fixture.url,
        },
      ],
    };

    const registry = new GatewayRegistry(manifest, silentLogger, { fetch: fixture.fetch });
    cleanup.push(() => registry.close());

    await registry.refresh();

    const upstreams = await registry.listUpstreams();
    expect(upstreams).toHaveLength(1);
    expect(upstreams[0].status).toBe("available");
    expect(upstreams[0].toolCount).toBe(1);

    const tools = await registry.listTools();
    expect(tools).toHaveLength(1);
    expect(tools[0].name).toBe("ping");
    expect(tools[0].upstreamId).toBe("fixture");

    const result = await registry.callTool({
      upstreamId: "fixture",
      toolName: "ping",
      arguments: { name: "gateway" },
    });
    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toContain("pong:gateway");
  });
});
