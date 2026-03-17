import { getDefaultProviderProfile, getProviderProfileByName } from "@/lib/state/local-state";
import type { ProviderProfile } from "@/lib/llm/provider-profiles";

export type ProviderFailureType =
  | "missing_profile"
  | "unsupported_capability"
  | "timeout"
  | "rate_limit"
  | "malformed_json"
  | "partial_stream"
  | "config_missing";

export type WorkflowKind = "draft" | "revision" | "repair";

export type ProviderExecutionResult =
  | {
      ok: true;
      text: string;
      provenance: {
        providerProfile: string;
        model: string;
        protocol: string;
        templateVersion: string;
        workflowKind: WorkflowKind;
        status: "pending_review";
      };
    }
  | {
      ok: false;
      error: {
        type: ProviderFailureType;
        message: string;
      };
      provenance: {
        providerProfile: string | null;
        model: string | null;
        protocol: string | null;
        templateVersion: string;
        workflowKind: WorkflowKind;
        status: "failed";
      };
    };

function getTemplateVersion(kind: WorkflowKind) {
  return `${kind}-workflow-v1`;
}

function getFallbackProfile(name = "openai-compatible-local"): ProviderProfile {
  return {
    id: "provider_openai_compatible_local",
    name,
    adapter: "openai-compatible",
    protocol: "responses",
    baseUrl: "http://localhost:11434/v1",
    apiKey: "demo-key",
    model: "local-model",
    capabilities: {
      chat: false,
      completions: false,
      responses: true,
      streaming: true,
    },
    isDefault: true,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  };
}

function buildSuccessText(kind: WorkflowKind, chapterTitle: string) {
  if (kind === "revision") {
    return `${chapterTitle} 的修订提案已经生成，重点强化夜渡节奏并收紧句间张力。`;
  }

  if (kind === "repair") {
    return `${chapterTitle} 的修复提案已经生成，当前版本回收了过早解释并保持设定一致。`;
  }

  return `${chapterTitle} 的新草稿提案已经生成，当前版本保持寒江夜渡的悬念与推进节奏。`;
}

function checkCapability(profile: ProviderProfile, kind: WorkflowKind) {
  if (kind === "draft" || kind === "revision" || kind === "repair") {
    return profile.capabilities.responses || profile.capabilities.chat || profile.capabilities.completions;
  }

  return false;
}

export async function executeProviderWorkflow(input: {
  workflowKind: WorkflowKind;
  chapterTitle: string;
  providerProfileName?: string;
  failureMode?: string;
}): Promise<ProviderExecutionResult> {
  const profile = input.providerProfileName
    ? await getProviderProfileByName(input.providerProfileName)
    : await getDefaultProviderProfile();

  const resolvedProfile = profile ?? getFallbackProfile(input.providerProfileName);

  if (!resolvedProfile.apiKey) {
    return {
      ok: false,
      error: {
        type: "config_missing",
        message: "provider API key missing",
      },
      provenance: {
        providerProfile: resolvedProfile.name,
        model: resolvedProfile.model,
        protocol: resolvedProfile.protocol,
        templateVersion: getTemplateVersion(input.workflowKind),
        workflowKind: input.workflowKind,
        status: "failed",
      },
    };
  }

  if (!checkCapability(resolvedProfile, input.workflowKind)) {
    return {
      ok: false,
      error: {
        type: "unsupported_capability",
        message: "provider does not support requested workflow capability",
      },
      provenance: {
        providerProfile: resolvedProfile.name,
        model: resolvedProfile.model,
        protocol: resolvedProfile.protocol,
        templateVersion: getTemplateVersion(input.workflowKind),
        workflowKind: input.workflowKind,
        status: "failed",
      },
    };
  }

  const failureMode = input.failureMode?.trim();
  if (failureMode === "timeout") {
    return {
      ok: false,
      error: { type: "timeout", message: "provider request timed out" },
      provenance: {
        providerProfile: resolvedProfile.name,
        model: resolvedProfile.model,
        protocol: resolvedProfile.protocol,
        templateVersion: getTemplateVersion(input.workflowKind),
        workflowKind: input.workflowKind,
        status: "failed",
      },
    };
  }

  if (failureMode === "429") {
    return {
      ok: false,
      error: { type: "rate_limit", message: "provider returned 429" },
      provenance: {
        providerProfile: resolvedProfile.name,
        model: resolvedProfile.model,
        protocol: resolvedProfile.protocol,
        templateVersion: getTemplateVersion(input.workflowKind),
        workflowKind: input.workflowKind,
        status: "failed",
      },
    };
  }

  if (failureMode === "malformed_json") {
    return {
      ok: false,
      error: { type: "malformed_json", message: "provider returned malformed JSON" },
      provenance: {
        providerProfile: resolvedProfile.name,
        model: resolvedProfile.model,
        protocol: resolvedProfile.protocol,
        templateVersion: getTemplateVersion(input.workflowKind),
        workflowKind: input.workflowKind,
        status: "failed",
      },
    };
  }

  if (failureMode === "partial_stream") {
    return {
      ok: false,
      error: { type: "partial_stream", message: "provider stream interrupted" },
      provenance: {
        providerProfile: resolvedProfile.name,
        model: resolvedProfile.model,
        protocol: resolvedProfile.protocol,
        templateVersion: getTemplateVersion(input.workflowKind),
        workflowKind: input.workflowKind,
        status: "failed",
      },
    };
  }

  return {
    ok: true,
    text: buildSuccessText(input.workflowKind, input.chapterTitle),
    provenance: {
      providerProfile: resolvedProfile.name,
      model: resolvedProfile.model,
      protocol: resolvedProfile.protocol,
      templateVersion: getTemplateVersion(input.workflowKind),
      workflowKind: input.workflowKind,
      status: "pending_review",
    },
  };
}
