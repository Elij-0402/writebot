import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/projects/[projectId]/workflow/route";

describe("draft and revision workflow route", () => {
  it("supports revision and repair actions", async () => {
    const revisionResponse = await POST(
      new Request("http://localhost/api/projects/project_demo/workflow", {
        method: "POST",
        body: JSON.stringify({
          mode: "write",
          action: "revision_chapter",
          chapterId: "chapter-12",
          providerProfileName: "openai-compatible-local",
        }),
      }) as never,
      { params: Promise.resolve({ projectId: "project_demo" }) } as never,
    );
    const repairResponse = await POST(
      new Request("http://localhost/api/projects/project_demo/workflow", {
        method: "POST",
        body: JSON.stringify({
          mode: "write",
          action: "repair_chapter",
          chapterId: "chapter-12",
          providerProfileName: "openai-compatible-local",
        }),
      }) as never,
      { params: Promise.resolve({ projectId: "project_demo" }) } as never,
    );

    const revisionPayload = await revisionResponse.json();
    const repairPayload = await repairResponse.json();

    expect(revisionPayload.result.provenance.workflowKind).toBe("revision");
    expect(repairPayload.result.provenance.workflowKind).toBe("repair");
  });
});
