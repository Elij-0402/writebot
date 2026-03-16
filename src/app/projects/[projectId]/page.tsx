import { ProjectOverview } from "@/components/project/project-overview";
import { PrototypeNav } from "@/components/project/prototype-nav";
import { getAgentPrototype } from "@/lib/prototype/agent-prototype-data";
import { getProjectOverviewState } from "@/lib/state/project-state";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const prototype = getAgentPrototype(projectId);
  const projectState = await getProjectOverviewState(projectId);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f6eee2_0%,#efe4d6_48%,#e8d8c7_100%)] px-6 py-16 text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <PrototypeNav links={prototype.navigation} activeHref={`/projects/${projectId}`} />
        <ProjectOverview projectTitle={projectState.projectTitle} overview={projectState.overview} />
      </div>
    </main>
  );
}
