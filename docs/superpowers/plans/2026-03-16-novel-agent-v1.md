# 中文小说主编台 V1 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个符合 Anthropic 风格的中文小说主编台 V1，优先实现状态优先、审批优先、工作流优先的内部创作系统，覆盖立项到开写、章节生产、长篇纠偏三条核心流程。

**Architecture:** 采用单仓库 Next.js 全栈实现，先建立结构化状态模型、`proposal -> review -> approve -> commit` 审批链和确定性状态写入器，再在其上叠加写作、审校、控盘三种能力模式。前台只暴露一个写作入口和三个核心页面，避免过早引入多 agent 或多服务复杂度。

**Tech Stack:** Next.js 16, TypeScript, React, Tailwind CSS, Prisma, PostgreSQL, Zod, OpenAI API, Vitest, Testing Library, Playwright

---

## File Structure

本计划按空仓库启动，采用最小可维护结构：

- `package.json`
  依赖、脚本、lint/test 命令。
- `next.config.ts`
  Next.js 配置。
- `tsconfig.json`
  TypeScript 配置。
- `postcss.config.mjs`
  PostCSS 配置。
- `tailwind.config.ts`
  Tailwind 配置。
- `prisma/schema.prisma`
  状态模型、审批链对象、审计记录。
- `prisma/seed.ts`
  示例项目种子数据。
- `src/app/layout.tsx`
  全局布局。
- `src/app/page.tsx`
  首页跳转。
- `src/app/projects/page.tsx`
  项目列表页。
- `src/app/projects/[projectId]/page.tsx`
  项目页。
- `src/app/projects/[projectId]/chapter/page.tsx`
  章节工作台。
- `src/app/projects/[projectId]/control/page.tsx`
  控盘页。
- `src/app/api/projects/route.ts`
  项目创建与列表。
- `src/app/api/projects/[projectId]/workflow/route.ts`
  workflow 入口。
- `src/app/api/projects/[projectId]/approve/route.ts`
  审批与 commit 入口。
- `src/components/project/project-summary.tsx`
  项目概览组件。
- `src/components/chapter/chapter-workbench.tsx`
  章节工作台主组件。
- `src/components/control/control-panel.tsx`
  控盘页主组件。
- `src/components/shared/approval-banner.tsx`
  审批提示条。
- `src/lib/db.ts`
  Prisma client。
- `src/lib/env.ts`
  环境变量校验。
- `src/lib/types/state.ts`
  状态对象类型。
- `src/lib/types/workflow.ts`
  workflow 输入输出类型。
- `src/lib/state/project-state.ts`
  项目聚合读取。
- `src/lib/state/context-package.ts`
  最小上下文包规则。
- `src/lib/state/proposal-store.ts`
  proposal / review / approval 读写。
- `src/lib/state/audit-log.ts`
  审批与 commit 审计记录。
- `src/lib/state/commit-writer.ts`
  确定性状态写入器。
- `src/lib/workflows/novel-workflow.ts`
  统一 workflow 入口。
- `src/lib/workflows/project-bootstrap.ts`
  立项到开写工作流。
- `src/lib/workflows/chapter-production.ts`
  章节生产工作流。
- `src/lib/workflows/story-control.ts`
  长篇纠偏工作流。
- `src/lib/workflows/modes/write-mode.ts`
  写作模式。
- `src/lib/workflows/modes/review-mode.ts`
  审校模式。
- `src/lib/workflows/modes/control-mode.ts`
  控盘模式。
- `src/lib/llm/client.ts`
  模型调用封装。
- `src/lib/llm/prompts.ts`
  prompt 模板。
- `src/lib/rules/risk-rules.ts`
  高风险章节规则。
- `src/lib/rules/state-sync.ts`
  定稿后的确定性状态同步规则。
- `src/lib/rules/context-conflicts.ts`
  上下文冲突检测。
- `src/lib/authors/approval-policy.ts`
  审批升级规则。
