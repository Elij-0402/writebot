import { ensureProject } from "@/lib/state/local-state";
import { runChapterProduction } from "@/lib/workflows/chapter-production";
import { runProjectBootstrap } from "@/lib/workflows/project-bootstrap";
import { runStoryControl } from "@/lib/workflows/story-control";

export async function runNovelWorkflow(input: {
  mode: "write" | "review" | "control";
  action: string;
  projectId?: string;
  prompt?: string;
  chapterId?: string;
  isHighRisk?: boolean;
}) {
  const projectId = input.projectId ?? "project_demo";
  await ensureProject({
    projectId,
    title: projectId === "project_demo" ? "项目演示" : "未命名项目",
  });

  if (input.mode === "control") {
    return {
      mode: input.mode,
      action: input.action,
      status: "ok" as const,
      result: await runStoryControl({ projectId }),
    };
  }

  if (input.action === "bootstrap_project") {
    return {
      mode: input.mode,
      action: input.action,
      status: "ok" as const,
      result: await runProjectBootstrap({
        projectId,
        prompt: input.prompt ?? "新建项目",
      }),
    };
  }

  return {
    mode: input.mode,
    action: input.action,
    status: "ok" as const,
    result: await runChapterProduction({
      projectId,
      chapterId: input.chapterId ?? "chapter-8",
      isHighRisk: input.isHighRisk,
    }),
  };
}
