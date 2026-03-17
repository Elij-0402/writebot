import { describe, expect, it } from "vitest";
import projectFixture from "../fixtures/golden/dragon-abyss-chronicle.json";
import chapterFixture from "../fixtures/golden/chapter-12-night-river.json";
import { detectContextConflicts } from "@/lib/rules/context-conflicts";
import { executeProviderWorkflow } from "@/lib/llm/provider-kernel";

const approvedCanonFacts = projectFixture.canonFacts.map((fact) => ({
  key: fact.key,
  category: fact.category as "timeline" | "lore" | "name" | "term",
  value: fact.value,
}));

function detectTerminologyDrift(text: string, terms: string[]) {
  return terms.filter((term) => !text.includes(term));
}

describe("golden regression harness", () => {
  it("detects canon contradiction for the 龙渊纪事 fixture", () => {
    const result = detectContextConflicts({
      approvedFacts: approvedCanonFacts,
      proposedFacts: [
        { key: "夜渡寒江", category: "timeline", value: "春夜" },
        { key: "寒江渡口", category: "lore", value: "临江南岸" },
      ],
    });

    expect(result).toEqual([
      expect.objectContaining({ key: "夜渡寒江", approvedValue: "冬夜", proposedValue: "春夜" }),
      expect.objectContaining({ key: "寒江渡口", approvedValue: "临江北岸", proposedValue: "临江南岸" }),
    ]);
  });

  it("accepts a compliant chapter revision", () => {
    const punctuationOk = chapterFixture.candidateBody.endsWith(chapterFixture.expectedPunctuation);
    const terminologyDrift = detectTerminologyDrift(chapterFixture.candidateBody, chapterFixture.properNouns);

    expect(punctuationOk).toBe(true);
    expect(terminologyDrift).toEqual([]);
  });

  it("captures provider failure regressions as structured classes", async () => {
    const timeout = await executeProviderWorkflow({
      workflowKind: "draft",
      chapterTitle: chapterFixture.title,
      failureMode: "timeout",
    });
    const rateLimit = await executeProviderWorkflow({
      workflowKind: "draft",
      chapterTitle: chapterFixture.title,
      failureMode: "429",
    });

    expect(timeout).toEqual(expect.objectContaining({ ok: false }));
    expect(rateLimit).toEqual(expect.objectContaining({ ok: false }));

    if (!timeout.ok && !rateLimit.ok) {
      expect(timeout.error.type).toBe("timeout");
      expect(rateLimit.error.type).toBe("rate_limit");
    }
  });
});
