import { describe, expect, it } from "vitest";
import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("formats date in the correct format", () => {
    const date = new Date("2022-07-08T11:12:30");
    const result = formatDate(date);

    expect(result).toBe("8 Jul 2022 11:12:30AM");
  });

  it("returns 'Invalid date' for invalid date input", () => {
    const invalidDate = new Date("invalid");
    const result = formatDate(invalidDate);

    expect(result).toBe("Invalid date");
  });
});
