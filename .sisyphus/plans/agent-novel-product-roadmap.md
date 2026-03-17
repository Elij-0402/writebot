# Agent Novel Product Roadmap

## TL;DR
> **Summary**: Evolve the current Writebot prototype into a 2026-grade, workflow-first, human-confirmed, artifact-driven novel creation product for Chinese web novel authors. The product remains Web-first, open-source, self-hostable, and provider-agnostic via a product-owned provider abstraction rather than a chat-first shell.
> **Deliverables**:
> - Market thesis and product positioning for Chinese web novel authors
> - PRD for a single-author, author-control-first creation desk
> - Narrative memory, canon, provider, and deployment architecture
> - Writer-centric IA and UI/UX direction grounded in the current prototype
> - Full-stack execution roadmap with TDD, evals, self-host baseline, and launch readiness
> **Effort**: XL
> **Parallel**: YES - 3 waves
> **Critical Path**: 1 → 2 → 3 → 4 → 8 → 10 → 12 → 13 → 14 → 15

## Context
### Original Request
Plan the iterative direction and full product form for the current project, spanning market analysis, PRD, architecture, UI/UX, and full-stack execution, aligned with 2026-era Anthropic / GPT / Gemini agent best practices for a novel-writing product.

### Interview Summary
- Product category: professional author chief-editor desk
- Core promise: author control first, not raw generation speed
- Primary workflow: single-author manuscript flow first
- Primary market: Chinese web novel authors
- Product shape: open-source, self-host-first, Web-first
- Model access: highly configurable API key / base URL / multi-provider setup with OpenAI-compatible chat/completions/responses support
- Verification default: TDD for execution phases

### Metis Review (gaps addressed)
- Locked the moat to workflow UX + narrative memory + verifiable author trust, not provider breadth
- Added explicit guardrails against chat-first drift, autonomous-book-factory scope, and premature collaboration features
- Added deployment baseline, provenance rules, golden fixtures, eval classes, and failure-mode coverage to avoid “verification theater”
- Applied defaults for unresolved but non-blocking questions instead of reopening the interview

## Work Objectives
### Core Objective
Transform the existing workflow-first prototype into a production-shaped roadmap for an open-source, self-hostable, Chinese web novel writing product that helps serious authors plan, draft, revise, and maintain canon with explicit human control.

### Deliverables
- Decision-complete market and product thesis
- MVP PRD with scope, non-goals, metrics, and artifact lifecycle
- Canonical narrative memory and provider architecture
- Writer-centric IA and UI/UX blueprint
- Self-host deployment baseline and CI strategy
- Phased full-stack implementation roadmap with executable acceptance criteria

### Definition of Done (verifiable conditions with commands)
- `powershell -Command "Test-Path '.sisyphus/plans/agent-novel-product-roadmap.md'"` returns `True`
- `powershell -Command "(Get-Content '.sisyphus/plans/agent-novel-product-roadmap.md' -Raw) -match '## Work Objectives'"` returns `True`
- `powershell -Command "(Get-Content '.sisyphus/plans/agent-novel-product-roadmap.md' -Raw) -match '## TODOs'"` returns `True`
- `powershell -Command "(Get-Content '.sisyphus/plans/agent-novel-product-roadmap.md' -Raw) -match '## Final Verification Wave'"` returns `True`

### Must Have
- Single-author, author-control-first thesis
- Chinese web novel workflow assumptions
- Artifact-driven lifecycle: premise → outline → chapter plan → chapter draft → revision → approved canon
- Canon mutation rule: only approved artifacts may modify durable truth
- Product-owned provider abstraction and capability registry
- Open-source self-host baseline with clear deployment minimum
- TDD gates, golden fixtures, evals, and provenance requirements

### Must NOT Have (guardrails, AI slop patterns, scope boundaries)
- No chat-first repositioning
- No fully autonomous novel-generation factory in v1
- No multi-author merge semantics in v1
- No mobile/native-first roadmap in the first implementation waves
- No plugin marketplace, multimedia generation, or publishing-platform integrations in v1
- No product thesis built around “supports many providers” as the primary differentiation
- No deployment story that assumes Vercel alone solves long-running workflows, secrets, storage, and queueing

### Unvalidated Assumptions
- Commercial stance default: OSS self-host first, managed cloud later if demand appears
- Provider floor default: support named first-party adapters for Anthropic/OpenAI/Gemini plus OpenAI-compatible endpoints as the extensibility floor
- Success-priority default: author review confidence first, continuity quality second, drafting throughput third
- Content-segment default: broad Chinese web novel workflow, not male-frequency/female-frequency specialization in v1
- Deployment baseline default: single-node containerized self-hosting before any k8s or multi-cluster story
- Observability default: per-run provenance, latency, failure class, and approximate cost tracking are mandatory in v1

## Verification Strategy
> ZERO HUMAN INTERVENTION — all verification is agent-executed.
- Test decision: TDD + Vitest / Playwright / Prisma validate / Next build
- QA policy: Every task includes executable happy-path and failure-path scenarios
- Golden fixtures:
  - Project: `龙渊纪事`
  - Chapter: `第12章：夜渡寒江`
  - Provider profile: `openai-compatible-local` with base URL `http://localhost:11434/v1`
- Evidence: `.sisyphus/evidence/task-{N}-{slug}.{ext}`
- Required command set for all implementation waves:
  - `pnpm vitest`
  - `pnpm playwright test`
  - `pnpm build`
  - `pnpm prisma validate`

## Edge Cases / Failure Modes
- Provider protocol mismatch between Chat Completions, Responses, and provider-specific streaming semantics
- Timeout / 429 / malformed JSON / partial-stream interruptions during chapter generation or revision
- Duplicate approval submission or stale revision accept/reject actions after another state change
- Long-context truncation that drops active canon or chapter brief before low-priority material
- Canon conflict between approved lore and newly generated proposal
- Resume after browser refresh or server restart during an in-progress workflow
- Chinese punctuation drift, proper noun drift, and terminology inconsistency across revisions
- Secret/config misconfiguration for self-hosted operators

## Execution Strategy
### Parallel Execution Waves
> Target: 5-8 tasks per wave. Extract shared dependencies first.

Wave 1: thesis, PRD, canon/memory model, provider kernel, deployment baseline

Wave 2: writer-centric IA, project overview, chapter workspace, config center, revision/provenance surfaces

Wave 3: eval harness, CI/self-host packaging, launch readiness, OSS documentation, final hardening

