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

  it("prefers approved canon over recent summaries and reports conflicts", () => {
    const result = buildContextPackage({
      chapterCard: { id: "chapter-12" },
      volumeSummary: "卷一摘要",
      characters: [],
      hardRules: [],
      recentSummaries: ["未经批准的新摘要"],
      foreshadows: [],
      styleGuide: "热血",
      forbiddenItems: [],
      approvedCanon: [{ id: "canon_1", content: "龙渊纪事中，江面夜渡发生在冬夜。" }],
      approvedFacts: [{ key: "夜渡寒江", value: "冬夜", category: "timeline" }],
      proposedFacts: [{ key: "夜渡寒江", value: "春夜", category: "timeline" }],
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.orderedSources[1]).toEqual({ id: "canon_1", content: "龙渊纪事中，江面夜渡发生在冬夜。" });
    expect(result.conflicts).toEqual([
      expect.objectContaining({ key: "夜渡寒江", approvedValue: "冬夜", proposedValue: "春夜" }),
    ]);
  });

  it("truncates lower-priority sources after approved canon when budget is tight", () => {
    const result = buildContextPackage({
      chapterCard: { id: "chapter-12" },
      volumeSummary: "卷一摘要",
      characters: [],
      hardRules: [],
      recentSummaries: ["最近摘要", "次要摘要"],
      foreshadows: [],
      styleGuide: "热血",
      forbiddenItems: [],
      approvedCanon: [{ id: "canon_1", content: "已批准设定" }],
      derivedMemory: [{ id: "derived_1", content: "派生摘要" }],
      tokenBudget: 3,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.orderedSources).toEqual([
      { id: "chapter-12" },
      { id: "canon_1", content: "已批准设定" },
      "卷一摘要",
    ]);
    expect(result.truncated).toBe(true);
  });
});
