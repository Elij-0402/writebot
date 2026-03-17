import { expect, test } from "@playwright/test";

test("作者可以在历史记录里查看来源与差异后再决定", async ({ page }) => {
  await page.goto("/projects/project_demo/history");

  await expect(page.getByRole("heading", { level: 1, name: "历史记录" })).toBeVisible();
  await expect(page.getByText("Provider Profile", { exact: true })).toBeVisible();
  await expect(page.getByText("Model", { exact: true })).toBeVisible();
  await expect(page.getByText("Template", { exact: true })).toBeVisible();
  await expect(page.getByText("当前提案 vs 原始草稿")).toBeVisible();
  await expect(page.getByRole("button", { name: "接受本次修订" })).toBeVisible();
  await expect(page.getByRole("button", { name: "退回该提案" })).toBeVisible();
});

test("接受内容前必须先经过比较界面", async ({ page }) => {
  await page.goto("/projects/project_demo/history");

  await expect(page.getByText("先比较，再决定是否接受")).toBeVisible();
  await expect(page.getByRole("button", { name: "直接覆盖已批准内容" })).toHaveCount(0);
});
