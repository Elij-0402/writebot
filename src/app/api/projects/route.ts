import { NextResponse } from "next/server";
import { createProject, listProjects } from "@/lib/state/local-state";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const project = await createProject({
    title: typeof body.title === "string" ? body.title : null,
  });

  return NextResponse.json({ id: project.id, title: project.title }, { status: 201 });
}

export async function GET() {
  const projects = await listProjects();
  return NextResponse.json({
    projects: projects.map((project) => ({
      id: project.id,
      title: project.title ?? "未命名项目",
    })),
  });
}
