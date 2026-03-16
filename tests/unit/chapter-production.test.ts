import { describe, expect, it } from "vitest";
import { runChapterProduction } from "@/lib/workflows/chapter-production";

describe("runChapterProduction", () => {
  it("returns a chapter draft proposal plus review result", async () => {
    const result = await runChapterProduction({
      projectId: "project_1",
      chapterId: "chapter_8",
    });

    expect(result.proposals[0].objectType).toBe("chapter_draft");
    expect(result.review.status).toBe("review_ready");
  });
});
