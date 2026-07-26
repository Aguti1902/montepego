import { expect, test } from "@playwright/test";

test("buscar y abrir una propiedad", async ({ page }) => {
  await page.goto("/en/properties");
  await expect(page.getByRole("heading", { name: "Properties" })).toBeVisible();
  await page.getByRole("link", { name: /View the villa|View the home/i }).first().click();
  await expect(page).toHaveURL(/\/en\/property\//);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("main").getByText(/Ref\.\s*\d+/).first()).toBeVisible();
});

test("enviar el formulario de contacto", async ({ page }) => {
  await page.goto("/en/contact");
  await page.getByLabel("Name").fill("Test Buyer");
  await page.getByLabel("Email").fill("buyer@example.com");
  await page.getByLabel("Message").fill("I am interested in Monte Pego.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status")).toContainText(/Message sent/i, {
    timeout: 10_000,
  });
});

test("editar y publicar una propiedad desde el panel", async ({ page }) => {
  await page.goto("/admin/properties");
  await expect(page.getByRole("heading", { name: "Propiedades" })).toBeVisible();
  await page.getByRole("link", { name: "Editar" }).first().click();
  await expect(page.getByText(/Ref\./i).first()).toBeVisible();
  await page.locator("#status").selectOption("available");
  await expect(page.locator("#status")).toHaveValue("available");
});
