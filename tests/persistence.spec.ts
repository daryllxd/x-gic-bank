import { expect, test } from "@playwright/test";
import { performTransaction } from "./helpers";

test.describe("Persistence Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Clear localStorage before each test
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test("should load transactions from localStorage on startup", async ({
    page,
  }) => {
    // Set up localStorage with transactions
    await page.evaluate(() => {
      localStorage.setItem(
        "x-gic-bank-transactions",
        JSON.stringify([
          {
            date: "2025-04-18T03:47:38.655Z",
            amount: 1000,
            balance: 1000,
          },
          {
            date: "2025-04-18T03:47:39.794Z",
            amount: -500,
            balance: 500,
          },
        ])
      );
    });

    // Reload to test persistence
    await page.reload();

    // Print statement to verify transactions
    await page.getByRole("textbox").fill("P");
    await page.keyboard.press("Enter");

    // Verify transactions are displayed
    const output = await page.getByTestId("output").textContent();
    const transactionLines = output
      ?.split("\n")
      .filter((line) => line.includes("|"));

    expect(transactionLines).toHaveLength(2 + 1); // +1 for the header
  });

  test("should persist transactions after deposit and withdrawal", async ({
    page,
  }) => {
    // Perform transactions
    await performTransaction(page, "D", 1000);
    await performTransaction(page, "W", 500);

    // Reload to test persistence
    await page.reload();

    // Print statement to verify transactions
    await page.getByRole("textbox").fill("P");
    await page.keyboard.press("Enter");

    // Verify transactions are displayed
    const output = await page.getByTestId("output").textContent();
    const transactionLines = output
      ?.split("\n")
      .filter((line) => line.includes("|"));
    expect(transactionLines).toHaveLength(2 + 1); // +1 for the header
  });

  test("should not persist transactions if transaction is cancelled", async ({
    page,
  }) => {
    // Start deposit but cancel
    await page.getByRole("textbox").fill("D");
    await page.keyboard.press("Enter");
    await page.getByRole("textbox").fill("Q");
    await page.keyboard.press("Enter");

    // Reload to test persistence
    await page.reload();

    // Print statement to verify no transactions
    await page.getByRole("textbox").fill("P");
    await page.keyboard.press("Enter");

    // Verify no transactions are displayed
    await expect(page.getByTestId("output")).toContainText(
      "No transactions to display."
    );
  });
});
