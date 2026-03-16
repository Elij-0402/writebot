import Link from "next/link";
import { ChapterWorkbench } from "@/components/chapter/chapter-workbench";

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <main className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Link href={`/projects/${projectId}`}>返回项目页</Link>
        <ChapterWorkbench />
      </div>
    </main>
  );
}
