import { describe, expect, it } from "vitest";
import { runProjectBootstrap } from "@/lib/workflows/project-bootstrap";

describe("runProjectBootstrap", () => {
  it("returns bootstrap proposals, review result and workflow batch draft", async () => {
    const result = await runProjectBootstrap({ projectId: "project_1", prompt: "玄幻升级流" });

    expect(result.proposals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ objectType: "project_card" }),
        expect.objectContaining({ objectType: "world_rule" }),
        expect.objectContaining({ objectType: "plot" }),
      ]),
    );
    expect(result.review.status).toBe("review_ready");
    expect(result.approvalBatchDraft.scope).toBe("workflow");
  });
});
