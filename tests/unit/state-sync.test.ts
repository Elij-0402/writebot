import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockTx, mockDb } = vi.hoisted(() => {
  const tx = {
    proposal: {
      create: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  };

  return {
    mockTx: tx,
    mockDb: {
      $transaction: vi.fn(),
    },
  };
});

vi.mock("@/lib/db", () => ({
  db: mockDb,
}));

import {
  createApprovalBatchRecord,
  createProposalRecord,
} from "@/lib/state/proposal-store";
import { stateObjectTypes } from "@/lib/types/state";

describe("createProposalRecord", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.$transaction.mockImplementation(async (callback) => callback(mockTx));
  });

  it("creates a proposal with linked pending review", async () => {
    const payload = { draftId: "draft_1" };
    mockTx.proposal.create.mockResolvedValue({
      id: "proposal_1",
      projectId: "project_1",
      objectType: "chapter_draft",
      status: "proposal",
      payload,
      originalProposal: {
        objectType: "chapter_draft",
        payload: { draftId: "draft_1" },
      },
      review: {
        id: "review_1",
        proposalId: "proposal_1",
        status: "pending",
        reviewerId: null,
        summary: null,
        notes: null,
        reviewAt: null,
      },
    });
    mockTx.auditLog.create.mockResolvedValue({
      id: "audit_1",
      projectId: "project_1",
      proposalId: "proposal_1",
      actorId: "system",
      eventType: "proposal_created",
      metadata: {
        proposalId: "proposal_1",
        projectId: "project_1",
        objectType: "chapter_draft",
      },
      createdAt: new Date("2026-03-16T00:00:00.000Z"),
    });

    const result = await createProposalRecord({
      objectType: "chapter_draft",
      projectId: "project_1",
      payload,
    });

    expect(result.status).toBe("proposal");
    expect(result.objectType).toBe("chapter_draft");
    expect(result.id).toMatch(/^proposal_/);
    expect(result.originalProposal).toEqual({
      objectType: "chapter_draft",
      payload: { draftId: "draft_1" },
    });
    expect(result.originalProposal).not.toBe(result.payload);
    expect(result.review).toEqual(
      expect.objectContaining({
        proposalId: result.id,
        status: "pending",
        reviewerId: null,
        notes: null,
      }),
    );
    expect(result.auditLogs).toEqual([
      expect.objectContaining({
        actorId: "system",
        eventType: "proposal_created",
      }),
    ]);

    payload.draftId = "mutated";
    expect(result.originalProposal).toEqual({
      objectType: "chapter_draft",
      payload: { draftId: "draft_1" },
    });

    expect(mockDb.$transaction).toHaveBeenCalledTimes(1);
    expect(mockTx.proposal.create).toHaveBeenCalledTimes(1);
    expect(mockTx.auditLog.create).toHaveBeenCalledTimes(1);
  });

  it("covers the Task 2 core state object types", () => {
    expect(stateObjectTypes).toEqual(
      expect.arrayContaining([
        "characters",
        "plot",
        "chapter_cards",
        "foreshadow_registry",
        "issues_and_decisions",
      ]),
    );
  });
});

describe("createApprovalBatchRecord", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a workflow batch that links multiple proposals", async () => {
    const result = await createApprovalBatchRecord({
      projectId: "project_1",
      scope: "workflow",
      requiredRole: "chief_editor",
      proposalIds: ["proposal_1", "proposal_2"],
    });

    expect(result.scope).toBe("workflow");
    expect(result.status).toBe("pending");
    expect(result.requiredRole).toBe("chief_editor");
    expect(result.proposals).toEqual([
      expect.objectContaining({ proposalId: "proposal_1" }),
      expect.objectContaining({ proposalId: "proposal_2" }),
    ]);
  });

  it("creates an object batch for a single proposal", async () => {
    const result = await createApprovalBatchRecord({
      projectId: "project_1",
      scope: "object",
      requiredRole: "author",
      proposalIds: ["proposal_1"],
    });

    expect(result.scope).toBe("object");
    expect(result.proposals).toEqual([
      expect.objectContaining({ proposalId: "proposal_1" }),
    ]);
  });
});
