export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-foreground/70">
          Writebot
        </p>
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">Projects</h1>
          <p className="max-w-2xl text-base leading-7 text-foreground/80">
            Task 1 baseline is ready for the projects workspace.
          </p>
        </div>
      </div>
    </main>
  );
}
