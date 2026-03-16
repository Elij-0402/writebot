import type { AuditEventType, AuditRecord } from "@/lib/types/state";

export function createAuditLogEntry(input: {
  id?: string;
  projectId: string;
  proposalId?: string | null;
  actorId?: string;
  eventType: AuditEventType;
  metadata?: Record<string, unknown> | null;
  createdAt?: Date;
}): AuditRecord {
  return {
    id: input.id ?? "audit_demo",
    projectId: input.projectId,
    proposalId: input.proposalId ?? null,
    actorId: input.actorId ?? "system",
    eventType: input.eventType,
    metadata: input.metadata ?? null,
    createdAt: (input.createdAt ?? new Date()).toISOString(),
  };
}
