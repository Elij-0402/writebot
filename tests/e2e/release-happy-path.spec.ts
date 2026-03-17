import { expect, test } from "@playwright/test";

test("new operator can configure provider, draft, review, approve, and confirm canon update", async ({ page, request }) => {
  await page.goto("/projects/project_demo/settings");
  await page.getByLabel("Provider Profile 名称").fill("openai-compatible-local");
  await page.getByLabel("Adapter 类型").selectOption("openai-compatible");
  await page.getByLabel("Protocol").fill("responses");
  await page.getByLabel("Base URL").fill("http://localhost:11434/v1");
  await page.getByLabel("API Key").fill("demo-key");
  await page.getByLabel("模型名称").fill("local-model");
  await page.getByRole("button", { name: "保存 provider profile" }).click();
  await expect(page.getByText("已保存 provider profile：openai-compatible-local")).toBeVisible();

  await page.goto("/projects/project_demo");
  await expect(page.getByRole("heading", { level: 1, name: "项目概览" })).toBeVisible();
  await expect(page.getByText("龙渊纪事")).toBeVisible();
  await page.getByRole("link", { name: "章节工作区" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "章节工作区" })).toBeVisible();

  const draftResponse = await request.post("/api/projects/project_demo/workflow", {
    data: {
      mode: "write",
      action: "draft_chapter",
      chapterId: "chapter-12",
      providerProfileName: "openai-compatible-local",
    },
  });
  const draftPayload = await draftResponse.json();
  const batchId = draftPayload.result.approvalBatchDraft.id as string;

  await page.goto("/projects/project_demo/history");
  await expect(page.getByText("Provider Profile", { exact: true })).toBeVisible();
  await expect(page.getByText("openai-compatible-local")).toBeVisible();

  const canonBeforeResponse = await request.get("/api/projects/project_demo/canon");
  const canonBefore = await canonBeforeResponse.json();
  expect(Array.isArray(canonBefore.canonEntries)).toBeTruthy();

  const approveResponse = await request.post("/api/projects/project_demo/approve", {
    data: {
      actorId: "author_1",
      reason: "approve draft",
      batchId,
    },
  });
  expect(approveResponse.ok()).toBeTruthy();

  const canonAfterResponse = await request.get("/api/projects/project_demo/canon");
  const canonAfter = await canonAfterResponse.json();

  expect(canonAfter.canonEntries.length).toBeGreaterThanOrEqual(canonBefore.canonEntries.length);
  expect(JSON.stringify(canonAfter.canonEntries)).toContain("第12章：夜渡寒江");
});
