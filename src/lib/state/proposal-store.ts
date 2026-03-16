import type {
  ApprovalBatchRecord,
  CreateApprovalBatchRecordInput,
  CreateProposalRecordInput,
  ProposalRecord,
} from "@/lib/types/state";
import {
  createApprovalBatch,
  createProposal,
  markProposalReviewReady,
} from "@/lib/state/local-state";

function cloneSnapshot<T>(value: T): T {
  return structuredClone(value);
}

export async function createProposalRecord(
  input: CreateProposalRecordInput,
): Promise<ProposalRecord> {
  return createProposal({
    ...input,
    payload: cloneSnapshot(input.payload),
  });
}

export async function markProposalAsReviewReady(input: {
  proposalId: string;
  summary?: string;
  notes?: string;
  reviewerId?: string;
}) {
  return markProposalReviewReady(input);
}

export async function createApprovalBatchRecord(
  input: CreateApprovalBatchRecordInput,
): Promise<ApprovalBatchRecord> {
  return createApprovalBatch(input);
}