### Dependency Matrix (full, all tasks)
| Task | Depends On | Enables |
|---|---|---|
| 1 | - | 2, 3, 4, 6 |
| 2 | 1 | 6, 8, 10, 15 |
| 3 | 1, 2 | 8, 10, 11, 12 |
| 4 | 1, 2 | 7, 11, 12, 14 |
| 5 | 1, 4 | 13, 14, 15 |
| 6 | 1, 2 | 8, 9, 10 |
| 7 | 4, 5 | 11, 14 |
| 8 | 3, 6 | 9, 10, 12 |
| 9 | 6, 8 | 10, 15 |
| 10 | 3, 6, 8, 9 | 12, 15 |
| 11 | 3, 4, 7 | 12, 13, 15 |
| 12 | 3, 4, 8, 10, 11 | 13, 15 |
| 13 | 5, 7, 11, 12 | 14, 15 |
| 14 | 5, 7, 13 | 15 |
| 15 | 2, 9, 10, 12, 13, 14 | F1-F4 |

### Agent Dispatch Summary (wave → task count → categories)
- Wave 1 → 5 tasks → writing / deep / unspecified-high
- Wave 2 → 5 tasks → visual-engineering / deep / unspecified-high
- Wave 3 → 5 tasks → deep / writing / unspecified-high

## TODOs
> Implementation + Test = ONE task. Never separate.
> EVERY task MUST have: Agent Profile + Parallelization + QA Scenarios.

- [ ] 1. Lock product thesis, market stance, and v1 scope

  **What to do**: Create `docs/product/market-thesis.md` that turns the interview outcomes into a durable product thesis. Define the target user as serious Chinese web novel authors, compare the product against generic chat writing tools and automation-first “book factories,” document why author control wins, and list explicit v1 exclusions.
  **Must NOT do**: Do not reposition the product as a generic AI writing assistant, team studio suite, or autonomous novel generator. Do not make provider breadth the headline of the product thesis.

  **Recommended Agent Profile**:
  - Category: `writing` — Reason: this task is product-definition heavy and must produce clear, decision-grade prose
  - Skills: `[]` — no additional skill required beyond repo-grounded writing
  - Omitted: `[playwright]` — no browser interaction needed for thesis authoring

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: 2, 3, 4, 5, 6 | Blocked By: none

  **References** (executor has NO interview context — be exhaustive):
  - Pattern: `README.md` — current product already frames itself as “Writebot novel agent console V1” with workflow/API/page coverage
  - Pattern: `docs/superpowers/specs/2026-03-16-writebot-agent-product-prototype-design.md` — existing workflow-first, human-confirmed, artifact-driven product direction
  - Pattern: `docs/superpowers/specs/2026-03-17-writebot-writing-product-frontend-ia-design.md` — writer-centric IA direction and Chinese-language UX framing
  - Pattern: `.sisyphus/drafts/agent-novel-product-strategy.md` — confirmed interview decisions and defaults
  - External: `https://www.anthropic.com/research/building-effective-agents/` — simple agent patterns over unnecessary complexity

  **Acceptance Criteria** (agent-executable only):
  - [ ] `powershell -Command "Test-Path 'docs/product/market-thesis.md'"` returns `True`
  - [ ] `powershell -Command "(Get-Content 'docs/product/market-thesis.md' -Raw) -match 'Chinese web novel authors'"` returns `True`
  - [ ] `powershell -Command "(Get-Content 'docs/product/market-thesis.md' -Raw) -match 'author control'"` returns `True`
  - [ ] `powershell -Command "(Get-Content 'docs/product/market-thesis.md' -Raw) -match 'Out of Scope'"` returns `True`

  **QA Scenarios** (MANDATORY — task incomplete without these):
  ```
  Scenario: Market thesis includes the chosen positioning
    Tool: Bash
    Steps: Run PowerShell checks for target user, author-control thesis, and v1 exclusions in docs/product/market-thesis.md.
    Expected: All checks return True and the file contains no language that repositions the product as chat-first.
    Evidence: .sisyphus/evidence/task-1-market-thesis.txt

  Scenario: Scope-creep terms are rejected
    Tool: Bash
    Steps: Run `powershell -Command "(Get-Content 'docs/product/market-thesis.md' -Raw) -match 'multi-author v1|mobile-first|autonomous book factory'"` before finalizing the file.
    Expected: Command returns False.
    Evidence: .sisyphus/evidence/task-1-market-thesis-error.txt
  ```

  **Commit**: YES | Message: `docs(product): lock market thesis and v1 scope` | Files: `docs/product/market-thesis.md`

- [ ] 2. Author the v1 PRD around artifact progression, not agent theater

  **What to do**: Create `docs/product/prd-v1.md` for the first complete product shape. Define primary jobs-to-be-done, the artifact lifecycle (`premise → outline → chapter plan → draft → revision → approved canon`), success metrics, non-goals, core user flows, and why the chapter workspace is the dominant product surface.
  **Must NOT do**: Do not structure the PRD around “agents available,” “chat commands,” or provider comparisons. Do not introduce collaboration, marketplace, mobile, or publishing integrations into v1 requirements.

  **Recommended Agent Profile**:
  - Category: `writing` — Reason: PRD quality matters more than code here and must be explicit
  - Skills: `[]` — no extra skill needed
  - Omitted: `[playwright]` — no browser interaction required

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: 3, 6, 8, 10, 15 | Blocked By: 1

  **References** (executor has NO interview context — be exhaustive):
  - Pattern: `docs/superpowers/specs/2026-03-16-writebot-agent-product-prototype-design.md` — role of workflow, confirmation, workbench, and control surfaces
  - Pattern: `docs/superpowers/specs/2026-03-17-writebot-writing-product-frontend-ia-design.md` — project overview and chapter workspace should dominate the experience
  - Pattern: `tests/e2e/project-flow.spec.ts` — current product already validates project → overview → chapter flow in Chinese
  - Pattern: `.sisyphus/drafts/agent-novel-product-strategy.md` — confirmed market, carrier, and verification strategy
  - External: `https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents` — eval-driven product iteration should be reflected in success metrics

  **Acceptance Criteria** (agent-executable only):
  - [ ] `powershell -Command "Test-Path 'docs/product/prd-v1.md'"` returns `True`
  - [ ] `powershell -Command "(Get-Content 'docs/product/prd-v1.md' -Raw) -match 'Jobs to be Done'"` returns `True`
  - [ ] `powershell -Command "(Get-Content 'docs/product/prd-v1.md' -Raw) -match 'Success Metrics'"` returns `True`
  - [ ] `powershell -Command "(Get-Content 'docs/product/prd-v1.md' -Raw) -match 'Non-Goals'"` returns `True`

  **QA Scenarios** (MANDATORY — task incomplete without these):
  ```
  Scenario: PRD encodes the approved artifact lifecycle
    Tool: Bash
    Steps: Run PowerShell checks for premise, outline, chapter plan, draft, revision, and approved canon sections in docs/product/prd-v1.md.
    Expected: All lifecycle stages are present and ordered as the primary workflow.
    Evidence: .sisyphus/evidence/task-2-prd.txt

  Scenario: PRD rejects chat-first framing
    Tool: Bash
    Steps: Run `powershell -Command "(Get-Content 'docs/product/prd-v1.md' -Raw) -match 'chat-first|generic writing assistant'"`.
    Expected: Command returns False.
    Evidence: .sisyphus/evidence/task-2-prd-error.txt
  ```

  **Commit**: YES | Message: `docs(prd): define single-author v1 product` | Files: `docs/product/prd-v1.md`

