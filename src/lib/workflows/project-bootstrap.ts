export async function runProjectBootstrap(input: { prompt: string }) {
  return {
    proposals: [
      { objectType: "project_card", content: input.prompt },
      { objectType: "world_rule", content: "world draft" },
      { objectType: "plot", content: "plot draft" },
      { objectType: "chapter_cards", content: "first ten cards" },
    ],
    review: { status: "review_ready" as const },
    approvalBatchDraft: {
      scope: "workflow" as const,
      requiredRole: "chief_editor" as const,
    },
  };
}
