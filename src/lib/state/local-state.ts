import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Prisma } from "@prisma/client";
import type { ProviderProfile } from "@/lib/llm/provider-profiles";
import type {
  ApprovalBatchRecord,
  AuditEventType,
  AuditRecord,
  CreateApprovalBatchRecordInput,
  CreateProposalRecordInput,
  ProposalRecord,
  ProposalStatus,
  ReviewRecord,
} from "@/lib/types/state";

type LocalProjectRecord = {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
};

type LocalStateCommitRecord = {
  id: string;
  proposalId: string;
  actorId: string;
  reason: string | null;
  version: string;
  status: "committed";
  committedAt: string;
};

type LocalState = {
  projects: LocalProjectRecord[];
  proposals: Array<Omit<ProposalRecord, "auditLogs"> & { createdAt: string; updatedAt: string }>;
  reviews: ReviewRecord[];
  approvalBatches: ApprovalBatchRecord[];
  approvalBatchProposals: Array<{ batchId: string; proposalId: string }>;
  commits: LocalStateCommitRecord[];
  auditLogs: AuditRecord[];
  providerProfiles: ProviderProfile[];
  defaultProviderProfileId: string | null;
};

function getStateDirectory() {
  return path.join(process.cwd(), ".writebot");
}

function getStateFilePath() {
  const workerSuffix = process.env.VITEST_POOL_ID ? `state-${process.env.VITEST_POOL_ID}.json` : "state.json";
  return path.join(getStateDirectory(), workerSuffix);
}

