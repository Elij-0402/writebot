import { expect, test } from "@playwright/test";

test("用户可以保存 OpenAI-compatible provider profile", async ({ page }) => {
  await page.goto("/projects/project_demo/settings");

  await page.getByLabel("Provider Profile 名称").fill("openai-compatible-local");
  await page.getByLabel("Adapter 类型").selectOption("openai-compatible");
  await page.getByLabel("Protocol").fill("responses");
  await page.getByLabel("Base URL").fill("http://localhost:11434/v1");
  await page.getByLabel("API Key").fill("demo-key");
  await page.getByLabel("模型名称").fill("local-model");
  await page.getByLabel("设为默认运行时").check();
  await page.getByRole("button", { name: "保存 provider profile" }).click();

  await expect(page.getByText("已保存 provider profile：openai-compatible-local")).toBeVisible();
  await expect(page.getByText("responses · http://localhost:11434/v1").first()).toBeVisible();
  await expect(page.getByText("默认运行时", { exact: true }).first()).toBeVisible();
});

test("无效 provider 配置会被阻止", async ({ page }) => {
  await page.goto("/projects/project_demo/settings");

  await page.getByLabel("Provider Profile 名称").fill("broken-profile");
  await page.getByLabel("Adapter 类型").selectOption("openai-compatible");
  await page.getByLabel("Protocol").fill("unsupported");
  await page.getByLabel("API Key").fill("demo-key");
  await page.getByLabel("模型名称").fill("local-model");
  await page.getByRole("button", { name: "保存 provider profile" }).click();

  await expect(page.getByText("Base URL 为必填项")).toBeVisible();
  await expect(page.getByText("Protocol 必须是 chat、completions 或 responses" )).toBeVisible();
  await expect(page.getByText("broken-profile")).toHaveCount(0);
});
