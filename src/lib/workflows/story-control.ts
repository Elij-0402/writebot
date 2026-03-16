import {
  createApprovalBatchRecord,
  createProposalRecord,
  markProposalAsReviewReady,
} from "@/lib/state/proposal-store";
import { ensureProject } from "@/lib/state/local-state";

export async function runStoryControl(input: { projectId: string }) {
  await ensureProject({ projectId: input.projectId });

  const proposal = await createProposalRecord({
    projectId: input.projectId,
    objectType: "plot",
    payload: {
      kind: "repair",
      title: "主线纠偏方案",
      summary: "当前主线出现轻微漂移，建议收束信息释放节奏。",
    },
  });
  const reviewedProposal = await markProposalAsReviewReady({
    proposalId: proposal.id,
    summary: "纠偏方案已完成初审",
  });
  const approvalBatchDraft = await createApprovalBatchRecord({
    projectId: input.projectId,
    scope: "workflow",
    requiredRole: "chief_editor",
    proposalIds: [reviewedProposal.id],
  });

  return {
    projectId: input.projectId,
    riskReport: { summary: "mainline drift" },
    options: ["conservative", "moderate", "force_converge"],
    proposals: [reviewedProposal],
    approvalBatchDraft,
    decisionLog: { type: "story_control" as const },
  };
}