function createId(prefix: string) {
  return `${prefix}_${randomUUID().replaceAll("-", "").slice(0, 12)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function cloneJson<T>(value: T): T {
  return structuredClone(value);
}

function createAuditRecord(input: {
  projectId: string;
  proposalId?: string | null;
  actorId: string;
  eventType: AuditEventType;
  metadata?: Record<string, unknown> | null;
}): AuditRecord {
  return {
    id: createId("audit"),
    projectId: input.projectId,
    proposalId: input.proposalId ?? null,
    actorId: input.actorId,
    eventType: input.eventType,
    metadata: input.metadata ?? null,
    createdAt: nowIso(),
  };
}

function buildDemoState(): LocalState {
  const timestamp = nowIso();
  const projectId = "project_demo";
  const proposalId = "proposal_demo_chapter_8";
  const reviewId = "review_demo_chapter_8";
  const batchId = "batch_demo_chapter_8";
  const providerProfile: ProviderProfile = {
    id: "provider_openai_compatible_local",
    name: "openai-compatible-local",
    adapter: "openai-compatible",
    protocol: "responses",
    baseUrl: "http://localhost:11434/v1",
    apiKey: "demo-key",
    model: "local-model",
    capabilities: {
      chat: false,
      completions: false,
      responses: true,
      streaming: true,
    },
    isDefault: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  const originalBody =
    "林澄停在寒江渡口前，掌心还压着那把旧钥匙。她知道眼前这一步会把整条调查线索推向无法回头的位置。";
  const body =
    "林澄停在寒江渡口前，指尖还扣着上一章留下的钥匙，心里已经替自己否决了三种更安全的退路。她知道只要再往前一步，真相就会开始主动索取代价。";

  const review: ReviewRecord = {
    id: reviewId,
    proposalId,
    status: "completed",
    reviewerId: "system",
    summary: "已整理为待确认版本",
    notes: "等待作者确认后继续推进",
    reviewAt: timestamp,
  };

  const proposal: ProposalRecord & { createdAt: string; updatedAt: string } = {
    id: proposalId,
    projectId,
    objectType: "chapter_draft",
    status: "review_ready",
    payload: {
      chapterId: "chapter-12",
       title: "第12章：夜渡寒江",
       summary: "确认寒江夜渡后的延续方向。",
       lastAction: "系统已整理候选方向",
       writingGoal: "保持夜渡寒江的紧张推进，但不要提前透支真相揭秘。",
       body,
       provenance: {
         providerProfile: "openai-compatible-local",
        model: "local-model",
        protocol: "responses",
        templateVersion: "chapter-draft-v1",
        status: "pending_review",
      },
    } satisfies Prisma.JsonObject,
    originalProposal: {
      objectType: "chapter_draft",
        payload: {
         chapterId: "chapter-12",
         body: originalBody,
        } satisfies Prisma.JsonObject,
      },
    review,
    auditLogs: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const approvalBatch: ApprovalBatchRecord = {
    id: batchId,
    projectId,
    scope: "object",
    requiredRole: "author",
    status: "pending",
    reason: "确认第12章：夜渡寒江的延续方向",
    approvedAt: null,
    proposals: [{ proposalId }],
  };

  return {
    projects: [
      {
       id: projectId,
        title: "龙渊纪事",
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ],
    proposals: [proposal],
    reviews: [review],
    approvalBatches: [approvalBatch],
    approvalBatchProposals: [{ batchId, proposalId }],
    commits: [],
    auditLogs: [
      createAuditRecord({
        projectId,
        proposalId,
        actorId: "system",
        eventType: "proposal_created",
        metadata: { proposalId, objectType: "chapter_draft" },
      }),
      createAuditRecord({
        projectId,
        proposalId,
        actorId: "system",
        eventType: "review_requested",
        metadata: { proposalId, reviewStatus: "completed" },
        }),
    ],
    providerProfiles: [providerProfile],
    defaultProviderProfileId: providerProfile.id,
  };
}

async function writeState(state: LocalState) {
  await mkdir(getStateDirectory(), { recursive: true });
  await writeFile(getStateFilePath(), JSON.stringify(state, null, 2), "utf8");
}

async function readState(): Promise<LocalState> {
  try {
    const raw = await readFile(getStateFilePath(), "utf8");
    const parsed = JSON.parse(raw) as Partial<LocalState>;
    const normalized: LocalState = {
      projects: parsed.projects ?? [],
      proposals: parsed.proposals ?? [],
      reviews: parsed.reviews ?? [],
      approvalBatches: parsed.approvalBatches ?? [],
      approvalBatchProposals: parsed.approvalBatchProposals ?? [],
      commits: parsed.commits ?? [],
      auditLogs: parsed.auditLogs ?? [],
      providerProfiles: parsed.providerProfiles ?? [],
      defaultProviderProfileId: parsed.defaultProviderProfileId ?? null,
    };

    if (!normalized.projects.some((project) => project.id === "project_demo")) {
      const nextState = buildDemoState();
      nextState.projects = [...normalized.projects, ...nextState.projects];
      nextState.proposals = [...normalized.proposals, ...nextState.proposals];
      nextState.reviews = [...normalized.reviews, ...nextState.reviews];
      nextState.approvalBatches = [...normalized.approvalBatches, ...nextState.approvalBatches];
      nextState.approvalBatchProposals = [
        ...normalized.approvalBatchProposals,
        ...nextState.approvalBatchProposals,
      ];
      nextState.commits = normalized.commits;
      nextState.auditLogs = [...normalized.auditLogs, ...nextState.auditLogs];
      nextState.providerProfiles = normalized.providerProfiles;
      nextState.defaultProviderProfileId = normalized.defaultProviderProfileId;
      await writeState(nextState);
      return nextState;
    }

    if (parsed.providerProfiles === undefined || parsed.defaultProviderProfileId === undefined) {
      await writeState(normalized);
    }

    return normalized;
  } catch {
    const initialState = buildDemoState();
    await writeState(initialState);
    return initialState;
  }
}

function attachProposalRelations(
  state: LocalState,
  proposal: LocalState["proposals"][number],
): ProposalRecord {
  const review = state.reviews.find((entry) => entry.proposalId === proposal.id) ?? null;
  const auditLogs = state.auditLogs.filter((entry) => entry.proposalId === proposal.id);

  return {
    id: proposal.id,
    projectId: proposal.projectId,
    objectType: proposal.objectType,
    status: proposal.status,
    payload: cloneJson(proposal.payload),
    originalProposal: cloneJson(proposal.originalProposal),
    review: review ? { ...review } : null,
    auditLogs: auditLogs.map((entry) => ({ ...entry, metadata: cloneJson(entry.metadata) })),
  };
}

function mapBatchRelations(state: LocalState, batch: ApprovalBatchRecord): ApprovalBatchRecord {
  return {
    ...batch,
    proposals: state.approvalBatchProposals
      .filter((entry) => entry.batchId === batch.id)
      .map((entry) => ({ proposalId: entry.proposalId })),
  };
}

export async function listProjects() {
  const state = await readState();
  return [...state.projects].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export async function createProject(input: { title?: string | null }) {
  const state = await readState();
  const timestamp = nowIso();
  const project: LocalProjectRecord = {
    id: createId("project"),
    title: input.title?.trim() || "未命名项目",
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  state.projects.push(project);
  await writeState(state);
  return project;
}

export async function ensureProject(input: { projectId: string; title?: string | null }) {
  const state = await readState();
  const existing = state.projects.find((project) => project.id === input.projectId);

  if (existing) {
    const nextTitle = input.title?.trim();

    if (nextTitle && existing.title !== nextTitle) {
      existing.title = nextTitle;
      existing.updatedAt = nowIso();
      await writeState(state);
    }

    return existing;
  }

  const timestamp = nowIso();
  const project: LocalProjectRecord = {
    id: input.projectId,
    title: input.title?.trim() || "未命名项目",
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  state.projects.push(project);
  await writeState(state);
  return project;
}

export async function createProposal(input: CreateProposalRecordInput): Promise<ProposalRecord> {
  const state = await readState();
  const project = state.projects.find((entry) => entry.id === input.projectId);

  if (!project) {
    throw new Error(`project not found: ${input.projectId}`);
  }

  const proposalId = createId("proposal");
  const timestamp = nowIso();
  const review: ReviewRecord = {
    id: createId("review"),
    proposalId,
    status: "pending",
    reviewerId: null,
    summary: null,
    notes: null,
    reviewAt: null,
  };

  const proposal: ProposalRecord & { createdAt: string; updatedAt: string } = {
    id: proposalId,
    projectId: input.projectId,
    objectType: input.objectType,
    status: "proposal" as ProposalStatus,
    payload: cloneJson(input.payload) as ProposalRecord["payload"],
    originalProposal: {
      objectType: input.objectType,
      payload: cloneJson(input.payload) as ProposalRecord["payload"],
    },
    review,
    auditLogs: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  state.proposals.push(proposal);
  state.reviews.push(review);
  state.auditLogs.push(
    createAuditRecord({
      projectId: input.projectId,
      proposalId,
      actorId: "system",
      eventType: "proposal_created",
      metadata: { proposalId, objectType: input.objectType },
    }),
  );
  project.updatedAt = timestamp;

  await writeState(state);
  return attachProposalRelations(state, proposal);
}

export async function markProposalReviewReady(input: {
  proposalId: string;
  summary?: string;
  notes?: string;
  reviewerId?: string;
}) {
  const state = await readState();
  const proposal = state.proposals.find((entry) => entry.id === input.proposalId);
  const review = state.reviews.find((entry) => entry.proposalId === input.proposalId);

  if (!proposal || !review) {
    throw new Error(`proposal review not found: ${input.proposalId}`);
  }

  const timestamp = nowIso();
  proposal.status = "review_ready";
  proposal.updatedAt = timestamp;
  review.status = "completed";
  review.reviewerId = input.reviewerId ?? "system";
  review.summary = input.summary ?? "review_ready";
  review.notes = input.notes ?? null;
  review.reviewAt = timestamp;

  state.auditLogs.push(
    createAuditRecord({
      projectId: proposal.projectId,
      proposalId: proposal.id,
      actorId: review.reviewerId ?? "system",
      eventType: "review_requested",
      metadata: { proposalId: proposal.id, reviewStatus: review.status },
    }),
  );

  await writeState(state);
  return attachProposalRelations(state, proposal);
}

export async function createApprovalBatch(
  input: CreateApprovalBatchRecordInput,
): Promise<ApprovalBatchRecord> {
  const state = await readState();
  const batchId = createId("batch");
  const batch: ApprovalBatchRecord = {
    id: batchId,
    projectId: input.projectId,
    scope: input.scope,
    requiredRole: input.requiredRole,
    status: "pending",
    reason: null,
    approvedAt: null,
    proposals: input.proposalIds.map((proposalId) => ({ proposalId })),
  };

  state.approvalBatches.push(batch);
  state.approvalBatchProposals.push(
    ...input.proposalIds.map((proposalId) => ({ batchId, proposalId })),
  );

  await writeState(state);
  return batch;
}

export async function getProposalById(proposalId: string) {
  const state = await readState();
  const proposal = state.proposals.find((entry) => entry.id === proposalId);
  return proposal ? attachProposalRelations(state, proposal) : null;
}

export async function getApprovalBatchForDecision(input: {
  batchId?: string;
  projectId: string;
}) {
  const state = await readState();
  const batch = input.batchId
    ? state.approvalBatches.find((entry) => entry.id === input.batchId && entry.projectId === input.projectId)
    : [...state.approvalBatches]
        .reverse()
        .find((entry) => entry.projectId === input.projectId && entry.status === "pending");

  return batch ? mapBatchRelations(state, batch) : null;
}

export async function recordApprovalDecision(input: {
  batchId?: string;
  projectId: string;
  actorId: string;
  reason: string;
  decision: "approved" | "rejected";
}) {
  const state = await readState();
  const batch = input.batchId
    ? state.approvalBatches.find((entry) => entry.id === input.batchId && entry.projectId === input.projectId)
    : [...state.approvalBatches]
        .reverse()
        .find((entry) => entry.projectId === input.projectId && entry.status === "pending");

  if (!batch) {
    throw new Error("approval batch not found");
  }

  const timestamp = nowIso();
  batch.status = input.decision;
  batch.reason = input.reason;
  batch.approvedAt = input.decision === "approved" ? timestamp : null;

  const proposalIds = state.approvalBatchProposals
    .filter((entry) => entry.batchId === batch.id)
    .map((entry) => entry.proposalId);

  for (const proposalId of proposalIds) {
    const proposal = state.proposals.find((entry) => entry.id === proposalId);

    if (!proposal) {
      continue;
    }

    proposal.status = input.decision;
    proposal.updatedAt = timestamp;
    state.auditLogs.push(
      createAuditRecord({
        projectId: proposal.projectId,
        proposalId,
        actorId: input.actorId,
        eventType: "approval_recorded",
        metadata: {
          batchId: batch.id,
          decision: input.decision,
          requiredRole: batch.requiredRole,
          scope: batch.scope,
        },
      }),
    );
  }

  await writeState(state);
  return {
    batch: mapBatchRelations(state, batch),
    proposalIds,
  };
}

export async function commitProposal(input: {
  proposalId: string;
  actorId: string;
  reason: string;
}) {
  const state = await readState();
  const proposal = state.proposals.find((entry) => entry.id === input.proposalId);

  if (!proposal) {
    throw new Error(`proposal not found: ${input.proposalId}`);
  }

  const timestamp = nowIso();
  proposal.status = "committed";
  proposal.updatedAt = timestamp;

  const commitRecord: LocalStateCommitRecord = {
    id: createId("commit"),
    proposalId: input.proposalId,
    actorId: input.actorId,
    reason: input.reason,
    version: `v${state.commits.length + 1}`,
    status: "committed",
    committedAt: timestamp,
  };

  state.commits.push(commitRecord);
  state.auditLogs.push(
    createAuditRecord({
      projectId: proposal.projectId,
      proposalId: proposal.id,
      actorId: input.actorId,
      eventType: "proposal_committed",
      metadata: { commitId: commitRecord.id, version: commitRecord.version },
    }),
  );

  await writeState(state);
  return commitRecord;
}

export async function getProjectSnapshot(projectId: string) {
  const state = await readState();
  const project = state.projects.find((entry) => entry.id === projectId);

  if (!project) {
    return null;
  }

  return {
    project: { ...project },
    proposals: state.proposals
      .filter((entry) => entry.projectId === projectId)
      .map((entry) => attachProposalRelations(state, entry)),
    approvalBatches: state.approvalBatches
      .filter((entry) => entry.projectId === projectId)
      .map((entry) => mapBatchRelations(state, entry)),
    commits: state.commits.filter((entry) =>
      state.proposals.some((proposal) => proposal.projectId === projectId && proposal.id === entry.proposalId),
    ),
    auditLogs: state.auditLogs.filter((entry) => entry.projectId === projectId),
  };
}

export async function listProviderProfiles() {
  const state = await readState();

  return state.providerProfiles.map((profile) => ({
    ...profile,
    isDefault: state.defaultProviderProfileId === profile.id,
  }));
}

export async function getDefaultProviderProfile() {
  const state = await readState();
  const profile = state.providerProfiles.find((entry) => entry.id === state.defaultProviderProfileId);
  return profile ?? null;
}

export async function getProviderProfileByName(name: string) {
  const state = await readState();
  return state.providerProfiles.find((entry) => entry.name === name) ?? null;
}

export async function saveProviderProfile(input: ProviderProfile) {
  const state = await readState();
  const nextProfiles = state.providerProfiles.filter((profile) => profile.id !== input.id);

  nextProfiles.push({
    ...input,
    isDefault: input.isDefault,
  });

  state.providerProfiles = nextProfiles;

  if (input.isDefault) {
    state.defaultProviderProfileId = input.id;
  } else if (state.defaultProviderProfileId === null) {
    state.defaultProviderProfileId = nextProfiles[0]?.id ?? null;
  }

  await writeState(state);

  return {
    profile: {
      ...input,
      isDefault: state.defaultProviderProfileId === input.id,
    },
    defaultProfileId: state.defaultProviderProfileId,
  };
}

export function getLocalStatePath() {
  return getStateFilePath();
}