- `src/lib/serializers/workflow-io.ts`
  workflow schema。
- `src/styles/globals.css`
  全局样式。
- `tests/unit/context-package.test.ts`
  上下文包规则测试。
- `tests/unit/approval-policy.test.ts`
  审批规则测试。
- `tests/unit/state-sync.test.ts`
  状态同步与 commit 测试。
- `tests/unit/project-bootstrap.test.ts`
  立项到开写流程测试。
- `tests/unit/chapter-production.test.ts`
  章节生产流程测试。
- `tests/unit/story-control.test.ts`
  控盘流程测试。
- `tests/unit/workflow-modes.test.ts`
  模式路由测试。
- `tests/integration/projects-route.test.ts`
  项目 API 测试。
- `tests/integration/workflow-route.test.ts`
  workflow API 测试。
- `tests/integration/approve-route.test.ts`
  approve API 测试。
- `tests/e2e/project-flow.spec.ts`
  端到端流程测试。
- `README.md`
  本地开发说明。
- `.env.example`
  环境变量模板。

## Testing Notes

- API 集成测试不要直接 `fetch("http://localhost:3000")`。
- 路由测试统一采用“直接导入 route handler + mock `NextRequest`”方式。
- 只有端到端测试才依赖 Playwright 启动 Next 应用。

## Chunk 1: 工程骨架与状态事实源

### Task 1: 初始化 Next.js 工程与测试骨架

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/styles/globals.css`
- Create: `.env.example`
- Create: `README.md`
- Create: `tests/e2e/project-flow.spec.ts`

- [ ] **Step 1: 写一个失败的 E2E 测试，约束首页重定向**

```ts
import { test, expect } from "@playwright/test";

test("home redirects to projects", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/projects$/);
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm playwright test tests/e2e/project-flow.spec.ts --grep "home redirects to projects"`
Expected: FAIL with missing app or missing route

- [ ] **Step 3: 创建最小应用骨架**

```tsx
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/projects");
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm playwright test tests/e2e/project-flow.spec.ts --grep "home redirects to projects"`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json next.config.ts tsconfig.json postcss.config.mjs tailwind.config.ts src/app src/styles .env.example README.md tests/e2e/project-flow.spec.ts
git commit -m "feat: scaffold novel console app"
```

### Task 2: 建立 Prisma 状态模型与审批链对象

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `src/lib/db.ts`
- Create: `src/lib/types/state.ts`
- Create: `src/lib/state/proposal-store.ts`
- Create: `src/lib/state/audit-log.ts`
- Create: `tests/unit/state-sync.test.ts`

- [ ] **Step 1: 写失败测试，锁定 proposal-review-approve-commit 的基本对象**

```ts
import { describe, expect, it } from "vitest";
import { createProposalRecord } from "@/lib/state/proposal-store";

describe("createProposalRecord", () => {
  it("creates a proposal in pending review state", async () => {
    const result = await createProposalRecord({
      objectType: "chapter_draft",
      projectId: "project_1",
      payload: { draftId: "draft_1" },
    });

    expect(result.status).toBe("proposal");
    expect(result.objectType).toBe("chapter_draft");
    expect(result.audit).toEqual(
      expect.objectContaining({
        actorId: "system",
        eventType: "proposal_created",
      }),
    );
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm vitest tests/unit/state-sync.test.ts`
Expected: FAIL with missing module

- [ ] **Step 3: 实现最小 schema 与 proposal store**

```ts
export async function createProposalRecord(input: {
  objectType: string;
  projectId: string;
  payload: unknown;
}) {
  return {
    id: "proposal_demo",
    status: "proposal" as const,
    objectType: input.objectType,
    payload: input.payload,
    audit: {
      actorId: "system",
      eventType: "proposal_created",
    },
  };
}
```

- [ ] **Step 4: 运行单测和 schema 校验**

Run: `pnpm vitest tests/unit/state-sync.test.ts`
Expected: PASS

