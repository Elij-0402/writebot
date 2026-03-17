# Writebot PRD V1

## Product Summary

Writebot V1 is a Web-first, open-source, self-hostable author desk for one serious Chinese web novel author. The product is built around controlled artifact progression, explicit review, and trusted canon maintenance rather than transcript-led interaction or bulk autonomous generation.

## Product Goal

Help one author move from premise to approved story canon through a repeatable manuscript workflow that keeps planning, drafting, revision, and acceptance inside one durable product loop.

## Jobs to be Done

1. As an author, I need to keep project-level story intent, outline, chapter plans, and chapter drafts connected so I can keep writing a long serialized novel without losing continuity.
2. As an author, I need drafting and revision assistance that produces reviewable proposals instead of silently overwriting my manuscript.
3. As an author, I need to inspect provenance, differences, and approval state so I can decide what becomes durable truth.
4. As a self-hosting operator, I need configurable provider access with API key and base URL support so I can run the product with my own infrastructure and model endpoints.

## Primary Workflow

The dominant artifact lifecycle in V1 is:

`premise → outline → chapter plan → draft → revision → approved canon`

Each stage creates or refines artifacts that remain inspectable. Generated output is provisional until the author reviews and approves it. Only approved artifacts may update durable canon.

## Why Chapter Workspace Is The Dominant Surface

The chapter workspace is where writing actually happens. Project overview should guide the next step, but the chapter workspace is the center of gravity because it concentrates the active brief, current draft, revision actions, inline approvals, repair prompts, and context needed to keep the author moving.

This makes the product feel like a creation desk instead of a command console. The author should spend most active time in the chapter workspace, with project overview, story references, outline, history, and settings acting as supporting surfaces.

## Core User Flows

### Flow 1: Start from an existing project

1. Open a project
2. See the current stage, pending approvals, and recommended next chapter action
3. Enter the chapter workspace
4. Draft, revise, or repair with explicit workflow actions
5. Review provenance and differences
6. Approve selected output and update canon safely

### Flow 2: Maintain continuity while revising

1. Open a chapter draft or revision proposal
2. Compare pending text against accepted material
3. Inspect provider, prompt template, and workflow provenance
4. Accept, reject, or send back for rework
5. Keep durable narrative truth aligned with approved artifacts

### Flow 3: Configure runtime model access

1. Open settings and provider setup
2. Register an official provider or OpenAI-compatible endpoint
3. Enter API key, base URL, and protocol details
4. Validate capability support
5. Save a runtime profile for later workflow execution

## Functional Requirements

### Author Workflow

- project-first navigation with a stable route into project overview and chapter workspace
- artifact progression visible at the project and chapter level
- distinct draft, revision, and repair workflow actions
- revision history, provenance, and comparison surfaces
- explicit approval before durable canon mutation

### Canon And Trust

- clear approved versus pending state
- provenance metadata for every workflow run
- durable canon updated only after approval
- history and diff views that explain what changed and why

### Provider Setup

- product-owned provider abstraction
- provider profiles with API key, base URL, and protocol configuration
- OpenAI-compatible endpoint support
- capability-aware validation and runtime selection

### Self-Host Readiness

- self-host-first deployment baseline
- documented environment contract
- CI, tests, and startup guidance suitable for open-source operators

## Success Metrics

- an operator can configure a provider profile without editing source code
- an author can open 龙渊纪事, enter 第12章：夜渡寒江, run draft or revision, inspect provenance, and approve safely
- canon mutation occurs only after approval in all happy-path flows
- regression coverage catches provider failures, canon conflicts, long-context truncation, and terminology drift
- golden fixtures for 龙渊纪事 and 第12章：夜渡寒江 stay machine-verifiable in CI
- a fresh self-host deployment can boot, validate config, and run the core manuscript loop

## Non-Goals

- multi-user collaboration as a primary V1 workflow
- native-mobile-first product design
- marketplace or extension-ecosystem work
- publishing-platform integrations
- autonomous end-to-end full-book generation without human review
- product framing centered on agent rosters, chat commands, or provider comparison charts

## Scope Boundaries

V1 is intentionally scoped to a trusted single-author creation loop. The product promise is author control first, continuity confidence second, throughput third.

The product must not drift into a broad assistant shell. It must remain a workflow-first author desk that keeps artifact state, approvals, provenance, and canon mutation explicit.
