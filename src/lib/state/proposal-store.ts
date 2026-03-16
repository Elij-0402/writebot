import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { createAuditLogEntry } from "@/lib/state/audit-log";
import type {
  ApprovalBatchRecord,
  CreateApprovalBatchRecordInput,
  CreateProposalRecordInput,
  ProposalRecord,
} from "@/lib/types/state";

function cloneSnapshot<T>(value: T): T {
  return structuredClone(value);
}

type ProposalWithRelations = Prisma.ProposalGetPayload<{
  include: {
    review: true;
  };
}>;

export async function createProposalRecord(
  input: CreateProposalRecordInput,
): Promise<ProposalRecord> {
  const originalProposal = {
    objectType: input.objectType,
    payload: cloneSnapshot(input.payload),
  } as const;

  return db.$transaction(async (tx) => {
    const proposal = (await tx.proposal.create({
      data: {
        projectId: input.projectId,
        objectType: input.objectType,
        status: "proposal",
        payload: input.payload,
        originalProposal,
        review: {
          create: {
            status: "pending",
            reviewerId: null,
            summary: null,
            notes: null,
            reviewAt: null,
          },
        },
      },
      include: {
        review: true,
      },
    })) as ProposalWithRelations;

    const auditLog = await tx.auditLog.create({
      data: {
        projectId: input.projectId,
        proposalId: proposal.id,
        actorId: "system",
        eventType: "proposal_created",
        metadata: {
          proposalId: proposal.id,
          projectId: input.projectId,
          objectType: input.objectType,
        },
      },
    });

    return {
      id: proposal.id,
      projectId: proposal.projectId,
      objectType: proposal.objectType,
      status: proposal.status,
      payload: proposal.payload,
      originalProposal: proposal.originalProposal as ProposalRecord["originalProposal"],
      review: proposal.review
        ? {
            id: proposal.review.id,
            proposalId: proposal.review.proposalId,
            status: proposal.review.status,
            reviewerId: proposal.review.reviewerId,
            summary: proposal.review.summary,
            notes: proposal.review.notes,
            reviewAt: proposal.review.reviewAt?.toISOString() ?? null,
          }
        : null,
      auditLogs: [
        createAuditLogEntry({
          id: auditLog.id,
          projectId: auditLog.projectId,
          proposalId: auditLog.proposalId,
          actorId: auditLog.actorId,
          eventType: auditLog.eventType,
          metadata:
            auditLog.metadata && typeof auditLog.metadata === "object"
              ? (auditLog.metadata as Record<string, unknown>)
              : null,
          createdAt: auditLog.createdAt,
        }),
      ],
    };
  });
}

export async function createApprovalBatchRecord(
  input: CreateApprovalBatchRecordInput,
): Promise<ApprovalBatchRecord> {
  return {
    id: "batch_demo",
    projectId: input.projectId,
    scope: input.scope,
    requiredRole: input.requiredRole,
    status: "pending",
    reason: null,
    approvedAt: null,
    proposals: input.proposalIds.map((proposalId) => ({ proposalId })),
  };
}
