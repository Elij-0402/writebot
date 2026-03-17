export const providerAdapters = ["anthropic", "openai", "gemini", "openai-compatible"] as const;
export const providerProtocols = ["chat", "completions", "responses"] as const;

export type ProviderAdapter = (typeof providerAdapters)[number];
export type ProviderProtocol = (typeof providerProtocols)[number];

export type ProviderCapabilities = {
  chat: boolean;
  completions: boolean;
  responses: boolean;
  streaming: boolean;
};

export type ProviderProfile = {
  id: string;
  name: string;
  adapter: ProviderAdapter;
  protocol: ProviderProtocol;
  baseUrl: string | null;
  apiKey: string;
  model: string;
  capabilities: ProviderCapabilities;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProviderProfileInput = {
  name?: string;
  adapter?: string;
  protocol?: string;
  baseUrl?: string;
  apiKey?: string;
  model?: string;
  setAsDefault?: boolean;
};

export type ProviderProfileValidationResult =
  | {
      ok: true;
      value: {
        name: string;
        adapter: ProviderAdapter;
        protocol: ProviderProtocol;
        baseUrl: string | null;
        apiKey: string;
        model: string;
        capabilities: ProviderCapabilities;
        setAsDefault: boolean;
      };
    }
  | {
      ok: false;
      fieldErrors: Record<string, string>;
    };

function isProviderAdapter(value: string): value is ProviderAdapter {
  return providerAdapters.includes(value as ProviderAdapter);
}

function isProviderProtocol(value: string): value is ProviderProtocol {
  return providerProtocols.includes(value as ProviderProtocol);
}

export function buildCapabilities(protocol: ProviderProtocol): ProviderCapabilities {
  return {
    chat: protocol === "chat",
    completions: protocol === "completions",
    responses: protocol === "responses",
    streaming: protocol !== "completions",
  };
}

export function validateProviderProfileInput(
  input: ProviderProfileInput,
): ProviderProfileValidationResult {
  const fieldErrors: Record<string, string> = {};
  const name = input.name?.trim() ?? "";
  const adapter = input.adapter?.trim() ?? "";
  const protocol = input.protocol?.trim() ?? "";
  const baseUrl = input.baseUrl?.trim() ?? "";
  const apiKey = input.apiKey?.trim() ?? "";
  const model = input.model?.trim() ?? "";

  if (!name) {
    fieldErrors.name = "Provider Profile 名称为必填项";
  }

  if (!isProviderAdapter(adapter)) {
    fieldErrors.adapter = "Adapter 类型无效";
  }

  if (!isProviderProtocol(protocol)) {
    fieldErrors.protocol = "Protocol 必须是 chat、completions 或 responses";
  }

  if (adapter === "openai-compatible" && !baseUrl) {
    fieldErrors.baseUrl = "Base URL 为必填项";
  }

  if (!apiKey) {
    fieldErrors.apiKey = "API Key 为必填项";
  }

  if (!model) {
    fieldErrors.model = "模型名称为必填项";
  }

  if (Object.keys(fieldErrors).length > 0 || !isProviderAdapter(adapter) || !isProviderProtocol(protocol)) {
    return {
      ok: false,
      fieldErrors,
    };
  }

  return {
    ok: true,
    value: {
      name,
      adapter,
      protocol,
      baseUrl: baseUrl || null,
      apiKey,
      model,
      capabilities: buildCapabilities(protocol),
      setAsDefault: Boolean(input.setAsDefault),
    },
  };
}
