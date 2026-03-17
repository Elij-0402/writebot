import { NextResponse } from "next/server";
import { ensureProject, getProjectSnapshot } from "@/lib/state/local-state";

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

  const canonEntries = snapshot.proposals
    .filter((proposal) => proposal.objectType === "chapter_draft" && proposal.status === "committed")
    .map((proposal) => ({
      id: proposal.id,
      payload: proposal.payload,
    }));

  return NextResponse.json({ canonEntries }, { status: 200 });
}
