import type { Prisma } from "@prisma/client";

export const proposalStatuses = [
  "proposal",
  "review_ready",
  "approved",
  "rejected",
  "committed",
] as const;

export const stateObjectTypes = [
  "chapter_draft",
  "characters",
  "world_rule",
  "plot",
  "chapter_cards",
  "foreshadow_registry",
  "issues_and_decisions",
  "project_card",
] as const;

export const approvalRoles = ["author", "chief_editor"] as const;
export const approvalScopes = ["object", "workflow"] as const;

export const auditEventTypes = [
  "proposal_created",
  "review_requested",
  "approval_recorded",
  "proposal_committed",
] as const;

export type ProposalStatus = (typeof proposalStatuses)[number];
export type StateObjectType = (typeof stateObjectTypes)[number];
export type ApprovalRole = (typeof approvalRoles)[number];
export type ApprovalScope = (typeof approvalScopes)[number];
export type AuditEventType = (typeof auditEventTypes)[number];
export type ReviewStatus = "pending" | "completed";
export type ApprovalDecisionStatus = "pending" | "approved" | "rejected";

export type AuditRecord = {
  id: string;
  projectId: string;
  proposalId: string | null;
  actorId: string;
  eventType: AuditEventType;
  metadata: Record<string, unknown> | null;
  createdAt: string;
};

export type ReviewRecord = {
  id: string;
  proposalId: string;
  status: ReviewStatus;
  reviewerId: string | null;
  summary: string | null;
  notes: string | null;
  reviewAt: string | null;
};

export type ApprovalBatchProposalRecord = {
  proposalId: string;
};

export type ApprovalBatchRecord = {
  id: string;
  projectId: string;
  scope: ApprovalScope;
  requiredRole: ApprovalRole;
  status: ApprovalDecisionStatus;
  reason: string | null;
  approvedAt: string | null;
  proposals: ApprovalBatchProposalRecord[];
};

export type ProposalRecord = {
  id: string;
  projectId: string;
  objectType: StateObjectType;
  status: ProposalStatus;
  payload: Prisma.JsonValue;
  originalProposal: Readonly<{
    objectType: StateObjectType;
    payload: Prisma.JsonValue;
  }>;
  review: ReviewRecord | null;
  auditLogs: AuditRecord[];
};

export type CreateProposalRecordInput = {
  objectType: StateObjectType;
  projectId: string;
  payload: Prisma.InputJsonValue;
};

export type CreateApprovalBatchRecordInput = {
  projectId: string;
  scope: ApprovalScope;
  requiredRole: ApprovalRole;
  proposalIds: string[];
};
