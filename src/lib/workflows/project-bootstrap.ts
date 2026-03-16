import {
  createApprovalBatchRecord,
  createProposalRecord,
  markProposalAsReviewReady,
} from "@/lib/state/proposal-store";
import { ensureProject } from "@/lib/state/local-state";

export async function runProjectBootstrap(input: { projectId: string; prompt: string }) {
  await ensureProject({ projectId: input.projectId, title: input.prompt });

  const proposals = [];

  proposals.push(
    await createProposalRecord({
      projectId: input.projectId,
      objectType: "project_card",
      payload: { title: input.prompt, summary: `${input.prompt} 项目初稿` },
    }),
  );
  proposals.push(
    await createProposalRecord({
      projectId: input.projectId,
      objectType: "world_rule",
      payload: { title: "世界规则", summary: "world draft" },
    }),
  );
  proposals.push(
    await createProposalRecord({
      projectId: input.projectId,
      objectType: "plot",
      payload: { title: "主线规划", summary: "plot draft" },
    }),
  );
  proposals.push(
    await createProposalRecord({
      projectId: input.projectId,
      objectType: "chapter_cards",
      payload: { title: "章节卡", summary: "first ten cards" },
    }),
  );

  const reviewedProposals = [];
  for (const proposal of proposals) {
    reviewedProposals.push(
      await markProposalAsReviewReady({
        proposalId: proposal.id,
        summary: "立项内容已完成初审",
      }),
    );
  }

  const approvalBatchDraft = await createApprovalBatchRecord({
    projectId: input.projectId,
    scope: "workflow",
    requiredRole: "chief_editor",
    proposalIds: reviewedProposals.map((proposal) => proposal.id),
  });

  return {
    proposals: reviewedProposals,
    review: { status: "review_ready" as const },
    approvalBatchDraft,
  };
}
