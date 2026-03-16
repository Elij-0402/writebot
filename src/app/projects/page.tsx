import Link from "next/link";

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
        <div className="rounded-2xl border border-foreground/10 bg-white/60 p-6">
          <h2 className="text-xl font-semibold">Sample Project</h2>
          <p className="mt-2 text-sm text-foreground/70">
            Minimal dashboard entry for V1 flow.
          </p>
          <Link className="mt-4 inline-block text-sm font-medium" href="/projects/project_demo">
            Open project
          </Link>
        </div>
      </div>
    </main>
  );
}
