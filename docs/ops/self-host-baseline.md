# Self-Host Baseline

## Purpose

Writebot V1 is self-host-first. The minimum supported deployment must be practical for an operator running a single production-like node while still supporting long-running workflows, resumable jobs, provenance, and secure configuration.

## Minimum Topology

The supported baseline is a single-node containerized deployment with four core services:

1. web app
2. worker process
3. PostgreSQL
4. Redis

The web app serves the Next.js product surface and API routes. The worker handles queued workflow execution, retries, resumable job processing, and any work that should not block the request lifecycle. PostgreSQL stores product state, approvals, canon, provenance, and configuration metadata. Redis backs the queue, resumable job coordination, and lightweight execution signaling.

## Supported Deployment Modes

### Recommended baseline

- Docker-based self-host deployment on one machine or VM
- persistent PostgreSQL volume
- persistent backup destination for database dumps and operator artifacts
- Redis running alongside the app stack

### Optional preview mode

Vercel may be used for preview UI deployment or lightweight route smoke checks, but it is not the primary production story for workflow execution. Long-running generation, durable provenance, retries, and resumable jobs require the self-host baseline with a worker and queue.

## Environment And Secrets Contract

Operators must provide a clear environment contract, including at least:

- `DATABASE_URL`
- `REDIS_URL`
- application base URL
- session/auth secret as required by the app
- provider secrets such as OpenAI, Anthropic, Gemini, or OpenAI-compatible API keys
- default runtime provider configuration when enabled

Secrets must be injected through environment variables or a supported secret manager. They must not require source edits or browser-only storage.

## Queueing And Jobs

Workflow runs should enqueue execution work instead of assuming a request-response-only lifecycle. The worker must be able to:

- pick up draft, revision, and repair jobs
- record structured failure metadata
- resume interrupted runs safely where possible
- avoid duplicate approval-side effects on retry

## Backups

The baseline must include documented backups for PostgreSQL and any critical operator-managed artifacts. Operators should run scheduled database backups and test restore steps before treating the deployment as durable.

Backup guidance should cover:

- database dump frequency
- retention window
- restore procedure
- upgrade rollback expectations

## Upgrade Path

Upgrades should follow a clear path:

1. back up PostgreSQL
2. pull the new application image or source version
3. apply Prisma migrations
4. restart web and worker services
5. validate health and a core writing flow

Schema and app upgrades must be documented together so operators can update with confidence.

## Failure Expectations

Startup must fail fast when core config is missing. Missing database connection strings, queue configuration, or required provider secrets should produce concrete startup errors instead of partial runtime failure.

## What Vercel Can And Cannot Do

Vercel can help with preview environments, quick UI validation, and short-lived route checks. Vercel alone is not enough for the supported production baseline because the product needs durable state, worker execution, queue-backed retries, resumable workflows, and operator-controlled secret handling.

## Scope Boundaries

- Kubernetes is optional and not required for V1
- serverless-only deployment is not the supported baseline
- self-host support is defined around one reliable node first, then more complex topologies later
