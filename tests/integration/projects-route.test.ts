import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/projects/route";

describe("POST /api/projects", () => {
  it("creates a project", async () => {
    const request = new Request("http://localhost/api/projects", {
      method: "POST",
      body: JSON.stringify({ title: "剑来风云", genre: "玄幻" }),
    });

    const response = await POST(request as never);
    expect(response.status).toBe(201);
  });
});
