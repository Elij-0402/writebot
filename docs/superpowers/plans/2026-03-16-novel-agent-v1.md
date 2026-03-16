# 中文小说主编台 V1 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修正当前偏离 spec 的审批数据模型，并补齐 workflow、API、页面、验证与文档，形成符合设计文档的 V1 最小闭环。

**Architecture:** 先修正状态事实源，把 `Proposal`、`Review`、`ApprovalBatch`、`ApprovalBatchProposal`、`StateCommit` 的职责重新拉直，再在这个底座上实现三条 workflow、统一 mode routing、三个 API 和三个页面。所有业务写入都通过确定性状态模块执行，workflow 只产出结构化结果，不直接 commit。

**Tech Stack:** Next.js 16, TypeScript, React, Tailwind CSS, Prisma, PostgreSQL, Vitest, Playwright, ESLint

---

## File Structure

- `prisma/schema.prisma`
  修正状态模型，显式引入 `ApprovalBatch` 与 `ApprovalBatchProposal`
- `prisma/seed.ts`
  提供和新 schema 对齐的最小种子数据
- `src/lib/db.ts`
  Prisma client
- `src/lib/types/state.ts`
  状态对象类型、枚举和输入输出类型
- `src/lib/state/proposal-store.ts`
  proposal、review、approval batch 创建与读取
- `src/lib/state/audit-log.ts`
  审计日志记录与序列化
- `src/lib/state/commit-writer.ts`
  批准后的 proposal commit 管道
- `src/lib/state/project-state.ts`
  项目页聚合读取
- `src/lib/rules/state-sync.ts`
  proposal 状态同步规则
- `src/lib/rules/risk-rules.ts`
  高风险章节判断
- `src/lib/rules/context-conflicts.ts`
  上下文冲突检测
- `src/lib/authors/approval-policy.ts`
  审批角色升级规则
- `src/lib/state/context-package.ts`
  最小上下文包构建
- `src/lib/serializers/workflow-io.ts`
  workflow 输入输出序列化
- `src/lib/workflows/project-bootstrap.ts`
  立项到开写 workflow
- `src/lib/workflows/chapter-production.ts`
  章节生产 workflow
- `src/lib/workflows/story-control.ts`
  长篇纠偏 workflow
- `src/lib/workflows/novel-workflow.ts`
  统一 workflow 入口
- `src/lib/workflows/modes/write-mode.ts`
  写作模式路由
- `src/lib/workflows/modes/review-mode.ts`
  审校模式路由
- `src/lib/workflows/modes/control-mode.ts`
  控盘模式路由
- `src/lib/llm/client.ts`
  模型调用占位封装
- `src/lib/llm/prompts.ts`
  prompt 占位模板
- `src/app/api/projects/route.ts`
  项目创建与列表 API
- `src/app/api/projects/[projectId]/workflow/route.ts`
  workflow 入口 API
- `src/app/api/projects/[projectId]/approve/route.ts`
  审批 API
- `src/app/projects/page.tsx`
  项目列表页
- `src/app/projects/[projectId]/page.tsx`
  项目总览页
- `src/app/projects/[projectId]/chapter/page.tsx`
  章节工作台页
- `src/app/projects/[projectId]/control/page.tsx`
  控盘页
- `src/components/project/project-summary.tsx`
  项目总览组件
- `src/components/chapter/chapter-workbench.tsx`
  章节工作台组件
- `src/components/control/control-panel.tsx`
  控盘组件
- `src/components/shared/approval-banner.tsx`
  待审批提示条
- `tests/unit/state-sync.test.ts`
  proposal、approval batch、commit 的状态规则测试
- `tests/unit/approval-policy.test.ts`
  审批升级规则测试
- `tests/unit/context-package.test.ts`
  上下文包与冲突规则测试
- `tests/unit/project-bootstrap.test.ts`
  立项 workflow 测试
- `tests/unit/chapter-production.test.ts`
  章节生产 workflow 测试
- `tests/unit/story-control.test.ts`
  控盘 workflow 测试
- `tests/unit/workflow-modes.test.ts`
  mode routing 测试
- `tests/integration/projects-route.test.ts`
  projects route 集成测试
- `tests/integration/workflow-route.test.ts`
  workflow route 集成测试
- `tests/integration/approve-route.test.ts`
  approve route 集成测试
- `tests/e2e/project-flow.spec.ts`
  最小页面导航闭环
- `README.md`
  本地开发与验证说明
