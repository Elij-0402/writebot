type ApprovalBannerProps = {
  label: string;
  tone: "confirmation" | "repair";
  actionLabel: string;
};

const toneClasses: Record<ApprovalBannerProps["tone"], string> = {
  confirmation: "border-amber-300 bg-amber-100 text-amber-900",
  repair: "border-rose-300 bg-rose-100 text-rose-900",
};

export function ApprovalBanner({ label, tone, actionLabel }: ApprovalBannerProps) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border px-4 py-4 text-sm shadow-[0_10px_30px_rgba(29,20,13,0.06)] md:flex-row md:items-center md:justify-between ${toneClasses[tone]}`}
    >
      <span className="font-medium">{label}</span>
      <span className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">{actionLabel}</span>
    </div>
  );
}
