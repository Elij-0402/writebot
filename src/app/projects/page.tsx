import Link from "next/link";
import { getProjectsEntryState } from "@/lib/state/project-state";

export default async function ProjectsPage() {
  const entryState = await getProjectsEntryState();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f7eddc_0%,#efe2d1_38%,#e7d5c4_100%)] px-6 py-16 text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-foreground/70">Writebot 创作入口</p>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight">项目</h1>
          <p className="max-w-2xl text-base leading-7 text-foreground/80">{entryState.summary}</p>
        </div>
        <div className="rounded-[32px] border border-foreground/10 bg-white/70 p-7 shadow-[0_22px_60px_rgba(29,20,13,0.09)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/45">当前项目</p>
              <h2 className="text-3xl font-semibold tracking-tight">{entryState.projectTitle}</h2>
              <p className="max-w-2xl text-sm leading-7 text-foreground/72">
                围绕当前章节的确认、审批和提交继续推进创作流程。
              </p>
            </div>
            <Link
              className="inline-flex rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background"
              href={entryState.continueHref}
            >
              继续当前项目
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {entryState.signals.map((signal) => (
              <div
                key={signal.label}
                className="rounded-2xl border border-foreground/10 bg-stone-50 p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
                  {signal.label}
                </p>
                <p className="mt-2 text-sm font-semibold">{signal.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