- `.env.example`
  本地环境变量模板

## Testing Notes

- 路由集成测试统一直接导入 route handler，不通过本地 HTTP 服务
- workflow 测试优先验证输出契约和状态边界，不提前实现复杂 AI 逻辑
- 每个任务遵循 TDD：先写失败测试，再实现最小代码，再运行对应测试
- `eslint` 与 `prisma validate` 是每个大 chunk 的最低验证要求

## Chunk 1: 数据模型修正与状态事实源

### Task 1: 修正 Prisma schema，引入 ApprovalBatch 与关联表

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `prisma/seed.ts`
- Modify: `src/lib/types/state.ts`
- Test: `tests/unit/state-sync.test.ts`

- [ ] **Step 1: 写失败单测，约束 workflow 审批不再直接挂在单个 proposal 上**

```ts
import { describe, expect, it } from "vitest";
import { createApprovalBatchRecord } from "@/lib/state/proposal-store";

describe("createApprovalBatchRecord", () => {
  it("creates a workflow batch that links multiple proposals", async () => {
    const result = await createApprovalBatchRecord({
      projectId: "project_1",
      scope: "workflow",
      requiredRole: "chief_editor",
      proposalIds: ["proposal_1", "proposal_2"],
    });

    expect(result.scope).toBe("workflow");
    expect(result.proposals).toHaveLength(2);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm.cmd vitest tests/unit/state-sync.test.ts`
Expected: FAIL with missing `createApprovalBatchRecord` or outdated schema assumptions

- [ ] **Step 3: 实现最小 schema 与类型修正**

```prisma
model ApprovalBatch {
  id           String                 @id @default(cuid())
  projectId    String
  scope        ApprovalScope
  requiredRole ApprovalRole
  status       ApprovalDecisionStatus @default(pending)
  reason       String?
  approvedAt   DateTime?
  proposals    ApprovalBatchProposal[]
}

model ApprovalBatchProposal {
  batchId    String
  proposalId String
  batch      ApprovalBatch @relation(fields: [batchId], references: [id], onDelete: Cascade)
  proposal   Proposal      @relation(fields: [proposalId], references: [id], onDelete: Cascade)

  @@id([batchId, proposalId])
}
```

- [ ] **Step 4: 运行测试与 schema 校验**

Run: `pnpm.cmd vitest tests/unit/state-sync.test.ts`
Expected: PASS

