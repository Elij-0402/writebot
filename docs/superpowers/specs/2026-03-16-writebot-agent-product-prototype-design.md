# Writebot Agent Product Prototype Design

- Date: 2026-03-16
- Status: Approved for planning
- Audience: Writebot internal product and engineering
- Related context: [2026-03-16-novel-agent-design.md](/D:/writebot/docs/superpowers/specs/2026-03-16-novel-agent-design.md)

## 1. Why This Spec Exists

The current repository already has the right backend direction for a controlled agent product: proposals, reviews, approval batches, commits, and audit logs exist as explicit state objects. That aligns with a workflow-first architecture.

What is still missing is the product prototype layer that turns this internal agent architecture into a simple, controllable user experience. Right now, the architecture is closer to the 2026 agent direction than the UI surface is. This spec closes that gap.

The goal of this document is to define the first product prototype for Writebot as a:

`workflow-first, human-confirmed, artifact-driven writing agent platform`

not as a chat-first writing tool.

## 2. Source-Informed Validation

As of `2026-03-16`, I re-checked official public materials from Anthropic, Google, and OpenAI. I did **not** find a single shared "2026 agent definition paper" published by all three. The correct standard comes from their latest official docs, engineering articles, and SDK guidance.

This spec is based on the overlap across those sources. The overlap is strong:

- Agent systems should separate `orchestration` from `execution`
- Long-running systems need explicit `state / memory / artifacts`
- Higher-risk actions should include `human approval`
- Multi-agent capability should be specialized and bounded, not exposed as uncontrolled complexity
- Systems should keep `trace / eval / versioning / guardrails` in the platform, even if they are not front-and-center in the user experience

This is an engineering inference from official sources, not a verbatim definition.

### 2.1 Anthropic Signals

Anthropic's recent guidance repeatedly favors:

- simple, composable agent patterns over unnecessary complexity
- a clear distinction between `workflows` and `agents`
- focused subagents with narrow responsibilities
- explicit tool boundaries
- long-running agent harnesses with memory/context management
- eval-driven improvement

Relevant sources:

- https://www.anthropic.com/research/building-effective-agents/
- https://docs.anthropic.com/en/docs/claude-code/sub-agents
- https://www.anthropic.com/news/context-management
- https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents

### 2.2 Google Signals

Google ADK guidance strongly favors:

- deterministic `workflow agents` for predictable pipelines
- explicit `session / state / memory` layers
- resumable workflows
- event-driven execution and observable state transitions
- model-agnostic orchestration that does not force all logic into one model loop

Relevant sources:

- https://google.github.io/adk-docs/
- https://google.github.io/adk-docs/agents/workflow-agents/
- https://google.github.io/adk-docs/sessions/
- https://google.github.io/adk-docs/sessions/memory/
- https://google.github.io/adk-docs/runtime/resume/
- https://cloud.google.com/architecture/choose-design-pattern-agentic-ai-system
- https://cloud.google.com/architecture/multiagent-ai-system

### 2.3 OpenAI Signals

OpenAI's current public guidance strongly favors:

- agent workflows with `tools`, `handoffs`, and `tracing`
- human approval for tool actions in higher-risk settings
- guardrails against prompt injection
- versioned workflow publication
- trace-based debugging and evaluation

Relevant sources:

- https://platform.openai.com/docs/guides/agent-builder
- https://platform.openai.com/docs/guides/agent-builder-safety
- https://platform.openai.com/docs/guides/agents-sdk/
- https://openai.github.io/openai-agents-python/
- https://openai.github.io/openai-agents-python/tracing/
- https://openai.github.io/openai-agents-python/handoffs/
- https://openai.github.io/openai-agents-python/guardrails/
- https://openai.com/index/designing-agents-to-resist-prompt-injection/

## 3. Product Verdict As Of 2026-03-16

Writebot is already on the correct product direction, but it is not yet fully expressed as a 2026-grade agent product at the prototype level.

### 3.1 What Is Already Aligned

- The system is state-first, not chat-log-first
- Approval and commit are separated
- Workflow output is meant to become explicit objects
- Risk and review are first-class concepts
- The product is moving toward orchestration instead of a single "super chat"

### 3.2 What Is Not Yet Aligned Enough

- The UI does not yet expose a clear `human-in-the-loop gateway`
- The writing surface is still too close to a placeholder workbench
- The product does not yet translate system complexity into a simple next-step experience
- Confirmation, execution, and risk correction are not yet represented as distinct product surfaces
- Trace/eval/version concepts exist in system direction but are not yet productized in a calm, readable way

## 4. Non-Negotiable Product Principles

