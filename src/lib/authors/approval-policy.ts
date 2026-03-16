export function resolveApprovalRequirement(input: {
  objectType: "chapter_draft" | "world_rule" | "plot" | "chapter_cards";
  riskLevel: "low" | "high";
}) {
  if (input.objectType !== "chapter_draft") {
    return { requiredRole: "chief_editor" as const };
  }

  return {
    requiredRole: input.riskLevel === "high" ? "chief_editor" : "author" as const,
  };
}
