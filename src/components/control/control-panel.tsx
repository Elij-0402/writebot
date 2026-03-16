import { ApprovalBanner } from "@/components/shared/approval-banner";

export function ControlPanel() {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-foreground/10 bg-white/60 p-6">
      <ApprovalBanner label="Workflow 审批入口" />
      <h2 className="text-2xl font-semibold">控盘页</h2>
      <p className="text-sm text-foreground/70">Risk report and correction options appear here.</p>
    </section>
  );
}