- [ ] 3. Define the canon, memory, and narrative-truth architecture

  **What to do**: Create `docs/architecture/narrative-memory.md` and update the implementation roadmap assumptions around canonical artifacts. Specify which objects are durable truth, which are derived memory, which are ephemeral run context, how approvals mutate canon, and how revisions preserve provenance. Include the rule that only approved artifacts change durable narrative truth.
  **Must NOT do**: Do not blur canon, summaries, scratchpads, prompts, and generated drafts into one memory bucket. Do not let unapproved model output mutate durable truth.

  **Recommended Agent Profile**:
  - Category: `deep` — Reason: this is the highest-risk conceptual boundary in the product
  - Skills: `[]` — no extra skill needed
  - Omitted: `[playwright]` — browser is not required

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: 8, 10, 11, 12 | Blocked By: 1, 2

  **References** (executor has NO interview context — be exhaustive):
  - Pattern: `docs/superpowers/specs/2026-03-16-novel-agent-design.md` — Proposal, Review, ApprovalBatch, StateCommit, AuditLog semantics
  - Pattern: `prisma/schema.prisma` — current state-first model foundation
  - Pattern: `src/lib/state/project-state.ts` — current project aggregation seam
  - Pattern: `src/lib/state/context-package.ts` — context-packaging direction already exists in repo
  - Pattern: `tests/unit/context-package.test.ts` — current context and conflict rules testing style
  - External: `https://www.anthropic.com/news/context-management` — long-running systems need explicit context boundaries

  **Acceptance Criteria** (agent-executable only):
  - [ ] `powershell -Command "Test-Path 'docs/architecture/narrative-memory.md'"` returns `True`
  - [ ] `powershell -Command "(Get-Content 'docs/architecture/narrative-memory.md' -Raw) -match 'durable canon'"` returns `True`
  - [ ] `powershell -Command "(Get-Content 'docs/architecture/narrative-memory.md' -Raw) -match 'derived memory'"` returns `True`
  - [ ] `powershell -Command "(Get-Content 'docs/architecture/narrative-memory.md' -Raw) -match 'ephemeral run context'"` returns `True`

  **QA Scenarios** (MANDATORY — task incomplete without these):
  ```
  Scenario: Canon mutation rule is explicit and unique
    Tool: Bash
    Steps: Run PowerShell checks that docs/architecture/narrative-memory.md contains the phrase "only approved artifacts" and separate sections for canon, derived memory, and ephemeral context.
    Expected: All checks return True.
    Evidence: .sisyphus/evidence/task-3-memory.txt

  Scenario: Unapproved output cannot mutate truth
    Tool: Bash
    Steps: Run `powershell -Command "(Get-Content 'docs/architecture/narrative-memory.md' -Raw) -match 'unapproved output may update canon'"`.
    Expected: Command returns False.
    Evidence: .sisyphus/evidence/task-3-memory-error.txt
  ```

  **Commit**: YES | Message: `docs(architecture): define canon and memory invariants` | Files: `docs/architecture/narrative-memory.md`

- [ ] 4. Define the provider kernel, capability registry, and config contract

  **What to do**: Create `docs/architecture/provider-kernel.md` and design the implementation contract for a product-owned provider abstraction. Define provider profiles, capability flags, OpenAI-compatible support, first-party adapter rules for Anthropic/OpenAI/Gemini, raw-provider escape hatch, config validation, and provenance fields saved for every run.
  **Must NOT do**: Do not hard-code the product to a single official SDK. Do not treat Vercel or a vendor SDK as the product’s domain boundary. Do not flatten all providers to the lowest common denominator if capability differences matter.

  **Recommended Agent Profile**:
  - Category: `deep` — Reason: this is a critical architecture seam with long-term blast radius
  - Skills: `[]` — no extra skill required
  - Omitted: `[playwright]` — no browser work needed

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: 5, 7, 11, 12, 14 | Blocked By: 1, 2

  **References** (executor has NO interview context — be exhaustive):
  - Pattern: `src/lib/llm/client.ts:1-5` — current provider seam is only a stub and must be expanded
  - Pattern: `src/lib/llm/prompts.ts` — prompt layer exists but should sit above the provider kernel
  - Pattern: `.env.example:1-2` — current environment story is minimal and will need expansion
  - Pattern: `README.md` — current local-development contract is web-app oriented
  - External: `https://openai.github.io/openai-agents-python/tracing/` — trace and provenance expectations
  - External: `https://google.github.io/adk-docs/sessions/memory/` — explicit session/state boundaries

  **Acceptance Criteria** (agent-executable only):
  - [ ] `powershell -Command "Test-Path 'docs/architecture/provider-kernel.md'"` returns `True`
  - [ ] `powershell -Command "(Get-Content 'docs/architecture/provider-kernel.md' -Raw) -match 'provider profile'"` returns `True`
  - [ ] `powershell -Command "(Get-Content 'docs/architecture/provider-kernel.md' -Raw) -match 'OpenAI-compatible'"` returns `True`
  - [ ] `powershell -Command "(Get-Content 'docs/architecture/provider-kernel.md' -Raw) -match 'provenance'"` returns `True`

  **QA Scenarios** (MANDATORY — task incomplete without these):
  ```
  Scenario: Provider kernel defines both abstraction and escape hatch
    Tool: Bash
    Steps: Run PowerShell checks for sections covering capability registry, provider profiles, first-party adapters, OpenAI-compatible support, and raw-provider escape hatch.
    Expected: All checks return True.
    Evidence: .sisyphus/evidence/task-4-provider.txt

  Scenario: Vendor lock-in language is absent
    Tool: Bash
    Steps: Run `powershell -Command "(Get-Content 'docs/architecture/provider-kernel.md' -Raw) -match 'Vercel solves provider architecture|single SDK is sufficient'"`.
    Expected: Command returns False.
    Evidence: .sisyphus/evidence/task-4-provider-error.txt
  ```

  **Commit**: YES | Message: `docs(provider): define provider kernel contract` | Files: `docs/architecture/provider-kernel.md`

