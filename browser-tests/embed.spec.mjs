import { test, expect } from "@playwright/test";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
test("Portable calculator computes the documented sample", async ({ page }) => {
  await page.goto(pathToFileURL(resolve("examples/embed/index.html")).href);
  await expect(page.locator("#result")).toContainText(
    "Period net benefit: 7200.00",
  );
  await expect(page.locator("#result")).toContainText("ROI: 150.00%");
  await page.locator('[name="monthly"]').fill("1200");
  await page.getByRole("button").click();
  await expect(page.locator("#result")).toContainText("No positive payback");
});
