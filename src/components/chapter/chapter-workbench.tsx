import { ApprovalBanner } from "@/components/shared/approval-banner";
import { ChapterNavigation } from "@/components/chapter/chapter-navigation";
import { ContextAiPanel } from "@/components/chapter/context-ai-panel";
import type { PrototypeWorkbench } from "@/lib/prototype/agent-prototype-data";

type ChapterWorkbenchProps = {
  workbench: PrototypeWorkbench;
};

export function ChapterWorkbench({ workbench }: ChapterWorkbenchProps) {
  return (
    <section className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)_320px]">
      <ChapterNavigation
        title={workbench.chapterNavigationTitle}
        currentChapterTitle={workbench.currentChapterTitle}
        chapters={workbench.chapterList}
      />

      <section className="grid gap-5 rounded-[32px] border border-foreground/10 bg-white/80 p-7 shadow-[0_22px_60px_rgba(29,20,13,0.09)]">
        <header className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-foreground/45">
            {workbench.pageEyebrow}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">{workbench.pageTitle}</h1>
          <p className="max-w-3xl text-base leading-7 text-foreground/72">{workbench.writingGoal}</p>
        </header>

        {workbench.banner ? (
          <ApprovalBanner
            label={workbench.banner.label}
            tone={workbench.banner.tone}
            actionLabel={workbench.banner.actionLabel}
          />
        ) : null}

        <section className="rounded-[28px] border border-foreground/10 bg-background/72 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/45">
            {workbench.currentChapterTitle}
          </p>
          <h2 className="mt-3 text-lg font-semibold uppercase tracking-[0.18em] text-foreground/55">
            {workbench.editorLabel}
          </h2>
          <div className="mt-5 rounded-[24px] border border-foreground/10 bg-white/80 p-5 text-base leading-8 text-foreground/78">
            {workbench.editorBody}
          </div>
        </section>
      </section>

      <ContextAiPanel title={workbench.assistantTitle} cards={workbench.assistantCards} />
    </section>
  );
}