- [ ] 5. Define the minimum self-host deployment and operations baseline

  **What to do**: Create `docs/ops/self-host-baseline.md` for the supported first deployment shape. Standardize on a minimum viable self-host topology: web app, worker, PostgreSQL, Redis queue, env/secrets contract, backups, upgrade path, and a clear statement of what Vercel can and cannot be used for.
  **Must NOT do**: Do not require Kubernetes for v1. Do not pretend that serverless-only deployment is enough for long-running agent workflows, provenance, and resumable jobs.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` — Reason: ops design with realistic constraints and developer empathy
  - Skills: `[]`
  - Omitted: `[playwright]` — browser not needed

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: 13, 14, 15 | Blocked By: 1, 4

  **References** (executor has NO interview context — be exhaustive):
  - Pattern: `.env.example:1-2` — current env baseline is only `DATABASE_URL`
  - Pattern: `playwright.config.ts:1-22` — current repo already assumes buildable web deployment on port 3000
  - Pattern: `package.json` — current runtime/build/test scripts
  - Pattern: `README.md` — current local development lifecycle
  - External: `https://cloud.google.com/architecture/choose-design-pattern-agentic-ai-system` — evented orchestration and state management patterns

  **Acceptance Criteria** (agent-executable only):
  - [ ] `powershell -Command "Test-Path 'docs/ops/self-host-baseline.md'"` returns `True`
  - [ ] `powershell -Command "(Get-Content 'docs/ops/self-host-baseline.md' -Raw) -match 'PostgreSQL'"` returns `True`
  - [ ] `powershell -Command "(Get-Content 'docs/ops/self-host-baseline.md' -Raw) -match 'Redis'"` returns `True`
  - [ ] `powershell -Command "(Get-Content 'docs/ops/self-host-baseline.md' -Raw) -match 'Vercel'"` returns `True`

  **QA Scenarios** (MANDATORY — task incomplete without these):
  ```
  Scenario: Self-host baseline is concrete
    Tool: Bash
    Steps: Run PowerShell checks for topology, secrets, backups, upgrade path, queueing, and supported deployment modes in docs/ops/self-host-baseline.md.
    Expected: All checks return True.
    Evidence: .sisyphus/evidence/task-5-self-host.txt

  Scenario: Unsupported deployment fantasy is excluded
    Tool: Bash
    Steps: Run `powershell -Command "(Get-Content 'docs/ops/self-host-baseline.md' -Raw) -match 'kubernetes required|serverless only is fully supported'"`.
    Expected: Command returns False.
    Evidence: .sisyphus/evidence/task-5-self-host-error.txt
  ```

  **Commit**: YES | Message: `docs(ops): define self-host baseline` | Files: `docs/ops/self-host-baseline.md`

- [ ] 6. Refactor the prototype shell into a writer-centric information architecture

  **What to do**: Replace the prototype-only navigation with a durable writer-centric app shell. Keep `/projects`, `/projects/[projectId]`, and `/projects/[projectId]/chapter` as the backbone, then add stable surfaces for `故事设定`, `大纲`, `历史记录`, and `设置/模型接入`. Ensure the IA follows the existing Chinese writing-product language instead of agent-console terminology.
  **Must NOT do**: Do not reintroduce “Task Dispatch Cockpit,” “Confirmation Center,” or “Control Console” as first-class top-level products. Do not create a chat tab as the primary navigation surface.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — Reason: this is shell architecture plus UX language and layout work
  - Skills: `[playwright]` — needed for route/surface verification in the browser
  - Omitted: `[]`

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 8, 9, 10 | Blocked By: 1, 2

  **References** (executor has NO interview context — be exhaustive):
  - Pattern: `docs/superpowers/specs/2026-03-17-writebot-writing-product-frontend-ia-design.md` — approved writer-centric IA direction
  - Pattern: `src/components/project/prototype-nav.tsx:1-34` — current navigation component to evolve or replace
  - Pattern: `src/app/projects/[projectId]/page.tsx:1-23` — current project overview route shell
  - Pattern: `src/app/projects/[projectId]/chapter/page.tsx:1-27` — current chapter route shell
  - Pattern: `tests/e2e/project-flow.spec.ts:48-60` — current Chinese navigation expectations already verified

  **Acceptance Criteria** (agent-executable only):
  - [ ] `pnpm playwright test tests/e2e/project-flow.spec.ts --grep "原型使用批准后的中文创作产品语言"` passes
  - [ ] `pnpm build` passes
  - [ ] `powershell -Command "(Get-Content 'src/components/project/prototype-nav.tsx' -Raw) -match 'Task Dispatch Cockpit|Confirmation Center|Control Console'"` returns `False`

  **QA Scenarios** (MANDATORY — task incomplete without these):
  ```
  Scenario: Writer-centric navigation is visible and routeable
    Tool: Playwright
    Steps: Start the app, open /projects/project_demo, click through 项目概览, 章节工作区, 故事设定, 大纲, 历史记录, 设置/模型接入.
    Expected: Each route resolves, top navigation stays in Chinese, and no legacy console labels are visible.
    Evidence: .sisyphus/evidence/task-6-shell.png

  Scenario: Legacy agent-console terms are absent
    Tool: Playwright
    Steps: Search visible text on /projects/project_demo and related top-level surfaces for Task Dispatch Cockpit, Confirmation Center, and Control Console.
    Expected: Zero matches.
    Evidence: .sisyphus/evidence/task-6-shell-error.png
  ```

  **Commit**: YES | Message: `feat(shell): adopt writer-centric information architecture` | Files: `src/app/projects/**/*`, `src/components/project/prototype-nav.tsx`, `tests/e2e/project-flow.spec.ts`