Run: `pnpm prisma validate`
Expected: `The schema at prisma/schema.prisma is valid`

- [ ] **Step 5: Commit**

```bash
git add prisma src/lib/db.ts src/lib/types/state.ts src/lib/state/proposal-store.ts src/lib/state/audit-log.ts tests/unit/state-sync.test.ts
git commit -m "feat: add state and approval schema"
```

## Chunk 2: 审批边界与确定性写入

### Task 3: 实现审批策略与高风险章节升级规则

**Files:**
- Create: `src/lib/authors/approval-policy.ts`
- Create: `src/lib/rules/risk-rules.ts`
- Create: `tests/unit/approval-policy.test.ts`

- [ ] **Step 1: 写失败测试，要求高风险章节升级为主编审批**

```ts
import { describe, expect, it } from "vitest";
import { resolveApprovalRequirement } from "@/lib/authors/approval-policy";

describe("resolveApprovalRequirement", () => {
  it("requires chief editor for high risk chapter approval", () => {
    const result = resolveApprovalRequirement({
      objectType: "chapter_draft",
      riskLevel: "high",
    });

    expect(result.requiredRole).toBe("chief_editor");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm vitest tests/unit/approval-policy.test.ts`
Expected: FAIL with missing module

- [ ] **Step 3: 实现最小审批升级规则**

```ts
export function resolveApprovalRequirement(input: {
  objectType: "chapter_draft" | "world_rule" | "plot_change";
  riskLevel: "low" | "high";
}) {
  if (input.objectType !== "chapter_draft") return { requiredRole: "chief_editor" as const };
  return { requiredRole: input.riskLevel === "high" ? "chief_editor" : "author" as const };
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm vitest tests/unit/approval-policy.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/authors/approval-policy.ts src/lib/rules/risk-rules.ts tests/unit/approval-policy.test.ts
git commit -m "feat: add approval escalation rules"
```

### Task 4: 实现确定性状态同步与 commit writer

**Files:**
- Create: `src/lib/rules/state-sync.ts`
- Create: `src/lib/state/commit-writer.ts`
- Modify: `tests/unit/state-sync.test.ts`

- [ ] **Step 1: 扩展失败测试，要求只有 approved proposal 才能 commit**

```ts
import { describe, expect, it } from "vitest";
import { commitApprovedProposal } from "@/lib/state/commit-writer";

describe("commitApprovedProposal", () => {
  it("rejects unapproved proposal", async () => {
    await expect(
      commitApprovedProposal({
        proposalId: "p1",
        approvalStatus: "pending",
        actorId: "author_1",
        reason: "looks good",
      }),
    ).rejects.toThrow("proposal not approved");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm vitest tests/unit/state-sync.test.ts`
Expected: FAIL with missing module

- [ ] **Step 3: 实现状态同步计划与确定性 commit**

```ts
export async function commitApprovedProposal(input: {
  proposalId: string;
  approvalStatus: "approved" | "pending";
  actorId: string;
  reason: string;
}) {
  if (input.approvalStatus !== "approved") throw new Error("proposal not approved");
  return {
    status: "committed" as const,
    proposalId: input.proposalId,
    auditRecord: {
      actorId: input.actorId,
      reason: input.reason,
      eventType: "proposal_committed",
    },
  };
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm vitest tests/unit/state-sync.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/rules/state-sync.ts src/lib/state/commit-writer.ts tests/unit/state-sync.test.ts
git commit -m "feat: add deterministic commit pipeline"
```

## Chunk 3: 上下文包与三条核心流程

### Task 5: 实现最小上下文包与冲突检测

**Files:**
- Create: `src/lib/state/context-package.ts`
- Create: `src/lib/rules/context-conflicts.ts`
- Create: `src/lib/serializers/workflow-io.ts`
- Create: `tests/unit/context-package.test.ts`

- [ ] **Step 1: 写失败测试，覆盖 spec 规定的上下文要素与失败条件**

