import { executeProviderWorkflow, type WorkflowKind } from "@/lib/llm/provider-kernel";

export function getLlmClient() {
  return {
    complete: async (input: {
      workflowKind: WorkflowKind;
      chapterTitle: string;
      providerProfileName?: string;
      failureMode?: string;
    }) => executeProviderWorkflow(input),
  };
}
