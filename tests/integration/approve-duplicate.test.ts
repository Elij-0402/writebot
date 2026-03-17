import { describe, expect, it } from "vitest";
import { POST as approve } from "@/app/api/projects/[projectId]/approve/route";
import { POST as workflow } from "@/app/api/projects/[projectId]/workflow/route";

describe("duplicate approval submission", () => {
  it("rejects approving the same batch twice", async () => {
    const workflowResponse = await workflow(
      new Request("http://localhost/api/projects/project_demo/workflow", {
        method: "POST",
        body: JSON.stringify({
          mode: "write",
          action: "draft_chapter",
          chapterId: "chapter-12",
          providerProfileName: "openai-compatible-local",
        }),
      }) as never,
      { params: Promise.resolve({ projectId: "project_demo" }) } as never,
    );
    const workflowPayload = await workflowResponse.json();
    const batchId = workflowPayload.result.approvalBatchDraft.id as string;

    const first = await approve(
      new Request("http://localhost/api/projects/project_demo/approve", {
        method: "POST",
        body: JSON.stringify({ actorId: "author_1", reason: "accept", batchId }),
      }) as never,
      { params: Promise.resolve({ projectId: "project_demo" }) } as never,
    );

    const duplicate = await approve(
      new Request("http://localhost/api/projects/project_demo/approve", {
        method: "POST",
        body: JSON.stringify({ actorId: "author_1", reason: "accept again", batchId }),
      }) as never,
      { params: Promise.resolve({ projectId: "project_demo" }) } as never,
    );
    const duplicatePayload = await duplicate.json();

    expect(first.status).toBe(200);
    expect(duplicate.status).toBe(409);
    expect(duplicatePayload.error).toBe("approval batch already resolved");
  });
});
