import { describe, it, expect } from "vitest";
import { SearchTool } from "../search-tool.js";
import { buildSearchCatalog } from "../search-index.js";

const catalog = buildSearchCatalog({
  upstreams: [
    {
      id: "demo",
      name: "Demo Upstream",
      url: "http://127.0.0.1:4100/mcp",
      enabled: true,
      status: "available",
      toolCount: 2,
    },
    {
      id: "offline",
      name: "Offline Upstream",
      url: "http://127.0.0.1:4101/mcp",
      enabled: true,
      status: "unavailable",
      toolCount: 0,
      error: "connect ECONNREFUSED",
    },
  ],
  tools: [
    {
      upstreamId: "demo",
      upstreamName: "Demo Upstream",
      name: "ping",
      title: "Ping",
      description: "Return a pong message",
      inputSchema: {
        type: "object",
        properties: {
          name: { type: "string" },
        },
      },
      annotations: {
        readOnlyHint: true,
      },
    },
    {
      upstreamId: "demo",
      upstreamName: "Demo Upstream",
      name: "echo",
      title: "Echo",
      description: "Echo structured input back to the caller",
      inputSchema: {
        type: "object",
        properties: {
          payload: { type: "string" },
        },
        required: ["payload"],
      },
    },
  ],
});
const tool = new SearchTool(catalog);

describe("thoughtbox_search", () => {
  it("lists configured gateway upstreams", async () => {
    const result = await tool.handle({
      code: "async () => catalog.upstreams.map((upstream) => upstream.id).sort()",
    });
    const output = JSON.parse(result.content[0].text);
    expect(output.error).toBeUndefined();
    expect(output.result).toEqual(["demo", "offline"]);
  });

  it("filters tools by upstream", async () => {
    const result = await tool.handle({
      code: `async () => catalog.tools.filter((tool) => tool.upstreamId === "demo").map((tool) => tool.name).sort()`,
    });
    const output = JSON.parse(result.content[0].text);
    expect(output.result).toEqual(["echo", "ping"]);
  });

  it("searches tool descriptions by keyword", async () => {
    const result = await tool.handle({
      code: `async () => catalog.tools.filter((tool) => (tool.description ?? "").toLowerCase().includes("pong")).map((tool) => tool.name)`,
    });
    const output = JSON.parse(result.content[0].text);
    expect(output.result).toEqual(["ping"]);
  });

  it("returns unavailable upstreams with their error state", async () => {
    const result = await tool.handle({
      code: `async () => catalog.upstreams.filter((upstream) => upstream.status !== "available")`,
    });
    const output = JSON.parse(result.content[0].text);
    expect(output.result).toHaveLength(1);
    expect(output.result[0].error).toContain("ECONNREFUSED");
  });

  it("returns durationMs in response envelope", async () => {
    const result = await tool.handle({
      code: `async () => 42`,
    });
    const output = JSON.parse(result.content[0].text);
    expect(output.durationMs).toBeTypeOf("number");
    expect(output.durationMs).toBeGreaterThanOrEqual(0);
  });

  it("captures console.log in logs", async () => {
    const result = await tool.handle({
      code: `async () => { console.log("hello"); return "done"; }`,
    });
    const output = JSON.parse(result.content[0].text);
    expect(output.logs).toContain("hello");
    expect(output.result).toBe("done");
  });

  it("blocks access to process", async () => {
    const result = await tool.handle({
      code: `async () => typeof process`,
    });
    const output = JSON.parse(result.content[0].text);
    expect(output.result).toBe("undefined");
  });

  it("returns truncated output instead of throwing on oversized results", async () => {
    const result = await tool.handle({
      code: `async () => ({ payload: "x".repeat(30000) })`,
    });
    const output = JSON.parse(result.content[0].text);
    expect(output.error).toBeUndefined();
    expect(output.truncated).toBe(true);
    expect(typeof output.result).toBe("string");
    expect(output.result).toContain("[truncated]");
  });

  it("returns error for invalid code", async () => {
    const result = await tool.handle({
      code: `async () => { throw new Error("search failed"); }`,
    });
    const output = JSON.parse(result.content[0].text);
    expect(output.error).toBe("search failed");
    expect(output.result).toBeNull();
  });

  it("catalog top-level is frozen (writes silently fail)", async () => {
    const result = await tool.handle({
      code: `async () => { catalog.newProp = "bad"; return catalog.newProp; }`,
    });
    const output = JSON.parse(result.content[0].text);
    expect(output.result).toBeNull();
  });
});
