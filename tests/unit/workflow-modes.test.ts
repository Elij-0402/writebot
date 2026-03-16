import { describe, expect, it } from "vitest";
import { runNovelWorkflow } from "@/lib/workflows/novel-workflow";

describe("runNovelWorkflow", () => {
  it("routes control mode requests to story control", async () => {
    const result = await runNovelWorkflow({
      mode: "control",
      action: "inspect_story",
      projectId: "project_1",
    });

    expect(result.mode).toBe("control");
  });
});
