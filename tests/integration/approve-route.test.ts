import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/projects/[projectId]/approve/route";

describe("POST /api/projects/:projectId/approve", () => {
  it("rejects incomplete approval payload", async () => {
    const request = new Request("http://localhost/api/projects/project_demo/approve", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(
      request as never,
      { params: Promise.resolve({ projectId: "project_demo" }) } as never,
    );

    expect(response.status).toBe(400);
  });
});
