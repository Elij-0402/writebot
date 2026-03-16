import { describe, expect, it } from "vitest";
import { resolveApprovalRequirement } from "@/lib/authors/approval-policy";

describe("resolveApprovalRequirement", () => {
  it("requires chief editor for high risk chapter draft", () => {
    const result = resolveApprovalRequirement({
      objectType: "chapter_draft",
      riskLevel: "high",
    });

    expect(result.requiredRole).toBe("chief_editor");
  });
});
