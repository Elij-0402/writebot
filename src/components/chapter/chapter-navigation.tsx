import Link from "next/link";
import type { PrototypeChapterNavItem } from "@/lib/prototype/agent-prototype-data";

type ChapterNavigationProps = {
  title: string;
  currentChapterTitle: string;
  chapters: PrototypeChapterNavItem[];
};

const statusClasses: Record<PrototypeChapterNavItem["status"], string> = {
  可继续写作: "bg-emerald-100 text-emerald-900",
  待确认: "bg-amber-100 text-amber-900",
  进行中: "bg-sky-100 text-sky-900",
  需修复: "bg-rose-100 text-rose-900",
};

export function ChapterNavigation({ title, currentChapterTitle, chapters }: ChapterNavigationProps) {
  return (
    <aside className="grid gap-4 rounded-[28px] border border-foreground/10 bg-white/72 p-5 shadow-[0_18px_50px_rgba(29,20,13,0.08)]">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/45">{title}</p>
        <h2 className="text-xl font-semibold tracking-tight">{currentChapterTitle}</h2>
      </div>

      <div className="grid gap-3">
        {chapters.map((chapter) => {
          const isActive = chapter.label === currentChapterTitle;

          return (
            <Link
              key={chapter.id}
              href={chapter.href}
              className={`grid gap-2 rounded-2xl border px-4 py-4 text-left transition ${
                isActive
                  ? "border-foreground/20 bg-foreground text-background"
                  : "border-foreground/10 bg-background/70 text-foreground"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">{chapter.label}</span>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.16em] ${
                    isActive ? "bg-background/20 text-background" : statusClasses[chapter.status]
                  }`}
                >
                  {chapter.status}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
