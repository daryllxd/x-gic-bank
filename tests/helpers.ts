import type { Page } from "@playwright/test";

export async function performTransaction(
  page: Page,
  type: "D" | "W",
  amount?: number
) {
  await page.getByRole("textbox").fill(type);
  await page.keyboard.press("Enter");

  if (amount !== undefined) {
    await page.getByRole("textbox").fill(amount.toString());
    await page.keyboard.press("Enter");
  }
}

export async function createDummyTransactions(page: any) {
  // Initial deposit of $500
  await page.getByRole("textbox").fill("D");
  await page.keyboard.press("Enter");
  await page.getByRole("textbox").fill("500");
  await page.keyboard.press("Enter");

  // Withdrawal of $100
  await page.getByRole("textbox").fill("W");
  await page.keyboard.press("Enter");
  await page.getByRole("textbox").fill("100");
  await page.keyboard.press("Enter");
}