```ts
import { describe, expect, it } from "vitest";
import { buildContextPackage } from "@/lib/state/context-package";

describe("buildContextPackage", () => {
  it("fails when chapter card is missing", () => {
    const result = buildContextPackage({
      chapterCard: null,
      volumeSummary: "第一卷",
      characters: [],
      hardRules: [],
      recentSummaries: [],
      foreshadows: [],
      styleGuide: "热血",
      forbiddenItems: [],
    });

    expect(result.ok).toBe(false);
    expect(result.reason).toBe("missing_chapter_card");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm vitest tests/unit/context-package.test.ts`
Expected: FAIL with missing module

- [ ] **Step 3: 实现完整的最小上下文包规则**

```ts
export function buildContextPackage(input: {
  chapterCard: { id: string } | null;
  volumeSummary: string;
  characters: Array<{ id: string; currentState: string }>;
  hardRules: Array<{ id: string; content: string }>;
  recentSummaries: string[];
  foreshadows: Array<{ id: string; status: string }>;
  styleGuide: string;
  forbiddenItems: string[];
}) {
  if (!input.chapterCard) return { ok: false as const, reason: "missing_chapter_card" as const };
  return {
    ok: true as const,
    orderedSources: [
      input.chapterCard,
      input.volumeSummary,
      ...input.characters,
      ...input.hardRules,
      ...input.recentSummaries,
      ...input.foreshadows,
      input.styleGuide,
      ...input.forbiddenItems,
    ],
  };
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm vitest tests/unit/context-package.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/state/context-package.ts src/lib/rules/context-conflicts.ts src/lib/serializers/workflow-io.ts tests/unit/context-package.test.ts
git commit -m "feat: add context package rules"
```

### Task 6: 实现立项到开写工作流

**Files:**
- Create: `src/lib/workflows/project-bootstrap.ts`
- Create: `tests/unit/project-bootstrap.test.ts`

- [ ] **Step 1: 写失败测试，约束立项流程必须产出立项卡、设定、总纲、前置章节卡**

```ts
import { describe, expect, it } from "vitest";
import { runProjectBootstrap } from "@/lib/workflows/project-bootstrap";

describe("runProjectBootstrap", () => {
  it("returns proposals, review report and approval batch for project bootstrap", async () => {
    const result = await runProjectBootstrap({
      prompt: "玄幻升级流",
    });

    expect(result.proposals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ objectType: "project_card" }),
        expect.objectContaining({ objectType: "world_rule" }),
        expect.objectContaining({ objectType: "plot" }),
      ]),
    );
    expect(result.reviewReport.status).toBe("review_ready");
    expect(result.approvalBatch.scope).toBe("project_bootstrap");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm vitest tests/unit/project-bootstrap.test.ts`
Expected: FAIL with missing module

- [ ] **Step 3: 实现最小立项工作流**

```ts
export async function runProjectBootstrap(input: { prompt: string }) {
  return {
    proposals: [
      { objectType: "project_card", content: input.prompt },
      { objectType: "world_rule", content: "world draft" },
      { objectType: "plot", content: "plot draft" },
      { objectType: "chapter_cards", content: "first ten cards" },
    ],
    reviewReport: {
      status: "review_ready",
      summary: "structure consistent",
    },
    approvalBatch: {
      scope: "project_bootstrap",
      requiredRole: "chief_editor",
    },
  };
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm vitest tests/unit/project-bootstrap.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/workflows/project-bootstrap.ts tests/unit/project-bootstrap.test.ts
git commit -m "feat: add project bootstrap workflow"
```

### Task 7: 实现长篇纠偏工作流

**Files:**
- Create: `src/lib/workflows/story-control.ts`
- Create: `tests/unit/story-control.test.ts`

- [ ] **Step 1: 写失败测试，约束控盘必须输出风险报告与三类方案**

