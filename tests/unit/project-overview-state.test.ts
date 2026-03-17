import { beforeEach, describe, expect, it } from "vitest";
import { getLocalStatePath } from "@/lib/state/local-state";
import { getProjectOverviewState } from "@/lib/state/project-state";

describe("getProjectOverviewState", () => {
  beforeEach(async () => {
    await import("node:fs/promises").then(async ({ rm }) => {
      await rm(getLocalStatePath(), { force: true });
    });
  });

  it("builds an author-first dispatch overview", async () => {
    const result = await getProjectOverviewState("project_demo");

    expect(result.overview.primaryAction.label).toBe("继续写作");
    expect(result.overview.signals).toEqual([
      expect.objectContaining({ label: "推荐下一步" }),
      expect.objectContaining({ label: "当前工件阶段" }),
      expect.objectContaining({ label: "待确认事项" }),
      expect.objectContaining({ label: "故事设定状态" }),
    ]);
    expect(result.overview.progressLabel).toContain("需要人工确认");
    expect(result.overview.chapters[0]?.recommended).toBe(true);
  });
});
