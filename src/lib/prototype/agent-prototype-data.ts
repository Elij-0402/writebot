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
  progressLabel: string;
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

export function getAgentPrototype(projectId: string) {
  const base = `/projects/${projectId}`;

  return {
    projectId,
    projectTitle: "项目演示",
    continueLink: {
      href: `${base}`,
      label: "继续当前项目",
    },
    entry: {
      pageTitle: "项目",
      eyebrow: "Writebot 创作入口",
      summary: "从当前项目继续写作，系统状态会以内联方式跟随创作流程。",
      projectLabel: "当前项目",
      projectSummary: "围绕第 8 章的确认与续写推进当前创作流程。",
      projectSignals: [
        { label: "当前状态", value: "第 8 章待确认" },
        { label: "下一步", value: "确认后继续写作" },
        { label: "主界面", value: "章节工作区" },
      ],
    },
    navigation: [
      { href: `${base}`, label: "项目概览", kind: "primary" },
      { href: `${base}/chapter`, label: "章节工作区", kind: "primary" },
    ] satisfies PrototypeLink[],
    overview: {
      title: "项目概览",
      progressLabel: "第 8 章需要人工确认，已锁定下一步",
      primaryAction: {
        href: `${base}/chapter`,
        label: "继续写作",
      },
      chapters: [
        {
          id: "chapter-8",
          title: "第 8 章",
          summary: "确认档案馆段落后的延续方向。",
          status: "待确认",
          lastAction: "系统已整理候选方向",
          href: `${base}/chapter?panel=confirmation`,
          recommended: true,
        },
      ],
      notes: ["系统已整理候选方向", "确认后将直接回到章节工作区继续推进。"],
    } satisfies PrototypeOverview,
    confirmation: {
      decisionSummary: "为第 8 章确认延续方向。",
      rationale: "先确认档案馆段落后的走向，再继续生成正文候选，能避免后续返工。",
      recommendationRationale: "当前推荐方向能保持线索推进，同时不提前透支档案馆揭秘。",
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
      affectedArtifacts: ["第 8 章", "人物动机", "档案馆线索"],
    },
    workbench: {
      currentObjective: "围绕第 8 章继续写作。",
      chapterBrief: "先确认档案馆段落后的延续方向，再继续生成候选正文。",
      candidateText:
        "林澄停在档案馆门前，指尖还扣着上一章留下的钥匙，心里已经替自己否决了三种更安全的退路。",
      supportNotes: [
        "锁定约束：档案馆揭秘必须留在第 8 章内完成。",
        "语气要求：保持克制推进，不提前泄露最终答案。",
      ],
    },
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