These principles are the foundation of the prototype and should not be weakened later without an explicit redesign.

### 4.1 Internal Complexity, Simple Surface

The platform can be internally sophisticated, but the user-facing experience must remain simple.

The product should hide:

- raw workflow graphs
- subagent topology
- prompt internals
- state machine complexity

The product should show:

- the current step
- the reason it matters
- the evidence behind it
- the safe actions available now

### 4.2 Workflow First, Execution Second

The system decides the current step through orchestration. The user confirms high-value decisions before execution. Execution happens only after the decision is written back into artifacts/state.

### 4.3 One Page, One Role

Each major page should have one clear job:

- cockpit: decide what to do next
- confirmation center: confirm a decision with evidence
- workbench: execute the confirmed task
- control console: repair high-risk drift

### 4.4 Confirm Before Expanding Scope

The workbench is not allowed to redefine task boundaries. If the user wants to change direction, the product routes back to confirmation rather than silently widening the task.

### 4.5 Evidence-Based Confirmation

Every confirmation item must include:

- a proposed decision
- a reason
- affected artifacts
- a risk level
- alternatives

This prevents the system from becoming a "trust me" AI workflow.

## 5. Information Architecture

The first product prototype is a 4-page system:

1. `Task Dispatch Cockpit`
2. `Confirmation Center`
3. `Creation Workbench`
4. `Control Console`

These are not four equal tabs. They are four roles in one controlled workflow.

## 6. Page 1: Task Dispatch Cockpit

### 6.1 Page Purpose

This is the first page after `Continue Current Project`.

Its purpose is not to summarize everything. Its purpose is to translate a complex agent system into a single safe next step.

### 6.2 Chosen Direction

Chosen approach:

`task-dispatch cockpit`

Rejected alternative:

- pure overview dashboard

Reason:

The platform should guide the user through the next controlled action, not force the user to infer what should happen next from many cards and charts.

### 6.3 Priority Logic

If multiple classes of work exist at once, the cockpit prioritizes:

1. `pending confirmation`
2. `high-risk drift`
3. `can continue writing`

This reflects the shared agent principle:

`human confirmation outranks autonomous forward motion`

### 6.4 Required Modules

The cockpit should contain five modules:

1. `Current most important step`
   This is the dominant page card.
   It answers:
   - what should happen now
   - why this comes first
   - where the user goes next

2. `Current project stage`
   This gives lightweight orientation:
   - current phase
   - current volume/chapter
   - what has already been stabilized

3. `What is queued next`
   A short queue preview so the user does not feel blind.
   This is not a free-form todo list.

4. `Risk and blockers`
   Shallow status only:
   - high risk
   - awaiting approval
   - blocked

5. `Stable navigation`
   Lightweight links to:
   - confirmation center
   - workbench
   - control console

The navigation must be visually weaker than the current-step card.

## 7. Page 2: Confirmation Center

### 7.1 Page Purpose

The confirmation center is the core human-in-the-loop surface for the product.

It is not a modal and not a generic approval inbox. It is a decision workbench.

### 7.2 Chosen Direction

Chosen structure:

`one current confirmation item + visible queue`

Rejected alternatives:

- purely linear blind flow
- queue-first list workflow

Reason:

This preserves both orchestration and transparency:

- the system decides the main line
- the user can still see what comes next

### 7.3 Required Layout Blocks

The confirmation center should contain:

1. `Status strip`
   - current confirmation count
   - current phase
   - post-confirmation destination

2. `Current confirmation item`
   - the proposed decision
   - the short main judgment
   - why it is being surfaced now

3. `Evidence area`
   - rationale
   - risk level
   - why the current recommendation outranks alternatives

4. `Impact area`
   - affected artifacts
   - affected chapter/volume/character/blueprint surfaces

5. `Visible queue`
   - what remains after this item
   - queue is visible but not dominant

6. `Action bar`
   Only three primary actions:
   - accept current option
   - switch to an alternative
   - reject and send back for rework

### 7.4 Transition Rules

The rules after confirmation are fixed:

- `accept current option`
  - write decision back into artifacts/state
  - record the decision/trace
  - if another same-priority confirmation exists, stay in confirmation center
  - otherwise route to the correct execution page

- `switch to alternative`
  - promote that alternative to the current candidate
  - show new impact/risk summary
  - require a second explicit confirmation
  - then continue as a normal accept

- `reject and rework`
  - do not write target artifacts
  - create a rework task
  - store rejection reason
  - continue to next processable item or return to cockpit

The confirmation center never performs the final creation action itself. It only confirms and dispatches.

