export function ApprovalBanner({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-amber-300 bg-amber-100 px-4 py-3 text-sm text-amber-900">
      {label}
    </div>
  );
}
