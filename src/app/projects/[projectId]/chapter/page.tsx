import { ChapterWorkbench } from "@/components/chapter/chapter-workbench";
import { PrototypeNav } from "@/components/project/prototype-nav";
import { getAgentPrototype } from "@/lib/prototype/agent-prototype-data";

export default async function ChapterPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ panel?: string }>;
}) {
  const { projectId } = await params;
  const { panel } = await searchParams;
  const prototype = getAgentPrototype(projectId);
  const inlinePanel = panel === "repair" ? "repair" : panel === "confirmation" ? "confirmation" : null;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f6eee2_0%,#efe4d6_48%,#e8d8c7_100%)] px-6 py-16 text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <PrototypeNav links={prototype.navigation} activeHref={`/projects/${projectId}/chapter`} />
        <ChapterWorkbench workbench={prototype.workbench} panel={inlinePanel} />
      </div>
    </main>
  );
}
