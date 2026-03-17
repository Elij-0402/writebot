import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/projects/[projectId]/workflow/route";

describe("POST /api/projects/:projectId/workflow", () => {
  it("returns draft workflow result with provenance", async () => {
    const request = new Request("http://localhost/api/projects/project_demo/workflow", {
      method: "POST",
      body: JSON.stringify({
        mode: "write",
        action: "draft_chapter",
        chapterId: "chapter-12",
        providerProfileName: "openai-compatible-local",
      }),
    });

    const response = await POST(
      request as never,
      { params: Promise.resolve({ projectId: "project_demo" }) } as never,
    );

    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.result.status).toBe("ok");
    expect(payload.result.provenance.providerProfile).toBe("openai-compatible-local");
  });

  it("returns structured provider failures", async () => {
    const request = new Request("http://localhost/api/projects/project_demo/workflow", {
      method: "POST",
      body: JSON.stringify({
        mode: "write",
        action: "draft_chapter",
        chapterId: "chapter-12",
        providerProfileName: "openai-compatible-local",
        failureMode: "malformed_json",
      }),
    });

    const response = await POST(
      request as never,
      { params: Promise.resolve({ projectId: "project_demo" }) } as never,
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.result.status).toBe("error");
    expect(payload.result.error.type).toBe("malformed_json");
  });
});
