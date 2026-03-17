export type ContextFact = {
  key: string;
  value: string;
  category: "name" | "lore" | "timeline" | "term";
};

export function detectContextConflicts(input: {
  approvedFacts: ContextFact[];
  proposedFacts: ContextFact[];
}) {
  return input.proposedFacts.flatMap((fact) => {
    const approved = input.approvedFacts.find(
      (candidate) => candidate.category === fact.category && candidate.key === fact.key,
    );

    if (!approved || approved.value === fact.value) {
      return [];
    }

    return [
      {
        key: fact.key,
        category: fact.category,
        approvedValue: approved.value,
        proposedValue: fact.value,
      },
    ];
  });
}
