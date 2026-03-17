import { describe, expect, it } from "vitest";
import { runChapterProduction } from "@/lib/workflows/chapter-production";

describe("runChapterProduction", () => {
  it("returns a provider-backed draft proposal plus review result", async () => {
    const result = await runChapterProduction({
      projectId: "project_1",
      chapterId: "chapter-12",
    });

    expect(result.status).toBe("ok");
    expect(result.proposals[0].objectType).toBe("chapter_draft");
    expect(result.review.status).toBe("review_ready");
    expect((result.proposals[0].payload as { provenance: { providerProfile: string } }).provenance.providerProfile).toBe(
      "openai-compatible-local",
    );
  });

  it("returns structured provider failure without creating proposals", async () => {
    const result = await runChapterProduction({
      projectId: "project_1",
      chapterId: "chapter-12",
      failureMode: "429",
    });

    expect(result.status).toBe("error");
    expect(result.error).toEqual(expect.objectContaining({ type: "rate_limit" }));
    expect(result.proposals).toEqual([]);
  });
});
