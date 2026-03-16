import { expect, test } from "@playwright/test";

test("home redirects to projects", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/projects$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Projects" }),
  ).toBeVisible();
  await expect(
    page.getByText("Task 1 baseline is ready for the projects workspace."),
  ).toBeVisible();
});

test("user can navigate project dashboard, chapter workbench and control page", async ({
  page,
}) => {
  await page.goto("/projects/project_demo");

  await page.getByRole("link", { name: "章节工作台" }).click();
  await expect(page).toHaveURL(/\/chapter$/);

  await page.goto("/projects/project_demo");
  await page.getByRole("link", { name: "控盘页" }).click();
  await expect(page).toHaveURL(/\/control$/);
});
