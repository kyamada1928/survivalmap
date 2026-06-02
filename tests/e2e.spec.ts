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
  const mapContainer = page.getByTestId("map-view");
  await expect(mapContainer).toBeVisible();
  const toiletMarkers = await page.locator(".map-marker").count();
  expect(toiletMarkers).toBeGreaterThan(0);
  await expect(page.getByTestId("spot-card-locker-1")).toHaveCount(0);
  await expect(page.getByTestId("spot-card-toilet-1")).toBeVisible();
});

test("spot tap opens details bottom sheet", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("category-filter-toilet").click();
  await page.getByTestId("spot-card-toilet-1").click();
  await expect(page.locator("text=Spot details")).toBeVisible();
  await expect(page.locator("text=Verified").first()).toBeVisible();
  await expect(page.locator("text=Last checked: 2026-06-02")).toBeVisible();
  await expect(page.getByRole("link", { name: "Open in Google Maps" })).toHaveAttribute(
    "href",
    /google\.com\/maps\/search/
  );
  await expect(page.getByRole("link", { name: "Open in Apple Maps" })).toHaveAttribute("href", /maps\.apple\.com/);
  await expect(page.locator("text=Opening hours and availability may change")).toBeVisible();
  await expect(page.locator("text=Distance")).toBeVisible();
});

test("map marker popup opens details through view more", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("category-filter-toilet").click();
  const markers = page.locator(".map-marker");
  await expect(markers.first()).toBeVisible();
  await markers.first().click();
  await expect(page.getByTestId("map-view-more-toilet-1")).toBeVisible();
  await page.getByTestId("map-view-more-toilet-1").click();
  await expect(page.locator("text=Spot details")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Osaka Station City Toilet" })).toBeVisible();
});

test("user can report a spot problem", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("spot-card-toilet-1").click();
  await page.getByTestId("report-spot-button-toilet-1").click();
  await expect(page.locator("text=Report a problem")).toBeVisible();
  await page.getByRole("textbox", { name: /Details/i }).fill("The restroom was closed during posted hours.");
  await page.getByTestId("submit-report-button").click();
  await expect(page.locator("text=Thanks. Your report was saved.")).toBeVisible();
});

test("user can switch UI language to Japanese", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Language").selectOption("ja");
  await expect(page.locator("text=梅田エッセンシャル")).toBeVisible();
  await expect(page.getByTestId("category-filter-all")).toHaveText("すべて");
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
  await expect(page.locator("[data-testid^='spot-card-user-']").filter({ hasText: "Test Local ATM" })).toBeVisible();
});

test("user-added spot persists after reload", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("open-spot-form-button").click();
  await page.getByRole("textbox", { name: /Name/i }).fill("Reload Test ATM");
  await page.getByRole("combobox", { name: /Category/i }).selectOption("ATM");
  await page.getByRole("textbox", { name: /Description/i }).fill("Persist after reload.");
  await page.getByRole("textbox", { name: /Tourist note/i }).fill("Visible after refresh.");
  await page.getByRole("textbox", { name: /Tags/i }).fill("reload, persistence");
  await page.getByTestId("submit-spot-button").click();
  await page.reload();
  await expect(page.locator("[data-testid^='spot-card-user-']").filter({ hasText: "Reload Test ATM" })).toBeVisible();
});

test("map displays all spots when 'All' category is selected", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("category-filter-all").click();
  const mapContainer = page.getByTestId("map-view");
  await expect(mapContainer).toBeVisible();
  const allMarkers = await page.locator(".map-marker").count();
  expect(allMarkers).toBeGreaterThan(10);
});

test("map updates when category filter changes", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("category-filter-atm").click();
  const mapContainer = page.getByTestId("map-view");
  await expect(mapContainer).toBeVisible();
  const atmMarkers = await page.locator(".map-marker").count();
  expect(atmMarkers).toBeGreaterThan(0);
  expect(atmMarkers).toBeLessThan(15);
  await page.getByTestId("category-filter-toilet").click();
  const toiletMarkers = await page.locator(".map-marker").count();
  expect(toiletMarkers).toBeGreaterThan(0);
});

test("user can edit their added spot", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("open-spot-form-button").click();
  await page.getByRole("textbox", { name: /Name/i }).fill("Original Name");
  await page.getByRole("combobox", { name: /Category/i }).selectOption("ATM");
  await page.getByRole("textbox", { name: /Description/i }).fill("Original description.");
  await page.getByRole("textbox", { name: /Tourist note/i }).fill("Original note.");
  await page.getByTestId("submit-spot-button").click();
  await page.locator("[data-testid^='spot-card-user-']").filter({ hasText: "Original Name" }).click();
  await expect(page.locator("text=Spot details")).toBeVisible();
  const editButton = page.locator("button:has-text('Edit')");
  await editButton.click();
  await expect(page.locator("text=Edit:")).toBeVisible();
  await page.getByRole("textbox", { name: /Name/i }).fill("Updated Name");
  await page.getByRole("textbox", { name: /Description/i }).fill("Updated description.");
  await page.getByTestId("submit-spot-button").click();
  await page.reload();
  await expect(page.locator("[data-testid^='spot-card-user-']").filter({ hasText: "Updated Name" })).toBeVisible();
  await expect(page.locator("[data-testid^='spot-card-user-']").filter({ hasText: "Original Name" })).toHaveCount(0);
});

test("user can delete their added spot", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("open-spot-form-button").click();
  await page.getByRole("textbox", { name: /Name/i }).fill("Spot to Delete");
  await page.getByRole("combobox", { name: /Category/i }).selectOption("ATM");
  await page.getByRole("textbox", { name: /Description/i }).fill("This will be deleted.");
  await page.getByTestId("submit-spot-button").click();
  await page.locator("[data-testid^='spot-card-user-']").filter({ hasText: "Spot to Delete" }).click();
  await expect(page.locator("text=Spot details")).toBeVisible();
  const spotId = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("[data-testid^='delete-spot-button-']"));
    return buttons[0]?.getAttribute("data-testid")?.replace("delete-spot-button-", "");
  });
  page.once("dialog", (dialog) => {
    expect(dialog.message()).toContain("Delete");
    dialog.accept();
  });
  await page.getByTestId(`delete-spot-button-${spotId}`).click();
  await expect(page.getByRole("button", { name: /Spot to Delete/i })).toHaveCount(0);
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
  await expect(page.locator(".map-current-location")).toBeVisible();
  await context.close();
});