```ts
import { describe, expect, it } from "vitest";
import { runStoryControl } from "@/lib/workflows/story-control";

describe("runStoryControl", () => {
  it("returns risk report, three correction options and a batched approval plan", async () => {
    const result = await runStoryControl({ projectId: "project_1" });

    expect(result.options).toHaveLength(3);
    expect(result.approvalBatch.requiredRole).toBe("chief_editor");
    expect(result.decisionLog.type).toBe("story_control");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm vitest tests/unit/story-control.test.ts`
Expected: FAIL with missing module

- [ ] **Step 3: 实现最小控盘流程**

```ts
export async function runStoryControl(input: { projectId: string }) {
  return {
    projectId: input.projectId,
    riskReport: { summary: "mainline drift" },
    options: ["conservative", "moderate", "force_converge"],
    approvalBatch: {
      requiredRole: "chief_editor",
      scope: "story_control",
    },
    decisionLog: {
      type: "story_control",
      summary: "pending approval",
    },
  };
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm vitest tests/unit/story-control.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/workflows/story-control.ts tests/unit/story-control.test.ts
git commit -m "feat: add story control workflow"
```

### Task 8: 实现章节生产工作流

**Files:**
- Create: `src/lib/workflows/chapter-production.ts`
- Create: `tests/unit/chapter-production.test.ts`

- [ ] **Step 1: 写失败测试，约束章节生产必须经过上下文包、审校结果和待审批 proposal**

```ts
import { describe, expect, it } from "vitest";
import { runChapterProduction } from "@/lib/workflows/chapter-production";

describe("runChapterProduction", () => {
  it("returns draft proposal plus review output", async () => {
    const result = await runChapterProduction({
      projectId: "project_1",
      chapterId: "chapter_8",
    });

    expect(result.proposal.objectType).toBe("chapter_draft");
    expect(result.review.status).toBe("review_ready");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm vitest tests/unit/chapter-production.test.ts`
Expected: FAIL with missing module

- [ ] **Step 3: 实现最小章节生产工作流**

```ts
export async function runChapterProduction(input: { projectId: string; chapterId: string }) {
  return {
    proposal: {
      objectType: "chapter_draft",
      projectId: input.projectId,
      chapterId: input.chapterId,
    },
    review: {
      status: "review_ready",
      summary: "draft matches chapter card",
    },
  };
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm vitest tests/unit/chapter-production.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/workflows/chapter-production.ts tests/unit/chapter-production.test.ts
git commit -m "feat: add chapter production workflow"
```

### Task 9: 实现统一 workflow 入口与三种模式路由

**Files:**
- Create: `src/lib/workflows/novel-workflow.ts`
- Create: `src/lib/workflows/modes/write-mode.ts`
- Create: `src/lib/workflows/modes/review-mode.ts`
- Create: `src/lib/workflows/modes/control-mode.ts`
- Create: `src/lib/llm/client.ts`
- Create: `src/lib/llm/prompts.ts`
- Create: `tests/unit/workflow-modes.test.ts`

- [ ] **Step 1: 写失败测试，约束 workflow 入口路由到三种模式**

```ts
import { describe, expect, it } from "vitest";
import { runNovelWorkflow } from "@/lib/workflows/novel-workflow";

describe("runNovelWorkflow", () => {
  it("routes control mode requests to story control workflow", async () => {
    const result = await runNovelWorkflow({ mode: "control", action: "inspect_story" });
    expect(result.mode).toBe("control");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm vitest tests/unit/workflow-modes.test.ts`
Expected: FAIL with missing module

- [ ] **Step 3: 实现最小模式路由**

```ts
export async function runNovelWorkflow(input: { mode: "write" | "review" | "control"; action: string }) {
  return { mode: input.mode, action: input.action, status: "ok" as const };
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm vitest tests/unit/workflow-modes.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/workflows/novel-workflow.ts src/lib/workflows/modes src/lib/llm tests/unit/workflow-modes.test.ts
git commit -m "feat: add workflow mode routing"
```