- [ ] 7. Add a product-grade provider settings and validation center

  **What to do**: Implement a configurable provider settings surface for open-source users. Add typed provider profiles, API key/base URL storage rules, capability-aware validation, and a UI/API flow that lets users register official providers or OpenAI-compatible endpoints without editing source code.
  **Must NOT do**: Do not store secrets in client-only state. Do not force every provider into one undifferentiated “model name” field. Do not assume all providers support the same streaming, tool, or response protocol features.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` — Reason: mixed domain work across API, config, validation, and UI
  - Skills: `[playwright]` — browser validation required for settings UX
  - Omitted: `[]`

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 11, 14 | Blocked By: 4, 5

  **References** (executor has NO interview context — be exhaustive):
  - Pattern: `src/lib/llm/client.ts:1-5` — current stub seam to replace
  - Pattern: `.env.example:1-2` — current environment contract is too small for the target product
  - Pattern: `src/app/api/projects/[projectId]/workflow/route.ts:1-20` — current API style for typed JSON handling
  - Pattern: `tests/integration/workflow-route.test.ts:1-18` — route testing pattern to follow
  - External: `https://platform.openai.com/docs/guides/agent-builder-safety` — config safety and approval boundaries

  **Acceptance Criteria** (agent-executable only):
  - [ ] `pnpm vitest tests/integration/provider-settings-route.test.ts` passes
  - [ ] `pnpm playwright test tests/e2e/provider-settings.spec.ts` passes
  - [ ] `pnpm build` passes
  - [ ] `powershell -Command "(Get-Content '.env.example' -Raw) -match 'DEFAULT_PROVIDER|OPENAI_BASE_URL|ANTHROPIC_API_KEY|GEMINI_API_KEY'"` returns `True`

  **QA Scenarios** (MANDATORY — task incomplete without these):
  ```
  Scenario: User can save an OpenAI-compatible provider profile
    Tool: Playwright
    Steps: Open 设置/模型接入, create provider profile "openai-compatible-local", set base URL to http://localhost:11434/v1, enter a placeholder API key, choose protocol "responses", save.
    Expected: Validation passes, profile is persisted, and the profile appears as selectable default runtime provider.
    Evidence: .sisyphus/evidence/task-7-provider-settings.png

  Scenario: Invalid provider configuration is rejected
    Tool: Playwright
    Steps: Create a provider profile with empty base URL and an unsupported protocol flag.
    Expected: Save action is blocked with a concrete validation error and no profile is persisted.
    Evidence: .sisyphus/evidence/task-7-provider-settings-error.png
  ```

  **Commit**: YES | Message: `feat(config): add provider settings and validation center` | Files: `src/app/settings/**/*`, `src/app/api/settings/**/*`, `src/lib/llm/**/*`, `.env.example`, `tests/integration/provider-settings-route.test.ts`, `tests/e2e/provider-settings.spec.ts`

- [ ] 8. Rebuild project overview as an author-first dispatch surface

  **What to do**: Upgrade the project overview page from prototype summary into a true author dispatch surface. It should show the next recommended chapter action, artifact progress, pending approvals, canon health, and clear entry into chapter work without surfacing internal orchestration jargon.
  **Must NOT do**: Do not turn project overview into an analytics dashboard. Do not expose raw workflow graphs, token counts, or agent topology on the main author surface.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — Reason: this is a high-impact UI surface with data-binding changes
  - Skills: `[playwright]` — needed for layout and copy verification
  - Omitted: `[]`

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 9, 10, 12, 15 | Blocked By: 3, 6

  **References** (executor has NO interview context — be exhaustive):
  - Pattern: `src/components/project/project-overview.tsx:1-50` — current overview component structure
  - Pattern: `src/lib/state/project-state.ts:38-98` — current dynamic overview state builder
  - Pattern: `src/app/projects/[projectId]/page.tsx:1-23` — current route composition
  - Pattern: `tests/e2e/project-flow.spec.ts:11-20` — current overview assertions
  - Pattern: `docs/superpowers/specs/2026-03-17-writebot-writing-product-frontend-ia-design.md` — target overview behavior and vocabulary

  **Acceptance Criteria** (agent-executable only):
  - [ ] `pnpm vitest tests/unit/project-overview-state.test.ts` passes
  - [ ] `pnpm playwright test tests/e2e/project-flow.spec.ts --grep "用户可以从项目入口进入中文项目概览"` passes
  - [ ] `pnpm build` passes

  **QA Scenarios** (MANDATORY — task incomplete without these):
  ```
  Scenario: Project overview guides the next writing step
    Tool: Playwright
    Steps: Open /projects/project_demo and verify the page shows one recommended next action, current artifact stage, pending approval signal, and a direct path into the chapter workspace.
    Expected: The page feels like a creative navigation surface, not a systems dashboard; all required modules are visible.
    Evidence: .sisyphus/evidence/task-8-project-overview.png

  Scenario: Internal orchestration jargon does not leak
    Tool: Playwright
    Steps: Search for terms like workflow graph, execution lane, artifact state, dispatch queue on the overview screen.
    Expected: Zero matches.
    Evidence: .sisyphus/evidence/task-8-project-overview-error.png
  ```

  **Commit**: YES | Message: `feat(project): rebuild author-first overview surface` | Files: `src/app/projects/[projectId]/page.tsx`, `src/components/project/project-overview.tsx`, `src/lib/state/project-state.ts`, `tests/unit/project-overview-state.test.ts`, `tests/e2e/project-flow.spec.ts`

