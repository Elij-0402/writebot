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

test("章节工作区显示三栏写作布局", async ({ page }) => {
  await page.goto("/projects/project_demo/chapter");

  await expect(page.getByRole("heading", { level: 1, name: "章节工作区" })).toBeVisible();
  await expect(page.getByText("章节导航")).toBeVisible();
  await expect(page.getByText("正文编辑区")).toBeVisible();
  await expect(page.getByText("智能辅助")).toBeVisible();
  await expect(page.getByText("当前建议")).toBeVisible();
  await expect(page.getByText("继续写作")).toBeVisible();
});

test("旧确认页和修复页都会回到章节工作区的内联状态", async ({ page }) => {
  await page.goto("/projects/project_demo/confirmation");

  await expect(page).toHaveURL(/\/projects\/project_demo\/chapter\?panel=confirmation$/);
  await expect(page.getByText("有 1 项内容需要你确认")).toBeVisible();
  await expect(page.getByRole("button", { name: "确认继续" })).toBeVisible();
  await expect(page.getByRole("button", { name: "退回重做" })).toBeVisible();

  await page.goto("/projects/project_demo/control");

  await expect(page).toHaveURL(/\/projects\/project_demo\/chapter\?panel=repair$/);
  await expect(page.getByText("检测到一项连续性问题")).toBeVisible();
  await expect(page.getByText("修复建议")).toBeVisible();
});
