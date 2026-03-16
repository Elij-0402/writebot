import { describe, expect, it } from "vitest";
import { buildContextPackage } from "@/lib/state/context-package";

describe("buildContextPackage", () => {
  it("fails when chapter card is missing", () => {
    const result = buildContextPackage({
      chapterCard: null,
      volumeSummary: "卷一摘要",
      characters: [],
      hardRules: [],
      recentSummaries: [],
      foreshadows: [],
      styleGuide: "热血",
      forbiddenItems: [],
    });

    expect(result.ok).toBe(false);
    expect(result.reason).toBe("missing_chapter_card");
  });
});
