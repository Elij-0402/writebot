# Provider Kernel Contract

## Purpose

Writebot must integrate models through a product-owned provider kernel instead of letting any vendor SDK define product boundaries. The kernel exists to normalize configuration, validation, capability checks, and provenance while still preserving provider-specific differences that matter to workflow behavior.

## Core Contract

The provider kernel exposes a typed runtime boundary for drafting, revision, and repair workflows. It accepts a provider profile, validates required configuration, checks declared capabilities, executes the requested protocol, and returns structured output plus provenance.

## Provider Profile

A provider profile is the saved runtime configuration for one model endpoint. Each provider profile should include:

- profile id and display name
- adapter type such as `anthropic`, `openai`, `gemini`, or `openai-compatible`
- base URL when applicable
- API key secret reference or secure stored value
- protocol mode such as chat, completions, or responses
- model identifier
- timeout, retry, and streaming preferences
- enabled capability flags
- operator notes and default-use markers

Provider profiles are product data, not source edits. Users must be able to create and select them through supported settings flows.

## Capability Registry

The kernel must expose a capability registry so workflows can ask what the selected runtime supports before execution. Capability flags should include, at minimum:

- streaming support
- structured JSON output support
- tool or function calling support
- system prompt support
- max context window metadata
- image or multimodal input support when relevant
- responses API support
- chat completions support
- legacy completions support

Workflows must branch on capability truth instead of assuming every provider can behave identically.

## Adapter Types

### First-party adapters

Named first-party adapters should exist for Anthropic, OpenAI, and Gemini. These adapters may use provider-specific request/response semantics where needed, but they still conform to the kernel return shape and provenance rules.

### OpenAI-compatible adapter

An OpenAI-compatible adapter is mandatory. It must support configurable base URL, API key, and protocol selection so operators can connect local or third-party endpoints that speak OpenAI-style chat, completions, or responses APIs.

### Raw-provider escape hatch

The kernel should include a raw-provider escape hatch for advanced operator use. This escape hatch still goes through config validation and provenance capture, but it allows explicitly declared request mapping when a provider does not fit a named first-party adapter yet.

## Validation Rules

Before a profile can be used, the kernel must validate:

- required secret presence
- protocol compatibility with the adapter type
- base URL shape for adapters that need one
- declared capabilities versus selected workflow requirements
- timeout and retry ranges
- model identifier presence

Validation errors must be concrete and operator-readable. Invalid configuration must fail fast before workflow execution starts.

## Workflow Interface

The kernel should expose specialized execution entry points that keep workflow intent visible:

- draft execution
- revision execution
- repair execution

These actions may share low-level transport code, but the product must not flatten them into one generic generate call at the UX or provenance layer.

## Provenance

Every run must persist provenance fields that include:

- provider profile id and display name
- adapter type
- base URL when used
- model identifier
- protocol used
- capability snapshot at run time
- request start/end timestamps
- latency
- failure class if any
- approximate usage/cost metadata when available
- workflow action type and template version

This provenance is required for history, diff, operator debugging, and trust.

## Failure Handling

The provider kernel must classify and return structured failures for:

- timeout
- rate limit / 429
- malformed JSON or schema mismatch
- partial stream interruption
- unsupported capability
- authentication/configuration failure

Failure metadata must be recorded without creating committed content.

## Boundary Rules

- vendor SDKs are implementation details, not the product contract
- provider differences may remain visible when they affect correctness or UX
- the kernel serves workflows, approvals, and provenance; it does not replace them
- product settings must control profiles without requiring source-code edits