## Chunk 4: API 与页面落地

### Task 10: 实现项目 API 与项目页

**Files:**
- Create: `src/app/api/projects/route.ts`
- Create: `src/app/projects/page.tsx`
- Create: `src/app/projects/[projectId]/page.tsx`
- Create: `src/components/project/project-summary.tsx`
- Create: `src/lib/state/project-state.ts`
- Create: `tests/integration/projects-route.test.ts`

- [ ] **Step 1: 写失败集成测试，直接调用 route handler**

```ts
import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/projects/route";

describe("POST /api/projects", () => {
  it("creates a project", async () => {
    const request = new Request("http://localhost/api/projects", {
      method: "POST",
      body: JSON.stringify({ title: "剑来风云", genre: "玄幻" }),
    });

    const response = await POST(request as any);
    expect(response.status).toBe(201);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm vitest tests/integration/projects-route.test.ts`
Expected: FAIL with missing route

- [ ] **Step 3: 实现项目 route 与项目页**

```ts
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ id: "project_demo" }, { status: 201 });
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm vitest tests/integration/projects-route.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/api/projects/route.ts src/app/projects src/components/project/project-summary.tsx src/lib/state/project-state.ts tests/integration/projects-route.test.ts
git commit -m "feat: add projects dashboard"
```

### Task 11: 实现 workflow API 与章节工作台

**Files:**
- Create: `src/app/api/projects/[projectId]/workflow/route.ts`
- Create: `src/app/projects/[projectId]/chapter/page.tsx`
- Create: `src/components/chapter/chapter-workbench.tsx`
- Create: `src/components/shared/approval-banner.tsx`
- Create: `tests/integration/workflow-route.test.ts`
- Modify: `tests/e2e/project-flow.spec.ts`

- [ ] **Step 1: 写失败测试，要求 workflow route 返回 proposal 或 review 结果**

```ts
import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/projects/[projectId]/workflow/route";

describe("POST /api/projects/:projectId/workflow", () => {
  it("returns workflow result", async () => {
    const request = new Request("http://localhost/api/projects/project_demo/workflow", {
      method: "POST",
      body: JSON.stringify({ mode: "write", action: "draft_chapter" }),
    });

    const response = await POST(request as any, { params: Promise.resolve({ projectId: "project_demo" }) } as any);
    expect(response.status).toBe(200);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm vitest tests/integration/workflow-route.test.ts`
Expected: FAIL with missing route

- [ ] **Step 3: 实现 workflow route 与章节工作台**

```tsx
export default function ChapterPage() {
  return (
    <main>
      <h1>章节工作台</h1>
      <p>待审批</p>
    </main>
  );
}
```

- [ ] **Step 4: 运行集成与 E2E 测试确认通过**

Run: `pnpm vitest tests/integration/workflow-route.test.ts`
Expected: PASS

Run: `pnpm playwright test tests/e2e/project-flow.spec.ts --grep "chapter workbench"`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/api/projects/[projectId]/workflow/route.ts src/app/projects/[projectId]/chapter/page.tsx src/components/chapter/chapter-workbench.tsx src/components/shared/approval-banner.tsx tests/integration/workflow-route.test.ts tests/e2e/project-flow.spec.ts
git commit -m "feat: add chapter workbench workflow"
```

### Task 12: 实现 approve API、审批记录与控盘页

**Files:**
- Create: `src/app/api/projects/[projectId]/approve/route.ts`
- Create: `src/app/projects/[projectId]/control/page.tsx`
- Create: `src/components/control/control-panel.tsx`
- Create: `tests/integration/approve-route.test.ts`

- [ ] **Step 1: 写失败测试，要求审批记录完整字段**

```ts
import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/projects/[projectId]/approve/route";

