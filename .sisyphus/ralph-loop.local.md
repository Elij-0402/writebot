---
active: true
iteration: 4
completion_promise: "VERIFIED"
initial_completion_promise: "DONE"
verification_attempt_id: "3967893a-21c6-4fc5-a192-fe30171386a4"
started_at: "2026-03-16T19:38:14.443Z"
session_id: "ses_307d809e1ffediJJxmdrT0KpTx"
ultrawork: true
verification_pending: true
strategy: "continue"
message_count_at_start: 1
---
先完整阅读并严格遵循这个计划文件：
.sisyphus/plans/agent-novel-product-roadmap.md
你现在的任务不是重新规划，而是**从当前仓库真实状态出发，持续执行计划中的所有剩余开发，直到交付或遇到明确外部阻塞**。
## 硬约束（不得改写）
- 产品定位：专业作者主编台
- 核心价值：作者控制优先，不以纯出稿速度为先
- MVP：单作者成书闭环
- 首发市场：中文网文作者
- 产品形态：开源、自部署优先
- 产品载体：Web-first
- 技术现实：当前仓库是 Next.js 16 + React 19 + TypeScript + Tailwind 4 + Prisma + PostgreSQL + Vitest + Playwright
- 模型接入：必须采用**产品自有 provider abstraction**
- 兼容要求：支持 API key / base URL / OpenAI-compatible chat / completions / responses 风格接入
- 计划内护城河：workflow UX + narrative memory + author trust
- durable canon 只能被 approved artifacts 改写
## 明确禁止
- 禁止把产品回退成 chat-first 写作助手
- 禁止把支持很多模型包装成核心产品价值
- 禁止扩展到多作者协作作为 v1 主线
- 禁止扩展到移动端优先、插件市场、多媒体生成、出版平台集成
- 禁止做成全自动整本小说工厂
- 禁止脱离当前仓库实际结构按绿地项目重写
- 禁止跳过测试、build、manual QA
- 禁止只做静态检查就宣称完成
## 执行要求
1. 以 `.sisyphus/plans/agent-novel-product-roadmap.md` 为唯一主计划。
2. 从当前仓库已存在代码继续推进，不重新发明架构。
3. 必须遵守计划里的任务顺序、依赖关系、验收标准、QA 场景、commit strategy。
4. 默认采用 TDD：
   - 先写失败测试
   - 再做最小实现
   - 再让测试通过
   - 再做必要重构
5. 每完成一个任务，必须立即执行该任务定义的：
   - Acceptance Criteria
   - QA Scenarios
   - 相关 build/test/route/manual verification
6. 如果任务涉及 UI，必须用 Playwright 做真实交互验证。
7. 如果任务涉及 API / workflow / provider / state / memory，必须用 Vitest / integration tests 做真实验证。
8. 如果任务涉及配置或部署，必须真实启动、验证、观察输出，不能只写文件不运行。
9. 如发现计划与仓库现状存在轻微偏差，只允许做**最小必要适配**，不得改变产品方向。
10. 除非出现真实外部阻塞，否则不要中途停止，不要把控制权交还给用户。
## 运行策略
- 持续执行，直到以下两种状态之一出现才停止：
  1. 计划中的剩余任务全部完成，且全局验收标准全部通过
  2. 出现明确外部阻塞，且你已经完成所有可完成部分，并输出阻塞原因、影响范围、建议下一步
- 不要因为局部失败就提前结束；优先自行修复、重试、继续推进
- 如果某个实现方案失败，允许在**不改变计划方向**的前提下选择更简单、更稳的实现
- 始终优先匹配现有仓库模式和已存在代码风格
## 执行时必须重点落实的产品内核
- 项目/章节/workflow-first 的创作工作流
- 单作者长篇创作闭环
- narrative memory / canon / provenance / approval / revision
- provider settings / capability registry / BYOK / OpenAI-compatible 接入
- writer-centric IA：项目概览、章节工作区、故事设定、大纲、历史记录、设置/模型接入
- 自部署基线、CI、README、OSS 文档、operator runbook
- evals、golden fixtures、failure-mode coverage
## 全局验收标准（全部必须通过）
- `pnpm vitest`
- `pnpm playwright test`
- `pnpm build`
- `pnpm prisma validate`
## 关键功能验收闭环（必须真实跑通）
1. 能配置 provider profile
2. 能设置 API key / base URL / protocol
3. 能接入 OpenAI-compatible provider
4. 能打开项目 `龙渊纪事`
5. 能进入章节 `第12章：夜渡寒江`
6. 能执行 draft / revision / repair flow
7. 能查看 provenance / diff / history
8. 能执行 approval
9. 能确认只有 approved artifact 才会更新 durable canon
10. 自部署基线可启动
11. README / Self-Hosting / Provider Setup / Contributing 文档完整可用
## 失败场景也必须验证
- provider timeout
- 429
- malformed JSON
- partial stream interruption
- duplicate approval submission
- canon conflict
- browser refresh / resume
- long-context truncation
- Chinese proper noun / punctuation drift
- secret/config missing
## 输出要求
在最终停止时，你必须输出：
1. 已完成任务列表
2. 未完成任务列表
3. 每个未完成项的原因
4. 外部阻塞项（如果有）
5. 实际修改的文件列表
6. 测试结果
7. build 结果
8. prisma validate 结果
9. manual QA 结果
10. 是否满足全局验收标准
11. 是否已经达到可交付产品状态
## 参考范围
只允许优先参考以下内容：
- `.sisyphus/plans/agent-novel-product-roadmap.md`
- 当前仓库实际代码
- 计划中引用的现有文档
