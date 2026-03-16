import { describe, expect, it } from "vitest";
import { runStoryControl } from "@/lib/workflows/story-control";

describe("runStoryControl", () => {
  it("returns risk report, correction options and workflow batch draft", async () => {
    const result = await runStoryControl({ projectId: "project_1" });

    expect(result.options).toHaveLength(3);
    expect(result.approvalBatchDraft.scope).toBe("workflow");
    expect(result.decisionLog.type).toBe("story_control");
  });
});
