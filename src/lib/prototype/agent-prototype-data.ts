export type PrototypeLink = {
  href: string;
  label: string;
  kind?: "primary" | "secondary";
};

export type PrototypeChapterStatus = "可继续写作" | "待确认" | "进行中" | "需修复";

export type PrototypeChapterCard = {
  id: string;
  title: string;
  summary: string;
  status: PrototypeChapterStatus;
  lastAction: string;
  href: string;
  recommended?: boolean;
};

export type PrototypeOverview = {
  title: string;
  projectLabel: string;
  progressLabel: string;
  signals: Array<{
    label: string;
    value: string;
  }>;
  notesTitle: string;
  chapterCardLabels: {
    recommended: string;
    lastAction: string;
    action: string;
  };
  primaryAction: {
    href: string;
    label: string;
  };
  chapters: PrototypeChapterCard[];
  notes: string[];
};

export type PrototypeConfirmationOption = {
  label: string;
  summary: string;
};

export type PrototypeIssue = {
  title: string;
  summary: string;
  consequence: string;
};

export type PrototypeBanner = {
  label: string;
  tone: "confirmation" | "repair";
  actionLabel: string;
};

export type PrototypeChapterNavItem = {
  id: string;
  label: string;
  status: PrototypeChapterStatus;
  href: string;
};

export type PrototypeAssistantCard = {
  title: string;
  body?: string;
  actions?: string[];
};

export type PrototypeConfirmationCard = {
  title: string;
  body: string;
  impact: string;
  confirmLabel: string;
  rejectLabel: string;
};

export type PrototypeRepairCard = {
  title: string;
  body: string;
  evidence: string;
  recommendations: string[];
};

export type PrototypeWorkbench = {
  pageTitle: string;
  pageEyebrow: string;
  chapterNavigationTitle: string;
  assistantTitle: string;
  editorLabel: string;
  currentChapterTitle: string;
  writingGoal: string;
  editorBody: string;
  draftStateLabel: string;
  acceptedStateLabel: string;
  revisionActions: string[];
  repairDrawerTitle: string;
  banners: {
    confirmation: PrototypeBanner;
    repair: PrototypeBanner;
  };
  chapterList: PrototypeChapterNavItem[];
  assistantCards: PrototypeAssistantCard[];
  confirmationCard: PrototypeConfirmationCard;
  repairCard: PrototypeRepairCard;
};

