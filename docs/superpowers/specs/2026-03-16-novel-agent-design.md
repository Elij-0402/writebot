# 中文小说主编台 V1 设计文档

- 日期：2026-03-16
- 状态：Approved for planning
- 目标读者：Writebot 内部开发者
- 关联计划：[docs/superpowers/plans/2026-03-16-novel-agent-v1.md](/D:/writebot/docs/superpowers/plans/2026-03-16-novel-agent-v1.md)

## 1. 背景

当前仓库已经完成 `Task 1` 的应用骨架，并实现了一版 `Task 2` 的 Prisma 状态模型、proposal store 与基础测试。但现有实现存在一个关键设计偏差：`workflow` 级审批被直接挂在单个 `proposal` 上，导致“单对象变更提案”和“整组 workflow 产出的审批动作”语义混杂。

这个偏差如果不先修正，后续的审批接口、commit pipeline、workflow API 和控制台页面都会建立在错误抽象上，后面会发生连锁返工。因此本轮设计先修正数据模型，再继续补齐 docs 中尚未完成的核心功能。

## 2. 目标

本轮工作的目标不是快速补齐一个演示壳，而是把 V1 按 docs 中已经确认的边界补完整：

1. 修正 `Task 2`，让审批模型重新贴合 spec
2. 实现三条核心 workflow 的最小闭环
3. 暴露 projects / workflow / approve 三个 API
4. 补齐项目页、章节工作台、控盘页和最小导航流
5. 完成验证与 README，本地能清晰运行和检查

## 3. 交付策略

整体实现分为四个顺序阶段：

### Phase A: 修正 Task 2 数据底座

- 修正 Prisma schema
- 调整 seed 数据
- 调整 `src/lib/types/state.ts`
- 调整 `proposal-store`、审计日志和相关单测

### Phase B: 构建核心 workflow

- 审批升级规则
- commit writer
- context package 与冲突检测
- project bootstrap
- chapter production
- story control
- workflow mode routing

### Phase C: 暴露产品表面

- 项目 API 和项目页
- workflow API 和章节工作台
- approve API 和控盘页
- 端到端导航与最小闭环

### Phase D: 验证与文档

- 完整跑 lint / Prisma / unit / e2e
- 补齐 README 和 `.env.example`
- 确认 docs 中定义的最小闭环成立

## 4. 数据模型设计

### 4.1 设计原则

- `Proposal` 只表示单个状态对象的一次变更提案
- `Workflow` 级审批必须是显式的一组 proposal，不允许伪装成“挂在某个 proposal 上”
- 审批与提交要分离：批准不等于已提交
- 所有关键状态变更都必须有审计记录

### 4.2 核心对象

#### Project

项目根对象，承接 proposals、审批批次、审计日志以及后续页面聚合查询。

#### Proposal

只表示“一个对象的一次变更提案”，例如：

- 一个 `chapter_draft`
- 一个 `world_rule`
- 一个 `plot`
- 一组 `chapter_cards`

Proposal 不再直接表达“整个 workflow 的审批”。

#### Review

挂在单个 proposal 上，记录 review 结果与备注，并负责把提案推进到 `review_ready`。

#### ApprovalBatch

审批批次对象，是本次修正的核心。它表示“一次审批动作要处理的一组 proposal”。

- `scope = object`：表示审批 1 个 proposal
- `scope = workflow`：表示审批一个 workflow 产出的多个 proposals

批次本身记录：

- `projectId`
- `scope`
- `requiredRole`
- `status`
- `reason`
- `approvedAt`

#### ApprovalBatchProposal

审批批次和 proposal 的关联表。它用于显式表达“某个 workflow 批次包含哪些 proposals”。

这样 `workflow` 级审批不再依附于某个 proposal，而是独立存在，并关联多条 proposals。

#### StateCommit

最终提交记录。只有当 proposal 已经被批准时才能创建。`workflow` 批次批准后，系统按 proposal 逐项 commit。

#### AuditLog

审计日志，记录 proposal 创建、review、审批、commit 等关键动作。

### 4.3 状态语义

Proposal 的业务状态保持为：

`proposal -> review_ready -> approved -> committed`

其中：

- `approved` 可能来源于 `object` 批次批准
- 也可能来源于 `workflow` 批次批准
- `committed` 只在 commit writer 明确执行后产生

## 5. 模块边界

