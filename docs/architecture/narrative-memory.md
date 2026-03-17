# Narrative Memory Architecture

## Purpose

Writebot needs explicit memory layers so long-form novel work stays trustworthy over time. The product must separate durable truth from temporary generation context and from reviewable but unapproved outputs.

## Memory Layers

### Durable canon

Durable canon is the stable narrative truth of a project. It includes approved artifacts such as accepted story rules, accepted outline decisions, accepted chapter facts, accepted character facts, and any committed material that the author has explicitly approved.

Durable canon is the highest-priority source during context assembly. It is versioned, reviewable, and preserved across runs, browser refreshes, and resumable workflows.

### Derived memory

Derived memory contains computed or compressed representations that help workflows stay efficient without becoming the source of truth. This includes summaries, chapter rollups, conflict indexes, terminology lists, and continuity hints derived from approved material.

Derived memory may accelerate retrieval and prioritization, but it never outranks durable canon. If derived memory conflicts with approved truth, the system must keep the canon, flag the mismatch, and treat the derivative as stale.

### Ephemeral run context

Ephemeral run context is assembled for one workflow run. It includes the active chapter brief, current task intent, relevant approved canon slices, high-priority revision notes, selected provider profile, and bounded recent run metadata.

Ephemeral run context is disposable. It exists to help a specific draft, revision, or repair action complete safely, then it may be discarded or regenerated.

## Artifact Classes

### Durable objects

- approved story bible entries
- approved outline and chapter plan artifacts
- approved chapter facts extracted from accepted content
- committed chapter text that has already crossed approval
- canonical terminology and proper noun records

### Derived objects

- project summaries
- chapter summaries
- continuity indexes
- name and lore conflict reports
- retrieval hints and ranking metadata

### Ephemeral objects

- active workflow prompt inputs
- pending generation instructions
- temporary repair candidates
- run-local truncation decisions
- resumable in-flight execution state

## Approval And Canon Mutation Rules

Only approved artifacts may change durable canon. A draft, revision, repair proposal, or generated summary may exist, be inspected, and even be preferred for later approval, but it cannot mutate durable narrative truth until the approval step completes.

Unapproved output may inform review, diff, provenance, and repair flows. It may not silently update canon, replace approved facts, or rewrite accepted terminology.

## Provenance Requirements

Every proposal and revision path must retain provenance that answers:

- what artifact was proposed
- which workflow produced it
- which provider/model/profile was used
- which prompt template or revision strategy was used
- which approved context artifacts were included
- whether the result is pending, approved, rejected, or committed

Provenance must stay attached through review and revision so authors can inspect both what changed and how it was produced.

## Context Packaging Rules

Context packaging must be deterministic and independent of transient UI state. The same approved project state should yield the same priority ordering for the same workflow action.

Priority order should follow this shape:

1. project identity and current chapter target
2. active approved outline and chapter brief
3. durable canon relevant to the target action
4. required hard constraints and terminology rules
5. approved recent history needed for continuity
6. derived memory and lower-priority summaries

If token budget pressure forces truncation, lower-priority derived material drops before approved canon.

## Conflict Handling

The system must detect and surface contradictions involving names, lore, timeline, terminology, and approved chapter facts. A newer draft does not win because it is newer. If a pending artifact conflicts with approved canon, the conflict should appear as a review or repair issue rather than a truth update.

## Revision Model

Revisions create new proposals with lineage to the source artifact they are changing. The system should preserve:

- source artifact identifier
- prior approval/commit status
- diff target
- workflow action type such as draft, revision, or repair
- review decision trail

This keeps revision provenance explicit and prevents history from collapsing into a single mutable document.
