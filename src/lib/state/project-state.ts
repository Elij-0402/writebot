import type { PrototypeOverview, PrototypeWorkbench } from "@/lib/prototype/agent-prototype-data";
import { getAgentPrototype } from "@/lib/prototype/agent-prototype-data";
import { ensureProject, getProjectSnapshot, listProjects } from "@/lib/state/local-state";

type ChapterStatus = "可继续写作" | "待确认" | "进行中" | "需修复";

type ProjectEntryState = {
  projectId: string;
  projectTitle: string;
  summary: string;
  signals: Array<{ label: string; value: string }>;
  continueHref: string;
};

function asObject(value: unknown) {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function resolveChapterStatus(input: {
  proposalStatus: string;
  hasPendingApproval: boolean;
}): ChapterStatus {
  if (input.hasPendingApproval) {
    return "待确认";
  }

  if (input.proposalStatus === "committed") {
    return "可继续写作";
  }

  if (input.proposalStatus === "rejected") {
    return "需修复";
  }

  return "进行中";
}

function buildDynamicOverview(
  projectId: string,
  prototype: ReturnType<typeof getAgentPrototype>,
  snapshot: NonNullable<Awaited<ReturnType<typeof getProjectSnapshot>>>,
): PrototypeOverview {
  const latestChapterProposal = [...snapshot.proposals]
    .reverse()
    .find((proposal) => proposal.objectType === "chapter_draft");
  const chapterPayload = asObject(latestChapterProposal?.payload);
  const pendingBatch = [...snapshot.approvalBatches]
    .reverse()
    .find(
      (batch) =>
        batch.status === "pending" &&
        batch.proposals.some((proposal) => proposal.proposalId === latestChapterProposal?.id),
    );
  const chapterId = typeof chapterPayload.chapterId === "string" ? chapterPayload.chapterId : "chapter-12";
  const chapterTitle = typeof chapterPayload.title === "string" ? chapterPayload.title : "第12章：夜渡寒江";
  const chapterSummary =
    typeof chapterPayload.summary === "string"
      ? chapterPayload.summary
      : prototype.overview.chapters[0]?.summary ?? "继续推进当前章节。";
  const lastAction =
    typeof chapterPayload.lastAction === "string"
      ? chapterPayload.lastAction
        : pendingBatch
          ? "等待人工确认"
          : snapshot.commits.length > 0
            ? "最近版本已提交"
            : "系统已生成候选内容";
  const pendingApprovals = snapshot.approvalBatches.filter((batch) => batch.status === "pending").length;

  return {
    ...prototype.overview,
    progressLabel:
      pendingApprovals > 0
        ? `${chapterTitle} 需要人工确认，已锁定下一步`
        : `${chapterTitle} 已进入继续写作状态`,
    signals: [
      {
        label: "推荐下一步",
        value: pendingBatch ? "先处理当前确认，再进入章节工作区。" : "直接进入章节工作区继续写作。",
      },
      {
        label: "当前工件阶段",
        value: pendingBatch ? "章节草稿待确认" : snapshot.commits.length > 0 ? "章节草稿已批准" : "章节草稿进行中",
      },
      {
        label: "待确认事项",
        value: `${pendingApprovals} 项待确认`,
      },
      {
        label: "故事设定状态",
        value: snapshot.commits.length > 0 ? "已批准内容稳定当前设定" : "等待批准后更新稳定设定",
      },
    ],
    primaryAction: {
      href: pendingBatch ? `/projects/${projectId}/chapter?panel=confirmation` : `/projects/${projectId}/chapter`,
      label: "继续写作",
    },
    chapters: [
      {
        id: chapterId,
        title: chapterTitle,
        summary: chapterSummary,
        status: resolveChapterStatus({
          proposalStatus: latestChapterProposal?.status ?? "proposal",
          hasPendingApproval: Boolean(pendingBatch),
        }),
        lastAction,
        href: pendingBatch ? `/projects/${projectId}/chapter?panel=confirmation` : `/projects/${projectId}/chapter`,
        recommended: true,
      },
    ],
    notes: [
      pendingBatch ? "当前存在人工确认项，确认后会直接回到章节工作区。" : "当前没有人工确认批次，可以继续写作。",
      snapshot.commits.length > 0 ? `已累计提交 ${snapshot.commits.length} 次版本。` : "还没有提交记录。",
    ],
  };
}

function buildDynamicWorkbench(
  projectId: string,
  prototype: ReturnType<typeof getAgentPrototype>,
  snapshot: NonNullable<Awaited<ReturnType<typeof getProjectSnapshot>>>,
): PrototypeWorkbench {
  const latestChapterProposal = [...snapshot.proposals]
    .reverse()
    .find((proposal) => proposal.objectType === "chapter_draft");
  const latestRepairProposal = [...snapshot.proposals]
    .reverse()
    .find((proposal) => {
      const payload = asObject(proposal.payload);
      return proposal.objectType === "plot" && payload.kind === "repair";
    });
  const pendingBatch = [...snapshot.approvalBatches].reverse().find((batch) => batch.status === "pending");
  const chapterPayload = asObject(latestChapterProposal?.payload);
  const repairPayload = asObject(latestRepairProposal?.payload);
  const latestCommit = snapshot.commits.at(-1);

  return {
    ...prototype.workbench,
    currentChapterTitle:
      typeof chapterPayload.title === "string" ? chapterPayload.title : prototype.workbench.currentChapterTitle,
    writingGoal:
      typeof chapterPayload.writingGoal === "string"
        ? chapterPayload.writingGoal
        : prototype.workbench.writingGoal,
    editorBody:
      typeof chapterPayload.body === "string" ? chapterPayload.body : prototype.workbench.editorBody,
    draftStateLabel: pendingBatch
      ? "当前草稿：待确认提案"
      : snapshot.commits.length > 0
        ? "当前草稿：可继续修订"
        : "当前草稿：生成候选中",
    acceptedStateLabel: latestCommit ? `已批准版本：${latestCommit.version}` : "已批准版本：暂无",
    revisionActions: ["继续写作", "发起修订", pendingBatch ? "先完成确认" : "修复本章"],
    chapterList: [
      {
        id: typeof chapterPayload.chapterId === "string" ? chapterPayload.chapterId : "chapter-12",
        label: typeof chapterPayload.title === "string" ? chapterPayload.title : "第12章：夜渡寒江",
        status: pendingBatch ? "待确认" : snapshot.commits.length > 0 ? "可继续写作" : "进行中",
        href: pendingBatch ? `/projects/${projectId}/chapter?panel=confirmation` : `/projects/${projectId}/chapter`,
      },
    ],
    assistantCards: [
      {
        title: "当前建议",
        body: pendingBatch ? "先完成当前确认，再继续推进正文。" : "当前章节可以继续生成和改写正文。",
      },
      {
        title: "本章上下文",
        body: `累计提案 ${snapshot.proposals.length} 条，累计提交 ${snapshot.commits.length} 次。`,
      },
      {
        title: "可用操作",
        actions: ["继续写作", "改写这一段", "扩写张力"],
      },
    ],
    confirmationCard: {
      ...prototype.workbench.confirmationCard,
      body: pendingBatch?.reason ?? prototype.workbench.confirmationCard.body,
    },
    repairCard: {
      ...prototype.workbench.repairCard,
      body:
        typeof repairPayload.summary === "string"
          ? repairPayload.summary
          : prototype.workbench.repairCard.body,
    },
  };
}

export async function getProjectsEntryState(): Promise<ProjectEntryState> {
  const projects = await listProjects();
  const currentProject = projects.find((project) => project.id === "project_demo") ?? projects[0];

  return {
    projectId: currentProject.id,
    projectTitle: currentProject.title ?? "未命名项目",
    summary: "从当前项目继续写作，系统状态会以内联方式跟随创作流程。",
    signals: [
      { label: "当前状态", value: currentProject.id === "project_demo" ? "第12章待确认" : "项目已就绪" },
      { label: "下一步", value: "进入章节工作区" },
      { label: "主界面", value: "章节工作区" },
    ],
    continueHref: `/projects/${currentProject.id}`,
  };
}

export async function getProjectOverviewState(projectId: string) {
  await ensureProject({
    projectId,
    title: projectId === "project_demo" ? "龙渊纪事" : "未命名项目",
  });
  const snapshot = await getProjectSnapshot(projectId);

  if (!snapshot) {
    throw new Error(`project not found: ${projectId}`);
  }

  const prototype = getAgentPrototype(projectId);

  return {
    projectTitle: snapshot.project.title ?? prototype.projectTitle,
    overview: buildDynamicOverview(projectId, prototype, snapshot),
  };
}

export async function getChapterWorkbenchState(projectId: string) {
  await ensureProject({
    projectId,
    title: projectId === "project_demo" ? "龙渊纪事" : "未命名项目",
  });
  const snapshot = await getProjectSnapshot(projectId);

  if (!snapshot) {
    throw new Error(`project not found: ${projectId}`);
  }

  const prototype = getAgentPrototype(projectId);

  return {
    workbench: buildDynamicWorkbench(projectId, prototype, snapshot),
  };
}

export async function getProjectState(projectId: string) {
  await ensureProject({
    projectId,
    title: projectId === "project_demo" ? "龙渊纪事" : "未命名项目",
  });
  const snapshot = await getProjectSnapshot(projectId);

  if (!snapshot) {
    throw new Error(`project not found: ${projectId}`);
  }

  return {
    id: projectId,
    title: snapshot.project.title ?? "未命名项目",
    pendingApprovals: snapshot.approvalBatches.filter((batch) => batch.status === "pending").length,
    latestActivity: snapshot.auditLogs.at(-1)?.eventType ?? "project_created",
  };
}
