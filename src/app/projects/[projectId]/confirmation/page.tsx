import { redirect } from "next/navigation";

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  redirect(`/projects/${projectId}/chapter?panel=confirmation`);
}
