import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.actorId || !body.reason) {
    return NextResponse.json({ error: "actorId and reason required" }, { status: 400 });
  }

  return NextResponse.json({ status: "approved" }, { status: 200 });
}
