import { runChapterProduction } from "@/lib/workflows/chapter-production";

export async function runRevisionWorkflow(input: {
  projectId: string;
  chapterId: string;
  providerProfileName?: string;
  failureMode?: string;
}) {
  return runChapterProduction({
    projectId: input.projectId,
    chapterId: input.chapterId,
    workflowKind: "revision",
    providerProfileName: input.providerProfileName,
    failureMode: input.failureMode,
  });
}