describe("POST /api/projects/:projectId/approve", () => {
  it("rejects approval request without actor, proposal id and reason", async () => {
    const request = new Request("http://localhost/api/projects/project_demo/approve", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(request as any, { params: Promise.resolve({ projectId: "project_demo" }) } as any);
    expect(response.status).toBe(400);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm vitest tests/integration/approve-route.test.ts`
Expected: FAIL with missing route

- [ ] **Step 3: 实现 approve route 与控盘页**

```ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.proposalId || !body.actorId || !body.reason) {
    return NextResponse.json({ error: "proposalId, actorId and reason required" }, { status: 400 });
  }
  return NextResponse.json(
    {
      status: "approved",
      approvalRecord: {
        actorId: body.actorId,
        reason: body.reason,
        approvedAt: new Date().toISOString(),
      },
    },
    { status: 200 },
  );
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm vitest tests/integration/approve-route.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/api/projects/[projectId]/approve/route.ts src/app/projects/[projectId]/control/page.tsx src/components/control/control-panel.tsx tests/integration/approve-route.test.ts src/lib/state/audit-log.ts
git commit -m "feat: add approval route and control page"
```

## Chunk 5: 收尾验证与开发文档

### Task 13: 打通端到端导航与最小闭环

**Files:**
- Modify: `tests/e2e/project-flow.spec.ts`
- Modify: `src/app/projects/[projectId]/page.tsx`
- Modify: `src/app/projects/[projectId]/chapter/page.tsx`
- Modify: `src/app/projects/[projectId]/control/page.tsx`

- [ ] **Step 1: 扩展失败测试，要求项目页能跳到章节工作台和控盘页**

```ts
test("user can navigate project dashboard, chapter workbench and control page", async ({ page }) => {
  await page.goto("/projects/project_demo");
  await page.getByRole("link", { name: "章节工作台" }).click();
  await expect(page).toHaveURL(/\/chapter$/);
  await page.getByRole("link", { name: "控盘页" }).click();
  await expect(page).toHaveURL(/\/control$/);
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm playwright test tests/e2e/project-flow.spec.ts`
Expected: FAIL until links exist

- [ ] **Step 3: 补齐页面导航与可见状态**

```tsx
<Link href={`/projects/${projectId}/chapter`}>章节工作台</Link>
<Link href={`/projects/${projectId}/control`}>控盘页</Link>
```

- [ ] **Step 4: 运行完整验证**

Run: `pnpm vitest`
Expected: PASS

Run: `pnpm playwright test`
Expected: PASS

Run: `pnpm prisma validate`
Expected: schema valid

- [ ] **Step 5: Commit**

```bash
git add src/app/projects tests/e2e/project-flow.spec.ts
git commit -m "feat: complete v1 navigation flow"
```

### Task 14: 完善 README 与本地开发说明

**Files:**
- Modify: `README.md`
- Modify: `.env.example`

- [ ] **Step 1: 写失败检查清单，确认 README 覆盖安装、迁移、测试**

```md
- install
- env
- prisma migrate
- run dev
- run vitest
- run playwright
```

- [ ] **Step 2: 手工检查当前 README 不满足清单**

Run: `Get-Content README.md`
Expected: missing one or more required sections

- [ ] **Step 3: 补齐文档**

```md
## Local Development

1. `pnpm install`
2. `cp .env.example .env`
3. `pnpm prisma migrate dev`
4. `pnpm dev`
5. `pnpm vitest`
6. `pnpm playwright test`
```

- [ ] **Step 4: 手工复核文档**

Run: `Get-Content README.md`
Expected: contains all required sections

- [ ] **Step 5: Commit**

```bash
git add README.md .env.example
git commit -m "docs: add local development guide"
```

## Plan Review Notes

- 先打通事实源，再打通审批链，再做 workflow，再挂页面。
- 章节生产必须依赖完整上下文包与冲突检测，不能先绕过。
- route 集成测试统一直接导入 handler，避免不可执行的本地 HTTP 假设。
- 每个 Chunk 完成后先跑对应测试，再进入下一 Chunk。

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-03-16-novel-agent-v1.md`. Ready to execute?
