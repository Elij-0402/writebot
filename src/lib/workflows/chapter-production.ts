import { getLlmClient } from "@/lib/llm/client";
import { resolveApprovalRequirement } from "@/lib/authors/approval-policy";
import { getRiskLevel } from "@/lib/rules/risk-rules";
import {
  createApprovalBatchRecord,
  createProposalRecord,
  markProposalAsReviewReady,
} from "@/lib/state/proposal-store";
import { ensureProject } from "@/lib/state/local-state";

export async function runChapterProduction(input: {
  projectId: string;
  chapterId: string;
  workflowKind?: "draft" | "revision" | "repair";
  providerProfileName?: string;
  failureMode?: string;
  isHighRisk?: boolean;
}) {
  await ensureProject({ projectId: input.projectId });
  const workflowKind = input.workflowKind ?? "draft";
  const chapterTitle = input.chapterId === "chapter-12" || input.chapterId === "chapter-8" ? "第12章：夜渡寒江" : input.chapterId;
  const client = getLlmClient();
  const completion = await client.complete({
    workflowKind,
    chapterTitle,
    providerProfileName: input.providerProfileName,
    failureMode: input.failureMode,
  });

  if (!completion.ok) {
    return {
      status: "error" as const,
      error: completion.error,
      provenance: completion.provenance,
      proposals: [],
      review: { status: "failed" as const },
    };
  }

  const proposal = await createProposalRecord({
    projectId: input.projectId,
    objectType: "chapter_draft",
    payload: {
      chapterId: input.chapterId,
      title: chapterTitle,
      summary:
        workflowKind === "revision"
          ? "修订提案已生成，等待作者比较后决定。"
          : workflowKind === "repair"
            ? "修复提案已生成，等待作者确认后回写。"
            : "继续推进当前章节正文。",
      lastAction:
        workflowKind === "revision"
          ? "系统已生成修订提案"
          : workflowKind === "repair"
            ? "系统已生成修复提案"
            : "系统已生成新候选段落",
      writingGoal:
        workflowKind === "repair"
          ? "收回冲突信息并保持已批准设定。"
          : "保持主线推进，并留出下一段转折空间。",
      body: completion.text,
      provenance: completion.provenance,
    },
  });
  const reviewedProposal = await markProposalAsReviewReady({
    proposalId: proposal.id,
    summary:
      workflowKind === "revision"
        ? "修订提案已完成初审"
        : workflowKind === "repair"
          ? "修复提案已完成初审"
          : "章节候选已完成初审",
  });
  const approvalRequirement = resolveApprovalRequirement({
    objectType: "chapter_draft",
    riskLevel: getRiskLevel({ isHighRisk: input.isHighRisk ?? false }),
  });
  const approvalBatchDraft = await createApprovalBatchRecord({
    projectId: input.projectId,
    scope: "object",
    requiredRole: approvalRequirement.requiredRole,
    proposalIds: [reviewedProposal.id],
  });

  return {
    status: "ok" as const,
    proposals: [reviewedProposal],
    review: { status: "review_ready" as const },
    approvalBatchDraft,
    provenance: completion.provenance,
  };
}
