import { NextResponse } from "next/server";
import { buildContextPackage } from "@/lib/state/context-package";
import { ensureProject, getProjectSnapshot } from "@/lib/state/local-state";

function asObject(value: unknown) {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await context.params;
  await ensureProject({ projectId, title: projectId === "project_demo" ? "龙渊纪事" : "未命名项目" });
  const snapshot = await getProjectSnapshot(projectId);

  if (!snapshot) {
    return NextResponse.json({ error: "project not found" }, { status: 404 });
  }

  const latestChapter = [...snapshot.proposals]
    .reverse()
    .find((proposal) => proposal.objectType === "chapter_draft");
  const chapterPayload = asObject(latestChapter?.payload);

  const contextPackage = buildContextPackage({
    chapterCard:
      latestChapter && typeof chapterPayload.chapterId === "string"
        ? { id: chapterPayload.chapterId }
        : { id: "chapter-12" },
    volumeSummary: "围绕寒江夜渡推进当前卷的悬念。",
    characters: [{ id: "lin-cheng", currentState: "仍在追查档案馆线索。" }],
    hardRules: [{ id: "rule-1", content: "未经批准的输出不能更新 durable canon。" }],
    recentSummaries: ["最近摘要只作低优先参考。"],
    foreshadows: [{ id: "foreshadow-1", status: "待回收" }],
    styleGuide: "紧张、克制、保留悬念",
    forbiddenItems: ["提前揭秘档案馆真相"],
    approvedCanon: [{ id: "canon_1", content: "寒江夜渡发生在冬夜。" }],
    approvedFacts: [{ key: "夜渡寒江", value: "冬夜", category: "timeline" }],
    proposedFacts: [{ key: "夜渡寒江", value: "冬夜", category: "timeline" }],
    tokenBudget: 6,
  });

  return NextResponse.json(contextPackage, { status: 200 });
}
