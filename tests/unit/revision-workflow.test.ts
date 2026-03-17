import { describe, expect, it } from "vitest";
import { runRevisionWorkflow } from "@/lib/workflows/revision-workflow";

describe("runRevisionWorkflow", () => {
  it("creates a revision proposal with reviewable provenance", async () => {
    const result = await runRevisionWorkflow({
      projectId: "project_1",
      chapterId: "chapter-12",
    });

    expect(result.status).toBe("ok");
    expect(result.review.status).toBe("review_ready");
    expect((result.proposals[0].payload as { provenance: { workflowKind: string } }).provenance.workflowKind).toBe(
      "revision",
    );
  });
});
