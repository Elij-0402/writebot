import { ApprovalBanner } from "@/components/shared/approval-banner";

export function ChapterWorkbench() {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-foreground/10 bg-white/60 p-6">
      <ApprovalBanner label="待审批" />
      <h2 className="text-2xl font-semibold">章节工作台</h2>
      <p className="text-sm text-foreground/70">Draft proposal and review output appear here.</p>
    </section>
  );
}