export function getAgentPrototype(projectId: string) {
  const base = `/projects/${projectId}`;

  return {
    projectId,
    projectTitle: "龙渊纪事",
    continueLink: {
      href: `${base}`,
      label: "继续当前项目",
    },
    entry: {
      pageTitle: "项目",
      eyebrow: "Writebot 创作入口",
      summary: "从当前项目继续写作，系统状态会以内联方式跟随创作流程。",
      projectLabel: "当前项目",
      projectSummary: "围绕第12章：夜渡寒江的确认与续写推进当前创作流程。",
      projectSignals: [
        { label: "当前状态", value: "第12章待确认" },
        { label: "下一步", value: "确认后继续写作" },
        { label: "主界面", value: "章节工作区" },
      ],
    },
    navigation: [
      { href: `${base}`, label: "项目概览", kind: "primary" },
      { href: `${base}/chapter`, label: "章节工作区", kind: "primary" },
      { href: `${base}/story-bible`, label: "故事设定", kind: "secondary" },
      { href: `${base}/outline`, label: "大纲", kind: "secondary" },
      { href: `${base}/history`, label: "历史记录", kind: "secondary" },
      { href: `${base}/settings`, label: "设置/模型接入", kind: "secondary" },
    ] satisfies PrototypeLink[],
    overview: {
      title: "项目概览",
      projectLabel: "当前项目",
      progressLabel: "第12章：夜渡寒江需要人工确认，已锁定下一步",
      signals: [
        { label: "推荐下一步", value: "先完成当前确认，再进入章节工作区。" },
        { label: "当前工件阶段", value: "章节草稿待确认" },
        { label: "待确认事项", value: "1 项待确认" },
        { label: "故事设定状态", value: "等待批准后更新稳定设定" },
      ],
      notesTitle: "项目提示",
      chapterCardLabels: {
        recommended: "推荐优先",
        lastAction: "最近动作",
        action: "进入章节",
      },
      primaryAction: {
        href: `${base}/chapter`,
        label: "继续写作",
      },
      chapters: [
        {
          id: "chapter-12",
          title: "第12章：夜渡寒江",
          summary: "确认寒江夜渡后的延续方向。",
          status: "待确认",
          lastAction: "系统已整理候选方向",
          href: `${base}/chapter?panel=confirmation`,
          recommended: true,
        },
      ],
      notes: ["系统已整理候选方向", "确认后将直接回到章节工作区继续推进。"],
    } satisfies PrototypeOverview,
    confirmation: {
      decisionSummary: "为第12章：夜渡寒江确认延续方向。",
      rationale: "先确认寒江夜渡后的走向，再继续生成正文候选，能避免后续返工。",
      recommendationRationale: "当前推荐方向能保持线索推进，同时不提前透支真相揭秘。",
      options: [
        {
          label: "推荐方向",
          summary: "保持当前调查节奏，在确认后继续生成候选正文。",
        },
        {
          label: "备选方向",
          summary: "延后冲突爆发，先补充角色的心理波动。",
        },
      ] satisfies PrototypeConfirmationOption[],
      affectedArtifacts: ["第12章：夜渡寒江", "人物动机", "寒江线索"],
    },
    workbench: {
      pageTitle: "章节工作区",
      pageEyebrow: "围绕当前章节持续创作",
      chapterNavigationTitle: "章节导航",
      assistantTitle: "智能辅助",
      editorLabel: "正文编辑区",
      currentChapterTitle: "第12章：夜渡寒江",
      writingGoal: "保持夜渡寒江的紧张推进，但不要提前透支真相揭秘。",
      editorBody:
        "林澄停在寒江渡口前，指尖还扣着上一章留下的钥匙，心里已经替自己否决了三种更安全的退路。她知道只要再往前一步，真相就会开始主动索取代价。",
      draftStateLabel: "当前草稿：待确认提案",
      acceptedStateLabel: "已批准版本：暂无",
      revisionActions: ["继续写作", "发起修订", "修复本章"],
      repairDrawerTitle: "修复详情",
      banners: {
        confirmation: {
          label: "有 1 项内容需要你确认",
          tone: "confirmation",
          actionLabel: "待确认",
        },
        repair: {
          label: "检测到一项连续性问题",
          tone: "repair",
          actionLabel: "需修复",
        },
      },
      chapterList: [
        { id: "chapter-7", label: "第 7 章", status: "进行中", href: `${base}/chapter?chapter=7` },
          { id: "chapter-12", label: "第12章：夜渡寒江", status: "待确认", href: `${base}/chapter?chapter=12` },
      ],
      assistantCards: [
        { title: "当前建议", body: "先确认本章延续方向，再继续生成候选段落。" },
        { title: "本章上下文", body: "角色动机已锁定，档案馆揭秘必须留在本章内部。" },
        { title: "可用操作", actions: ["继续写作", "改写这一段", "扩写张力"] },
      ],
      confirmationCard: {
        title: "当前确认",
         body: "先确认第12章：夜渡寒江后的延续方向，再继续生成候选正文。",
         impact: "会影响夜渡节奏、人物动机承接以及寒江线索释放顺序。",
        confirmLabel: "确认继续",
        rejectLabel: "退回重做",
      },
      repairCard: {
        title: "修复建议",
         body: "当前候选段落提前解释了寒江线索，建议收回解释性语句，保留悬念。",
         evidence: "受影响范围：第12章：夜渡寒江后半段的悬念和转折节奏。",
         recommendations: ["回收过早解释", "保留寒江线索张力"],
      },
    } satisfies PrototypeWorkbench,
    control: {
      issue: {
        title: "检测到连续性风险",
        summary: "当前候选段落提前解释了档案馆线索，削弱了章节转折。",
        consequence: "如果忽略，会让第 8 章后半段失去悬念和节奏。",
      } satisfies PrototypeIssue,
      strategies: ["接受修复建议", "退回重新分析", "稍后处理"],
    },
  };
}

