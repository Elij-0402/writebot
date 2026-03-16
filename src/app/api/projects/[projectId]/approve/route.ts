import { NextRequest, NextResponse } from "next/server";
import { commitApprovedProposal } from "@/lib/state/commit-writer";
import {
  getApprovalBatchForDecision,
  recordApprovalDecision,
} from "@/lib/state/local-state";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await context.params;
  const body = await request.json();

  if (!body.actorId || !body.reason) {
    return NextResponse.json({ error: "actorId and reason required" }, { status: 400 });
  }

  const batch = await getApprovalBatchForDecision({
    projectId,
    batchId: typeof body.batchId === "string" ? body.batchId : undefined,
  });

  if (!batch) {
    return NextResponse.json({ error: "approval batch not found" }, { status: 404 });
  }

  const decision = body.decision === "rejected" ? "rejected" : "approved";
  const decisionResult = await recordApprovalDecision({
    projectId,
    batchId: batch.id,
    actorId: body.actorId,
    reason: body.reason,
    decision,
  });

  const committedProposalIds: string[] = [];

  if (decision === "approved") {
    for (const proposalId of decisionResult.proposalIds) {
      const commitResult = await commitApprovedProposal({
        proposalId,
        proposalStatus: "approved",
        actorId: body.actorId,
        reason: body.reason,
      });
      committedProposalIds.push(commitResult.proposalId);
    }
  }

  return NextResponse.json(
    {
      status: decision,
      batchId: decisionResult.batch.id,
      committedProposalIds,
    },
    { status: 200 },
  );
}
