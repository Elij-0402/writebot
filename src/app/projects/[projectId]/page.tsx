import Link from "next/link";
import { ProjectSummary } from "@/components/project/project-summary";
import { getProjectState } from "@/lib/state/project-state";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectState(projectId);

  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-foreground/70">
          Project Dashboard
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">{project.title}</h1>
        <ProjectSummary projectId={project.id} title={project.title} />
        <div className="flex gap-4 text-sm font-medium">
          <Link href={`/projects/${projectId}/chapter`}>章节工作台</Link>
          <Link href={`/projects/${projectId}/control`}>控盘页</Link>
        </div>
      </div>
    </main>
  );
}
