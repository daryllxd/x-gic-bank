import { expect, test } from "@playwright/test";
import { createDummyTransactions } from "./helpers";

test.describe("Printing a statement", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await createDummyTransactions(page);
  });

  test("should display statement with transactions", async ({ page }) => {
    await page.getByRole("textbox").fill("P");
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("output")).toContainText("Date");
    await expect(page.getByTestId("output")).toContainText("Amount");
    await expect(page.getByTestId("output")).toContainText("Balance");
    await expect(page.getByTestId("output")).toContainText("500.00");
    await expect(page.getByTestId("output")).toContainText("-100.00");
    await expect(page.getByTestId("output")).toContainText("400.00");
  });

  test("should display empty statement", async ({ page }) => {
    // Clear transactions
    await page.reload();
    await page.getByRole("textbox").fill("P");
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("output")).toContainText(
      "No transactions to display."
    );
  });
});
