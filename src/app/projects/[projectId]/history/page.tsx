import { PrototypeNav } from "@/components/project/prototype-nav";
import { getAgentPrototype } from "@/lib/prototype/agent-prototype-data";
import { getHistoryState } from "@/lib/state/history-state";

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const prototype = getAgentPrototype(projectId);
  const historyState = await getHistoryState(projectId);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f6eee2_0%,#efe4d6_48%,#e8d8c7_100%)] px-6 py-16 text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <PrototypeNav links={prototype.navigation} activeHref={`/projects/${projectId}/history`} />
        <section className="grid gap-5 rounded-[32px] border border-foreground/10 bg-white/78 p-7 shadow-[0_22px_60px_rgba(29,20,13,0.09)]">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-foreground/45">
              历史记录 · {historyState.projectTitle}
            </p>
            <h1 className="text-4xl font-semibold tracking-tight">历史记录</h1>
            <p className="max-w-3xl text-base leading-7 text-foreground/72">
              在这里查看修订来源、差异、批准状态与作者决策入口，所有接受动作都必须先经过对比步骤。
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(320px,0.78fr)]">
          <article className="grid gap-4 rounded-[32px] border border-foreground/10 bg-white/78 p-7 shadow-[0_22px_60px_rgba(29,20,13,0.09)]">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-foreground/45">当前修订</p>
              <h2 className="text-2xl font-semibold tracking-tight">{historyState.entry.title}</h2>
              <p className="text-sm leading-7 text-foreground/72">{historyState.entry.summary}</p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {historyState.entry.metadata.map((item) => (
                <div key={item.label} className="rounded-2xl border border-foreground/10 bg-background/72 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-foreground/80">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-[28px] border border-foreground/10 bg-background/72 p-6">
              <h3 className="text-lg font-semibold">{historyState.entry.compareTitle}</h3>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <section className="rounded-2xl border border-foreground/10 bg-white/82 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">原始草稿</p>
                  <p className="mt-3 text-sm leading-7 text-foreground/78">{historyState.entry.previousBody}</p>
                </section>
                <section className="rounded-2xl border border-foreground/10 bg-white/82 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">当前提案</p>
                  <p className="mt-3 text-sm leading-7 text-foreground/78">{historyState.entry.currentBody}</p>
                </section>
              </div>
            </div>
          </article>

          <aside className="grid gap-4 rounded-[32px] border border-foreground/10 bg-white/72 p-7 shadow-[0_22px_60px_rgba(29,20,13,0.09)]">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-foreground/45">作者决策</p>
              <h2 className="text-2xl font-semibold tracking-tight">先比较，再决定是否接受</h2>
              <p className="text-sm leading-7 text-foreground/72">
                当前状态：{historyState.entry.status}。你需要先查看差异与来源，才能决定是否接受本次修订。
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background"
              >
                {historyState.entry.acceptLabel}
              </button>
              <button
                type="button"
                className="rounded-full border border-foreground/15 bg-white px-5 py-3 text-sm font-semibold text-foreground"
              >
                {historyState.entry.rejectLabel}
              </button>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