- [ ] 9. Turn chapter workspace into the dominant writing and review surface

  **What to do**: Evolve the existing three-column chapter workspace into the core product. Keep chapter navigation, central editor, and assistant panel, but add revision-aware actions, inline confirmation cards, repair drawers, and explicit accepted-vs-draft state. Ensure authors can continue writing without losing visibility into required approvals.
  **Must NOT do**: Do not redirect users away to separate confirmation or repair products for the common path. Do not collapse the center editor into a chatbot transcript.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — Reason: this is the product’s primary usage surface
  - Skills: `[playwright]` — browser verification is mandatory
  - Omitted: `[]`

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 10, 12, 15 | Blocked By: 6, 8

  **References** (executor has NO interview context — be exhaustive):
  - Pattern: `src/components/chapter/chapter-workbench.tsx:1-56` — current three-column workbench baseline
  - Pattern: `src/lib/state/project-state.ts:100-161` — current dynamic workbench state builder
  - Pattern: `src/app/projects/[projectId]/chapter/page.tsx:1-27` — chapter route shell
  - Pattern: `tests/e2e/project-flow.spec.ts:22-46` — current inline confirmation and repair expectations
  - Pattern: `docs/superpowers/specs/2026-03-17-writebot-writing-product-frontend-ia-design.md` — approved workbench behavior

  **Acceptance Criteria** (agent-executable only):
  - [ ] `pnpm vitest tests/unit/chapter-workbench-state.test.ts` passes
  - [ ] `pnpm playwright test tests/e2e/project-flow.spec.ts --grep "章节工作区显示三栏写作布局|旧确认页和修复页都会回到章节工作区的内联状态"` passes
  - [ ] `pnpm build` passes

  **QA Scenarios** (MANDATORY — task incomplete without these):
  ```
  Scenario: Author can stay in the chapter workspace through review events
    Tool: Playwright
    Steps: Open /projects/project_demo/chapter, trigger confirmation and repair states, then continue writing from the same workspace without route hopping.
    Expected: Confirmation and repair surfaces appear inline, and the center editor remains the dominant surface.
    Evidence: .sisyphus/evidence/task-9-workbench.png

  Scenario: Chat-first drift is rejected
    Tool: Playwright
    Steps: Inspect the chapter workspace for transcript-style conversation panels, role bubbles, or a primary “chat” CTA.
    Expected: None of these are the dominant interaction model.
    Evidence: .sisyphus/evidence/task-9-workbench-error.png
  ```

  **Commit**: YES | Message: `feat(chapter): make workspace the dominant writing surface` | Files: `src/app/projects/[projectId]/chapter/page.tsx`, `src/components/chapter/**/*`, `src/lib/state/project-state.ts`, `tests/unit/chapter-workbench-state.test.ts`, `tests/e2e/project-flow.spec.ts`

- [ ] 10. Add revision history, provenance, and author decision surfaces

  **What to do**: Build the `历史记录` and revision-diff experience so authors can inspect what changed, who/what produced it, which provider/model/template was used, and whether the output is still pending, approved, or committed. Include compare/accept/reject flows that reinforce trust.
  **Must NOT do**: Do not hide provenance behind logs only visible to developers. Do not let accepted content be overwritten without a visible comparison step.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` — Reason: combines domain state, provenance, and trust-oriented UX
  - Skills: `[playwright]` — UI verification is required
  - Omitted: `[]`

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 12, 15 | Blocked By: 3, 6, 8, 9

  **References** (executor has NO interview context — be exhaustive):
  - Pattern: `docs/superpowers/specs/2026-03-16-novel-agent-design.md` — approval and commit separation must remain visible
  - Pattern: `src/lib/state/project-state.ts` — current aggregation entry point for project-facing state
  - Pattern: `src/lib/state/audit-log.ts` — audit trail direction in current repo
  - Pattern: `src/lib/state/commit-writer.ts` — committed state should remain distinct from approval
  - Pattern: `tests/unit/state-sync.test.ts` — state-machine testing style to preserve

  **Acceptance Criteria** (agent-executable only):
  - [ ] `pnpm vitest tests/unit/provenance-history.test.ts` passes
  - [ ] `pnpm playwright test tests/e2e/history-and-diff.spec.ts` passes
  - [ ] `pnpm build` passes

  **QA Scenarios** (MANDATORY — task incomplete without these):
  ```
  Scenario: Author can inspect revision provenance before accepting
    Tool: Playwright
    Steps: Open 历史记录 for project fixture 龙渊纪事, select a chapter draft revision, inspect provider/model/template/version metadata, then compare current draft vs accepted canon.
    Expected: Provenance is visible, diff is readable, and accept/reject controls are explicit.
    Evidence: .sisyphus/evidence/task-10-history.png

  Scenario: Accepted content cannot be silently replaced
    Tool: Playwright
    Steps: Attempt to apply a new revision over accepted content without opening a comparison step.
    Expected: The UI blocks the action or routes through a comparison/confirmation flow.
    Evidence: .sisyphus/evidence/task-10-history-error.png
  ```

  **Commit**: YES | Message: `feat(history): add provenance and revision surfaces` | Files: `src/app/projects/[projectId]/history/**/*`, `src/components/history/**/*`, `src/lib/state/**/*`, `tests/unit/provenance-history.test.ts`, `tests/e2e/history-and-diff.spec.ts`

- [ ] 11. Implement canonical memory, context packaging, and revision provenance

  **What to do**: Convert the memory model into executable code. Add canonical artifact storage rules, context packaging that prefers approved canon over raw draft text, revision provenance fields, and conflict detection for names, lore, timeline, and terminology drift. Ensure context assembly is deterministic and testable.
  **Must NOT do**: Do not pass the entire project history blindly into prompts. Do not let summaries overwrite canon. Do not make context packaging depend on UI state.

  **Recommended Agent Profile**:
  - Category: `deep` — Reason: high-risk product kernel work touching correctness and trust
  - Skills: `[]`
  - Omitted: `[playwright]` — primary verification is domain logic and integration tests

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: 12, 13, 15 | Blocked By: 3, 4, 7

  **References** (executor has NO interview context — be exhaustive):
  - Pattern: `src/lib/state/context-package.ts` — current context packaging seam
  - Pattern: `src/lib/state/project-state.ts` — current project aggregation patterns
  - Pattern: `src/lib/types/state.ts` — state object contracts should expand from here
  - Pattern: `tests/unit/context-package.test.ts` — existing unit-test location for context rules
  - Pattern: `docs/architecture/narrative-memory.md` — roadmap-defined memory truth rules
  - Pattern: `docs/architecture/provider-kernel.md` — provenance fields required for every run

  **Acceptance Criteria** (agent-executable only):
  - [ ] `pnpm vitest tests/unit/context-package.test.ts tests/unit/canon-memory.test.ts` passes
  - [ ] `pnpm vitest tests/integration/context-assembly-route.test.ts` passes
  - [ ] `pnpm build` passes

  **QA Scenarios** (MANDATORY — task incomplete without these):
  ```
  Scenario: Context package prefers approved canon
    Tool: Bash
    Steps: Run a fixture-based test for project 龙渊纪事 where approved lore contradicts a newer unapproved draft.
    Expected: The assembled context uses the approved canon and flags the contradiction as a repair/review issue.
    Evidence: .sisyphus/evidence/task-11-memory.txt

  Scenario: Long-context truncation preserves priority order
    Tool: Bash
    Steps: Run tests with a large fixture where context exceeds token budget.
    Expected: Context assembly keeps title, active outline, accepted canon, chapter brief, and latest approved facts before dropping lower-priority material.
    Evidence: .sisyphus/evidence/task-11-memory-error.txt
  ```

  **Commit**: YES | Message: `feat(memory): implement canon packaging and provenance` | Files: `src/lib/state/**/*`, `src/lib/types/state.ts`, `tests/unit/context-package.test.ts`, `tests/unit/canon-memory.test.ts`, `tests/integration/context-assembly-route.test.ts`

- [ ] 12. Implement chapter drafting and revision workflows on top of the provider kernel

  **What to do**: Replace the stubbed model path with real workflow execution for chapter drafting, revision, and repair suggestions. Route all generation through the provider kernel, persist provenance, create reviewable proposals, and preserve the approved/committed boundary. Keep workflows specialized: drafting, revision, and repair should be distinct actions with separate prompts and failure handling.
  **Must NOT do**: Do not let workflows commit content directly. Do not collapse drafting, revision, and repair into one generic “generate” endpoint. Do not bypass provider capability checks.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` — Reason: mixed workflow, API, provider, and state work
  - Skills: `[]`
  - Omitted: `[playwright]` — UI checks happen, but kernel verification is primarily API + workflow tests first

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: 13, 15 | Blocked By: 3, 4, 8, 9, 10, 11

  **References** (executor has NO interview context — be exhaustive):
  - Pattern: `src/lib/workflows/novel-workflow.ts:1-51` — current unified entry point
  - Pattern: `src/lib/workflows/chapter-production.ts` — current chapter workflow seam
  - Pattern: `src/lib/workflows/story-control.ts` — repair/control path seam
  - Pattern: `src/app/api/projects/[projectId]/workflow/route.ts:1-20` — current workflow route contract
  - Pattern: `tests/unit/chapter-production.test.ts` — existing workflow-test location
  - Pattern: `tests/integration/workflow-route.test.ts:1-18` — route contract pattern to preserve
  - Pattern: `src/lib/llm/client.ts:1-5` — current stub must be removed from hot path

  **Acceptance Criteria** (agent-executable only):
  - [ ] `pnpm vitest tests/unit/chapter-production.test.ts tests/unit/revision-workflow.test.ts tests/unit/provider-kernel.test.ts` passes
  - [ ] `pnpm vitest tests/integration/workflow-route.test.ts tests/integration/draft-run-route.test.ts` passes
  - [ ] `pnpm playwright test tests/e2e/chapter-revision-flow.spec.ts` passes
  - [ ] `pnpm build` passes

  **QA Scenarios** (MANDATORY — task incomplete without these):
  ```
  Scenario: Draft chapter run produces a reviewable proposal, not committed canon
    Tool: Playwright
    Steps: In project 龙渊纪事, open 第12章：夜渡寒江, run a draft action with provider profile openai-compatible-local.
    Expected: The workflow creates a new draft proposal with visible provenance and pending review/approval state; canon remains unchanged until accepted.
    Evidence: .sisyphus/evidence/task-12-draft-flow.png

  Scenario: Provider failure degrades safely
    Tool: Bash
    Steps: Run integration tests with simulated 429, timeout, malformed JSON, and unsupported capability responses.
    Expected: The workflow returns a structured error state, records provenance/failure metadata, and does not create committed content.
    Evidence: .sisyphus/evidence/task-12-draft-flow-error.txt
  ```

  **Commit**: YES | Message: `feat(workflows): implement provider-backed draft and revision flows` | Files: `src/lib/llm/**/*`, `src/lib/workflows/**/*`, `src/app/api/projects/[projectId]/workflow/route.ts`, `tests/unit/**/*`, `tests/integration/**/*`, `tests/e2e/chapter-revision-flow.spec.ts`

