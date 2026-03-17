import { expect, test } from "@playwright/test";

test("browser refresh keeps inline confirmation state resumable", async ({ page }) => {
  await page.goto("/projects/project_demo/chapter?panel=confirmation");
  await expect(page.getByText("有 1 项内容需要你确认")).toBeVisible();

  await page.reload();

  await expect(page).toHaveURL(/\/projects\/project_demo\/chapter\?panel=confirmation$/);
  await expect(page.getByText("有 1 项内容需要你确认")).toBeVisible();
  await expect(page.getByRole("button", { name: "确认继续" })).toBeVisible();
});
