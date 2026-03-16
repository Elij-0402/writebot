export async function runStoryControl(input: { projectId: string }) {
  return {
    projectId: input.projectId,
    riskReport: { summary: "mainline drift" },
    options: ["conservative", "moderate", "force_converge"],
    proposals: [{ objectType: "plot", content: "repair outline" }],
    approvalBatchDraft: {
      scope: "workflow" as const,
      requiredRole: "chief_editor" as const,
    },
    decisionLog: { type: "story_control" as const },
  };
}
