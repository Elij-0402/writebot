type ProjectSummaryProps = {
  projectId: string;
  title: string;
};

export function ProjectSummary({ projectId, title }: ProjectSummaryProps) {
  return (
    <section className="rounded-2xl border border-foreground/10 bg-white/60 p-6">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-foreground/70">Project ID: {projectId}</p>
    </section>
  );
}
