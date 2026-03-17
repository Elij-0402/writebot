import { expect, test } from "@playwright/test";

test("龙渊纪事可在第12章执行 draft / revision / repair flow", async ({ page, request }) => {
  await page.goto("/projects/project_demo/settings");
  await expect(page.getByRole("heading", { level: 1, name: "设置/模型接入" })).toBeVisible();

  const draftResponse = await request.post("/api/projects/project_demo/workflow", {
    data: {
      mode: "write",
      action: "draft_chapter",
      chapterId: "chapter-12",
      providerProfileName: "openai-compatible-local",
    },
  });
  expect(draftResponse.ok()).toBeTruthy();

  const revisionResponse = await request.post("/api/projects/project_demo/workflow", {
    data: {
      mode: "write",
      action: "revision_chapter",
      chapterId: "chapter-12",
      providerProfileName: "openai-compatible-local",
    },
  });
  expect(revisionResponse.ok()).toBeTruthy();

  const repairResponse = await request.post("/api/projects/project_demo/workflow", {
    data: {
      mode: "write",
      action: "repair_chapter",
      chapterId: "chapter-12",
      providerProfileName: "openai-compatible-local",
    },
  });
  expect(repairResponse.ok()).toBeTruthy();

  await page.goto("/projects/project_demo/chapter?panel=repair");
  await expect(page.getByRole("heading", { level: 1, name: "章节工作区" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "第12章：夜渡寒江" })).toBeVisible();
  await expect(page.getByText("当前草稿")).toBeVisible();
  await expect(page.getByText("修复详情")).toBeVisible();

  await page.goto("/projects/project_demo/history");
  await expect(page.getByText("Provider Profile", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "接受本次修订" })).toBeVisible();
});
