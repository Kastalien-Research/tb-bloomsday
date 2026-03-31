#!/usr/bin/env tsx
import crypto from "node:crypto";
import type { Request, Response } from "express";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const HOST = process.env.GATEWAY_FIXTURE_HOST || "127.0.0.1";
const PORT = Number(process.env.GATEWAY_FIXTURE_PORT || "1741");

interface SessionEntry {
  transport: StreamableHTTPServerTransport;
  server: McpServer;
}

function createFixtureServer(sessionId: string): McpServer {
  const server = new McpServer({
    name: "gateway-fixture",
    version: "1.0.0",
  });

  server.registerTool(
    "ping",
    {
      title: "Ping",
      description: "Return a pong greeting from the demo upstream server",
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
            upstream: "gateway-fixture",
            sessionId,
            greeting: `pong:${name ?? "world"}`,
          }),
        },
      ],
    }),
  );

  server.registerTool(
    "fixture_info",
    {
      title: "Fixture Info",
      description: "Describe the demo upstream used for the Thoughtbox smoke test",
      inputSchema: {},
    },
    async () => ({
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            ok: true,
            upstream: "gateway-fixture",
            tools: ["ping", "fixture_info"],
            smokeTest: "Use Thoughtbox to discover this upstream and call ping.",
          }),
        },
      ],
    }),
  );

  return server;
}

async function main() {
  const app = createMcpExpressApp({ host: HOST });
  const sessions = new Map<string, SessionEntry>();

  app.all("/mcp", async (req: Request, res: Response) => {
    const mcpSessionId = req.headers["mcp-session-id"] as string | undefined;

    try {
      if (mcpSessionId && sessions.has(mcpSessionId)) {
        const entry = sessions.get(mcpSessionId)!;
        await entry.transport.handleRequest(req, res, req.body);

        if (req.method === "DELETE") {
          sessions.delete(mcpSessionId);
          entry.transport.close();
          await entry.server.close();
        }
        return;
      }

      const sessionId = mcpSessionId || crypto.randomUUID();
      const server = createFixtureServer(sessionId);
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => sessionId,
        enableJsonResponse: true,
      });

      sessions.set(sessionId, { server, transport });
      transport.onclose = () => {
        sessions.delete(transport.sessionId || sessionId);
      };

      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);

      if (req.method === "DELETE") {
        sessions.delete(sessionId);
        transport.close();
        await server.close();
      }
    } catch (error) {
      console.error("[gateway-fixture] MCP error:", error);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: { code: -32603, message: "Internal server error" },
          id: null,
        });
      }
    }
  });

  app.get("/health", (_req: Request, res: Response) => {
    res.json({
      status: "ok",
      server: "gateway-fixture",
      transport: "streamable-http",
      url: `http://${HOST}:${PORT}/mcp`,
    });
  });

  const httpServer = app.listen(PORT, HOST, () => {
    console.error(`[gateway-fixture] listening on http://${HOST}:${PORT}/mcp`);
  });

  const shutdown = async () => {
    await Promise.allSettled(
      [...sessions.values()].flatMap(({ transport, server }) => [transport.close(), server.close()]),
    );
    sessions.clear();
    await new Promise<void>((resolve, reject) => {
      httpServer.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  };

  process.on("SIGINT", () => {
    void shutdown().finally(() => process.exit(0));
  });
  process.on("SIGTERM", () => {
    void shutdown().finally(() => process.exit(0));
  });
}

void main();
