import { describe, expect, it } from "vitest";
import { detectContextConflicts } from "@/lib/rules/context-conflicts";

describe("detectContextConflicts", () => {
  it("flags canon conflicts when a proposed fact contradicts approved truth", () => {
    const result = detectContextConflicts({
      approvedFacts: [
        { key: "寒江渡口", value: "临江北岸", category: "lore" },
        { key: "林澄", value: "林澄", category: "name" },
      ],
      proposedFacts: [
        { key: "寒江渡口", value: "临江南岸", category: "lore" },
        { key: "林澄", value: "林澄", category: "name" },
      ],
    });

    expect(result).toEqual([
      expect.objectContaining({ key: "寒江渡口", approvedValue: "临江北岸", proposedValue: "临江南岸" }),
    ]);
  });
});
