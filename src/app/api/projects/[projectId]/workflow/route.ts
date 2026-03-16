import { NextRequest, NextResponse } from "next/server";
import { runNovelWorkflow } from "@/lib/workflows/novel-workflow";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await context.params;
  const body = await request.json();
  const result = await runNovelWorkflow({
    mode: body.mode,
    action: body.action,
    projectId,
    prompt: body.prompt,
    chapterId: body.chapterId,
    isHighRisk: body.isHighRisk,
  });

  return NextResponse.json(result, { status: 200 });
}
