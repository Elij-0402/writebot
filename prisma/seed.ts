import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const projectId = "project_seed_demo";
  const proposalId = "proposal_seed_demo";
  const reviewId = "review_seed_demo";
  const batchId = "approval_batch_seed_workflow";

  await prisma.project.upsert({
    where: { id: projectId },
    update: {
      title: "Sample Project",
    },
    create: {
      id: projectId,
      title: "Sample Project",
    },
  });

  await prisma.proposal.upsert({
    where: { id: proposalId },
    update: {
      projectId,
      objectType: "chapter_draft",
      status: "proposal",
      payload: { draftId: "draft_seed_1" },
      originalProposal: {
        objectType: "chapter_draft",
        payload: { draftId: "draft_seed_1" },
      },
    },
    create: {
      id: proposalId,
      projectId,
      objectType: "chapter_draft",
      status: "proposal",
      payload: { draftId: "draft_seed_1" },
      originalProposal: {
        objectType: "chapter_draft",
        payload: { draftId: "draft_seed_1" },
      },
    },
  });

  await prisma.review.upsert({
    where: { proposalId },
    update: {
      status: "pending",
      reviewerId: null,
      summary: null,
      notes: "seeded review baseline",
      reviewAt: null,
    },
    create: {
      id: reviewId,
      proposalId,
      status: "pending",
      reviewerId: null,
      summary: null,
      notes: "seeded review baseline",
      reviewAt: null,
    },
  });

  await prisma.approvalBatch.upsert({
    where: { id: batchId },
    update: {
      projectId,
      scope: "workflow",
      requiredRole: "author",
      status: "pending",
      reason: null,
      approvedAt: null,
    },
    create: {
      id: batchId,
      projectId,
      scope: "workflow",
      requiredRole: "author",
      status: "pending",
      reason: null,
      approvedAt: null,
      proposals: {
        create: [
          {
            proposalId,
          },
        ],
      },
    },
  });

  console.info("Seeded example project proposal baseline data.");
}

main()
  .catch((error) => {
    console.error("Prisma seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
