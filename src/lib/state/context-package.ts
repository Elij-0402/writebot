import { detectContextConflicts, type ContextFact } from "@/lib/rules/context-conflicts";

export function buildContextPackage(input: {
  chapterCard: { id: string } | null;
  volumeSummary: string;
  characters: Array<{ id: string; currentState: string }>;
  hardRules: Array<{ id: string; content: string }>;
  recentSummaries: string[];
  foreshadows: Array<{ id: string; status: string }>;
  styleGuide: string;
  forbiddenItems: string[];
  approvedCanon?: Array<{ id: string; content: string }>;
  derivedMemory?: Array<{ id: string; content: string }>;
  approvedFacts?: ContextFact[];
  proposedFacts?: ContextFact[];
  tokenBudget?: number;
}) {
  if (!input.chapterCard) {
    return { ok: false as const, reason: "missing_chapter_card" as const };
  }

  const orderedSources = [
    input.chapterCard,
    ...(input.approvedCanon ?? []),
    input.volumeSummary,
    ...input.characters,
    ...input.hardRules,
    ...input.foreshadows,
    input.styleGuide,
    ...input.forbiddenItems,
    ...input.recentSummaries,
    ...(input.derivedMemory ?? []),
  ];
  const budget = input.tokenBudget ?? orderedSources.length;
  const conflicts = detectContextConflicts({
    approvedFacts: input.approvedFacts ?? [],
    proposedFacts: input.proposedFacts ?? [],
  });

  return {
    ok: true as const,
    orderedSources: orderedSources.slice(0, budget),
    truncated: orderedSources.length > budget,
    conflicts,
  };
}