- [ ] 13. Build the evaluation harness and golden regression fixtures

  **What to do**: Add a formal eval layer for the product. Create a golden fixture set centered on 龙渊纪事 and 第12章：夜渡寒江, then implement continuity checks, canon contradiction detection, terminology drift detection, provider-failure regression, and chapter-flow quality gates. Make eval output machine-readable and suitable for CI.
  **Must NOT do**: Do not rely on ad hoc manual review as the only quality signal. Do not treat “the text looks good” as a sufficient acceptance criterion.

  **Recommended Agent Profile**:
  - Category: `deep` — Reason: evaluation strategy is core to trust in an agent product
  - Skills: `[]`
  - Omitted: `[playwright]` — browser checks are secondary to regression automation here

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: 14, 15 | Blocked By: 5, 7, 11, 12

  **References** (executor has NO interview context — be exhaustive):
  - Pattern: `tests/unit/*` — existing unit test organization
  - Pattern: `tests/integration/*` — integration contract style
  - Pattern: `tests/e2e/project-flow.spec.ts` — E2E verification pattern already present
  - Pattern: `docs/product/prd-v1.md` — success metrics should map to eval gates
  - External: `https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents` — eval framing for agent products

  **Acceptance Criteria** (agent-executable only):
  - [ ] `pnpm vitest tests/evals/**/*.test.ts` passes
  - [ ] `powershell -Command "Test-Path 'tests/fixtures/golden/dragon-abyss-chronicle.json'"` returns `True`
  - [ ] `powershell -Command "Test-Path 'tests/fixtures/golden/chapter-12-night-river.json'"` returns `True`
  - [ ] `pnpm build` passes

  **QA Scenarios** (MANDATORY — task incomplete without these):
  ```
  Scenario: Golden continuity regression detects contradiction
    Tool: Bash
    Steps: Run eval tests where a generated draft renames an accepted proper noun or breaks a canon rule in the 龙渊纪事 fixture.
    Expected: The eval suite fails with a contradiction report tied to the offending artifact and field.
    Evidence: .sisyphus/evidence/task-13-evals.txt

  Scenario: Happy-path eval accepts a compliant revision
    Tool: Bash
    Steps: Run eval tests against a revision that preserves canon, uses expected Chinese punctuation, and improves the target chapter beat.
    Expected: The eval suite passes and records the success case.
    Evidence: .sisyphus/evidence/task-13-evals-error.txt
  ```

  **Commit**: YES | Message: `test(evals): add golden fixtures and regression harness` | Files: `tests/evals/**/*`, `tests/fixtures/golden/**/*`, `docs/product/prd-v1.md`

