import { describe, expect, it } from "vitest";
import { executeProviderWorkflow } from "@/lib/llm/provider-kernel";

describe("executeProviderWorkflow", () => {
  it("returns deterministic provider-backed provenance for draft runs", async () => {
    const result = await executeProviderWorkflow({
      workflowKind: "draft",
      chapterTitle: "第12章：夜渡寒江",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.provenance.providerProfile).toBe("openai-compatible-local");
    expect(result.provenance.protocol).toBe("responses");
  });

  it("classifies timeout failures", async () => {
    const result = await executeProviderWorkflow({
      workflowKind: "draft",
      chapterTitle: "第12章：夜渡寒江",
      failureMode: "timeout",
    });

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.type).toBe("timeout");
  });

  it("classifies partial stream failures", async () => {
    const result = await executeProviderWorkflow({
      workflowKind: "draft",
      chapterTitle: "第12章：夜渡寒江",
      failureMode: "partial_stream",
    });

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.type).toBe("partial_stream");
  });
});
