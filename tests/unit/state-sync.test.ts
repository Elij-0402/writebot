import { rm } from "node:fs/promises";
import { beforeEach, describe, expect, it } from "vitest";
import {
  createApprovalBatchRecord,
  createProposalRecord,
  markProposalAsReviewReady,
} from "@/lib/state/proposal-store";
import { commitApprovedProposal } from "@/lib/state/commit-writer";
import { getLocalStatePath, getProjectSnapshot } from "@/lib/state/local-state";
import { stateObjectTypes } from "@/lib/types/state";

const stateFilePath = getLocalStatePath();

describe("createProposalRecord", () => {
  beforeEach(async () => {
    await rm(stateFilePath, { force: true });
  });

  it("creates a proposal with linked pending review", async () => {
    const payload = { draftId: "draft_1" };

    const result = await createProposalRecord({
      objectType: "chapter_draft",
      projectId: "project_demo",
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
  beforeEach(async () => {
    await rm(stateFilePath, { force: true });
  });

  it("creates a workflow batch that links multiple proposals", async () => {
    const first = await createProposalRecord({
      objectType: "plot",
      projectId: "project_demo",
      payload: { draftId: "proposal_1" },
    });
    const second = await createProposalRecord({
      objectType: "world_rule",
      projectId: "project_demo",
      payload: { draftId: "proposal_2" },
    });

    const result = await createApprovalBatchRecord({
      projectId: "project_demo",
      scope: "workflow",
      requiredRole: "chief_editor",
      proposalIds: [first.id, second.id],
    });

    expect(result.scope).toBe("workflow");
    expect(result.status).toBe("pending");
    expect(result.requiredRole).toBe("chief_editor");
    expect(result.proposals).toEqual([
      expect.objectContaining({ proposalId: first.id }),
      expect.objectContaining({ proposalId: second.id }),
    ]);
  });

  it("creates an object batch for a single proposal", async () => {
    const proposal = await createProposalRecord({
      objectType: "chapter_draft",
      projectId: "project_demo",
      payload: { draftId: "proposal_1" },
    });

    const result = await createApprovalBatchRecord({
      projectId: "project_demo",
      scope: "object",
      requiredRole: "author",
      proposalIds: [proposal.id],
    });

    expect(result.scope).toBe("object");
    expect(result.proposals).toEqual([
      expect.objectContaining({ proposalId: proposal.id }),
    ]);
  });
});

describe("commitApprovedProposal", () => {
  beforeEach(async () => {
    await rm(stateFilePath, { force: true });
  });

  it("rejects commit when proposal is not approved", async () => {
    await expect(
      commitApprovedProposal({
        proposalId: "proposal_1",
        proposalStatus: "review_ready",
        actorId: "author_1",
        reason: "ship it",
      }),
    ).rejects.toThrow("proposal not approved");
  });

  it("persists a committed proposal when status is approved", async () => {
    const proposal = await createProposalRecord({
      objectType: "chapter_draft",
      projectId: "project_demo",
      payload: { draftId: "proposal_approved" },
    });

    await markProposalAsReviewReady({
      proposalId: proposal.id,
      summary: "ready",
    });

    const result = await commitApprovedProposal({
      proposalId: proposal.id,
      proposalStatus: "approved",
      actorId: "author_1",
      reason: "ship it",
    });

    const snapshot = await getProjectSnapshot("project_demo");

    expect(result.status).toBe("committed");
    expect(snapshot?.commits).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          proposalId: proposal.id,
          actorId: "author_1",
        }),
      ]),
    );
  });
});
