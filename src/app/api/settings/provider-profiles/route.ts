import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  validateProviderProfileInput,
  type ProviderProfile,
} from "@/lib/llm/provider-profiles";
import { saveProviderProfile } from "@/lib/state/local-state";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Record<string, unknown>;
  const validation = validateProviderProfileInput({
    name: typeof body.name === "string" ? body.name : undefined,
    adapter: typeof body.adapter === "string" ? body.adapter : undefined,
    protocol: typeof body.protocol === "string" ? body.protocol : undefined,
    baseUrl: typeof body.baseUrl === "string" ? body.baseUrl : undefined,
    apiKey: typeof body.apiKey === "string" ? body.apiKey : undefined,
    model: typeof body.model === "string" ? body.model : undefined,
    setAsDefault: body.setAsDefault === true,
  });

  if (!validation.ok) {
    return NextResponse.json(
      {
        error: "invalid_provider_profile",
        fieldErrors: validation.fieldErrors,
      },
      { status: 400 },
    );
  }

  const timestamp = new Date().toISOString();
  const profile: ProviderProfile = {
    id: `provider_${randomUUID().replaceAll("-", "").slice(0, 12)}`,
    createdAt: timestamp,
    updatedAt: timestamp,
    ...validation.value,
    isDefault: validation.value.setAsDefault,
  };

  const result = await saveProviderProfile(profile);

  return NextResponse.json(result, { status: 201 });
}
