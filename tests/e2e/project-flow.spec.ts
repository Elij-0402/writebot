import { expect, test } from "@playwright/test";

test("首页重定向到项目入口", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByRole("heading", { level: 1, name: "项目" })).toBeVisible();
  await expect(page.getByRole("link", { name: "继续当前项目" })).toBeVisible();
});

test("用户可以从项目入口进入中文项目概览", async ({ page }) => {
  await page.goto("/projects");
  await page.getByRole("link", { name: "继续当前项目" }).click();

  await expect(page).toHaveURL(/\/projects\/project_demo$/);
  await expect(page.getByRole("heading", { level: 1, name: "项目概览" })).toBeVisible();
  await expect(page.getByText("继续写作")).toBeVisible();
  await expect(page.getByText("待确认")).toBeVisible();
  await expect(page.getByText("进入章节")).toBeVisible();
});