### 5.1 `src/lib/workflows/*`

workflow 模块只负责产出结构化结果，不直接写最终状态。每条 workflow 至少返回：

- `proposals`
- `review` 结果
- `approvalBatchDraft`
- 面向 UI 的摘要

workflow 模块不直接 commit，不直接替代人工审批。

### 5.2 `src/lib/state/*`

状态模块只负责确定性读写：

- proposal 落库
- review 记录
- approval batch 落库
- 审计日志
- commit writer

状态模块不负责业务推理，不在这里藏 workflow 语义。

### 5.3 API 路由

#### `POST /api/projects`

- 创建项目
- 返回项目基础信息

#### `POST /api/projects/:projectId/workflow`

- 根据 `mode` 和 `action` 调用具体 workflow
- 保存 proposals / review / approval batch
- 返回 workflow 结果给前端

#### `POST /api/projects/:projectId/approve`

- 接收 `proposalId` 或 `approvalBatchId`
- 校验 `actorId`、角色与 `reason`
- 执行批准或拒绝
- 如批准则调用 commit writer

### 5.4 页面职责

#### 项目页 `projects/[projectId]/page.tsx`

展示：

- 项目状态概览
- 待审批项目
- 进入章节工作台入口
- 进入控盘页入口

#### 章节工作台 `projects/[projectId]/chapter/page.tsx`

展示：

- 当前章节上下文
- 章节草稿 proposal
- review 结果
- 待审批状态

#### 控盘页 `projects/[projectId]/control/page.tsx`

展示：

- 风险报告
- 三类修正方案
- `workflow` 级审批入口

## 6. 核心 workflow 设计

### 6.1 Project Bootstrap

目标：把立项输入转换成一组可审批的 proposal。

最小输出包括：

- `project_card`
- `world_rule`
- `plot`
- 前置 `chapter_cards`
- review 结果
- `workflow` 级 approval batch 草案

### 6.2 Chapter Production

目标：基于最小上下文包生成章节草稿 proposal。

最小输出包括：

- `chapter_draft` proposal
- review 结果
- `object` 或 `workflow` 级审批批次草案

### 6.3 Story Control

目标：对全书或当前卷输出风险报告和修正方案。

最小输出包括：

- risk report
- 三类修正方案
- 对应 proposals
- `workflow` 级审批批次草案

### 6.4 Mode Routing

统一 workflow 入口根据 `mode` 路由到：

- `write`
- `review`
- `control`

mode routing 只做分发，不复制下层业务逻辑。

## 7. 错误处理规则

必须收紧以下硬规则：

1. 缺少 `chapter_card` 时，章节生产 workflow 必须失败，不生成正式 draft proposal
2. `workflow` 批次内 proposal 为空时，审批请求直接拒绝
3. commit writer 只能处理已批准 proposal；未批准或已提交 proposal 必须报错
4. 高风险章节或非 `chapter_draft` 对象，审批角色自动升级为 `chief_editor`
5. 所有 approve / reject / commit 都必须写审计日志

## 8. 测试与验证

### 8.1 单测

至少覆盖：

- proposal / approval batch 建模
- 审批升级规则
- commit 限制
- context package 缺失与冲突
- 三条 workflow 的最小输出契约
- mode routing

### 8.2 集成测试

至少覆盖以下 route handler：

- `POST /api/projects`
- `POST /api/projects/:projectId/workflow`
- `POST /api/projects/:projectId/approve`

### 8.3 E2E

至少覆盖：

- `/` 重定向到 `/projects`
- 从项目页进入章节工作台
- 从项目页进入控盘页

### 8.4 额外验证

- `eslint`
- `prisma validate`
- README 本地开发说明完整

## 9. 非目标

本轮不包含：

- 对外商业化能力
- 多租户复杂权限系统
- 完整自治的多 agent 协作
- 高保真品牌视觉包装
- 超出 docs 定义范围的功能扩张

## 10. 结论

当前仓库的正确推进方式不是继续在现有 `Task 2` 模型上打补丁，而是先修正数据模型，让：

- proposal 保持单对象语义
- workflow 审批使用独立 approval batch
- approve 与 commit 明确分离
- 页面展示显式状态而不是隐式 prompt 状态

在这个底座上，再顺序补齐 workflow、API、页面和验证，才能真正把 docs 中未完成的部分补完整。
