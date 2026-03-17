import { PrototypeNav } from "@/components/project/prototype-nav";
import { getAgentPrototype } from "@/lib/prototype/agent-prototype-data";

export default async function OutlinePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const prototype = getAgentPrototype(projectId);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f6eee2_0%,#efe4d6_48%,#e8d8c7_100%)] px-6 py-16 text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <PrototypeNav links={prototype.navigation} activeHref={`/projects/${projectId}/outline`} />
        <section className="grid gap-5 rounded-[32px] border border-foreground/10 bg-white/78 p-7 shadow-[0_22px_60px_rgba(29,20,13,0.09)]">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-foreground/45">
              大纲 · {prototype.projectTitle}
            </p>
            <h1 className="text-4xl font-semibold tracking-tight">大纲</h1>
            <p className="max-w-3xl text-base leading-7 text-foreground/72">
              在这里查看卷级推进、章节计划与关键转折，后续会接入围绕创作流程的大纲工件管理。
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
