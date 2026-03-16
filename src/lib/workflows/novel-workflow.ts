export async function runNovelWorkflow(input: {
  mode: "write" | "review" | "control";
  action: string;
  projectId?: string;
}) {
  return {
    mode: input.mode,
    action: input.action,
    status: "ok" as const,
  };
}
