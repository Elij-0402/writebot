import Link from "next/link";
import type { PrototypeChapterCard, PrototypeOverview } from "@/lib/prototype/agent-prototype-data";

type ChapterCardProps = {
  chapter: PrototypeChapterCard;
  labels: PrototypeOverview["chapterCardLabels"];
};

const statusClasses: Record<PrototypeChapterCard["status"], string> = {
  可继续写作: "bg-emerald-100 text-emerald-900",
  待确认: "bg-amber-100 text-amber-900",
  进行中: "bg-sky-100 text-sky-900",
  需修复: "bg-rose-100 text-rose-900",
};

export function ChapterCard({ chapter, labels }: ChapterCardProps) {
  return (
    <article className="grid gap-4 rounded-[28px] border border-foreground/10 bg-white/80 p-6 shadow-[0_18px_50px_rgba(29,20,13,0.08)]">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-semibold tracking-tight">{chapter.title}</h2>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold tracking-[0.18em] ${statusClasses[chapter.status]}`}
        >
          {chapter.status}
        </span>
        {chapter.recommended ? (
          <span className="rounded-full bg-foreground px-3 py-1 text-xs font-semibold tracking-[0.18em] text-background">
            {labels.recommended}
          </span>
        ) : null}
      </div>

      <p className="text-sm leading-7 text-foreground/75">{chapter.summary}</p>

      <div className="rounded-2xl border border-foreground/10 bg-background/70 p-4 text-sm leading-7 text-foreground/72">
        {labels.lastAction}：{chapter.lastAction}
      </div>

      <Link
        href={chapter.href}
        className="inline-flex items-center justify-center rounded-full border border-foreground/15 bg-white px-4 py-3 text-sm font-semibold text-foreground"
      >
        {labels.action}
      </Link>
    </article>
  );
}
