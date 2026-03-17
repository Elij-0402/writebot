import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/projects/[projectId]/context/route";

describe("GET /api/projects/:projectId/context", () => {
  it("returns a deterministic context package", async () => {
    const response = await GET(new Request("http://localhost/api/projects/project_demo/context") as never, {
      params: Promise.resolve({ projectId: "project_demo" }),
    } as never);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.orderedSources[0]).toEqual({ id: "chapter-12" });
    expect(payload.truncated).toBe(true);
  });
});
