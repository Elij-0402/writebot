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
