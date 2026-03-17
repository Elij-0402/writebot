import { ensureProject, getProjectSnapshot } from "@/lib/state/local-state";

function asObject(value: unknown) {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

export async function getHistoryState(projectId: string) {
  await ensureProject({
    projectId,
    title: projectId === "project_demo" ? "龙渊纪事" : "未命名项目",
  });
  const snapshot = await getProjectSnapshot(projectId);

  if (!snapshot) {
    throw new Error(`project not found: ${projectId}`);
  }

  const latestProposal = [...snapshot.proposals]
    .reverse()
    .find((proposal) => proposal.objectType === "chapter_draft");
  const payload = asObject(latestProposal?.payload);
  const provenance = asObject(payload.provenance);
  const originalPayload = asObject(latestProposal?.originalProposal.payload);

  return {
    projectTitle: snapshot.project.title ?? "未命名项目",
    entry: {
      title: typeof payload.title === "string" ? payload.title : "当前修订",
      summary: typeof payload.summary === "string" ? payload.summary : "查看修订来源、差异与批准状态。",
      status: latestProposal?.status ?? "proposal",
      metadata: [
        { label: "Provider Profile", value: typeof provenance.providerProfile === "string" ? provenance.providerProfile : "openai-compatible-local" },
        { label: "Model", value: typeof provenance.model === "string" ? provenance.model : "local-model" },
        { label: "Protocol", value: typeof provenance.protocol === "string" ? provenance.protocol : "responses" },
        { label: "Template", value: typeof provenance.templateVersion === "string" ? provenance.templateVersion : "chapter-draft-v1" },
      ],
      currentBody: typeof payload.body === "string" ? payload.body : "",
      previousBody: typeof originalPayload.body === "string" ? originalPayload.body : "",
      compareTitle: "当前提案 vs 原始草稿",
      acceptLabel: "接受本次修订",
      rejectLabel: "退回该提案",
    },
  };
}