## 8. Page 3: Creation Workbench

### 8.1 Page Purpose

The workbench is not an open sandbox and not a chat screen.

It is:

`a confirmed-task execution surface`

### 8.2 Chosen Direction

The user enters the workbench only after a decision has already been confirmed.

Example:

`Use continuation direction 2 to generate chapter 8 candidate draft`

The page must clearly show:

- why the user is here
- what has been confirmed already
- what may be done safely now
- how to return if the direction needs to change

### 8.3 Required Layout Blocks

1. `Execution context bar`
   - current task
   - confirmed basis
   - locked constraints
   - link back to confirmation center

2. `Main writing surface`
   - chapter brief
   - current objective
   - candidate text
   - human editing surface

3. `Lightweight support rail`
   - current referenced artifacts
   - relevant character/world rules
   - review notes
   - generation notes

4. `Bottom action bar`
   Only a small number of strong actions:
   - generate candidate
   - local rewrite
   - adopt into draft
   - send to review / return for confirmation

### 8.4 Boundary Rule

The workbench executes the current task. It does not redefine the task boundary.

If the user wants to change direction, scope, or structural intent, the correct path is:

`back to confirmation center`

## 9. Page 4: Control Console

### 9.1 Page Purpose

The control console is not a settings page and not an always-on monitoring dashboard.

It is:

`a controlled repair surface for high-risk drift`

### 9.2 Usage Frequency

Users should not live in this page. They should only arrive here when the system detects a high-value issue such as:

- structural drift
- blueprint conflict
- chapter trajectory divergence
- approval blockage

### 9.3 Required Layout Blocks

1. `Current highest-risk issue`
   One dominant issue only.
   It should state:
   - what is drifting
   - risk level
   - what happens if ignored

2. `Three repair strategies`
   Fixed categories:
   - conservative repair
   - balanced repair
   - force convergence

   Each option explains:
   - how it repairs the issue
   - which artifacts it changes
   - its tradeoff cost

3. `Evidence and scope of impact`
   Calm, readable evidence:
   - where the conflict exists
   - what blueprint it violates
   - which chapters/characters/artifacts it impacts

4. `Action bar`
   Only:
   - accept repair option
   - send back for re-analysis
   - defer for now

### 9.4 Control Flow Rule

The console handles one high-risk issue at a time.

If the user accepts a repair strategy, the result should generate repair artifacts and then route into the normal confirmation/dispatch chain rather than silently mutating everything in place.

## 10. Primary Product Flow

The primary front-half product flow is:

`Continue Current Project`
-> `Task Dispatch Cockpit`
-> `Current highest-priority confirmation`
-> `Confirmation Center`
-> `Decision writeback`
-> `Creation Workbench` or `Control Console`

This keeps the product aligned with the principle:

`system orchestrates, human confirms, execution stays controlled`

## 11. User Simplicity Rules

To keep the surface from becoming exhausting, these rules apply across the first prototype:

- Never show raw agent graphs by default
- Never make the user choose between many internal agent roles
- Never put more than one current priority item at the top of a page
- Never expose more than three primary actions in a critical action bar
- Keep detailed evidence visible when needed, but secondary to the main decision
- Keep queue visibility lightweight and reassuring, not operationally noisy

## 12. Product Alignment Summary

### 12.1 Aligned With 2026 Agent Direction

This prototype aligns with the current official direction because it is:

- workflow-first
- artifact-driven
- explicitly human-confirmed
- execution-bounded
- compatible with trace/eval/versioning layers
- simple on the surface while preserving control internally

### 12.2 Not Attempted In This Prototype

This prototype does not attempt to expose:

- advanced settings systems
- raw agent internals
- tenant/admin controls
- full observability dashboards
- arbitrary user-built workflow graphs

Those may exist later, but should not define V1.

## 13. Implementation Consequences

This design implies the following work will eventually be needed in product and frontend implementation:

- a real cockpit current-step card and priority resolver
- a dedicated confirmation center page
- workbench execution context banners and boundary enforcement
- a control console focused on one issue and three repairs
- artifact-level writeback and transition tracking between pages

These items belong in the implementation plan, not this spec.

## 14. Conclusion

The correct first prototype for Writebot is not a bigger AI chat page.

It is a calm, controlled agent writing product with four explicit surfaces:

- a cockpit that decides the next safe step
- a confirmation center that turns AI suggestions into human-approved decisions
- a workbench that executes only what has been confirmed
- a control console that repairs high-risk drift without overwhelming the user

That product shape is the clearest path to meeting the current 2026-grade agent direction while keeping the user experience understandable and non-threatening.
