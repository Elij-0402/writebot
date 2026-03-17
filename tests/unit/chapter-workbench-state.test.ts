import { beforeEach, describe, expect, it } from "vitest";
import { getLocalStatePath } from "@/lib/state/local-state";
import { getChapterWorkbenchState } from "@/lib/state/project-state";

describe("getChapterWorkbenchState", () => {
  beforeEach(async () => {
    await import("node:fs/promises").then(async ({ rm }) => {
      await rm(getLocalStatePath(), { force: true });
    });
  });

  it("builds revision-aware chapter workspace state", async () => {
    const result = await getChapterWorkbenchState("project_demo");

    expect(result.workbench.draftStateLabel).toContain("当前草稿");
    expect(result.workbench.acceptedStateLabel).toContain("已批准版本");
    expect(result.workbench.revisionActions).toContain("发起修订");
    expect(result.workbench.confirmationCard.confirmLabel).toBe("确认继续");
  });
});
