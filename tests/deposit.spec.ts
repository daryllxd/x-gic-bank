import { expect, test } from "@playwright/test";
import { performTransaction } from "./helpers";

test.describe("Deposit Operations", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should handle valid deposit", async ({ page }) => {
    await performTransaction(page, "D", 100);
    await expect(page.getByTestId("output")).toContainText(
      "Thank you. $100.00 has been deposited to your account."
    );
  });

  test("should reject negative deposit", async ({ page }) => {
    await performTransaction(page, "D", -100);
    await expect(page.getByTestId("output")).toContainText(
      "Invalid amount. Please enter a positive number or 'Q' to cancel."
    );
  });

  test("should reject zero deposit", async ({ page }) => {
    await performTransaction(page, "D", 0);
    await expect(page.getByTestId("output")).toContainText(
      "Invalid amount. Please enter a positive number or 'Q' to cancel."
    );
  });

  test("should allow quitting during deposit", async ({ page }) => {
    await performTransaction(page, "D");
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
