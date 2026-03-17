import { beforeEach, describe, expect, it } from "vitest";
import { getLocalStatePath } from "@/lib/state/local-state";
import { getHistoryState } from "@/lib/state/history-state";

describe("getHistoryState", () => {
  beforeEach(async () => {
    await import("node:fs/promises").then(async ({ rm }) => {
      await rm(getLocalStatePath(), { force: true });
    });
  });

  it("returns provenance metadata and compare state", async () => {
    const result = await getHistoryState("project_demo");

    expect(result.entry.metadata).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Provider Profile" }),
        expect.objectContaining({ label: "Model" }),
        expect.objectContaining({ label: "Template" }),
      ]),
    );
    expect(result.entry.compareTitle).toBe("当前提案 vs 原始草稿");
    expect(result.entry.acceptLabel).toBe("接受本次修订");
    expect(result.entry.rejectLabel).toBe("退回该提案");
  });
});
