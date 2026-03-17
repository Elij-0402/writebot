import { PrototypeNav } from "@/components/project/prototype-nav";
import { ProviderSettingsForm } from "@/components/settings/provider-settings-form";
import { getAgentPrototype } from "@/lib/prototype/agent-prototype-data";
import { listProviderProfiles } from "@/lib/state/local-state";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const prototype = getAgentPrototype(projectId);
  const profiles = await listProviderProfiles();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f6eee2_0%,#efe4d6_48%,#e8d8c7_100%)] px-6 py-16 text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <PrototypeNav links={prototype.navigation} activeHref={`/projects/${projectId}/settings`} />
        <section className="grid gap-5 rounded-[32px] border border-foreground/10 bg-white/78 p-7 shadow-[0_22px_60px_rgba(29,20,13,0.09)]">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-foreground/45">
              设置/模型接入 · {prototype.projectTitle}
            </p>
            <h1 className="text-4xl font-semibold tracking-tight">设置/模型接入</h1>
            <p className="max-w-3xl text-base leading-7 text-foreground/72">
              在这里配置 provider profile、API key、base URL 与 protocol，并为后续工作流选择默认运行时。
            </p>
          </div>
        </section>
        <ProviderSettingsForm initialProfiles={profiles} />
      </div>
    </main>
  );
}
