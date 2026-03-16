import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ id: "project_demo" }, { status: 201 });
}

export async function GET() {
  return NextResponse.json({
    projects: [{ id: "project_demo", title: "Sample Project" }],
  });
}
