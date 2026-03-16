import Link from "next/link";
import { ChapterCard } from "@/components/project/chapter-card";
import type { PrototypeOverview } from "@/lib/prototype/agent-prototype-data";

type ProjectOverviewProps = {
  projectTitle: string;
  overview: PrototypeOverview;
};

export function ProjectOverview({ projectTitle, overview }: ProjectOverviewProps) {
  return (
    <section className="grid gap-6">
      <header className="grid gap-5 rounded-[32px] border border-foreground/10 bg-white/78 p-7 shadow-[0_22px_60px_rgba(29,20,13,0.09)] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-foreground/45">
            当前项目 · {projectTitle}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">{overview.title}</h1>
          <p className="max-w-3xl text-base leading-7 text-foreground/72">{overview.progressLabel}</p>
        </div>
        <Link
          href={overview.primaryAction.href}
          className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background"
        >
          {overview.primaryAction.label}
        </Link>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {overview.chapters.map((chapter) => (
          <ChapterCard key={chapter.id} chapter={chapter} />
        ))}
      </div>

      <section className="grid gap-3 rounded-[28px] border border-foreground/10 bg-white/65 p-6">
        <h2 className="text-lg font-semibold">项目提示</h2>
        <ul className="grid gap-3 text-sm leading-7 text-foreground/72 md:grid-cols-2">
          {overview.notes.map((note) => (
            <li key={note} className="rounded-2xl border border-foreground/10 bg-background/70 px-4 py-3">
              {note}
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
