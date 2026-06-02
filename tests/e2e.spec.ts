import { expect, test } from "@playwright/test";

test("home page opens", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("text=Umeda Essentials")).toBeVisible();
});

test("category filter is visible", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("category-filter-toilet")).toBeVisible();
  await expect(page.getByTestId("category-filter-atm")).toBeVisible();
});

test("Toilet category filters spots", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("category-filter-toilet").click();
  await expect(page.getByTestId("spot-card-locker-1")).toHaveCount(0);
  await expect(page.getByTestId("spot-card-toilet-1")).toBeVisible();
});

test("spot tap opens details bottom sheet", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("category-filter-toilet").click();
  await page.getByTestId("spot-card-toilet-1").click();
  await expect(page.locator("text=Spot details")).toBeVisible();
  await expect(page.locator("text=Distance")).toBeVisible();
});

test("spot submission form adds new spot", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("open-spot-form-button").click();
  await page.getByRole("textbox", { name: /Name/i }).fill("Test Local ATM");
  await page.getByRole("combobox", { name: /Category/i }).selectOption("ATM");
  await page.getByRole("textbox", { name: /Description/i }).fill("Local ATM near the station.");
  await page.getByRole("textbox", { name: /Tourist note/i }).fill("Open 24 hours.");
  await page.getByRole("textbox", { name: /Tags/i }).fill("test, local");
  await page.getByTestId("submit-spot-button").click();
  await expect(page.getByRole("button", { name: /Test Local ATM/i })).toBeVisible();
});

test("geolocation denied does not crash", async ({ browser }) => {
  const context = await browser.newContext({ permissions: [] });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("text=Location denied or unavailable")).toBeVisible();
  await context.close();
});

test("geolocation allowed and mocked location works", async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ["geolocation"],
    geolocation: { latitude: 34.702485, longitude: 135.495951 },
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("text=Location enabled")).toBeVisible();
  await context.close();
});
