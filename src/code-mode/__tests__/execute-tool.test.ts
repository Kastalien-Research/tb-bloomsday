import { describe, it, expect } from "vitest";
import { ExecuteTool } from "../execute-tool.js";
import type { GatewayRuntime } from "../../gateway/types.js";

function createExecuteTool(): ExecuteTool {
  const gateway: GatewayRuntime = {
    async getCatalog() {
      return {
        upstreams: [
          {
            id: "demo",
            name: "Demo Upstream",
            url: "http://127.0.0.1:4100/mcp",
            enabled: true,
            status: "available",
            toolCount: 2,
          },
        ],
        tools: [
          {
            upstreamId: "demo",
            upstreamName: "Demo Upstream",
            name: "ping",
            description: "Return a pong message",
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

  return new ExecuteTool({ gateway });
}

describe("thoughtbox_execute", () => {
  it("runs simple code and returns result", async () => {
    const tool = createExecuteTool();
    const result = await tool.handle({ code: `async () => 42` });
    const output = JSON.parse(result.content[0].text);
    expect(output.result).toBe(42);
    expect(output.error).toBeUndefined();
  });

  it("returns durationMs in envelope", async () => {
    const tool = createExecuteTool();
    const result = await tool.handle({ code: `async () => "hello"` });
    const output = JSON.parse(result.content[0].text);
    expect(output.durationMs).toBeTypeOf("number");
    expect(output.result).toBe("hello");
  });

  it("captures console.log output", async () => {
    const tool = createExecuteTool();
    const result = await tool.handle({
      code: `async () => { console.log("debug info"); return "ok"; }`,
    });
    const output = JSON.parse(result.content[0].text);
    expect(output.logs).toContain("debug info");
    expect(output.result).toBe("ok");
  });

  it("returns error for thrown exceptions", async () => {
    const tool = createExecuteTool();
    const result = await tool.handle({
      code: `async () => { throw new Error("boom"); }`,
    });
    const output = JSON.parse(result.content[0].text);
    expect(output.error).toBe("boom");
    expect(output.result).toBeNull();
  });

  it("blocks access to require", async () => {
    const tool = createExecuteTool();
    const result = await tool.handle({
      code: `async () => { return typeof require; }`,
    });
    const output = JSON.parse(result.content[0].text);
    expect(output.result).toBe("undefined");
  });

  it("blocks access to process", async () => {
    const tool = createExecuteTool();
    const result = await tool.handle({
      code: `async () => { return typeof process; }`,
    });
    const output = JSON.parse(result.content[0].text);
    expect(output.result).toBe("undefined");
  });

  it("blocks access to fetch", async () => {
    const tool = createExecuteTool();
    const result = await tool.handle({
      code: `async () => { return typeof fetch; }`,
    });
    const output = JSON.parse(result.content[0].text);
    expect(output.result).toBe("undefined");
  });

  it("blocks dynamic imports", async () => {
    const tool = createExecuteTool();
    const result = await tool.handle({
      code: `async () => await import("node:fs")`,
    });
    const output = JSON.parse(result.content[0].text);
    expect(output.result).toBeNull();
    expect(output.error).toContain("Dynamic import is not available");
  });

  it("blocks constructor-chain escape to host process", async () => {
    const tool = createExecuteTool();
    const result = await tool.handle({
      code: `async () => {
        const Fn = [].constructor.constructor;
        return Fn("return typeof process")();
      }`,
    });
    const output = JSON.parse(result.content[0].text);
    expect(output.result).toBe("undefined");
  });

  it("tb.hub is not available", async () => {
    const tool = createExecuteTool();
    const result = await tool.handle({
      code: `async () => { return typeof tb.hub; }`,
    });
    const output = JSON.parse(result.content[0].text);
    expect(output.result).toBe("undefined");
  });

  it("tb.init is not available", async () => {
    const tool = createExecuteTool();
    const result = await tool.handle({
      code: `async () => { return typeof tb.init; }`,
    });
    const output = JSON.parse(result.content[0].text);
    expect(output.result).toBe("undefined");
  });

  it("legacy internal namespaces are not available", async () => {
    const tool = createExecuteTool();
    const result = await tool.handle({
      code: `async () => { return typeof tb.session; }`,
    });
    const output = JSON.parse(result.content[0].text);
    expect(output.result).toBe("undefined");
  });

  it("can list configured upstreams", async () => {
    const tool = createExecuteTool();
    const result = await tool.handle({
      code: `async () => { return await tb.gateway.listUpstreams(); }`,
    });
    const output = JSON.parse(result.content[0].text);
    expect(output.error).toBeUndefined();
    expect(output.result[0].id).toBe("demo");
  });

  it("can list proxied tools", async () => {
    const tool = createExecuteTool();
    const result = await tool.handle({
      code: `async () => { return await tb.gateway.listTools(); }`,
    });
    const output = JSON.parse(result.content[0].text);
    expect(output.error).toBeUndefined();
    expect(output.result[0].name).toBe("ping");
  });

  it("can call a proxied tool through tb.gateway.call()", async () => {
    const tool = createExecuteTool();
    const result = await tool.handle({
      code: `async () => {
        return await tb.gateway.call({
          upstreamId: "demo",
          toolName: "ping",
          arguments: { name: "Thoughtbox" },
        });
      }`,
    });
    const output = JSON.parse(result.content[0].text);
    expect(output.error).toBeUndefined();
    expect(output.result.content[0].text).toContain("\"toolName\":\"ping\"");
    expect(output.result.content[0].text).toContain("\"name\":\"Thoughtbox\"");
  });

  it("can call a proxied tool through tb.call()", async () => {
    const tool = createExecuteTool();
    const result = await tool.handle({
      code: `async () => {
        return await tb.call({
          upstreamId: "demo",
          toolName: "ping",
          arguments: { name: "alias" },
        });
      }`,
    });
    const output = JSON.parse(result.content[0].text);
    expect(output.error).toBeUndefined();
    expect(output.result.content[0].text).toContain("\"name\":\"alias\"");
  });
});
