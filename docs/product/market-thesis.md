# Writebot Market Thesis

## Product Positioning

Writebot is a professional author chief-editor desk for serious Chinese web novel authors. It is a workflow-first, artifact-driven writing product built for long-form creation where the author remains the final decision-maker across planning, drafting, revision, approval, and canon maintenance.

The product wins on author control, not on raw generation speed. Its value comes from helping one author keep narrative continuity, review machine-generated proposals safely, and preserve trust in what becomes durable story truth.

## Target User

The primary user is a serious solo novelist working in the Chinese web fiction market. This user needs a stable project and chapter workflow, strong continuity support, and clear review boundaries more than they need a generic AI chat box.

## Market Stance

Generic chat writing tools are fast to open but weak at manuscript control. They mix brainstorming, drafting, and revision into a single transcript, which makes provenance, approval, and canon maintenance hard to trust over a long project.

Automation-first novel products also miss the core need. They optimize for bulk output, but that direction weakens revision discipline, hides decision boundaries, and makes it too easy for unreviewed text to drift away from story intent.

Writebot takes the opposite stance:

- workflow UX keeps the author inside a project and chapter flow instead of a chat transcript
- narrative memory keeps approved facts durable and reviewable
- provenance and approval keep trust visible before anything becomes long-term truth

## Product Shape

Writebot is open-source, self-host-first, and Web-first. Provider flexibility matters because authors and operators need bring-your-own-key deployment freedom, but model breadth is an implementation requirement rather than the headline promise.

The MVP serves a single-author manuscript loop:

`premise → outline → chapter plan → chapter draft → revision → approved canon`

Only approved artifacts may update durable canon.

## Why This Product Should Exist

Chinese web novel authors need a product that respects serialized long-form work. The central problem is not producing more text at any cost. The central problem is keeping chapters, revisions, terminology, and world facts under author supervision while still getting meaningful drafting help.

Writebot therefore acts as a chief-editor desk for one author:

- it organizes creation around projects, chapters, and review states
- it treats generated output as proposals instead of silent truth
- it preserves revision history and provenance so acceptance is informed
- it lets the author continue writing without surrendering control of canon

## V1 Scope

V1 is focused on a single author completing a book-length workflow in one controlled system. The dominant product surfaces are the project overview, chapter workspace, story references, outline, history, and provider settings.

The product moat in V1 is workflow UX + narrative memory + author trust.

## Out of Scope

- collaboration-first editorial workflows for multiple human contributors
- phone-led product strategy or native-app-first delivery
- plugin ecosystems, multimedia generation, or publishing platform integrations
- autonomous full-book production without explicit human review boundaries
- positioning the product primarily as a provider comparison layer
- reshaping the product into a generic AI writing assistant

## Decision Rules That Must Hold

- author control stays ahead of throughput
- workflow state stays clearer than chat history
- approved artifacts outrank raw generated drafts
- durable canon changes only through explicit approval
- provider abstraction serves the product; it is not the product thesis