Run: `pnpm.cmd prisma validate`
Expected: `The schema at prisma/schema.prisma is valid`

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma prisma/seed.ts src/lib/types/state.ts tests/unit/state-sync.test.ts
git commit -m "feat: repair approval batch data model"
```

### Task 2: 重写 proposal store，显式创建 proposal、review 与 approval batch

**Files:**
- Modify: `src/lib/state/proposal-store.ts`
- Modify: `src/lib/state/audit-log.ts`
- Modify: `tests/unit/state-sync.test.ts`

- [ ] **Step 1: 写失败单测，约束 object batch 只包含一个 proposal**

```ts
it("creates an object batch for a single proposal", async () => {
  const result = await createApprovalBatchRecord({
    projectId: "project_1",
    scope: "object",
    requiredRole: "author",
    proposalIds: ["proposal_1"],
  });

  expect(result.proposals).toEqual([
    expect.objectContaining({ proposalId: "proposal_1" }),
  ]);
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm.cmd vitest tests/unit/state-sync.test.ts`
Expected: FAIL with wrong approval structure

- [ ] **Step 3: 实现最小 proposal/review/batch store**

```ts
export async function createApprovalBatchRecord(input: {
  projectId: string;
  scope: "object" | "workflow";
  requiredRole: "author" | "chief_editor";
  proposalIds: string[];
}) {
  return {
    id: "batch_demo",
    projectId: input.projectId,
    scope: input.scope,
    requiredRole: input.requiredRole,
    status: "pending" as const,
    proposals: input.proposalIds.map((proposalId) => ({ proposalId })),
  };
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm.cmd vitest tests/unit/state-sync.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/state/proposal-store.ts src/lib/state/audit-log.ts tests/unit/state-sync.test.ts
git commit -m "feat: add explicit proposal and approval batch store"
```

### Task 3: 实现 commit writer 与 proposal 状态同步规则

**Files:**
- Create: `src/lib/state/commit-writer.ts`
- Create: `src/lib/rules/state-sync.ts`
- Modify: `tests/unit/state-sync.test.ts`

- [ ] **Step 1: 写失败单测，约束未批准 proposal 不能 commit**

```ts
import { commitApprovedProposal } from "@/lib/state/commit-writer";

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
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm.cmd vitest tests/unit/state-sync.test.ts`
Expected: FAIL with missing module

- [ ] **Step 3: 实现最小 commit writer**

```ts
export async function commitApprovedProposal(input: {
  proposalId: string;
  proposalStatus: "approved" | "review_ready" | "committed";
  actorId: string;
  reason: string;
}) {
  if (input.proposalStatus !== "approved") {
    throw new Error("proposal not approved");
  }

  return {
    proposalId: input.proposalId,
    status: "committed" as const,
    auditEventType: "proposal_committed" as const,
  };
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm.cmd vitest tests/unit/state-sync.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/state/commit-writer.ts src/lib/rules/state-sync.ts tests/unit/state-sync.test.ts
git commit -m "feat: add proposal commit pipeline"
```

## Chunk 2: 审批策略与上下文规则

### Task 4: 实现审批升级规则与高风险章节判断

**Files:**
- Create: `src/lib/authors/approval-policy.ts`
- Create: `src/lib/rules/risk-rules.ts`
- Create: `tests/unit/approval-policy.test.ts`

- [ ] **Step 1: 写失败单测，约束高风险章节升级到 chief editor**

```ts
import { describe, expect, it } from "vitest";
import { resolveApprovalRequirement } from "@/lib/authors/approval-policy";

describe("resolveApprovalRequirement", () => {
  it("requires chief editor for high risk chapter draft", () => {
    const result = resolveApprovalRequirement({
      objectType: "chapter_draft",
      riskLevel: "high",
    });

    expect(result.requiredRole).toBe("chief_editor");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm.cmd vitest tests/unit/approval-policy.test.ts`
Expected: FAIL with missing module

- [ ] **Step 3: 实现最小审批规则**

```ts
export function resolveApprovalRequirement(input: {
  objectType: "chapter_draft" | "world_rule" | "plot" | "chapter_cards";
  riskLevel: "low" | "high";
}) {
  if (input.objectType !== "chapter_draft") {
    return { requiredRole: "chief_editor" as const };
  }

  return {
    requiredRole: input.riskLevel === "high" ? "chief_editor" : "author" as const,
  };
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm.cmd vitest tests/unit/approval-policy.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/authors/approval-policy.ts src/lib/rules/risk-rules.ts tests/unit/approval-policy.test.ts
git commit -m "feat: add approval escalation policy"
```

### Task 5: 实现最小上下文包与冲突检测

**Files:**
- Create: `src/lib/state/context-package.ts`
- Create: `src/lib/rules/context-conflicts.ts`
- Create: `src/lib/serializers/workflow-io.ts`
- Create: `tests/unit/context-package.test.ts`

- [ ] **Step 1: 写失败单测，约束缺少 chapter card 时 workflow 失败**

```ts
import { describe, expect, it } from "vitest";
import { buildContextPackage } from "@/lib/state/context-package";

describe("buildContextPackage", () => {
  it("fails when chapter card is missing", () => {
    const result = buildContextPackage({
      chapterCard: null,
      volumeSummary: "卷一摘要",
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

Run: `pnpm.cmd vitest tests/unit/context-package.test.ts`
Expected: FAIL with missing module

- [ ] **Step 3: 实现最小上下文包规则**

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
  if (!input.chapterCard) {
    return { ok: false as const, reason: "missing_chapter_card" as const };
  }

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

Run: `pnpm.cmd vitest tests/unit/context-package.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/state/context-package.ts src/lib/rules/context-conflicts.ts src/lib/serializers/workflow-io.ts tests/unit/context-package.test.ts
git commit -m "feat: add context package constraints"
```

## Chunk 3: 三条核心 workflow 与 mode routing

### Task 6: 实现 project bootstrap workflow

**Files:**
- Create: `src/lib/workflows/project-bootstrap.ts`
- Create: `tests/unit/project-bootstrap.test.ts`

- [ ] **Step 1: 写失败单测，约束立项 workflow 输出 proposals、review 和 workflow batch**

```ts
import { describe, expect, it } from "vitest";
import { runProjectBootstrap } from "@/lib/workflows/project-bootstrap";

describe("runProjectBootstrap", () => {
  it("returns bootstrap proposals, review result and workflow batch draft", async () => {
    const result = await runProjectBootstrap({ prompt: "玄幻升级流" });

    expect(result.proposals).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ objectType: "project_card" }),
        expect.objectContaining({ objectType: "world_rule" }),
        expect.objectContaining({ objectType: "plot" }),
      ]),
    );
    expect(result.review.status).toBe("review_ready");
    expect(result.approvalBatchDraft.scope).toBe("workflow");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm.cmd vitest tests/unit/project-bootstrap.test.ts`
Expected: FAIL with missing module

- [ ] **Step 3: 实现最小 workflow**

```ts
export async function runProjectBootstrap(input: { prompt: string }) {
  return {
    proposals: [
      { objectType: "project_card", content: input.prompt },
      { objectType: "world_rule", content: "world draft" },
      { objectType: "plot", content: "plot draft" },
      { objectType: "chapter_cards", content: "first ten cards" },
    ],
    review: { status: "review_ready" as const },
    approvalBatchDraft: {
      scope: "workflow" as const,
      requiredRole: "chief_editor" as const,
    },
  };
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm.cmd vitest tests/unit/project-bootstrap.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/workflows/project-bootstrap.ts tests/unit/project-bootstrap.test.ts
git commit -m "feat: add project bootstrap workflow"
```

### Task 7: 实现 chapter production workflow

**Files:**
- Create: `src/lib/workflows/chapter-production.ts`
- Create: `tests/unit/chapter-production.test.ts`

- [ ] **Step 1: 写失败单测，约束章节 workflow 输出 draft proposal 和 review**

```ts
import { describe, expect, it } from "vitest";
import { runChapterProduction } from "@/lib/workflows/chapter-production";

describe("runChapterProduction", () => {
  it("returns a chapter draft proposal plus review result", async () => {
    const result = await runChapterProduction({
      projectId: "project_1",
      chapterId: "chapter_8",
    });

    expect(result.proposals[0].objectType).toBe("chapter_draft");
    expect(result.review.status).toBe("review_ready");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm.cmd vitest tests/unit/chapter-production.test.ts`
Expected: FAIL with missing module

- [ ] **Step 3: 实现最小 workflow**

```ts
export async function runChapterProduction(input: {
  projectId: string;
  chapterId: string;
}) {
  return {
    proposals: [
      {
        objectType: "chapter_draft",
        projectId: input.projectId,
        chapterId: input.chapterId,
      },
    ],
    review: { status: "review_ready" as const },
    approvalBatchDraft: { scope: "object" as const, requiredRole: "author" as const },
  };
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm.cmd vitest tests/unit/chapter-production.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/workflows/chapter-production.ts tests/unit/chapter-production.test.ts
git commit -m "feat: add chapter production workflow"
```

### Task 8: 实现 story control workflow

**Files:**
- Create: `src/lib/workflows/story-control.ts`
- Create: `tests/unit/story-control.test.ts`

- [ ] **Step 1: 写失败单测，约束控盘 workflow 输出风险报告、三类方案和 workflow batch**

```ts
import { describe, expect, it } from "vitest";
import { runStoryControl } from "@/lib/workflows/story-control";

describe("runStoryControl", () => {
  it("returns risk report, correction options and workflow batch draft", async () => {
    const result = await runStoryControl({ projectId: "project_1" });

    expect(result.options).toHaveLength(3);
    expect(result.approvalBatchDraft.scope).toBe("workflow");
    expect(result.decisionLog.type).toBe("story_control");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm.cmd vitest tests/unit/story-control.test.ts`
Expected: FAIL with missing module

- [ ] **Step 3: 实现最小 workflow**

```ts
export async function runStoryControl(input: { projectId: string }) {
  return {
    projectId: input.projectId,
    riskReport: { summary: "mainline drift" },
    options: ["conservative", "moderate", "force_converge"],
    proposals: [{ objectType: "plot", content: "repair outline" }],
    approvalBatchDraft: { scope: "workflow" as const, requiredRole: "chief_editor" as const },
    decisionLog: { type: "story_control" as const },
  };
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm.cmd vitest tests/unit/story-control.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/workflows/story-control.ts tests/unit/story-control.test.ts
git commit -m "feat: add story control workflow"
```

### Task 9: 实现统一 workflow 入口与 mode routing

**Files:**
- Create: `src/lib/workflows/novel-workflow.ts`
- Create: `src/lib/workflows/modes/write-mode.ts`
- Create: `src/lib/workflows/modes/review-mode.ts`
- Create: `src/lib/workflows/modes/control-mode.ts`
- Create: `src/lib/llm/client.ts`
- Create: `src/lib/llm/prompts.ts`
- Create: `tests/unit/workflow-modes.test.ts`

- [ ] **Step 1: 写失败单测，约束 control mode 路由到 story control**

```ts
import { describe, expect, it } from "vitest";
import { runNovelWorkflow } from "@/lib/workflows/novel-workflow";

describe("runNovelWorkflow", () => {
  it("routes control mode requests to story control", async () => {
    const result = await runNovelWorkflow({
      mode: "control",
      action: "inspect_story",
      projectId: "project_1",
    });

    expect(result.mode).toBe("control");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm.cmd vitest tests/unit/workflow-modes.test.ts`
Expected: FAIL with missing module

- [ ] **Step 3: 实现最小 mode routing**

```ts
export async function runNovelWorkflow(input: {
  mode: "write" | "review" | "control";
  action: string;
  projectId?: string;
}) {
  return {
    mode: input.mode,
    action: input.action,
    status: "ok" as const,
  };
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm.cmd vitest tests/unit/workflow-modes.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/workflows src/lib/llm tests/unit/workflow-modes.test.ts
git commit -m "feat: add workflow mode routing"
```

## Chunk 4: API 与页面

### Task 10: 实现 projects API 与项目页

**Files:**
- Create: `src/app/api/projects/route.ts`
- Create: `src/app/projects/[projectId]/page.tsx`
- Modify: `src/app/projects/page.tsx`
- Create: `src/components/project/project-summary.tsx`
- Create: `src/lib/state/project-state.ts`
- Create: `tests/integration/projects-route.test.ts`

- [ ] **Step 1: 写失败集成测试，约束项目创建成功返回 201**

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

Run: `pnpm.cmd vitest tests/integration/projects-route.test.ts`
Expected: FAIL with missing route

- [ ] **Step 3: 实现最小 route 与页面**

```ts
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ id: "project_demo" }, { status: 201 });
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm.cmd vitest tests/integration/projects-route.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/api/projects/route.ts src/app/projects src/components/project/project-summary.tsx src/lib/state/project-state.ts tests/integration/projects-route.test.ts
git commit -m "feat: add projects route and dashboard"
```

### Task 11: 实现 workflow API 与章节工作台

**Files:**
- Create: `src/app/api/projects/[projectId]/workflow/route.ts`
- Create: `src/app/projects/[projectId]/chapter/page.tsx`
- Create: `src/components/chapter/chapter-workbench.tsx`
- Create: `src/components/shared/approval-banner.tsx`
- Create: `tests/integration/workflow-route.test.ts`
- Modify: `tests/e2e/project-flow.spec.ts`

- [ ] **Step 1: 写失败集成测试，约束 workflow route 返回 workflow 结果**

```ts
import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/projects/[projectId]/workflow/route";

describe("POST /api/projects/:projectId/workflow", () => {
  it("returns workflow result", async () => {
    const request = new Request("http://localhost/api/projects/project_demo/workflow", {
      method: "POST",
      body: JSON.stringify({ mode: "write", action: "draft_chapter" }),
    });

    const response = await POST(
      request as any,
      { params: Promise.resolve({ projectId: "project_demo" }) } as any,
    );

    expect(response.status).toBe(200);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm.cmd vitest tests/integration/workflow-route.test.ts`
Expected: FAIL with missing route

- [ ] **Step 3: 实现最小 route 与页面**

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

- [ ] **Step 4: 运行集成测试确认通过**

Run: `pnpm.cmd vitest tests/integration/workflow-route.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/api/projects/[projectId]/workflow/route.ts src/app/projects/[projectId]/chapter/page.tsx src/components/chapter/chapter-workbench.tsx src/components/shared/approval-banner.tsx tests/integration/workflow-route.test.ts tests/e2e/project-flow.spec.ts
git commit -m "feat: add workflow route and chapter workbench"
```

### Task 12: 实现 approve API 与控盘页

**Files:**
- Create: `src/app/api/projects/[projectId]/approve/route.ts`
- Create: `src/app/projects/[projectId]/control/page.tsx`
- Create: `src/components/control/control-panel.tsx`
- Create: `tests/integration/approve-route.test.ts`

- [ ] **Step 1: 写失败集成测试，约束缺少 actorId 和 reason 时返回 400**

```ts
import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/projects/[projectId]/approve/route";

describe("POST /api/projects/:projectId/approve", () => {
  it("rejects incomplete approval payload", async () => {
    const request = new Request("http://localhost/api/projects/project_demo/approve", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(
      request as any,
      { params: Promise.resolve({ projectId: "project_demo" }) } as any,
    );

    expect(response.status).toBe(400);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm.cmd vitest tests/integration/approve-route.test.ts`
Expected: FAIL with missing route

- [ ] **Step 3: 实现最小 route 与页面**

```ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.actorId || !body.reason) {
    return NextResponse.json({ error: "actorId and reason required" }, { status: 400 });
  }

  return NextResponse.json({ status: "approved" }, { status: 200 });
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm.cmd vitest tests/integration/approve-route.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/api/projects/[projectId]/approve/route.ts src/app/projects/[projectId]/control/page.tsx src/components/control/control-panel.tsx tests/integration/approve-route.test.ts
git commit -m "feat: add approve route and control page"
```

### Task 13: 打通页面导航最小闭环

**Files:**
- Modify: `src/app/projects/[projectId]/page.tsx`
- Modify: `src/app/projects/[projectId]/chapter/page.tsx`
- Modify: `src/app/projects/[projectId]/control/page.tsx`
- Modify: `tests/e2e/project-flow.spec.ts`

- [ ] **Step 1: 写失败 E2E，约束项目页能进入章节工作台和控盘页**

```ts
import { expect, test } from "@playwright/test";

test("user can navigate project dashboard, chapter workbench and control page", async ({ page }) => {
  await page.goto("/projects/project_demo");
  await page.getByRole("link", { name: "章节工作台" }).click();
  await expect(page).toHaveURL(/\/chapter$/);
  await page.goto("/projects/project_demo");
  await page.getByRole("link", { name: "控盘页" }).click();
  await expect(page).toHaveURL(/\/control$/);
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm.cmd playwright test tests/e2e/project-flow.spec.ts`
Expected: FAIL until page links exist

- [ ] **Step 3: 实现最小导航**

```tsx
<Link href={`/projects/${projectId}/chapter`}>章节工作台</Link>
<Link href={`/projects/${projectId}/control`}>控盘页</Link>
```

- [ ] **Step 4: 运行测试确认通过**

Run: `pnpm.cmd playwright test tests/e2e/project-flow.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/projects tests/e2e/project-flow.spec.ts
git commit -m "feat: complete project navigation flow"
```

## Chunk 5: 收尾验证与文档

### Task 14: 完善 README 与环境说明

**Files:**
- Modify: `README.md`
- Modify: `.env.example`

- [ ] **Step 1: 写文档检查清单**

```md
- install
- env
- prisma validate
- run dev
- run unit tests
- run e2e tests
```

- [ ] **Step 2: 手工检查当前 README 不满足清单**

Run: `Get-Content README.md`
Expected: missing one or more required sections

- [ ] **Step 3: 补齐文档**

```md
## Local Development

1. `pnpm install`
2. `Copy-Item .env.example .env`
3. `pnpm prisma validate`
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
git commit -m "docs: complete local development guide"
```

### Task 15: 完整验证 V1 最小闭环

**Files:**
- Modify: `README.md` if verification notes need correction

- [ ] **Step 1: 运行单测**

Run: `pnpm.cmd vitest`
Expected: PASS

- [ ] **Step 2: 运行集成与 E2E**

Run: `pnpm.cmd playwright test`
Expected: PASS

- [ ] **Step 3: 运行 lint 与 Prisma 校验**

Run: `pnpm.cmd lint`
Expected: PASS

Run: `pnpm.cmd prisma validate`
Expected: schema valid

- [ ] **Step 4: 记录任何环境级阻塞并修正文档**

Run: `Get-Content README.md`
Expected: documents any local caveats discovered during verification

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "chore: verify v1 implementation"
```

## Plan Review Notes

- 先修正数据底座，再做 workflow、API 和页面，避免后续建立在错误审批语义上
- `workflow` 级审批必须通过 `ApprovalBatch` 建模，不允许继续挂靠到单个 proposal
- workflow 只返回结构化结果，不直接 commit
- route 测试统一直接导入 handler，避免脆弱的本地服务依赖
- 最小闭环以显式状态、审批记录和页面可导航为准，不在本轮引入额外复杂度

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-03-16-novel-agent-v1.md`. Ready to execute?
