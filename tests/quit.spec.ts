import { expect, test } from "@playwright/test";

test.describe("Quitting the app", () => {
  test("should show the goodbye message", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("textbox").fill("Q");
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("output")).toContainText(
      "Thank you for banking with AwesomeGIC Bank."
    );
    await expect(page.getByTestId("output")).toContainText("Have a nice day!");
  });
});
