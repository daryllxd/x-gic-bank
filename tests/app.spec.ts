import { expect, test } from "@playwright/test";

test("command app functionality", async ({ page }) => {
  await page.goto("/");

  // Check initial state
  await expect(page.getByText("Command App")).toBeVisible();
  const outputElement = page.getByTestId("command-output");
  await expect(outputElement).toHaveText("No output yet");

  // Test command A
  await page.getByPlaceholder("Enter command (A, B, or C)").fill("A");
  await page.keyboard.press("Enter");
  await expect(outputElement).toHaveText("apple");

  // Test command B
  await page.getByPlaceholder("Enter command (A, B, or C)").fill("B");
  await page.keyboard.press("Enter");
  await expect(outputElement).toHaveText("Banana");

  // Test command C with argument
  await page.getByPlaceholder("Enter command (A, B, or C)").fill("C test");
  await page.keyboard.press("Enter");
  await expect(outputElement).toHaveText("Calculate: test");

  // Test command C without argument
  await page.getByPlaceholder("Enter command (A, B, or C)").fill("C");
  await page.keyboard.press("Enter");
  await expect(outputElement).toHaveText(
    "Error: Command C requires an argument"
  );
});
