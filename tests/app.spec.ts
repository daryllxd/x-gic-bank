import { expect, test } from "@playwright/test";

test.describe("Banking App", () => {
  test("should handle banking operations correctly", async ({ page }) => {
    await page.goto("/");

    // Check initial state
    await expect(page.getByTestId("output")).toContainText(
      "Welcome to AwesomeGIC Bank!"
    );
    await expect(page.getByTestId("output")).toContainText("[D]eposit");
    await expect(page.getByTestId("output")).toContainText("[W]ithdraw");
    await expect(page.getByTestId("output")).toContainText("[P]rint statement");
    await expect(page.getByTestId("output")).toContainText("[Q]uit");

    // Test deposit
    await page.getByRole("textbox").fill("D");
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("output")).toContainText(
      "Please enter the amount to deposit:"
    );

    await page.getByRole("textbox").fill("500");
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("output")).toContainText(
      "Thank you. $500.00 has been deposited to your account."
    );
    await expect(page.getByTestId("output")).toContainText(
      "Is there anything else you'd like to do?"
    );

    // Test withdraw
    await page.getByRole("textbox").fill("W");
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("output")).toContainText(
      "Please enter the amount to withdraw:"
    );

    await page.getByRole("textbox").fill("100");
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("output")).toContainText(
      "Thank you. $100.00 has been withdrawn from your account."
    );
    await expect(page.getByTestId("output")).toContainText(
      "Is there anything else you'd like to do?"
    );

    // Test print statement
    await page.getByRole("textbox").fill("P");
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("output")).toContainText(
      "Date | Amount | Balance"
    );

    // Test insufficient funds
    await page.getByRole("textbox").fill("W");
    await page.keyboard.press("Enter");
    await page.getByRole("textbox").fill("1000");
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("output")).toContainText(
      "Insufficient funds for withdrawal."
    );

    // Test quit
    await page.getByRole("textbox").fill("Q");
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("output")).toContainText(
      "Thank you for banking with AwesomeGIC Bank."
    );
    await expect(page.getByTestId("output")).toContainText("Have a nice day!");
  });
});
