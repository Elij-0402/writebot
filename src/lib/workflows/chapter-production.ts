export async function runChapterProduction(input: {
  projectId: string;
  chapterId: string;
}) {
  return {
    proposals: [
      {
        objectType: "chapter_draft",
        projectId: input.projectId,
        chapterId: input.chapterId,
      },
    ],
    review: { status: "review_ready" as const },
    approvalBatchDraft: {
      scope: "object" as const,
      requiredRole: "author" as const,
    },
  };
}
