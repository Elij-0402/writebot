import { beforeEach, describe, expect, it } from "vitest";
import { POST } from "@/app/api/settings/provider-profiles/route";
import { getLocalStatePath } from "@/lib/state/local-state";

describe("POST /api/settings/provider-profiles", () => {
  beforeEach(async () => {
    await import("node:fs/promises").then(async ({ rm }) => {
      await rm(getLocalStatePath(), { force: true });
    });
  });

  it("saves an OpenAI-compatible provider profile", async () => {
    const request = new Request("http://localhost/api/settings/provider-profiles", {
      method: "POST",
      body: JSON.stringify({
        name: "openai-compatible-local",
        adapter: "openai-compatible",
        protocol: "responses",
        baseUrl: "http://localhost:11434/v1",
        apiKey: "demo-key",
        model: "local-model",
        setAsDefault: true,
      }),
    });

    const response = await POST(request as never);
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.profile.name).toBe("openai-compatible-local");
    expect(payload.profile.protocol).toBe("responses");
    expect(payload.profile.baseUrl).toBe("http://localhost:11434/v1");
    expect(payload.defaultProfileId).toBe(payload.profile.id);
    expect(payload.profile.capabilities.responses).toBe(true);
  });

  it("rejects invalid provider configuration", async () => {
    const request = new Request("http://localhost/api/settings/provider-profiles", {
      method: "POST",
      body: JSON.stringify({
        name: "broken-profile",
        adapter: "openai-compatible",
        protocol: "unsupported",
        baseUrl: "",
        apiKey: "demo-key",
        model: "local-model",
      }),
    });

    const response = await POST(request as never);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toBe("invalid_provider_profile");
    expect(payload.fieldErrors.baseUrl).toBe("Base URL 为必填项");
    expect(payload.fieldErrors.protocol).toBe("Protocol 必须是 chat、completions 或 responses");
  });
});
