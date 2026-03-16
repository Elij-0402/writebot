export function buildContextPackage(input: {
  chapterCard: { id: string } | null;
  volumeSummary: string;
  characters: Array<{ id: string; currentState: string }>;
  hardRules: Array<{ id: string; content: string }>;
  recentSummaries: string[];
  foreshadows: Array<{ id: string; status: string }>;
  styleGuide: string;
  forbiddenItems: string[];
}) {
  if (!input.chapterCard) {
    return { ok: false as const, reason: "missing_chapter_card" as const };
  }

  return {
    ok: true as const,
    orderedSources: [
      input.chapterCard,
      input.volumeSummary,
      ...input.characters,
      ...input.hardRules,
      ...input.recentSummaries,
      ...input.foreshadows,
      input.styleGuide,
      ...input.forbiddenItems,
    ],
  };
}
