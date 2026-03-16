import { commitProposal } from "@/lib/state/local-state";

export async function commitApprovedProposal(input: {
  proposalId: string;
  proposalStatus: "approved" | "review_ready" | "committed";
  actorId: string;
  reason: string;
}) {
  if (input.proposalStatus !== "approved") {
    throw new Error("proposal not approved");
  }

  const commitRecord = await commitProposal({
    proposalId: input.proposalId,
    actorId: input.actorId,
    reason: input.reason,
  });

  return {
    proposalId: input.proposalId,
    status: "committed" as const,
    auditEventType: "proposal_committed" as const,
    actorId: input.actorId,
    reason: input.reason,
    commitId: commitRecord.id,
    version: commitRecord.version,
  };
}