- [ ] 14. Package the self-host baseline, CI, and operator runbooks

  **What to do**: Implement the operational baseline described earlier. Add `Dockerfile`, `docker-compose.yml`, `.github/workflows/ci.yml`, expanded `.env.example`, startup docs, migration docs, backup/restore notes, and a clear split between supported self-host production and optional Vercel preview deployment.
  **Must NOT do**: Do not ship ambiguous env docs. Do not make CI optional. Do not leave backup and upgrade procedures implicit.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` — Reason: ops + delivery + documentation bundle
  - Skills: `[]`
  - Omitted: `[playwright]` — no browser dependence required

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: 15 | Blocked By: 5, 7, 13

  **References** (executor has NO interview context — be exhaustive):
  - Pattern: `README.md` — current developer onboarding baseline
  - Pattern: `package.json` — current scripts to preserve and expand
  - Pattern: `playwright.config.ts:1-22` — CI must support build/start based E2E
  - Pattern: `.env.example:1-2` — current env template is too minimal and must be expanded
  - Pattern: `docs/ops/self-host-baseline.md` — target operational support model

  **Acceptance Criteria** (agent-executable only):
  - [ ] `powershell -Command "Test-Path 'Dockerfile'"` returns `True`
  - [ ] `powershell -Command "Test-Path 'docker-compose.yml'"` returns `True`
  - [ ] `powershell -Command "Test-Path '.github/workflows/ci.yml'"` returns `True`
  - [ ] `pnpm prisma validate` passes
  - [ ] `pnpm build` passes

  **QA Scenarios** (MANDATORY — task incomplete without these):
  ```
  Scenario: Fresh self-host startup works
    Tool: Bash
    Steps: Start the stack with docker compose, wait for PostgreSQL and Redis, run migrations/seed, then open the app and hit the project entry route.
    Expected: The stack starts cleanly and the app serves the project entry UI.
    Evidence: .sisyphus/evidence/task-14-self-host.txt

  Scenario: Missing secret fails fast
    Tool: Bash
    Steps: Start the app with a required provider secret or DATABASE_URL missing.
    Expected: Startup fails with a concrete configuration error instead of partial runtime breakage.
    Evidence: .sisyphus/evidence/task-14-self-host-error.txt
  ```

  **Commit**: YES | Message: `chore(deploy): add self-host baseline and ci` | Files: `Dockerfile`, `docker-compose.yml`, `.github/workflows/ci.yml`, `.env.example`, `README.md`, `docs/ops/**/*`

- [ ] 15. Finish launch readiness for the open-source author desk

  **What to do**: Polish the repository and product for a real first public release. Add OSS-facing README structure, contributor docs, architecture overview, sample project fixtures, security notes for BYOK, migration notes, and final end-to-end flows that prove a new self-hosted user can configure a provider, enter a project, draft a chapter, review changes, and preserve canon safely.
  **Must NOT do**: Do not release with hidden setup steps, undocumented provider caveats, or missing contribution guidance. Do not claim support for collaboration, mobile, or automated full-book generation in the release copy.

  **Recommended Agent Profile**:
  - Category: `writing` — Reason: this is launch packaging across docs, onboarding, and release framing
  - Skills: `[playwright]` — final product walk-through must be verifiable
  - Omitted: `[]`

  **Parallelization**: Can Parallel: NO | Wave 3 | Blocks: F1-F4 | Blocked By: 2, 8, 9, 10, 12, 13, 14

  **References** (executor has NO interview context — be exhaustive):
  - Pattern: `README.md` — final OSS onboarding anchor
  - Pattern: `docs/product/market-thesis.md` — release messaging must stay aligned to thesis
  - Pattern: `docs/product/prd-v1.md` — launch scope must match product promise
  - Pattern: `docs/architecture/*.md` — architecture overview should link to these docs
  - Pattern: `tests/e2e/project-flow.spec.ts` — current product walk-through baseline to expand

  **Acceptance Criteria** (agent-executable only):
  - [ ] `pnpm vitest` passes
  - [ ] `pnpm playwright test` passes
  - [ ] `pnpm build` passes
  - [ ] `pnpm prisma validate` passes
  - [ ] `powershell -Command "(Get-Content 'README.md' -Raw) -match 'Provider Setup|Self-Hosting|Chinese Web Novel Workflow|Contributing'"` returns `True`

  **QA Scenarios** (MANDATORY — task incomplete without these):
  ```
  Scenario: New operator can complete the happy path from zero
    Tool: Playwright
    Steps: Start from a fresh self-hosted stack, configure provider profile openai-compatible-local, open 龙渊纪事, enter 第12章：夜渡寒江, run a draft flow, review provenance, accept content, and confirm canon is updated only after approval.
    Expected: End-to-end flow succeeds without undocumented manual intervention.
    Evidence: .sisyphus/evidence/task-15-release.png

  Scenario: Unsupported scope is not implied in release assets
    Tool: Bash
    Steps: Run text checks across README and launch docs for claims about multi-author collaboration, mobile apps, or autonomous full-book generation.
    Expected: No unsupported claims are present.
    Evidence: .sisyphus/evidence/task-15-release-error.txt
  ```

  **Commit**: YES | Message: `docs(oss): finalize release and contributor readiness` | Files: `README.md`, `CONTRIBUTING.md`, `docs/**/*`, `tests/e2e/**/*`

## Final Verification Wave (4 parallel agents, ALL must APPROVE)
- [ ] F1. Plan Compliance Audit — oracle
- [ ] F2. Code Quality Review — unspecified-high
- [ ] F3. Real Manual QA — unspecified-high (+ playwright if UI)
- [ ] F4. Scope Fidelity Check — deep

## Commit Strategy
- Docs and product-definition commits first; infrastructure and product-surface commits second; quality/ops commits last
- Keep provider kernel, memory/canon logic, UX shell, and deployment work in separate commit tracks
- Use commit rhythm inside implementation tasks: failing test → minimal implementation → pass/refactor → e2e/contract verification
- Recommended top-level commit slices:
  1. `docs(product): lock thesis and v1 scope`
  2. `docs(prd): define author workflow and metrics`
  3. `docs(architecture): define canon memory invariants`
  4. `docs(provider): define provider kernel contract`
  5. `feat(config): add provider settings and validation`
  6. `feat(workspace): refactor writer-centric app shell`
  7. `feat(memory): add canon provenance and revision flows`
  8. `test(evals): add golden fixtures and regression harness`
  9. `chore(deploy): add self-host baseline and ci`
  10. `docs(oss): add operator and contributor guides`

## Success Criteria
- The roadmap fully explains what to build next from current prototype reality without leaving product or architecture forks unresolved
- The MVP is explicitly scoped to a trusted single-author Chinese web novel workflow
- Provider flexibility is implemented as an internal capability layer, not the core thesis
- Canon, revision, approval, and provenance rules are explicit and testable
- Self-host deployment, CI, evals, and UX verification are first-class parts of the plan rather than afterthoughts
