import { expect, test } from "@playwright/test";

test("home renders editorial shell", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Mezkla2" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /agenda ciudadana/i })).toBeVisible();
});

test("sample article page renders", async ({ page }) => {
  await page.goto("/noticia/agenda-ciudadana-semana-decisiva");
  await expect(page.getByRole("heading", { name: /agenda ciudadana/i })).toBeVisible();
  await expect(page.getByText(/min de lectura/i)).toBeVisible();
});

test("admin redirects anonymous users to login", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.getByRole("heading", { name: /ingreso editorial/i })).toBeVisible();
});
