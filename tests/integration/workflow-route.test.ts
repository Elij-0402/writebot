import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/projects/[projectId]/workflow/route";

describe("POST /api/projects/:projectId/workflow", () => {
  it("returns workflow result", async () => {
    const request = new Request("http://localhost/api/projects/project_demo/workflow", {
      method: "POST",
      body: JSON.stringify({ mode: "write", action: "draft_chapter" }),
    });

    const response = await POST(
      request as never,
      { params: Promise.resolve({ projectId: "project_demo" }) } as never,
    );

    expect(response.status).toBe(200);
  });
});
