import Link from "next/link";
import { getAgentPrototype } from "@/lib/prototype/agent-prototype-data";

export default function ProjectsPage() {
  const prototype = getAgentPrototype("project_demo");

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#f7eddc_0%,#efe2d1_38%,#e7d5c4_100%)] px-6 py-16 text-foreground">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-foreground/70">
          {prototype.entry.eyebrow}
        </p>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight">{prototype.entry.pageTitle}</h1>
          <p className="max-w-2xl text-base leading-7 text-foreground/80">
            {prototype.entry.summary}
          </p>
        </div>
        <div className="rounded-[32px] border border-foreground/10 bg-white/70 p-7 shadow-[0_22px_60px_rgba(29,20,13,0.09)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/45">
                {prototype.entry.projectLabel}
              </p>
              <h2 className="text-3xl font-semibold tracking-tight">{prototype.projectTitle}</h2>
              <p className="max-w-2xl text-sm leading-7 text-foreground/72">
                {prototype.entry.projectSummary}
              </p>
            </div>
            <Link
              className="inline-flex rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background"
              href={prototype.continueLink.href}
            >
              {prototype.continueLink.label}
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {prototype.entry.projectSignals.map((signal) => (
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
