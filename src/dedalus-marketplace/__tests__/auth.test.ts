import { describe, expect, it } from "vitest";
import { parseMarketplaceAuthHeaders } from "../auth.js";

describe("parseMarketplaceAuthHeaders", () => {
  it("parses bearer auth into apiKey", () => {
    expect(
      parseMarketplaceAuthHeaders({
        authorization: "Bearer secret-token",
      }),
    ).toEqual({
      apiKey: "secret-token",
    });
  });

  it("parses marketplace key headers when bearer auth is absent", () => {
    expect(
      parseMarketplaceAuthHeaders({
        "x-dedalus-api-key": "dedalus-key",
        "x-api-key": "provider-key",
      }),
    ).toEqual({
      apiKey: "dedalus-key",
      xAPIKey: "provider-key",
    });
  });

  it("uses the first value when headers are arrays", () => {
    expect(
      parseMarketplaceAuthHeaders({
        "x-dedalus-api-key": ["dedalus-key", "ignored"],
        "x-api-key": ["provider-key", "ignored"],
      }),
    ).toEqual({
      apiKey: "dedalus-key",
      xAPIKey: "provider-key",
    });
  });

  it("rejects unsupported authorization schemes", () => {
    expect(() =>
      parseMarketplaceAuthHeaders({
        authorization: "Basic abc123",
      }),
    ).toThrow(
      'Unsupported authorization scheme. Expected the "Authorization" header to use Bearer.',
    );
  });
});
