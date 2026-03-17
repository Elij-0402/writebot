"use client";

import { useState } from "react";
import type { ProviderProfile } from "@/lib/llm/provider-profiles";

type ProviderSettingsFormProps = {
  initialProfiles: ProviderProfile[];
};

type FieldErrors = Record<string, string>;

export function ProviderSettingsForm({ initialProfiles }: ProviderSettingsFormProps) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [name, setName] = useState("");
  const [adapter, setAdapter] = useState("openai-compatible");
  const [protocol, setProtocol] = useState("responses");
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [setAsDefault, setSetAsDefault] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setStatus(null);

    const response = await fetch("/api/settings/provider-profiles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        adapter,
        protocol,
        baseUrl,
        apiKey,
        model,
        setAsDefault,
      }),
    });

    const payload = (await response.json()) as {
      error?: string;
      fieldErrors?: FieldErrors;
      profile?: ProviderProfile;
    };

    if (!response.ok) {
      setFieldErrors(payload.fieldErrors ?? {});
      return;
    }

    if (!payload.profile) {
      setStatus("保存失败，请稍后重试。");
      return;
    }

    setProfiles((current) => {
      const filtered = current.filter((profile) => profile.id !== payload.profile?.id);
      return [...filtered, payload.profile!];
    });
    setStatus(`已保存 provider profile：${payload.profile.name}`);
    setName("");
    setProtocol("responses");
    setBaseUrl("");
    setApiKey("");
    setModel("");
    setSetAsDefault(true);
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
      <form
        className="grid gap-4 rounded-[32px] border border-foreground/10 bg-white/82 p-7 shadow-[0_22px_60px_rgba(29,20,13,0.09)]"
        onSubmit={handleSubmit}
      >
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Provider Profile</h2>
          <p className="text-sm leading-7 text-foreground/72">
            使用产品自有 provider abstraction 保存运行时接入信息，并在写作工作流中选择默认运行时。
          </p>
        </div>

        <label className="grid gap-2 text-sm font-medium">
          <span>Provider Profile 名称</span>
          <input
            aria-label="Provider Profile 名称"
            className="rounded-2xl border border-foreground/15 bg-background/80 px-4 py-3 outline-none"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          {fieldErrors.name ? <span className="text-sm text-red-700">{fieldErrors.name}</span> : null}
        </label>

        <label className="grid gap-2 text-sm font-medium">
          <span>Adapter 类型</span>
          <select
            aria-label="Adapter 类型"
            className="rounded-2xl border border-foreground/15 bg-background/80 px-4 py-3 outline-none"
            value={adapter}
            onChange={(event) => setAdapter(event.target.value)}
          >
            <option value="openai-compatible">OpenAI-compatible</option>
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic</option>
            <option value="gemini">Gemini</option>
          </select>
          {fieldErrors.adapter ? <span className="text-sm text-red-700">{fieldErrors.adapter}</span> : null}
        </label>

        <label className="grid gap-2 text-sm font-medium">
          <span>Protocol</span>
          <input
            aria-label="Protocol"
            className="rounded-2xl border border-foreground/15 bg-background/80 px-4 py-3 outline-none"
            value={protocol}
            onChange={(event) => setProtocol(event.target.value)}
          />
          {fieldErrors.protocol ? <span className="text-sm text-red-700">{fieldErrors.protocol}</span> : null}
        </label>

        <label className="grid gap-2 text-sm font-medium">
          <span>Base URL</span>
          <input
            aria-label="Base URL"
            className="rounded-2xl border border-foreground/15 bg-background/80 px-4 py-3 outline-none"
            value={baseUrl}
            onChange={(event) => setBaseUrl(event.target.value)}
          />
          {fieldErrors.baseUrl ? <span className="text-sm text-red-700">{fieldErrors.baseUrl}</span> : null}
        </label>

        <label className="grid gap-2 text-sm font-medium">
          <span>API Key</span>
          <input
            aria-label="API Key"
            className="rounded-2xl border border-foreground/15 bg-background/80 px-4 py-3 outline-none"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
          />
          {fieldErrors.apiKey ? <span className="text-sm text-red-700">{fieldErrors.apiKey}</span> : null}
        </label>

        <label className="grid gap-2 text-sm font-medium">
          <span>模型名称</span>
          <input
            aria-label="模型名称"
            className="rounded-2xl border border-foreground/15 bg-background/80 px-4 py-3 outline-none"
            value={model}
            onChange={(event) => setModel(event.target.value)}
          />
          {fieldErrors.model ? <span className="text-sm text-red-700">{fieldErrors.model}</span> : null}
        </label>

        <label className="flex items-center gap-3 text-sm font-medium">
          <input
            aria-label="设为默认运行时"
            checked={setAsDefault}
            type="checkbox"
            onChange={(event) => setSetAsDefault(event.target.checked)}
          />
          <span>设为默认运行时</span>
        </label>

        <button
          className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background"
          type="submit"
        >
          保存 provider profile
        </button>

        {status ? <p className="text-sm font-medium text-emerald-700">{status}</p> : null}
      </form>

      <section className="grid gap-4 rounded-[32px] border border-foreground/10 bg-white/72 p-7 shadow-[0_22px_60px_rgba(29,20,13,0.09)]">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">已保存的运行时</h2>
          <p className="text-sm leading-7 text-foreground/72">默认运行时会优先用于后续 draft、revision 与 repair 工作流。</p>
        </div>

        <div className="grid gap-3">
          {profiles.length > 0 ? (
            profiles.map((profile) => (
              <article
                key={profile.id}
                className="rounded-[24px] border border-foreground/10 bg-background/78 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold">{profile.name}</h3>
                    <p className="mt-1 text-sm text-foreground/72">
                      {profile.protocol} · {profile.baseUrl ?? "使用默认端点"}
                    </p>
                  </div>
                  {profile.isDefault ? (
                    <span className="rounded-full border border-emerald-700/20 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      默认运行时
                    </span>
                  ) : null}
                </div>
              </article>
            ))
          ) : (
            <p className="text-sm leading-7 text-foreground/72">还没有已保存的 provider profile。</p>
          )}
        </div>
      </section>
    </section>
  );
}
