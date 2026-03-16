export function canCommitProposal(proposalStatus: "approved" | "review_ready" | "committed") {
  return proposalStatus === "approved";
}
