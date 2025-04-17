import { expect, test } from "@playwright/test";
import { performTransaction } from "./helpers";

test.describe("Withdrawal Operations", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await performTransaction(page, "D", 500);
  });

  test("should handle valid withdrawal", async ({ page }) => {
    await performTransaction(page, "W", 100);
    await expect(page.getByTestId("output")).toContainText(
      "Thank you. $100.00 has been withdrawn from your account."
    );
  });

  test("should reject insufficient funds", async ({ page }) => {
    await performTransaction(page, "W", 1000);
    await expect(page.getByTestId("output")).toContainText(
      "Insufficient funds for withdrawal."
    );
  });

  test("should allow quitting during withdrawal", async ({ page }) => {
    await performTransaction(page, "W", 1000);
    await page.getByRole("textbox").fill("Q");
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("output")).toContainText(
      "Transaction cancelled."
    );
    await expect(page.getByTestId("output")).toContainText(
      "Is there anything else you'd like to do?"
    );
  });
});
