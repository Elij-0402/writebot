export async function getProjectState(projectId: string) {
  return {
    id: projectId,
    title: "Sample Project",
    pendingApprovals: 1,
    latestActivity: "workflow-ready",
  };
}
