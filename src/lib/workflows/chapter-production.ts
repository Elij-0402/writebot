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
  isHighRisk?: boolean;
}) {
  await ensureProject({ projectId: input.projectId });

  const proposal = await createProposalRecord({
    projectId: input.projectId,
    objectType: "chapter_draft",
    payload: {
      chapterId: input.chapterId,
      title: input.chapterId === "chapter-8" ? "第 8 章" : input.chapterId,
      summary: "继续推进当前章节正文。",
      lastAction: "系统已生成新候选段落",
      writingGoal: "保持主线推进，并留出下一段转折空间。",
      body: "新的候选段落已经生成，等待人工确认后纳入当前章节工作区。",
    },
  });
  const reviewedProposal = await markProposalAsReviewReady({
    proposalId: proposal.id,
    summary: "章节候选已完成初审",
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
    proposals: [reviewedProposal],
    review: { status: "review_ready" as const },
    approvalBatchDraft,
  };
}
